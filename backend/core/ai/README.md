# Eco Link Waste AI Module

This module provides real-time AI waste material classification for the Eco Link platform using a PyTorch EfficientNet-B0 deep learning model.

## Model Architecture
- **Base Architecture**: EfficientNet-B0 (Transfer Learning / Fine-tuned)
- **Input shape**: `(1, 3, 224, 224)` (RGB, 224x224 pixels)
- **Output**: 6-class logit vector mapped via Softmax to probability distributions

## File Structure & Responsibilities
- `model.py`: PyTorch model architecture (`EfficientNetB0`, `MBConv`, `SqueezeExcitation`) and model loader (`load_model`).
- `preprocessing.py`: Image normalization (ImageNet mean/std) and tensor conversion (`preprocess_image`).
- `labels.py`: Class index mapping dictionary (`CLASS_MAPPING`) matching model outputs to waste types, EWC codes, hazard levels, and CO2 factors.
- `inference.py`: Singleton classifier (`WasteAIClassifier`) and entry point function (`classify_waste_image`).
- `model_weights/`: Directory containing the trained PyTorch state dict checkpoint files.
- `__init__.py`: Clean module exports for Django integration.

## Locations
- **Model Weights**: `backend/core/ai/model_weights/`
- **Training Notebook**: `docs/ai/final-model.ipynb`

## Class Mapping
| Index | Material | Category | EWC Code | Hazard Level | CO2 Factor |
|-------|----------|----------|----------|--------------|------------|
| 0 | Cardboard | Paper & Packaging | 15 01 01 | Non-Hazardous | 1.2 |
| 1 | Glass | Glass & Ceramic | 15 01 07 | Non-Hazardous | 0.5 |
| 2 | Metal | Metals | 15 01 04 | Non-Hazardous | 2.1 |
| 3 | Paper | Paper & Packaging | 20 01 01 | Non-Hazardous | 1.0 |
| 4 | Plastic | Plastics | 15 01 02 | Non-Hazardous | 1.5 |
| 5 | General Waste | General Industrial Waste | 20 03 01 | Non-Hazardous | 0.3 |

## Preprocessing Pipeline
1. Input image loaded via PIL and converted to RGB.
2. Resized to `224x224` pixels using Bilinear interpolation.
3. Converted to float32 NumPy array and normalized to `[0.0, 1.0]`.
4. Standardized using ImageNet parameters:
   - Mean: `[0.485, 0.456, 0.406]`
   - Std: `[0.229, 0.224, 0.225]`
5. Transposed from `HWC` to `CHW` format and expanded to batch tensor `(1, 3, 224, 224)`.

## Inference Flow
`Image Input` → `preprocessing.preprocess_image()` → `model.EfficientNetB0` → `torch.softmax()` → `labels.CLASS_MAPPING` → Classification Result JSON

## Django Backend Usage
The Django REST API view `AIClassifyView` located in `backend/core/views.py` invokes `classify_waste_image` from this module:
```python
from core.ai import classify_waste_image

# Endpoint: POST /api/ai/classify/
result = classify_waste_image(image_file_or_path)
```
