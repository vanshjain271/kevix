'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';

export default function AuthModal() {
  const { isLoginModalOpen, closeLoginModal, setAuth } = useAuthStore();
  
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');

  if (!isLoginModalOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      // Completely mock successful authentication without hitting the backend API
      setAuth('dummy-session-token', {
        _id: 'dummy-customer-id',
        phone: phone,
        name: 'Arbuda Customer',
        email: 'customer@arbuda.com',
        role: 'customer'
      });
      closeLoginModal();
      setPhone('');
      setOtp('');
    } catch (err: any) {
      setError('Failed to authenticate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter a valid OTP');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { phone, otp });
      
      if (res.data.success) {
        setAuth(res.data.token, res.data.user);
        closeLoginModal();
        // Reset state
        setStep('phone');
        setPhone('');
        setOtp('');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-md shadow-2xl w-full max-w-md overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Close Button */}
        <button 
          onClick={closeLoginModal}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary z-10"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Content */}
        <div className="p-8 w-full">
          <h2 className="text-2xl font-bold text-text-primary mb-2">Login or Signup</h2>
          <p className="text-sm text-text-secondary mb-8">Get access to your Orders, Wishlist and Recommendations</p>
          
          {error && (
            <div className="bg-danger/10 text-danger text-sm p-3 rounded-sm mb-4 border border-danger/20 font-medium">
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-6">
              <div className="relative">
                <input 
                  type="tel" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  placeholder="Enter Mobile Number"
                  className="w-full border-b-2 border-surface-border py-2 text-text-primary outline-none focus:border-primary transition-colors text-lg"
                  required
                />
              </div>
              <p className="text-xs text-text-secondary">
                By continuing, you agree to GadgetHub's <span className="text-primary cursor-pointer hover:underline">Terms of Use</span> and <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
              </p>
              <button 
                type="submit" 
                disabled={loading || phone.length < 10}
                className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-sm shadow transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'AUTHENTICATING...' : 'CONTINUE'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <p className="text-sm text-text-primary">
                Please enter the OTP sent to <span className="font-bold">+91 {phone}</span>
                <button type="button" onClick={() => setStep('phone')} className="text-primary ml-2 font-medium hover:underline">Change</button>
              </p>
              
              <div className="relative">
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter OTP"
                  className="w-full border-b-2 border-surface-border py-2 text-text-primary outline-none focus:border-primary transition-colors text-lg tracking-widest font-bold"
                  required
                />
                {devOtp && (
                  <p className="text-xs text-success mt-2 font-bold bg-success/10 p-2 border border-success/20 rounded">
                    Dev Mode OTP: {devOtp}
                  </p>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={loading || otp.length < 4}
                className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3 rounded-sm shadow transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? 'VERIFYING...' : 'VERIFY & LOGIN'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
