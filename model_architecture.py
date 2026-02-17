"""
Hybrid Quantum-Classical Brain Tumor Classifier
Correct Deployment Architecture (Matches Checkpoint)
"""

import torch
import torch.nn as nn
import torchvision.models as models
import pennylane as qml

# ==============================
# CONFIG
# ==============================
NUM_QUBITS = 4
QUANTUM_DEPTH = 2

CLASS_NAMES = ["glioma", "meningioma", "no_tumor", "pituitary"]

# Quantum device
dev = qml.device("default.qubit", wires=NUM_QUBITS)


# ==============================
# QUANTUM CIRCUIT
# ==============================
def quantum_feature_map(inputs, wires):
    for i in wires:
        qml.Hadamard(wires=i)

    for i, wire in enumerate(wires):
        qml.RZ(inputs[i], wires=wire)

    for i in range(len(wires) - 1):
        qml.CNOT(wires=[wires[i], wires[i + 1]])


def variational_circuit(params, wires):
    for layer in range(params.shape[0]):

        for i, wire in enumerate(wires):
            qml.RY(params[layer, i], wires=wire)

        for i in range(len(wires) - 1):
            qml.CNOT(wires=[wires[i], wires[i + 1]])

        qml.CNOT(wires=[wires[-1], wires[0]])


@qml.qnode(dev, interface="torch")
def quantum_circuit(inputs, params):
    wires = range(NUM_QUBITS)

    quantum_feature_map(inputs, wires)
    variational_circuit(params, wires)

    return [qml.expval(qml.PauliZ(i)) for i in wires]


# ==============================
# DENSENET CLASSIFIER (TRAINING STYLE)
# ==============================
class DenseNet121Classifier(nn.Module):
    def __init__(self, num_classes=4):
        super().__init__()

        self.densenet = models.densenet121(weights=None)

        # Freeze feature extractor
        for param in self.densenet.features.parameters():
            param.requires_grad = False

        # Classifier must match training checkpoint
        num_features = self.densenet.classifier.in_features

        self.densenet.classifier = nn.Sequential(
            nn.Dropout(0.5),
            nn.Linear(num_features, 512),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(512, num_classes)
        )

    # ✅ Add extract_features method (required)
    def extract_features(self, x):
        import torch.nn.functional as F

        features = self.densenet.features(x)
        out = F.relu(features)
        out = F.adaptive_avg_pool2d(out, (1, 1))
        out = torch.flatten(out, 1)

        return out



# ==============================
# FEATURE REDUCER (Checkpoint expects this name)
# ==============================
class FeatureReducer(nn.Module):
    def __init__(self):
        super().__init__()

        self.reduction = nn.Sequential(
            nn.Linear(1024, 256),
            nn.ReLU(),
            nn.Dropout(0.3),

            nn.Linear(256, 64),
            nn.ReLU(),
            nn.Dropout(0.2),

            nn.Linear(64, NUM_QUBITS),
            nn.Tanh()
        )

    def forward(self, x):
        return self.reduction(x)


# ==============================
# QUANTUM LAYER (Batch Safe)
# ==============================
class QuantumLayer(nn.Module):
    def __init__(self):
        super().__init__()

        self.params = nn.Parameter(
            torch.randn(QUANTUM_DEPTH, NUM_QUBITS) * 0.1
        )

    def forward(self, inputs):
        batch_outputs = []

        for i in range(inputs.shape[0]):
            q_out = quantum_circuit(inputs[i], self.params)
            batch_outputs.append(torch.stack(q_out))

        return torch.stack(batch_outputs).float()


# ==============================
# FULL HYBRID MODEL (Matches Checkpoint)
# ==============================
class HybridQuantumClassicalModel(nn.Module):
    def __init__(self):
        super().__init__()

        self.feature_extractor = DenseNet121Classifier(num_classes=len(CLASS_NAMES))
        self.feature_reducer = FeatureReducer()
        self.quantum_layer = QuantumLayer()

        # Must match training classifier
        self.classifier = nn.Sequential(
            nn.Linear(NUM_QUBITS + 1024, 512),
            nn.ReLU(),
            nn.BatchNorm1d(512),
            nn.Dropout(0.4),

            nn.Linear(512, 256),
            nn.ReLU(),
            nn.BatchNorm1d(256),
            nn.Dropout(0.3),

            nn.Linear(256, len(CLASS_NAMES))
        )

    def forward(self, x):

        with torch.no_grad():
            classical_features = self.feature_extractor.extract_features(x)

        reduced = self.feature_reducer(classical_features)

        quantum_out = self.quantum_layer(reduced)

        combined = torch.cat([quantum_out, classical_features], dim=1)

        return self.classifier(combined)


# ==============================
# LOAD MODEL FUNCTION (Correct)
# ==============================
def load_model(checkpoint_path, device="cpu"):

    # Quantum simulation only CPU
    device = "cpu"

    model = HybridQuantumClassicalModel()

    checkpoint = torch.load(checkpoint_path, map_location=device)

    if "model_state_dict" in checkpoint:
        model.load_state_dict(checkpoint["model_state_dict"])
    else:
        model.load_state_dict(checkpoint)

    model.eval()
    model.to(device)

    return model
