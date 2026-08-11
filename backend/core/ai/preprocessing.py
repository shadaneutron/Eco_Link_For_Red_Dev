import io
import torch
import numpy as np
from PIL import Image

def preprocess_image(image_bytes_or_path):
    """
    Preprocess image input to PyTorch tensor.
    - Resize to 224x224 bilinear
    - Convert to float32 [0, 1]
    - Normalize with ImageNet mean/std
    - Reshape HWC to CHW with batch dimension (1, 3, 224, 224)
    """
    if isinstance(image_bytes_or_path, (str, bytes, io.BytesIO)):
        img = Image.open(image_bytes_or_path).convert('RGB')
    else:
        img = Image.open(io.BytesIO(image_bytes_or_path.read())).convert('RGB')
        
    img = img.resize((224, 224), Image.Resampling.BILINEAR)
    img_np = np.array(img, dtype=np.float32) / 255.0

    # Normalize with ImageNet mean and std as specified in final-model.ipynb
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    img_np = (img_np - mean) / std

    # Transpose HWC -> CHW
    img_np = np.transpose(img_np, (2, 0, 1))
    tensor = torch.from_numpy(img_np).unsqueeze(0)
    return tensor
