# 🧠 Hybrid Quantum-Classical Brain Tumor Classifier

A web app that uses **Quantum Computing + Deep Learning** to classify 
brain tumors from MRI scans.
---

## Project Structure

```
Capstone_app/
├── backend/
│   ├── main.py              # FastAPI server
│   ├── model_architecture.py # Model definition
│   ├── gradcam.py           # Grad-CAM heatmap generation
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.jsx          # Main application
│   │   ├── api.js           # API client
│   │   ├── index.css        # Tailwind + custom theme
│   │   └── components/      # All React components
│   ├── package.json
│   └── vite.config.js
├── best_hybrid_quantum_model.pth  # Trained model weights
├── model_architecture.py           # Original model file
├── inference.py                    # Original inference file
└── README.md
```

---
## 🎯 Features
- 🌡️ **Grad-CAM** - Visual attention heatmaps
- ⚛️ **Quantum Analysis** - 4-qubit circuit visualization  
- 🔬 **Feature Analysis** - DenseNet121 feature maps
- 📈 **Confidence Analysis** - Reliability indicators
- 🏥 **Clinical Report** - Medical context & guidance

## 📊 Model Performance
| Metric | Value |
|--------|-------|
| Test Accuracy | 88.30% |
| Baseline (DenseNet121) | 82.30% |
| Improvement | +6.00% |

## 🏗️ Architecture
- **Classical**: DenseNet121 (pretrained ImageNet)
- **Quantum**: 4-qubit variational circuit (PennyLane)
- **Dataset**: BRISC 2025 (6,000 MRI scans)

## 🔬 Tumor Classes
| Class | Description |
|-------|-------------|
| 🔴 Glioma | Most common primary brain tumor |
| 🟠 Meningioma | Arises from meninges |
| 🟢 No Tumor | Normal brain scan |
| 🔵 Pituitary | Pituitary gland tumor |

---

## Deployment

### Frontend → Vercel

1. Push to GitHub.
2. Import repository on [vercel.com]([https://vercel.com](https://hybrid-quantum-classical-brain-tumo.vercel.app/)).
3. Set **Root Directory** to `frontend`.
4. Set **Environment Variable**:
   - `VITE_API_URL` = your deployed backend URL (e.g., `https://your-backend.onrender.com`)
5. Deploy.

### Backend → Render

1. Push to GitHub.
2. Create a new **Web Service** on [render.com]([https://render.com](https://hybrid-quantumclassical-brain-tumor.onrender.com/)).
3. Set **Root Directory** to `backend`.
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Upload `best_hybrid_quantum_model.pth` (or set a persistent disk).

### Backend → HuggingFace Spaces

1. Create a new Space (Docker or Gradio SDK type).
2. Upload all `backend/` files + `best_hybrid_quantum_model.pth`.
3. Ensure the `main.py` model path points to the correct checkpoint location.

## ⚠️ Disclaimer
For research purposes only. Not a substitute for medical diagnosis.
