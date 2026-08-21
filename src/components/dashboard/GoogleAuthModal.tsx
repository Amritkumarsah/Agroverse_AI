import React, { useState } from 'react';
import { UserProfileData } from '../../services/firebaseService';
import { UserRole } from '../../types';
import { X, UserPlus, CheckCircle2, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAccount: (profile: UserProfileData) => void;
  selectedRole: UserRole;
}

const PRESET_GOOGLE_ACCOUNTS = [
  {
    name: 'Amrit Kumar Sah',
    email: 'sahamrit3333@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'Sachin Chauhan',
    email: 'sachinchauhan.cs@cltchennai.net',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'Rajesh Kumar',
    email: 'rajesh.kumar@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200'
  }
];

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onSelectAccount,
  selectedRole
}) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyingAccount, setVerifyingAccount] = useState<{ name: string; email: string; avatar: string } | null>(null);
  const [handshakeStep, setHandshakeStep] = useState(1);

  if (!isOpen) return null;

  const handleAccountClick = (account: { name: string; email: string; avatar: string }) => {
    setVerifyingAccount(account);
    setIsVerifying(true);
    setHandshakeStep(1);

    setTimeout(() => {
      setHandshakeStep(2);
    }, 600);

    setTimeout(() => {
      setHandshakeStep(3);
    }, 1200);

    setTimeout(() => {
      const profile: UserProfileData = {
        uid: `google-${Date.now()}`,
        email: account.email,
        displayName: account.name,
        photoURL: account.avatar,
        role: selectedRole,
        createdAt: new Date().toISOString(),
        emailVerified: true
      };
      onSelectAccount(profile);
    }, 1800);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim() || !customEmail.includes('@')) return;
    const resolvedName = customName.trim() || customEmail.split('@')[0];
    const newAccount = {
      name: resolvedName,
      email: customEmail.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200'
    };
    handleAccountClick(newAccount);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 text-slate-800 font-sans">
        
        {/* Top Close Bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <div className="flex items-center space-x-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span className="font-extrabold text-sm text-slate-700 tracking-tight">Google Accounts</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* VERIFICATION HANDSHAKE SCREEN */}
        {isVerifying && verifyingAccount ? (
          <div className="p-8 text-center space-y-6 animate-fadeIn">
            <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100 border-t-blue-500 animate-spin" />
              <img
                src={verifyingAccount.avatar}
                alt={verifyingAccount.name}
                className="w-14 h-14 rounded-full object-cover shadow-md"
              />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-extrabold text-slate-900">Signing in to AGROVERSE AI</h4>
              <p className="text-xs text-slate-500 font-medium">{verifyingAccount.email}</p>
            </div>

            {/* Handshake Progress Steps */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2 text-left">
              <div className="flex items-center space-x-2.5">
                {handshakeStep >= 1 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin shrink-0" />
                )}
                <span className={`font-semibold ${handshakeStep >= 1 ? 'text-slate-800' : 'text-slate-400'}`}>
                  Connecting securely to accounts.google.com...
                </span>
              </div>

              <div className="flex items-center space-x-2.5">
                {handshakeStep >= 2 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                )}
                <span className={`font-semibold ${handshakeStep >= 2 ? 'text-slate-800' : 'text-slate-400'}`}>
                  Verifying OAuth tokens & consent...
                </span>
              </div>

              <div className="flex items-center space-x-2.5">
                {handshakeStep >= 3 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />
                )}
                <span className={`font-semibold ${handshakeStep >= 3 ? 'text-emerald-700 font-bold' : 'text-slate-400'}`}>
                  Access Granted! Launching Farm Dashboard...
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* ACCOUNT CHOOSER LIST SCREEN */
          <div className="p-6 pt-2 space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Choose an account</h3>
              <p className="text-xs text-slate-500 font-medium">to continue to <span className="font-extrabold text-emerald-700">AGROVERSE AI</span></p>
            </div>

            {/* Account Selection Cards */}
            <div className="space-y-2">
              {PRESET_GOOGLE_ACCOUNTS.map((acc, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAccountClick(acc)}
                  className="w-full p-3 rounded-2xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 flex items-center space-x-3.5 text-left transition-all group cursor-pointer shadow-sm"
                >
                  <img
                    src={acc.avatar}
                    alt={acc.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-300 group-hover:scale-105 transition-transform shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-xs text-slate-900 group-hover:text-blue-700 transition-colors truncate">
                      {acc.name}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate font-medium">
                      {acc.email}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all shrink-0" />
                </button>
              ))}

              {/* Custom Google Account Entry Toggle */}
              {!showCustomInput ? (
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="w-full p-3 rounded-2xl border border-dashed border-slate-300 hover:border-blue-400 hover:bg-slate-50 flex items-center space-x-3 text-left transition-all cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                    <UserPlus className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="font-bold text-xs text-slate-700 hover:text-blue-600">
                    Use another Google Account
                  </div>
                </button>
              ) : (
                <form onSubmit={handleCustomSubmit} className="p-3.5 rounded-2xl border border-blue-300 bg-blue-50/40 space-y-3">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span>Enter your Google/Gmail credentials:</span>
                  </div>

                  <input
                    type="email"
                    required
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="e.g. yourname@gmail.com"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-blue-500 text-slate-900"
                  />

                  <input
                    type="text"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Full Name (Optional)"
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-blue-500 text-slate-900"
                  />

                  <div className="flex items-center space-x-2 pt-1">
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-colors cursor-pointer"
                    >
                      Sign In with Google
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCustomInput(false)}
                      className="px-3 py-2 rounded-xl border border-slate-300 text-slate-600 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Google Privacy Disclaimer Footer */}
            <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-400 leading-relaxed flex items-start space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                To continue, Google will share your name, email address, and profile picture with AGROVERSE AI. Before using AGROVERSE AI, review its Privacy Policy.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
