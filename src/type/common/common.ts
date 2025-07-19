export interface ListPageParams {
  page: number;
  page_size: number;
  search_by?: string;
  search_value?: string;
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
  searchable?: boolean;
  mode?: 'multiple' | 'tags';
  options?: Array<{ value: string; label: string }>;
}

export interface FilterProps {
  onFilter: (filters: Record<string, unknown>) => void;
  filterConfigs?: FilterConfig[];
  onSearch: (value: string) => void;
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
    search_by: '',
    search_value: '',
    sort_by: '',
    filters: {},
  };
}; 