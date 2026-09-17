export interface TeamResponse {
  id: number;
  name: string;
  city: string;
  stadium: string;
  logoUrl?: string;
  foundedDate: string;
  createdAt: string;
  updatedAt?: string;
}

export interface TeamRequest {
  name: string;
  city: string;
  stadium: string;
  logoUrl?: string;
  foundedDate: string;
}
