import useSWR from 'swr';
import api from '@/lib/api';
import { useAuthStore } from '@/store/useAuthStore';
import { useEffect } from 'react';

const fetcher = (url: string) => api.get(url).then(res => res.data?.data || res.data);

export function useCategories() {
  const { data, error, isLoading } = useSWR('/categories', fetcher);
  return { categories: data?.categories || [], error, isLoading };
}

export function useCart() {
  const { data, error, isLoading, mutate } = useSWR('/cart', fetcher);

  return {
    cart: data?.data?.cart || null,
    isLoading,
    isError: error,
    mutate
  };
}

export function useAddresses() {
  const { data, error, isLoading, mutate } = useSWR('/addresses', fetcher);

  return {
    addresses: data?.data || [],
    isLoading,
    isError: error,
    mutate
  };
}

export function useOrders() {
  const { data, error, isLoading, mutate } = useSWR('/orders/my', fetcher);

  return {
    orders: data?.data || [],
    isLoading,
    isError: error,
    mutate
  };
}

export function useBanners() {
  const { data, error, isLoading } = useSWR('/banners', fetcher);
  return { banners: data?.banners || [], error, isLoading };
}

export function useProducts(categoryId?: string, search?: string) {
  const { isAuthenticated, openLoginModal } = useAuthStore();
  
  // We only fetch products if authenticated
  const queryParams = new URLSearchParams();
  if (categoryId) queryParams.append('categoryId', categoryId);
  if (search) queryParams.append('search', search);
  const queryString = queryParams.toString();
  const url = queryString ? `/products?${queryString}` : '/products';

  const { data, error, isLoading } = useSWR(isAuthenticated ? url : null, fetcher, {
    onError: (err) => {
      if (err.response?.status === 401 || err.response?.status === 403) {
        openLoginModal();
      }
    }
  });

  // If not authenticated, we should proactively ask them to log in when trying to view products
  useEffect(() => {
    if (!isAuthenticated) {
      openLoginModal();
    }
  }, [isAuthenticated, openLoginModal]);

  return { products: data?.products || [], error, isLoading };
}

export function useProductDetail(productId: string) {
  const { isAuthenticated, openLoginModal } = useAuthStore();
  
  const { data, error, isLoading } = useSWR(
    isAuthenticated && productId ? `/products/${productId}` : null, 
    fetcher,
    {
      onError: (err) => {
        if (err.response?.status === 401 || err.response?.status === 403) {
          openLoginModal();
        }
      }
    }
  );

  return { product: data?.product || null, error, isLoading };
}
