import apiClient from './api.service';
import { Order, PaginatedResponse, OrderStatus } from '../types/api.types';

// Must match api.service.ts — points to production server
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.kevix.in/api/v1';

class OrderService {
  async getOrders(page = 1, limit = 10, status?: OrderStatus): Promise<PaginatedResponse<Order>> {
    return apiClient.get('/admin/orders', { page, limit, status });
  }

  async getOrderById(id: string): Promise<Order> {
    return apiClient.get(`/admin/orders/${id}`);
  }

  async getPackingSlip(orderId: string): Promise<void> {
    const token = localStorage.getItem('admin_token');
    const response = await fetch(`${API_BASE_URL}/admin/orders/${orderId}/packing-slip`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) {
      let msg = 'Failed to download packing slip';
      try { msg = (await response.json()).message || msg; } catch (_) {}
      throw new Error(msg);
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `packing-slip-${orderId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async getInvoicePDF(orderId: string, orderNumber?: string): Promise<void> {
    const token = localStorage.getItem('admin_token');
    const endpoint = `${API_BASE_URL}/admin/orders/${orderId}/invoice-pdf`;
    console.log('[PDF] Requesting:', endpoint);

    const response = await fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      let msg = 'Failed to generate invoice PDF';
      try { msg = (await response.json()).message || msg; } catch (_) {}
      console.error('[PDF] Error', response.status, msg);
      throw new Error(msg);
    }

    const blob = await response.blob();
    if (blob.size === 0) throw new Error('PDF is empty — please try again');

    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `invoice-${orderNumber || orderId}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  }

  async printInvoicePDF(orderId: string): Promise<void> {
    const token = localStorage.getItem('admin_token');
    const endpoint = `${API_BASE_URL}/admin/orders/${orderId}/invoice-pdf`;

    const response = await fetch(endpoint, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!response.ok) {
      let msg = 'Failed to fetch invoice for printing';
      try { msg = (await response.json()).message || msg; } catch (_) {}
      throw new Error(msg);
    }

    const blob = await response.blob();
    if (blob.size === 0) throw new Error('PDF is empty — please try again');

    const blobUrl = URL.createObjectURL(blob);
    
    // Open in a new hidden iframe to print
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);
    
    iframe.onload = () => {
      setTimeout(() => {
        iframe.contentWindow?.print();
      }, 500); // Give it a little time to load the PDF
    };
  }
}

export default new OrderService();
