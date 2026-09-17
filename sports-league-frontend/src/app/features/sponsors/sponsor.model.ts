import { SponsorCategory, SponsorCategoryName } from '../../shared/enums/sponsor-category.enum';

export interface SponsorResponse {
  id: number;
  name: string;
  contactEmail: string;
  phone?: string;
  websiteUrl?: string;
  category: SponsorCategoryName; // STRING devuelto por la API (ej. "Gold")
  createdAt: string;
  updatedAt?: string;
}

export interface SponsorRequest {
  name: string;
  contactEmail: string;
  phone?: string;
  websiteUrl?: string;
  category: SponsorCategory; // NUMBER esperado por la API
}
