import { useCallback, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './redux';
import { defaultParams, type ListPageParams } from '../type/common/common';

interface PaginatedListConfig<T> {
  selector: (state: any) => {
    loading: boolean;
    items: T[];
    total: number;
  };
  fetchAction: (params: ListPageParams) => any;
  initialParams?: Partial<ListPageParams>;
}

export const usePaginatedList = <T>({ 
  selector, 
  fetchAction, 
  initialParams = {} 
}: PaginatedListConfig<T>) => {
  const dispatch = useAppDispatch();
  const { loading, items, total } = useAppSelector(selector);

  const [params, setParams] = useState<ListPageParams>({
    ...defaultParams(),
    ...initialParams,
  });
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchData = useCallback(
    (fetchParams: ListPageParams) => {
      dispatch(fetchAction(fetchParams));
    },
    [dispatch, fetchAction],
  );

  const handleRefresh = useCallback(() => {
    if (loading) return;
    setRefreshing(true);
    const refreshParams = {
      ...params,
      page: 1,
    };
    setParams(refreshParams);
    fetchData(refreshParams);
  }, [loading, params, fetchData]);

  const handleLoadMore = useCallback(() => {
    if (!loading && !loadingMore && items.length < total) {
      setLoadingMore(true);
      const nextParams = { ...params, page: params.page + 1 };
      setParams(nextParams);
      fetchData(nextParams);
    }
  }, [loading, loadingMore, items.length, total, params, fetchData]);

  const updateParams = useCallback((updater: (prev: ListPageParams) => ListPageParams) => {
    const newParams = updater(params);
    setParams(newParams);
  }, [params]);

  useEffect(() => {
    fetchData(params);
  }, [params, fetchData]);

  useEffect(() => {
    if (!loading) {
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [loading]);

  return {
    data: items,
    loading,
    refreshing,
    loadingMore,
    total,
    params,
    handleRefresh,
    handleLoadMore,
    updateParams,
    fetchData,
  };
}; 