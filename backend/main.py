"""
FastAPI Backend for Brain Tumor Classification
Hybrid Quantum-Classical Model (DenseNet121 + PennyLane)
"""

import os
import io
import base64
from contextlib import asynccontextmanager

import torch
import torchvision.transforms as transforms
from PIL import Image
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from model_architecture import HybridQuantumClassicalModel, CLASS_NAMES, load_model
from gradcam import generate_all_gradcams

# ==============================
# CONFIG
# ==============================
MODEL_PATH = os.environ.get(
    "MODEL_PATH",
    os.path.join(os.path.dirname(__file__), "..", "best_hybrid_quantum_model.pth")
)
MODEL_ACCURACY = 0.8830  # Reported training accuracy

# Image preprocessing (must match training)
transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])

# ==============================
# MODEL SINGLETON (background loading)
# ==============================
import threading

model_instance = None
model_loading = False
model_error = None
model_ready = threading.Event()


def _load_model_background():
    """Load model in a background thread so server port binds immediately."""
    global model_instance, model_loading, model_error
    model_loading = True
    try:
        print(f"⏳ Loading model from {MODEL_PATH}...")
        model_instance = load_model(MODEL_PATH, device="cpu")
        print("✅ Model loaded successfully!")
    except Exception as e:
        model_error = str(e)
        print(f"❌ Model loading failed: {e}")
    finally:
        model_loading = False
        model_ready.set()


def get_model():
    """Get model, waiting for background loading to complete."""
    if not model_ready.wait(timeout=120):  # Wait up to 2 min
        raise RuntimeError("Model loading timed out")
    if model_error:
        raise RuntimeError(f"Model failed to load: {model_error}")
    return model_instance


# ==============================
# RISK LEVEL LOGIC
# ==============================
def get_risk_level(prediction: str, confidence: float) -> dict:
    """Determine risk level based on prediction and confidence."""
    if prediction == "no_tumor":
        return {
            "level": "LOW RISK",
            "color": "green",
            "description": "No tumor detected. Regular follow-up recommended."
        }
    elif confidence >= 0.85:
        return {
            "level": "HIGH RISK",
            "color": "red",
            "description": f"High confidence detection of {prediction}. Immediate specialist consultation recommended."
        }
    elif confidence >= 0.60:
        return {
            "level": "MODERATE RISK",
            "color": "amber",
            "description": f"Moderate confidence detection of {prediction}. Further diagnostic tests recommended."
        }
    else:
        return {
            "level": "LOW CONFIDENCE",
            "color": "yellow",
            "description": "Low confidence result. Additional imaging and clinical evaluation needed."
        }


# ==============================
# APP LIFECYCLE
# ==============================
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start model loading in background thread
    thread = threading.Thread(target=_load_model_background, daemon=True)
    thread.start()
    print("🚀 Server is ready! Model loading in background...")
    yield
    # Shutdown


# ==============================
# FASTAPI APP
# ==============================
app = FastAPI(
    title="Brain Tumor Classifier API",
    description="Hybrid Quantum-Classical Brain Tumor Classification using DenseNet121 + PennyLane",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS — allow frontend origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==============================
# ROUTES
# ==============================
@app.get("/")
async def root():
    return {
        "message": "Brain Tumor Classifier API",
        "status": "online",
        "model": "Hybrid Quantum-Classical (DenseNet121 + PennyLane)",
        "classes": CLASS_NAMES,
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "model_loaded": model_instance is not None,
        "model_loading": model_loading,
        "model_error": model_error,
        "device": "cpu",
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """
    Classify a brain MRI scan.

    Accepts: multipart/form-data with 'file' field (JPG/PNG image)
    Returns: prediction, confidence, probabilities, gradcam images, risk level
    """
    # Validate file type
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=400,
            detail="Invalid file type. Please upload a JPG or PNG image."
        )

    try:
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Preprocess
        input_tensor = transform(image).unsqueeze(0)  # [1, 3, 224, 224]

        # Get model
        model = get_model()

        # --- Inference ---
        with torch.no_grad():
            outputs = model(input_tensor)
            probabilities = torch.softmax(outputs, dim=1)[0]
            confidence_val, predicted_idx = torch.max(probabilities, 0)

        prediction = CLASS_NAMES[predicted_idx.item()]
        confidence = confidence_val.item()

        all_probs = {
            CLASS_NAMES[i]: round(probabilities[i].item(), 6)
            for i in range(len(CLASS_NAMES))
        }

        # --- Grad-CAM ---
        # Re-create tensor with grad enabled for Grad-CAM
        gradcam_tensor = transform(image).unsqueeze(0)
        gradcam_images = generate_all_gradcams(
            model, gradcam_tensor, image, CLASS_NAMES
        )

        # --- Risk Level ---
        risk = get_risk_level(prediction, confidence)

        # --- Uploaded image as base64 for reference ---
        img_buffer = io.BytesIO()
        image.resize((224, 224)).save(img_buffer, format="PNG")
        img_buffer.seek(0)
        uploaded_image_b64 = base64.b64encode(img_buffer.read()).decode("utf-8")

        return JSONResponse(content={
            "prediction": prediction,
            "confidence": round(confidence, 6),
            "probabilities": all_probs,
            "gradcam_images": gradcam_images,
            "risk_level": risk,
            "model_accuracy": MODEL_ACCURACY,
            "uploaded_image": uploaded_image_b64,
        })

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Inference failed: {str(e)}"
        )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
