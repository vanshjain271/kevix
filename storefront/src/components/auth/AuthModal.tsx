'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function AuthModal() {
  const router = useRouter();
  const { isLoginModalOpen, closeLoginModal, setAuth } = useAuthStore();
  
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pincode, setPincode] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOtp, setDevOtp] = useState('');

  if (!isLoginModalOpen) return null;

  const resetModal = () => {
    setPhone('');
    setName('');
    setEmail('');
    setPincode('');
    setOtp('');
    setStep('form');
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
    if (mode === 'signup') {
      if (!name.trim() || !email.trim() || !pincode.trim()) {
        setError('Please fill all details to create your account.');
        return;
      }
    }
    
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/send-otp', { phone: `+91${phone}` });
      if (res.data.success) {
        setDevOtp(res.data.devOtp || '');
        setStep('otp');
      } else {
        setError(res.data.message || 'Failed to send OTP.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to send OTP. Please try again.');
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
      const res = await api.post('/auth/verify-otp', { phone: `+91${phone}`, otp });
      
      if (res.data.success) {
        const { token, user } = res.data;
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`; // Set token for the immediate next request
        
        let updatedUser = user;

        if (mode === 'signup') {
          // Send profile update
          try {
            const profileRes = await api.put('/users/me', { 
              name, 
              email, 
              // We'd send pincode if backend supported it here, or maybe address structure. 
              // Sending as part of generic data.
            });
            if (profileRes.data.success) {
              updatedUser = profileRes.data.user;
            }
          } catch (profileErr) {
            console.error('Failed to update profile after signup:', profileErr);
            // It's okay, we'll still log them in
          }
        }

        setAuth(token, updatedUser);
        handleClose();
        
        if (mode === 'login') {
          if (!updatedUser.name || !updatedUser.email) {
            router.push('/complete-profile');
          }
        }
      } else {
        setError(res.data.message || 'Verification failed. Please try again.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Invalid OTP. Please try again.');
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
          className="absolute top-4 right-4 text-white hover:text-gray-200 z-10 w-8 h-8 flex items-center justify-center rounded-full transition-colors"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Purple Header */}
        <div className="bg-gradient-to-br from-primary to-primary-dark p-8 text-white relative">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mb-4">
            <span className="material-symbols-outlined text-2xl">
              {step === 'form' ? 'person' : 'sms'}
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-1">
            {step === 'form' ? (mode === 'login' ? 'Login to Kevix' : 'Create Account') : 'Verify OTP'}
          </h2>
          <p className="text-white/80 text-sm">
            {step === 'form' 
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

          {step === 'form' ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              
              {/* Tabs */}
              <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
                <button 
                  type="button" 
                  onClick={() => { setMode('login'); setError(''); }} 
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${mode === 'login' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Log In
                </button>
                <button 
                  type="button" 
                  onClick={() => { setMode('signup'); setError(''); }} 
                  className={`flex-1 py-2 text-sm font-bold rounded-md transition-colors ${mode === 'signup' ? 'bg-white shadow text-primary' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Sign Up
                </button>
              </div>

              {mode === 'signup' && (
                <>
                  <div>
                    <label className="text-xs font-semibold text-text-secondary uppercase mb-2 block">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. John Doe"
                      className="w-full border-2 border-surface-border rounded-lg px-4 py-3 text-text-primary outline-none focus:border-primary transition-colors bg-white"
                      required={mode === 'signup'}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-text-secondary uppercase mb-2 block">Email Address</label>
                    <input 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. john@example.com"
                      className="w-full border-2 border-surface-border rounded-lg px-4 py-3 text-text-primary outline-none focus:border-primary transition-colors bg-white"
                      required={mode === 'signup'}
                    />
                  </div>
                </>
              )}

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
                    required
                  />
                </div>
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="text-xs font-semibold text-text-secondary uppercase mb-2 block">Pincode</label>
                  <input 
                    type="text" 
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="e.g. 110001"
                    className="w-full border-2 border-surface-border rounded-lg px-4 py-3 text-text-primary outline-none focus:border-primary transition-colors bg-white"
                    required={mode === 'signup'}
                  />
                </div>
              )}

              <p className="text-xs text-text-secondary leading-relaxed mt-2">
                By continuing, you agree to Kevix's{' '}
                <span className="text-primary cursor-pointer hover:underline">Terms of Use</span>
                {' '}and{' '}
                <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>.
              </p>
              
              <button 
                type="submit" 
                disabled={loading || phone.length < 10 || (mode === 'signup' && (!name || !email || pincode.length < 6))}
                className="w-full bg-accent hover:bg-accent-dark text-white font-bold py-3.5 rounded-lg shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-4"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    Sending OTP...
                  </>
                ) : (mode === 'signup' ? 'CREATE ACCOUNT' : 'GET OTP')}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-text-secondary uppercase block">Enter OTP</label>
                  <button 
                    type="button" 
                    onClick={() => { setStep('form'); setOtp(''); setError(''); setDevOtp(''); }}
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
                ) : (mode === 'signup' ? 'VERIFY & CREATE' : 'VERIFY & LOGIN')}
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
