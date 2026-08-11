import { request } from './api';

export interface AIClassificationResponse {
  predicted_class_index: number;
  detected_material: string;
  category: string;
  confidence: number;
  confidence_percentage: number;
  ewc_code: string;
  hazard_level: string;
  co2_factor: number;
  all_probabilities: Record<string, number>;
}

export const aiApi = {
  classifyImage: async (file?: File, imageUrl?: string): Promise<AIClassificationResponse> => {
    if (file) {
      const formData = new FormData();
      formData.append('image', file);
      return request<AIClassificationResponse>('/ai/classify/', {
        method: 'POST',
        body: formData,
      });
    } else {
      return request<AIClassificationResponse>('/ai/classify/', {
        method: 'POST',
        body: JSON.stringify({ image_url: imageUrl }),
      });
    }
  },
};
