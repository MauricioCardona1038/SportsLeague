export enum SponsorCategory {
  Main = 0,
  Gold = 1,
  Silver = 2,
  Bronze = 3,
}

// Claves exactamente como las devuelve Enum.ToString() en el backend (ver MappingProfile.cs).
export type SponsorCategoryName = keyof typeof SponsorCategory;

export const SPONSOR_CATEGORY_LABELS: Record<SponsorCategoryName, string> = {
  Main: 'Patrocinador principal',
  Gold: 'Oro',
  Silver: 'Plata',
  Bronze: 'Bronce',
};
