"""
Grad-CAM Implementation for DenseNet121 Feature Extractor
Generates class-activation heatmaps for brain tumor classification.
"""

import torch
import numpy as np
import cv2
from PIL import Image
import base64
import io


class GradCAM:
    """Grad-CAM for DenseNet121 inside the HybridQuantumClassicalModel."""

    def __init__(self, model):
        self.model = model
        self.gradients = None
        self.activations = None
        self.handles = []
        self._register_hooks()

    def _register_hooks(self):
        """Hook into the last conv layer of DenseNet121 features."""
        # Get the last DenseBlock in DenseNet121 features (denseblock4)
        target_layer = self.model.feature_extractor.densenet.features.denseblock4

        def forward_hook(module, input, output):
            self.activations = output.detach()

        def backward_hook(module, grad_input, grad_output):
            self.gradients = grad_output[0].detach()

        h1 = target_layer.register_forward_hook(forward_hook)
        h2 = target_layer.register_full_backward_hook(backward_hook)
        self.handles = [h1, h2]

    def remove_hooks(self):
        for h in self.handles:
            h.remove()

    def generate(self, input_tensor, class_idx):
        """
        Generate Grad-CAM heatmap for a specific class.

        Args:
            input_tensor: preprocessed image tensor [1, 3, 224, 224]
            class_idx: target class index

        Returns:
            heatmap: numpy array [224, 224] normalized 0-1
        """
        self.model.zero_grad()
        self.gradients = None
        self.activations = None

        # We need gradients for classical features, so temporarily enable them
        # The model uses torch.no_grad() for feature extraction in forward(),
        # so we need to bypass that
        input_tensor = input_tensor.clone().requires_grad_(True)

        # Run feature extraction WITH gradients (bypass no_grad in forward)
        features = self.model.feature_extractor.densenet.features(input_tensor)

        import torch.nn.functional as F
        out = F.relu(features)
        classical_features = F.adaptive_avg_pool2d(out, (1, 1))
        classical_features = torch.flatten(classical_features, 1)

        # Continue through the rest of the model
        reduced = self.model.feature_reducer(classical_features)
        quantum_out = self.model.quantum_layer(reduced)
        combined = torch.cat([quantum_out, classical_features], dim=1)
        output = self.model.classifier(combined)

        # Backward pass for target class
        target = output[0, class_idx]
        target.backward(retain_graph=True)

        if self.gradients is None:
            # Fallback: return uniform heatmap
            return np.ones((224, 224)) * 0.5

        # Pool gradients across spatial dims
        weights = torch.mean(self.gradients, dim=[2, 3], keepdim=True)

        # Weighted combination of activation maps
        cam = torch.sum(weights * self.activations, dim=1).squeeze()
        cam = torch.relu(cam)

        # Normalize
        if cam.max() > 0:
            cam = cam / cam.max()

        # Resize to input size
        heatmap = cam.cpu().numpy()
        heatmap = cv2.resize(heatmap, (224, 224))

        return heatmap


def apply_heatmap_overlay(original_image, heatmap, alpha=0.5):
    """
    Overlay Grad-CAM heatmap on the original image.

    Args:
        original_image: PIL Image
        heatmap: numpy array [224, 224] normalized 0-1
        alpha: overlay transparency

    Returns:
        overlay: numpy array [224, 224, 3] uint8
    """
    # Resize original to 224x224
    img = original_image.resize((224, 224))
    img_array = np.array(img)

    # Ensure 3 channels
    if len(img_array.shape) == 2:
        img_array = np.stack([img_array] * 3, axis=-1)
    elif img_array.shape[2] == 4:
        img_array = img_array[:, :, :3]

    # Convert heatmap to color
    heatmap_uint8 = np.uint8(255 * heatmap)
    heatmap_color = cv2.applyColorMap(heatmap_uint8, cv2.COLORMAP_JET)
    heatmap_color = cv2.cvtColor(heatmap_color, cv2.COLOR_BGR2RGB)

    # Blend
    overlay = np.uint8(alpha * heatmap_color + (1 - alpha) * img_array)

    return overlay


def numpy_to_base64(img_array):
    """Convert numpy image array to base64 string."""
    img = Image.fromarray(img_array)
    buffer = io.BytesIO()
    img.save(buffer, format="PNG")
    buffer.seek(0)
    return base64.b64encode(buffer.read()).decode("utf-8")


def generate_all_gradcams(model, input_tensor, original_image, class_names):
    """
    Generate Grad-CAM heatmaps for all classes.

    Args:
        model: HybridQuantumClassicalModel
        input_tensor: preprocessed tensor [1, 3, 224, 224]
        original_image: PIL Image
        class_names: list of class name strings

    Returns:
        dict: {class_name: base64_encoded_overlay_image}
    """
    gradcam = GradCAM(model)
    results = {}

    for idx, class_name in enumerate(class_names):
        heatmap = gradcam.generate(input_tensor, idx)
        overlay = apply_heatmap_overlay(original_image, heatmap)
        results[class_name] = numpy_to_base64(overlay)

    gradcam.remove_hooks()
    return results
