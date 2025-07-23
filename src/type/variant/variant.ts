export interface Variant {
  id?: string;
  name: string;
  price: number;
  prep_per_time?: number;
  quantity_per_time?: number;
  is_available: boolean;
}

export interface VariantGroup {
  id?: string;
  group_name: string;
  is_required: boolean;
  min_select: number;
  max_select: number;
  variants: Variant[];
} 