import React, { useState, useEffect } from 'react';
import api from '../services/api.service';

interface Inquiry {
  _id: string;
  product: {
    _id: string;
    name: string;
    sku: string;
    images: string[];
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

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/inquiries');
      if (res.data.success) {
        setInquiries(res.data.inquiries);
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
                <th className="p-4 font-semibold">Quantity</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
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
                          <img src={inq.product?.images?.[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-text-primary line-clamp-1">{inq.product?.name}</div>
                          <div className="text-xs text-text-secondary">SKU: {inq.product?.sku}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm font-bold text-text-primary">
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
                      <a 
                        href={`https://wa.me/91${inq.phone}?text=Hello ${inq.name}, regarding your bulk inquiry for ${inq.product?.name}...`}
                        target="_blank"
                        rel="noreferrer"
                        className="w-8 h-8 rounded-full bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366] hover:text-white flex items-center justify-center transition-colors"
                        title="Chat on WhatsApp"
                      >
                        <span className="material-symbols-outlined text-[18px]">chat</span>
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
