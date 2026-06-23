import { useState, useEffect } from 'react';
import apiClient from '../services/api.service';

interface WishlistUser {
  user: {
    _id: string;
    name: string;
    phone: string;
    email?: string;
  };
  items: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  }[];
  totalAmount: number;
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
      setUsers(res.data?.wishlists || []);
      setTotalPages(res.data?.pagination?.pages || 1);
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

  const totalWishlisted = users.reduce((sum, u) => sum + (u.items?.length || 0), 0);

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
              <div key={user.user._id}>
                {/* User Row */}
                <button
                  onClick={() => setExpandedUser(expandedUser === user.user._id ? null : user.user._id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                      <span className="text-purple-700 font-bold text-sm">
                        {(user.user.name || user.user.phone || '?')[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-900">{user.user.name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">{user.user.phone} {user.user.email ? `• ${user.user.email}` : ''}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right flex flex-col gap-1 items-end">
                      <span className="bg-red-50 text-red-600 font-bold text-sm px-3 py-1 rounded-full">
                        ♥ {user.items?.length || 0} items
                      </span>
                      <span className="text-sm font-semibold text-gray-700">
                        Total: ₹{user.totalAmount?.toLocaleString('en-IN') || 0}
                      </span>
                    </div>
                    <a
                      href={`https://wa.me/91${user.user.phone.replace(/\\D/g, '').slice(-10)}?text=${encodeURIComponent(`Hello ${user.user.name || ''}, we noticed you liked some products on Kevix! Let us know if you need any help ordering.`)}`}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="bg-green-100 text-green-700 hover:bg-green-200 transition-colors p-2 rounded-full flex items-center justify-center"
                      title="Contact on WhatsApp"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.489-1.761-1.663-2.06-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                      </svg>
                    </a>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${expandedUser === user.user._id ? 'rotate-180' : ''}`}
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                {/* Expanded Wishlist */}
                {expandedUser === user.user._id && (
                  <div className="px-6 pb-6 bg-gray-50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-4">
                      {(user.items || []).map((product) => {
                        const img = product.image;
                        const price = product.price || 0;
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
