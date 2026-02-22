export type Gender = 'pria' | 'wanita' | 'anak' | 'unisex';
export type ProductShape = 'kotak' | 'bulat' | 'cat_eye' | 'aviator' | 'oval' | 'oversized' | 'geometric';

export type UserRole = 'admin' | 'staff' | 'customer';

export type ServiceType =
    | 'Periksa Mata Rutin'
    | 'Konsultasi Masalah Mata'
    | 'Ganti Frame'
    | 'Ganti Lensa'
    | 'Servis Kacamata'
    | 'Pemeriksaan Anak';

export const SERVICE_TYPES: ServiceType[] = [
    'Periksa Mata Rutin',
    'Konsultasi Masalah Mata',
    'Ganti Frame',
    'Ganti Lensa',
    'Servis Kacamata',
    'Pemeriksaan Anak',
];

export interface MetaStats {
    total: number;
    totalActive: number;
}
