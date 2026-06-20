import { useState, useEffect } from 'react';
import apiClient from '../services/api.service';

interface WishlistUser {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  wishlist: {
    _id: string;
    name: string;
    sellingPrice: number;
    mrp: number;
    images?: { url: string }[];
  }[];
}

export default function Wishlists() {
  const [users, setUsers] = useState<WishlistUser[]>([]);
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchWishlists();
    fetchStats();
  }, [page]);

  const fetchWishlists = async () => {
    setIsLoading(true);
    try {
      const res = await apiClient.get(`/admin/wishlists?page=${page}&limit=15`);
      setUsers(res.data?.data?.users || []);
      setTotalPages(res.data?.data?.pagination?.pages || 1);
    } catch (err) {
      console.error('Failed to load wishlists', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await apiClient.get('/admin/wishlists/stats');
      setStats(res.data?.data?.stats || []);
    } catch {
      setStats([]);
    }
  };

  const totalWishlisted = users.reduce((sum, u) => sum + (u.wishlist?.length || 0), 0);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
          <span className="text-red-500 text-3xl">♥</span>
          Customer Wishlists
        </h1>
        <p className="text-gray-500 mt-1">See what your customers love and want to buy</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-purple-100 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Users with Wishlists</p>
          <p className="text-3xl font-extrabold text-purple-700 mt-1">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-purple-100 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Total Items Wishlisted</p>
          <p className="text-3xl font-extrabold text-purple-700 mt-1">{totalWishlisted}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-purple-100 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Avg. Wishlist Size</p>
          <p className="text-3xl font-extrabold text-purple-700 mt-1">
            {users.length > 0 ? (totalWishlisted / users.length).toFixed(1) : '0'}
          </p>
        </div>
      </div>

      {/* Most Wishlisted Products */}
      {stats.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-8">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-gray-800 text-lg">🔥 Most Wishlisted Products</h2>
          </div>
          <div className="p-4 flex flex-wrap gap-3">
            {stats.map((stat: any) => {
              const img = stat.product?.images?.[0]?.url || stat.product?.images?.[0];
              return (
                <div key={stat._id} className="flex items-center gap-3 bg-purple-50 rounded-xl px-4 py-3 border border-purple-100">
                  {img && <img src={img} alt={stat.product?.name} className="w-10 h-10 object-contain rounded-lg" />}
                  <div>
                    <p className="text-sm font-semibold text-gray-800 max-w-[160px] truncate">{stat.product?.name}</p>
                    <p className="text-xs text-purple-600 font-bold">{stat.count} saves</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Users Wishlist Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-800 text-lg">Customer Wishlist Details</h2>
        </div>

        {isLoading ? (
          <div className="p-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-600 border-t-transparent" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-5xl mb-4">♡</p>
            <p className="text-gray-500">No wishlists yet. Customers will appear here once they save products.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {users.map((user) => (
              <div key={user._id}>
                {/* User Row */}
                <button
                  onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-700 font-bold text-sm">
                        {(user.name || user.phone || '?')[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{user.name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">{user.phone} {user.email ? `• ${user.email}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="bg-red-50 text-red-600 font-bold text-sm px-3 py-1 rounded-full">
                        ♥ {user.wishlist?.length || 0} items
                      </span>
                    </div>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedUser === user._id ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Wishlist */}
                {expandedUser === user._id && (
                  <div className="px-6 pb-6 bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-4">
                      {(user.wishlist || []).map((product) => {
                        const img = product.images?.[0]?.url || (product.images?.[0] as any);
                        const price = product.sellingPrice || 0;
                        const mrp = product.mrp || 0;
                        const discount = mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
                        return (
                          <div key={product._id} className="bg-white rounded-xl border border-purple-100 p-3 flex items-center gap-3 shadow-sm">
                            {img ? (
                              <img src={img} alt={product.name} className="w-14 h-14 object-contain rounded-lg bg-gray-50 border shrink-0" />
                            ) : (
                              <div className="w-14 h-14 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                                <span className="text-purple-300 text-[28px]">📦</span>
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">{product.name}</p>
                              <p className="text-sm font-bold text-purple-700">₹{price.toLocaleString('en-IN')}</p>
                              {discount > 0 && (
                                <p className="text-xs text-green-600 font-medium">{discount}% off</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
