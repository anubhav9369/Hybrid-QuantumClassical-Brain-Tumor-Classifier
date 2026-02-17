# 🧠 Hybrid Quantum-Classical Brain Tumor Classifier

Full-stack web application for classifying brain MRI scans using a hybrid DenseNet121 + PennyLane quantum computing model.

**Classes:** Glioma · Meningioma · No Tumor · Pituitary

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

## Local Development

### Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
# Runs at http://localhost:8000
# Swagger docs: http://localhost:8000/docs
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs at http://localhost:5173
# Proxies /api to backend at localhost:8000
```

---

## Deployment

### Frontend → Vercel

1. Push to GitHub.
2. Import repository on [vercel.com](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Set **Environment Variable**:
   - `VITE_API_URL` = your deployed backend URL (e.g., `https://your-backend.onrender.com`)
5. Deploy.

### Backend → Render

1. Push to GitHub.
2. Create a new **Web Service** on [render.com](https://render.com).
3. Set **Root Directory** to `backend`.
4. **Build Command**: `pip install -r requirements.txt`
5. **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Upload `best_hybrid_quantum_model.pth` (or set a persistent disk).

### Backend → HuggingFace Spaces

1. Create a new Space (Docker or Gradio SDK type).
2. Upload all `backend/` files + `best_hybrid_quantum_model.pth`.
3. Ensure the `main.py` model path points to the correct checkpoint location.

---

## API Reference

### `POST /predict`

**Request:** `multipart/form-data` with `file` field (JPG/PNG)

**Response:**
```json
{
  "prediction": "meningioma",
  "confidence": 0.9788,
  "probabilities": {
    "glioma": 0.0034,
    "meningioma": 0.9788,
    "no_tumor": 0.0158,
    "pituitary": 0.0020
  },
  "gradcam_images": { "glioma": "base64...", "...": "..." },
  "risk_level": { "level": "HIGH RISK", "color": "red", "description": "..." },
  "model_accuracy": 0.883,
  "uploaded_image": "base64..."
}
```

### `GET /health`

Returns model status.

---

## Tech Stack

| Layer    | Technology                      |
|----------|---------------------------------|
| Model    | PyTorch + PennyLane (Quantum)   |
| Backend  | FastAPI + Uvicorn               |
| Frontend | React + Vite + Tailwind CSS v4  |
| Charts   | Recharts                        |
| Animations | Framer Motion                 |
| Icons    | Lucide React                    |
