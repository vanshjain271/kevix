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
  const [isNewUser, setIsNewUser] = useState(false);

  if (!isLoginModalOpen) return null;

  const resetModal = () => {
    setStep('phone');
    setPhone('');
    setOtp('');
    setError('');
    setDevOtp('');
  };

  const handleClose = () => {
    resetModal();
    closeLoginModal();
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length < 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/send-otp', { phone });
      
      if (res.data.success) {
        setIsNewUser(res.data.isNewUser || false);
        setStep('otp');
        // Show OTP in development mode (backend sends it in response)
        if (res.data.devOtp) {
          setDevOtp(res.data.devOtp);
        }
      } else {
        setError(res.data.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again.');
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
        handleClose();
      } else {
        setError(res.data.message || 'Invalid OTP. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden relative">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Purple Header */}
        <div className="bg-gradient-to-br from-primary to-primary-dark p-8 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl">
              {step === 'phone' ? 'smartphone' : 'sms'}
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-1">
            {step === 'phone' ? 'Login or Signup' : isNewUser ? 'Create Account' : 'Verify OTP'}
          </h2>
          <p className="text-white/80 text-sm">
            {step === 'phone' 
              ? 'Access your Orders, Wishlist and Recommendations'
              : `OTP sent to +91 ${phone}`
            }
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          {error && (
            <div className="bg-danger/10 text-danger text-sm p-3 rounded-lg mb-5 border border-danger/20 font-medium flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">error</span>
              {error}
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="text-xs font-semibold text-text-secondary uppercase mb-2 block">Mobile Number</label>
                <div className="flex items-center border-2 border-surface-border rounded-lg overflow-hidden focus-within:border-primary transition-colors">
                  <span className="px-3 py-3 bg-surface text-text-secondary font-medium text-sm border-r border-surface-border">+91</span>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="Enter 10-digit number"
                    className="flex-1 px-4 py-3 text-text-primary outline-none text-base bg-white"
                    autoFocus
                    required
                  />
                </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                By continuing, you agree to Kevix's{' '}
                <span className="text-primary cursor-pointer hover:underline">Terms of Use</span>
                {' '}and{' '}
                <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
              </p>
              <button 
                type="submit" 
                disabled={loading || phone.length < 10}
                className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3.5 rounded-lg shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    Sending OTP...
                  </>
                ) : 'CONTINUE'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase block">Enter OTP</label>
                  <button 
                    type="button" 
                    onClick={() => { setStep('phone'); setOtp(''); setError(''); setDevOtp(''); }}
                    className="text-primary text-xs font-semibold hover:underline"
                  >
                    Change Number
                  </button>
                </div>
                <input 
                  type="text" 
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••"
                  className="w-full border-2 border-surface-border rounded-lg px-4 py-3 text-text-primary outline-none focus:border-primary transition-colors text-2xl tracking-[0.5em] font-bold text-center bg-white"
                  autoFocus
                  required
                />
                {devOtp && (
                  <p className="text-xs text-success mt-2 font-bold bg-success/10 p-2 border border-success/20 rounded-lg flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">bug_report</span>
                    Dev Mode OTP: <span className="tracking-widest ml-1">{devOtp}</span>
                  </p>
                )}
              </div>
              
              <button 
                type="submit" 
                disabled={loading || otp.length < 4}
                className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3.5 rounded-lg shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    Verifying...
                  </>
                ) : 'VERIFY & LOGIN'}
              </button>

              <p className="text-center text-sm text-text-secondary">
                Didn't receive OTP?{' '}
                <button 
                  type="button"
                  onClick={handleSendOtp as any}
                  className="text-primary font-semibold hover:underline"
                >
                  Resend
                </button>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
