import React, { useState, useEffect } from 'react';
import api from '../services/api.service';

interface Inquiry {
  _id: string;
  product: {
    _id: string;
    name: string;
    sku: string;
    images: string[];
    salePrice?: number;
    mrp?: number;
    colors?: string[];
    sizes?: string[];
    attributes?: { name: string; value: string }[];
  };
  user?: {
    name: string;
    phone: string;
  };
  name: string;
  phone: string;
  quantity: number;
  status: string;
  notes: string;
  createdAt: string;
}

export default function Inquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res: any = await api.get('/inquiries');
      if (res.success) {
        setInquiries(res.inquiries);
      }
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      await api.patch(`/inquiries/${id}/status`, { status: newStatus });
      fetchInquiries();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  if (loading) return <div className="p-8 flex justify-center"><span className="material-symbols-outlined animate-spin text-primary text-4xl">progress_activity</span></div>;

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Bulk Inquiries</h1>
          <p className="text-text-secondary text-sm">Manage wholesale requests from customers</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-surface-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface text-text-secondary text-xs uppercase tracking-wider border-b border-surface-border">
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Customer</th>
                <th className="p-4 font-semibold">Product</th>
                <th className="p-4 font-semibold text-right">Amount</th>
                <th className="p-4 font-semibold">Quantity</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-text-secondary">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq._id} className="hover:bg-surface/50 transition-colors">
                    <td className="p-4 text-sm text-text-secondary">
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-text-primary text-sm">{inq.name}</div>
                      <div className="text-text-secondary text-xs">+91 {inq.phone}</div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded border border-surface-border overflow-hidden shrink-0 bg-surface">
                          <img src={inq.product?.images?.[0] || ''} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text-primary line-clamp-1">{inq.product?.name}</div>
                          <div className="text-xs text-text-secondary">SKU: {inq.product?.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-bold text-text-primary text-right">
                      ₹{((inq.product?.salePrice || inq.product?.mrp || 0) * inq.quantity).toLocaleString('en-IN')}
                    </td>
                    <td className="p-4 text-sm font-medium text-text-secondary">
                      {inq.quantity} units
                    </td>
                    <td className="p-4">
                      <select
                        value={inq.status}
                        onChange={(e) => updateStatus(inq._id, e.target.value)}
                        className={`text-xs font-bold px-2 py-1 rounded-full outline-none cursor-pointer border ${
                          inq.status === 'PENDING' ? 'bg-warning/10 text-warning border-warning/20' :
                          inq.status === 'CONTACTED' ? 'bg-info/10 text-info border-info/20' :
                          inq.status === 'CONVERTED' ? 'bg-success/10 text-success border-success/20' :
                          'bg-surface text-text-secondary border-surface-border'
                        }`}
                      >
                        <option value="PENDING">PENDING</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="CONVERTED">CONVERTED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <a 
                          href={`https://wa.me/91${inq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${inq.name}, regarding your bulk inquiry for ${inq.product?.name} (${inq.quantity} units)...`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="w-8 h-8 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
                          title="Chat on WhatsApp"
                        >
                          <span className="material-symbols-outlined text-[18px]">chat</span>
                        </a>
                        <button
                          onClick={() => setSelectedInquiry(inq)}
                          className="w-8 h-8 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white flex items-center justify-center transition-colors"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-surface-border">
              <h2 className="text-lg font-bold text-text-primary">Inquiry Details</h2>
              <button 
                onClick={() => setSelectedInquiry(null)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              <div className="flex gap-4 mb-6 pb-6 border-b border-surface-border">
                <div className="w-24 h-24 rounded-lg border border-surface-border overflow-hidden shrink-0">
                  <img src={selectedInquiry.product?.images?.[0] || ''} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-text-primary mb-1">{selectedInquiry.product?.name}</h3>
                  <p className="text-sm text-text-secondary mb-2">SKU: {selectedInquiry.product?.sku}</p>
                  <p className="text-primary font-bold">
                    ₹{(selectedInquiry.product?.salePrice || selectedInquiry.product?.mrp || 0).toLocaleString('en-IN')} / unit
                  </p>
                </div>
              </div>

              {(selectedInquiry.product?.colors?.length || selectedInquiry.product?.sizes?.length || selectedInquiry.product?.attributes?.length) ? (
                <div className="mb-6 pb-6 border-b border-surface-border">
                  <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3">Product Variants / Attributes</h4>
                  <div className="space-y-2 text-sm">
                    {selectedInquiry.product?.colors && selectedInquiry.product.colors.length > 0 && (
                      <div className="flex gap-2"><span className="text-text-secondary w-20">Colors:</span> <span>{selectedInquiry.product.colors.join(', ')}</span></div>
                    )}
                    {selectedInquiry.product?.sizes && selectedInquiry.product.sizes.length > 0 && (
                      <div className="flex gap-2"><span className="text-text-secondary w-20">Sizes:</span> <span>{selectedInquiry.product.sizes.join(', ')}</span></div>
                    )}
                    {selectedInquiry.product?.attributes?.map((attr: any, i: number) => (
                      <div key={i} className="flex gap-2"><span className="text-text-secondary w-20">{attr.name}:</span> <span>{attr.value}</span></div>
                    ))}
                  </div>
                </div>
              ) : null}

              <div>
                <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-3">Customer Details</h4>
                <div className="bg-surface rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Name:</span>
                    <span className="font-medium text-text-primary">{selectedInquiry.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Phone:</span>
                    <span className="font-medium text-text-primary">+91 {selectedInquiry.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Quantity Requested:</span>
                    <span className="font-bold text-primary">{selectedInquiry.quantity} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Estimated Total:</span>
                    <span className="font-bold text-text-primary">₹{((selectedInquiry.product?.salePrice || selectedInquiry.product?.mrp || 0) * selectedInquiry.quantity).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t border-surface-border bg-surface flex justify-end">
              <a
                href={`https://wa.me/91${selectedInquiry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Hello ${selectedInquiry.name}, regarding your bulk inquiry for ${selectedInquiry.product?.name} (${selectedInquiry.quantity} units)...`)}`}
                target="_blank"
                rel="noreferrer"
                className="bg-[#25D366] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-[#20b858] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">chat</span>
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
