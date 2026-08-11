import torch
import numpy as np
from .model import load_model
from .preprocessing import preprocess_image
from .labels import CLASS_MAPPING

class WasteAIClassifier:
    _instance = None
    _model = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
            cls._instance._model = load_model()
        return cls._instance

    def classify(self, image_input):
        if self._model is None:
            self._model = load_model()

        tensor = preprocess_image(image_input)
        with torch.no_grad():
            logits = self._model(tensor)
            probs = torch.softmax(logits, dim=1)[0].numpy()
            pred_idx = int(np.argmax(probs))

        top_info = CLASS_MAPPING.get(pred_idx, CLASS_MAPPING[5])
        confidence = float(probs[pred_idx])

        probabilities_dict = {}
        for idx, prob in enumerate(probs):
            material_name = CLASS_MAPPING[idx]["material"]
            probabilities_dict[material_name] = round(float(prob), 4)

        return {
            "predicted_class_index": pred_idx,
            "detected_material": top_info["material"],
            "category": top_info["category"],
            "confidence": round(confidence, 4),
            "confidence_percentage": round(confidence * 100, 1),
            "ewc_code": top_info["ewc_code"],
            "hazard_level": top_info["hazard_level"],
            "co2_factor": top_info["co2_factor"],
            "all_probabilities": probabilities_dict
        }


def classify_waste_image(image_input):
    classifier = WasteAIClassifier.get_instance()
    return classifier.classify(image_input)
