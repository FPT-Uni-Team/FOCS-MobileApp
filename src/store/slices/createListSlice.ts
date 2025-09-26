import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { defaultParams, type ListPageParams } from '../../type/common/common';

interface BaseListState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
  params: ListPageParams;
  total: number;
}

export const createListSlice = <T>(name: string) => {
  const initialState: BaseListState<T> = {
    items: [],
    loading: false,
    error: null,
    params: defaultParams(),
    total: 0,
  };

  return createSlice({
    name,
    initialState,
    reducers: {
      fetchStart: (state, action: PayloadAction<ListPageParams | undefined>) => {
        state.loading = true;
        state.error = null;
        const newParams = action.payload || initialState.params;
        
        if (newParams.page === 1 || 
            JSON.stringify(newParams.filters) !== JSON.stringify(state.params.filters)) {
          state.items = [];
        }
        
        state.params = newParams;
      },
      fetchSuccess: (state, action: PayloadAction<{ items: T[]; total: number }>) => {
        state.loading = false;
        state.error = null;
        state.total = action.payload.total;
        
        if (state.params.page === 1) {
          state.items = action.payload.items as any;
        } else {
          state.items.push(...(action.payload.items as any));
        }
      },
      fetchFailure: (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
        if (state.params.page === 1) {
          state.items = [];
          state.total = 0;
        }
      },
      reset: (state) => {
        state.loading = false;
        state.error = null;
        state.items = [];
        state.total = 0;
        state.params = defaultParams();
      },
    },
  });
}; 