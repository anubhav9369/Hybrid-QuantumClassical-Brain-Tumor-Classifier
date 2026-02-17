"""
Inference Script for Brain Tumor Classification
Used by Streamlit App
"""

import torch
import torchvision.transforms as transforms
from PIL import Image

import streamlit as st
from model_architecture import load_model, CLASS_NAMES


# ==============================
# IMAGE TRANSFORM
# ==============================
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# ==============================
# LOAD MODEL ONLY ONCE (CACHED)
# ==============================
@st.cache_resource
def get_model(model_path):
    """
    Load model only once for Streamlit.
    Quantum model always runs on CPU.
    """
    return load_model(model_path, device="cpu")


# ==============================
# PREDICTION FUNCTION
# ==============================
def predict_image(image_path, model_path="best_hybrid_quantum_model.pth"):
    """
    Predict tumor type from MRI image
    Returns:
        prediction: class name
        confidence: float (0-1)
        all_probs: dict of probabilities
    """

    # Load cached model
    model = get_model(model_path)

    # Load and preprocess image
    image = Image.open(image_path).convert("RGB")
    input_tensor = transform(image).unsqueeze(0)

    # Predict
    with torch.no_grad():
        outputs = model(input_tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]

        confidence, predicted_idx = torch.max(probabilities, 0)

    # Results
    prediction = CLASS_NAMES[predicted_idx.item()]
    confidence = confidence.item()

    all_probs = {
        CLASS_NAMES[i]: probabilities[i].item()
        for i in range(len(CLASS_NAMES))
    }

    return prediction, confidence, all_probs
