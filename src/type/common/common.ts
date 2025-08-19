export interface ListPageParams {
  page: number;
  page_size: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface FilterConfig {
  type: 'select' | 'input' | 'date' | 'rangePicker';
  name: string;
  key?: string;
  label?: string;
  placeholder?: string;
  mode?: 'multiple' | 'tags';
  options?: Array<{ value: string; label: string }>;
}

export interface FilterProps {
  onFilter: (filters: Record<string, unknown>) => void;
  filterConfigs?: FilterConfig[];
  isShowFilter?: boolean;
}

export interface ListPageResponse {
  total_count: number;
  page_index: number;
  page_size: number;
  items: [];
}

export const defaultParams = (page_size = 10): ListPageParams => {
  return {
    page: 1,
    page_size,
    sort_by: '',
    filters: {},
  };
}; 