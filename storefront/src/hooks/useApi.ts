import useSWR from 'swr';
import api from '@/lib/api';

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

export function useReviews(productId: string) {
  const { data, error, isLoading, mutate } = useSWR(productId ? `/reviews?productId=${productId}` : null, fetcher);

  return {
    reviews: data?.data?.reviews || [],
    isLoading,
    isError: error,
    mutate
  };
}

export function useWishlist() {
  const { data, error, isLoading, mutate } = useSWR('/users/wishlist', fetcher);

  return {
    wishlist: data?.data?.wishlist || [],
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
  const queryParams = new URLSearchParams();
  if (categoryId) queryParams.append('categoryId', categoryId);
  if (search) queryParams.append('search', search);
  const queryString = queryParams.toString();
  const url = queryString ? `/products?${queryString}` : '/products';

  const { data, error, isLoading } = useSWR(url, fetcher);

  return { products: data?.products || [], error, isLoading };
}

export function useProductDetail(productId: string) {
  const { data, error, isLoading } = useSWR(
    productId ? `/products/${productId}` : null,
    fetcher
  );

  return { product: data?.product || null, error, isLoading };
}

export function useSettings() {
  const { data, error, isLoading } = useSWR('/settings', fetcher);
  return { settings: data || {}, error, isLoading };
}

export function useBrands() {
  const { data, error, isLoading } = useSWR('/brands', fetcher);
  return { brands: data?.brands || [], error, isLoading };
}

export function useProductsByBrand(brandId?: string) {
  const url = brandId ? `/products?brandId=${brandId}` : null;
  const { data, error, isLoading } = useSWR(url, fetcher);
  return { products: data?.products || [], error, isLoading };
}
