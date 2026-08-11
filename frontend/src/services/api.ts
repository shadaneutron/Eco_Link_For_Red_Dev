import { AuthResponse, User } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8001/api';

export interface RegisterPayload {
  full_name: string;
  email: string;
  password: string;
  confirm_password: string;
  role: string;
  company_name?: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

class ApiError extends Error {
  errors?: Record<string, string[] | string>;
  constructor(message: string, errors?: Record<string, string[] | string>) {
    super(message);
    this.name = 'ApiError';
    this.errors = errors;
  }
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL.replace(/\/$/, '')}${endpoint}`;
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const token = localStorage.getItem('access_token');
  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    let errorMsg = data.detail || data.error || data.message || 'An error occurred during the request.';
    if (data.errors) {
      if (typeof data.errors === 'string') {
        errorMsg = data.errors;
      } else if (typeof data.errors === 'object') {
        const firstKey = Object.keys(data.errors)[0];
        if (firstKey) {
          const val = data.errors[firstKey];
          errorMsg = Array.isArray(val) ? `${firstKey}: ${val[0]}` : `${firstKey}: ${val}`;
        }
      }
    }
    throw new ApiError(errorMsg, data.errors);
  }

  return data as T;
}

export const authApi = {
  login: async (credentials: LoginPayload): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (userData: RegisterPayload): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  getProfile: async (): Promise<{ user: User }> => {
    return request<{ user: User }>('/auth/me/', {
      method: 'GET',
    });
  },

  refreshToken: async (refresh: string): Promise<{ access: string }> => {
    return request<{ access: string }>('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh }),
    });
  },
};

export interface WasteListingPayload {
  title: string;
  material_type: string;
  quantity: number | string;
  unit: string;
  condition: string;
  location: string;
  description: string;
  images?: string[];
  ai_material_type?: string;
  ai_confidence?: number;
  ai_ewc_code?: string;
  status?: 'draft' | 'published';
}

export interface WasteListingResponse {
  id: number;
  factory: number;
  factory_name?: string;
  title: string;
  material_type: string;
  quantity: string | number;
  unit: string;
  condition: string;
  location: string;
  description: string;
  images: string[];
  ai_material_type?: string;
  ai_confidence?: number;
  ai_ewc_code?: string;
  status: 'draft' | 'published' | 'in_auction' | 'completed' | 'sold' | 'paused' | string;
  created_at: string;
  updated_at: string;
  bids_count?: number;
  views_count?: number;
  carbon_footprint?: number | string;
}

export interface AuctionResponse {
  id: number;
  listing: WasteListingResponse;
  status: 'open' | 'closed' | 'completed' | 'cancelled';
  start_date: string;
  end_date?: string;
  created_at: string;
  highest_bid?: string | null;
  bids_count: number;
}

export interface BidResponse {
  id: number;
  auction_id?: number;
  auction?: number;
  auction_status?: string;
  listing?: WasteListingResponse;
  recycler_id?: number;
  recycler_name?: string;
  company_name?: string;
  phone?: string;
  amount: string | number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

export const listingsApi = {
  createListing: async (payload: WasteListingPayload): Promise<WasteListingResponse> => {
    return request<WasteListingResponse>('/marketplace/listings/', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  getListings: async (): Promise<WasteListingResponse[]> => {
    return request<WasteListingResponse[]>('/marketplace/listings/', {
      method: 'GET',
    });
  },

  getListing: async (id: number): Promise<WasteListingResponse> => {
    return request<WasteListingResponse>(`/marketplace/listings/${id}/`, {
      method: 'GET',
    });
  },

  updateListing: async (id: number, payload: Partial<WasteListingPayload>): Promise<WasteListingResponse> => {
    return request<WasteListingResponse>(`/marketplace/listings/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },

  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    return request<{ url: string; filename: string }>('/upload/image/', {
      method: 'POST',
      body: formData,
    });
  },
};


