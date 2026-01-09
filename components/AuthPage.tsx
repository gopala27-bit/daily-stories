
import React, { useState } from 'react';
import * as api from '../api';
import { User } from '../types';

interface AuthPageProps {
  onLogin: (user: User) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ onLogin }) => {
  const [step, setStep] = useState(1); // 1 for mobile number, 2 for OTP
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileNumber.length >= 10) {
      setError('');
      setStep(2);
    } else {
      setError('Please enter a valid mobile number.');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError('Please enter a 4-digit OTP.');
      return;
    };
    
    setIsLoading(true);
    setError('');
    try {
        const user = await api.login(mobileNumber, otp);
        onLogin(user);
    } catch (err) {
        setError('Login failed. Please try again.');
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full max-w-sm p-8 space-y-6 bg-zinc-800/50 border border-zinc-700/50 rounded-xl shadow-lg">
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-center text-white">Welcome</h1>
              <p className="text-center text-zinc-400 mt-2">Enter your mobile number to begin.</p>
            </div>
            <div>
              <label htmlFor="mobile" className="sr-only">Mobile Number</label>
              <input
                id="mobile"
                name="mobile"
                type="tel"
                autoComplete="tel"
                required
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-zinc-600 bg-zinc-700 text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Mobile Number"
              />
            </div>
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-indigo-500"
              >
                Send OTP
              </button>
            </div>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-center text-white">Verify OTP</h1>
              <p className="text-center text-zinc-400 mt-2">Enter the 4-digit code. (any 4 digits)</p>
            </div>
            <div>
              <label htmlFor="otp" className="sr-only">OTP</label>
              <input
                id="otp"
                name="otp"
                type="text"
                maxLength={4}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-zinc-600 bg-zinc-700 text-zinc-100 placeholder-zinc-400 text-center tracking-[1em] focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="----"
              />
            </div>
            {error && <p className="text-sm text-red-400 text-center">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-indigo-500 disabled:bg-indigo-800"
              >
                {isLoading ? 'Verifying...' : 'Verify & Login'}
              </button>
            </div>
             <div className="text-center">
                <button type="button" onClick={() => setStep(1)} className="text-sm text-indigo-400 hover:text-indigo-300">
                    Back
                </button>
            </div>
          </form>
        )}
      </div>
       <p className="mt-8 text-xs text-center text-zinc-500">
        This platform is a shared daily journal. <br />
        No popularity. No algorithms. Every story matters equally.
      </p>
    </div>
  );
};

export default AuthPage;
