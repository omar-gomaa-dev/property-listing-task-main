export interface Property {
  id: number;
  title: string;
  description?: string;
  price?: number;
  status?: 'available' | 'sold' | 'pending' | string;
  address?: string;
  images?: string[];
  [key: string]: any;
}