export const auctionsApi = {
  getAuctions: async (): Promise<AuctionResponse[]> => {
    return request<AuctionResponse[]>('/marketplace/auctions/', {
      method: 'GET',
    });
  },

  getAuction: async (id: number): Promise<AuctionResponse> => {
    return request<AuctionResponse>(`/marketplace/auctions/${id}/`, {
      method: 'GET',
    });
  },

  placeBid: async (auctionId: number, amount: number | string): Promise<BidResponse> => {
    return request<BidResponse>(`/marketplace/auctions/${auctionId}/bids/`, {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  },

  getMyBids: async (): Promise<BidResponse[]> => {
    return request<BidResponse[]>('/marketplace/my-bids/', {
      method: 'GET',
    });
  },

  getAuctionBids: async (auctionId: number): Promise<BidResponse[]> => {
    return request<BidResponse[]>(`/marketplace/auctions/${auctionId}/bids/`, {
      method: 'GET',
    });
  },

  acceptBid: async (bidId: number): Promise<{ detail: string; bid: BidResponse }> => {
    return request<{ detail: string; bid: BidResponse }>(`/marketplace/bids/${bidId}/accept/`, {
      method: 'POST',
    });
  },

  rejectBid: async (bidId: number): Promise<{ detail: string; bid: BidResponse }> => {
    return request<{ detail: string; bid: BidResponse }>(`/marketplace/bids/${bidId}/reject/`, {
      method: 'POST',
    });
  },
};

export interface TransactionResponse {
  id: number;
  auction: number;
  bid: number;
  listing?: WasteListingResponse;
  factory: number;
  factory_name?: string;
  recycler: number;
  recycler_name?: string;
  amount: string;
  platform_commission: string;
  factory_amount: string;
  status: 'Pending' | 'Held' | 'Released' | 'Completed' | 'Cancelled';
  created_at: string;
  updated_at: string;
}

export const transactionsApi = {
  getTransactions: async (): Promise<TransactionResponse[]> => {
    return request<TransactionResponse[]>('/transactions/', {
      method: 'GET',
    });
  },

  getTransaction: async (id: number): Promise<TransactionResponse> => {
    return request<TransactionResponse>(`/transactions/${id}/`, {
      method: 'GET',
    });
  },

  simulatePayment: async (id: number): Promise<{ detail: string; simulation: boolean; transaction: TransactionResponse }> => {
    return request<{ detail: string; simulation: boolean; transaction: TransactionResponse }>(`/transactions/${id}/simulate-payment/`, {
      method: 'POST',
    });
  },

  releaseEscrow: async (id: number): Promise<{ detail: string; transaction: TransactionResponse }> => {
    return request<{ detail: string; transaction: TransactionResponse }>(`/transactions/${id}/release/`, {
      method: 'POST',
    });
  },
};

export interface ShipmentResponse {
  id: number;
  transaction: number;
  listing: number;
  listing_title?: string;
  listing_material_type?: string;
  listing_quantity?: string | number;
  listing_unit?: string;
  factory: number;
  factory_name?: string;
  recycler?: number | null;
  recycler_name?: string;
  logistics_company?: number | null;
  logistics_name?: string;
  pickup_location: string;
  destination: string;
  driver_name: string;
  vehicle: string;
  tracking_number: string;
  status: 'Pending' | 'Assigned' | 'Ready for Pickup' | 'Picked Up' | 'In Transit' | 'Delivered' | 'Confirmed';
  pickup_date?: string | null;
  estimated_arrival?: string | null;
  delivered_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssignDriverPayload {
  driver_name: string;
  vehicle: string;
  pickup_date?: string;
  estimated_arrival?: string;
}

export interface LogisticsReportsData {
  total_assigned_shipments: number;
  unassigned_available: number;
  pending: number;
  assigned: number;
  ready_for_pickup: number;
  picked_up: number;
  in_transit: number;
  delivered: number;
  confirmed_completed: number;
}

export const shipmentsApi = {
  getShipments: async (): Promise<ShipmentResponse[]> => {
    return request<ShipmentResponse[]>('/shipments/', {
      method: 'GET',
    });
  },

  getLogisticsReports: async (): Promise<LogisticsReportsData> => {
    return request<LogisticsReportsData>('/logistics/reports/', {
      method: 'GET',
    });
  },

  getShipment: async (id: number): Promise<ShipmentResponse> => {
    return request<ShipmentResponse>(`/shipments/${id}/`, {
      method: 'GET',
    });
  },

  assignDriver: async (id: number, payload: AssignDriverPayload): Promise<{ detail: string; shipment: ShipmentResponse }> => {
    return request<{ detail: string; shipment: ShipmentResponse }>(`/shipments/${id}/assign/`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  pickupShipment: async (id: number, status?: string): Promise<{ detail: string; shipment: ShipmentResponse }> => {
    return request<{ detail: string; shipment: ShipmentResponse }>(`/shipments/${id}/pickup/`, {
      method: 'POST',
      body: JSON.stringify({ status }),
    });
  },

  transitShipment: async (id: number): Promise<{ detail: string; shipment: ShipmentResponse }> => {
    return request<{ detail: string; shipment: ShipmentResponse }>(`/shipments/${id}/transit/`, {
      method: 'POST',
    });
  },

  deliverShipment: async (id: number): Promise<{ detail: string; shipment: ShipmentResponse }> => {
    return request<{ detail: string; shipment: ShipmentResponse }>(`/shipments/${id}/deliver/`, {
      method: 'POST',
    });
  },

  confirmShipment: async (id: number): Promise<{ detail: string; shipment: ShipmentResponse; transaction: TransactionResponse }> => {
    return request<{ detail: string; shipment: ShipmentResponse; transaction: TransactionResponse }>(`/shipments/${id}/confirm/`, {
      method: 'POST',
    });
  },
};

export interface AdminStatsResponse {
  total_users: number;
  factories_count: number;
  recyclers_count: number;
  logistics_count: number;
  active_listings: number;
  active_auctions: number;
  transactions_count: number;
  active_shipments: number;
  completed_deals: number;
  platform_commission_total: string;
}

export const adminApi = {
  getStats: async (): Promise<AdminStatsResponse> => {
    return request<AdminStatsResponse>('/admin/stats/', {
      method: 'GET',
    });
  },
  getUsers: async (): Promise<User[]> => {
    return request<User[]>('/admin/users/', {
      method: 'GET',
    });
  },
};

export type { AIClassificationResponse } from './ai';
export { aiApi } from './ai';


export const uploadApi = {
  uploadImage: async (file: File): Promise<{ url: string; filename: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    return request<{ url: string; filename: string }>('/upload/image/', {
      method: 'POST',
      body: formData,
    });
  },
};


export interface DPPListItemResponse {
  id: number;
  document_id: string;
  dpp_id: string;
  shipment_id: number;
  tracking_number: string;
  document_type: string;
  material_type: string;
  quantity: number | string;
  unit: string;
  status: string;
  generated_at: string;
  created_at: string;
}

export interface StandardizedDPPJSON {
  document_type: string;
  schema_version: string;
  document_id: string;
  generated_at: string;
  shipment: {
    tracking_number: string;
    status: string;
    created_at: string | null;
    delivered_at: string | null;
    confirmed_at: string | null;
  };
  material: {
    title: string;
    material_type: string;
    quantity: number;
    unit: string;
    condition: string;
    ai_classification: string;
    ai_confidence: number;
  };
  origin: {
    location: string;
  };
  destination: {
    location: string;
  };
  transaction: {
    amount: number;
    currency: string;
    status: string;
  };
  logistics: {
    company: string;
    driver: string;
    vehicle: string;
    pickup_at: string | null;
    in_transit_at: string | null;
    delivered_at: string | null;
  };
  circularity: {
    material_recovery: string;
    estimated_carbon_offset: string;
    recycling_category: string;
  };
  verification: {
    identity_verified: boolean;
    delivery_confirmed: boolean;
  };
}

export interface DPPResponse {
  id: number;
  dpp_id: string;
  shipment_id: number;
  shipment_tracking?: string;
  shipment_current_status?: string;
  material_type: string;
  quantity: string;
  unit: string;
  condition: string;
  ai_classification: string;
  ai_confidence: number | null;
  origin_governorate?: string;
  destination_governorate?: string;
  waste_generator_role?: string;
  recycler_role?: string;
  transaction_id_ref: number | null;
  deal_amount: string | null;
  deal_date: string | null;
  tracking_number: string;
  logistics_partner: string;
  pickup_date: string | null;
  delivery_date: string | null;
  shipment_status: string;
  carbon_info: string;
  recycling_notes: string;
  created_at: string;
  updated_at: string;
}

export const dppApi = {
  getDPPs: async (): Promise<DPPListItemResponse[]> => {
    return request<DPPListItemResponse[]>('/dpp/', {
      method: 'GET',
    });
  },

  getDPP: async (id: number): Promise<StandardizedDPPJSON> => {
    return request<StandardizedDPPJSON>(`/dpp/${id}/`, {
      method: 'GET',
    });
  },

  getShipmentDPP: async (shipmentId: number): Promise<StandardizedDPPJSON> => {
    return request<StandardizedDPPJSON>(`/shipments/${shipmentId}/dpp/`, {
      method: 'GET',
    });
  },

  downloadDPPPdf: async (id: number, isShipment: boolean = false): Promise<void> => {
    const endpoint = isShipment ? `/shipments/${id}/dpp/pdf/` : `/dpp/${id}/pdf/`;
    const token = localStorage.getItem('access_token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!response.ok) {
      throw new Error('Failed to download PDF document.');
    }
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `DPP-${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  },
};




export interface RecommendationResponse {
  listing: WasteListingResponse;
  match_score: number;
  insights: string[];
}

export const recommendationsApi = {
  getRecommendations: async (): Promise<RecommendationResponse[]> => {
    return request<RecommendationResponse[]>('/recommendations/', {
      method: 'GET',
    });
  },
};
