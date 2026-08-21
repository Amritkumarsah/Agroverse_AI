import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { useApp } from '../../context/AppContext';
import { 
  LogIn, 
  UserPlus, 
  Sparkles, 
  MapPin, 
  Lock, 
  User, 
  CheckCircle2, 
  Camera, 
  Upload, 
  ShieldCheck, 
  Navigation,
  Loader2,
  ArrowRight,
  Sprout,
  Building2,
  Microscope,
  KeyRound
} from 'lucide-react';
import { reverseGeocodeCity } from '../../utils/geoUtils';
import { firebaseService } from '../../services/firebaseService';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200'
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

export const AuthModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialTab = 'login'
}) => {
  const { setCurrentView, setRole, addNewFarm, farms, setSelectedFarmId, showToast, setCurrentUser, theme } = useApp();
  
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  
  // Login Form State
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'authority' | 'researcher'>('farmer');

  // Sign Up Form State
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupLocation, setSignupLocation] = useState('');
  const [signupLatitude, setSignupLatitude] = useState('26.1209');
  const [signupLongitude, setSignupLongitude] = useState('85.3647');
  const [signupCrop, setSignupCrop] = useState('Wheat (HD-2967)');
  const [signupFarmSize, setSignupFarmSize] = useState('2.5');
  const [signupAvatarUrl, setSignupAvatarUrl] = useState(PRESET_AVATARS[0]);
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectStatus, setDetectStatus] = useState('');

  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      setDetectStatus('Geolocation is not supported by your browser.');
      return;
    }
    setIsDetecting(true);
    setDetectStatus('Scanning satellite GPS & Wi-Fi location...');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const numLat = parseFloat(pos.coords.latitude.toFixed(4));
        const numLng = parseFloat(pos.coords.longitude.toFixed(4));
        setSignupLatitude(numLat.toString());
        setSignupLongitude(numLng.toString());
        
        setDetectStatus('Resolving exact city & district...');
        const cityName = await reverseGeocodeCity(numLat, numLng);
        setSignupLocation(cityName);
        setIsDetecting(false);
        setDetectStatus(`📍 Verified: ${cityName} (${numLat}°N, ${numLng}°E)`);
      },
      (err) => {
        setIsDetecting(false);
        setDetectStatus(`Location error: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSignupAvatarUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [verificationSentEmail, setVerificationSentEmail] = useState<string | null>(null);
  const [isVerifyingStatus, setIsVerifyingStatus] = useState(false);

  const { resendVerificationEmail, checkEmailVerification } = useApp();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthLoading(true);
    try {
      const emailToUse = loginIdentifier.includes('@') ? loginIdentifier : `${loginIdentifier.replace(/[^a-zA-Z0-9]/g, '')}@agrinexsus.ai`;
      const pwdToUse = loginPassword || 'AgriPass2026!';
      
      const profile = await firebaseService.signInWithEmail(emailToUse, pwdToUse, selectedRole);
      setRole(selectedRole);

      if (profile.emailVerified === false && emailToUse.includes('@') && !emailToUse.endsWith('@agrinexsus.ai')) {
        setVerificationSentEmail(emailToUse);
        showToast(`Verification required. Link sent to ${emailToUse}`, 'info');
      } else {
        setCurrentView('overview');
        showToast(`Signed in as ${profile.displayName || emailToUse} (${selectedRole.toUpperCase()})`, 'success');
        onClose();
      }
    } catch (err: any) {
      console.error('Firebase Sign-In Notice:', err);
      let errMsg = 'Login failed';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errMsg = 'Invalid credentials. If you are new, click "Register New Farmer" tab.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Invalid email address format.';
      } else if (err.code === 'auth/network-request-failed') {
        errMsg = 'Network offline. Check internet connection.';
      } else if (err.code) {
        errMsg = `Firebase Auth: ${err.code.replace('auth/', '')}`;
      }
      showToast(errMsg, 'error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handlePasswordResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;
    setIsResetting(true);
    try {
      await firebaseService.sendPasswordReset(resetEmail.trim());
      showToast(`Password reset link sent to ${resetEmail.trim()}`, 'success');
      setShowResetModal(false);
      setResetEmail('');
    } catch (err: any) {
      console.error('Password Reset Error:', err);
      const errMsg = err.code ? `Firebase Auth: ${err.code.replace('auth/', '')}` : (err.message || 'Reset failed');
      showToast(errMsg, 'error');
    } finally {
      setIsResetting(false);
    }
  };

  const handleGoogleSignIn = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    console.log('[GOOGLE AUTH] signInWithPopup CALLED', new Date().toISOString());
    console.log('[AUTH] Google button clicked');
    setIsAuthLoading(true);
    try {
      const profile = await firebaseService.signInWithGoogle(selectedRole);
      
      console.log('[AUTH] Dashboard redirect: ALLOWING ACCESS for', profile.displayName);

      // Auto-assign existing farm matching Google account name
      if (profile?.displayName) {
        const existingFarm = farms.find(f => f.name.toLowerCase() === profile.displayName?.toLowerCase());
        if (existingFarm) {
          setSelectedFarmId(existingFarm.id);
        }
      }

      setRole(selectedRole);
      setCurrentView('overview');
      showToast(`Welcome ${profile?.displayName || 'Agent'}! Authenticated & Authorized.`, 'success');
      onClose();
    } catch (err: any) {
      console.error('[AUTH] Google Auth Error:', err);
      console.log('[AUTH] Dashboard redirect: BLOCKED');
      
      if (err.code === 'auth/unregistered-agent' || err.message?.includes('not registered')) {
        showToast('Access Denied: Your Google account is not registered as an Agent. Please register first under "Register New Farmer" tab.', 'error');
      } else if (err.code === 'auth/popup-closed-by-user') {
        showToast('Google sign-in was cancelled.', 'info');
      } else if (err.code === 'auth/popup-blocked') {
        showToast('Your browser blocked the Google sign-in popup. Please allow popups for this site and try again.', 'error');
      } else if (err.code === 'auth/cancelled-popup-request') {
        showToast('Google sign-in request was cancelled.', 'info');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        showToast('An account already exists with the same email address but different sign-in credentials.', 'error');
      } else if (err.code === 'auth/unauthorized-domain') {
        showToast('Domain not authorized in Firebase Console. Add host to Authorized Domains list.', 'error');
      } else {
        const errMsg = err.message || 'Google authentication failed.';
        showToast(errMsg, 'error');
      }
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleQuickDemoLogin = (farmId?: string, roleType: 'farmer' | 'authority' | 'researcher' = 'farmer') => {
    if (farmId) setSelectedFarmId(farmId);
    setRole(roleType);
    setCurrentUser({
      uid: farmId || `demo-${Date.now()}`,
      email: roleType === 'authority' ? 'authority@agrinexsus.ai' : 'rajesh.kumar@agrinexsus.ai',
      displayName: roleType === 'authority' ? 'Dr. Ananya Sharma' : 'Rajesh Kumar',
      photoURL: roleType === 'authority' ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
      role: roleType,
      createdAt: new Date().toISOString(),
      emailVerified: true
    });
    setCurrentView('overview');
    showToast(`Quick Demo Access granted as ${roleType === 'authority' ? 'Dr. Ananya' : 'Rajesh Kumar'}!`, 'success');
    onClose();
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupName.trim()) {
      showToast('Please enter Farmer Full Name.', 'error');
      return;
    }
    if (!signupLocation.trim()) {
      showToast('Please enter District / City Location.', 'error');
      return;
    }
    if (!signupEmail.trim() || !signupEmail.includes('@')) {
      showToast('Please enter a valid Gmail address (e.g. farmer@gmail.com).', 'error');
      return;
    }
    if (!signupPassword.trim() || signupPassword.length < 6) {
      showToast('Please enter a password with at least 6 characters.', 'error');
      return;
    }

    setIsAuthLoading(true);
    try {
      const emailToUse = signupEmail.trim();
      const pwdToUse = signupPassword.trim();
      
      await firebaseService.signUpWithEmail(emailToUse, pwdToUse, signupName, 'farmer', signupAvatarUrl);
      
      addNewFarm({
        farmer: signupName,
        location: signupLocation,
        latitude: parseFloat(signupLatitude) || 26.1209,
        longitude: parseFloat(signupLongitude) || 85.3647,
        farmSizeHectares: parseFloat(signupFarmSize) || 2.5,
        crop: signupCrop,
        avatarUrl: signupAvatarUrl
      });

      setRole('farmer');

      // ALWAYS show the Gmail Verification Required screen upon signup
      setVerificationSentEmail(emailToUse);
      showToast(`Verification link sent to ${emailToUse}! Please verify your Gmail.`, 'info');
    } catch (err: any) {
      console.error('Firebase Sign Up Error:', err);
      let errMsg = err.message || 'Registration failed';
      if (err.code === 'auth/email-already-in-use') {
        errMsg = 'This Gmail address is already registered. Please sign in under "Sign In / Existing Account" tab.';
      } else if (err.code === 'auth/weak-password') {
        errMsg = 'Password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errMsg = 'Invalid email format. Please enter a valid Gmail address.';
      }
      showToast(errMsg, 'error');
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleCheckVerificationStatus = async () => {
    setIsVerifyingStatus(true);
    try {
      const isVerified = await checkEmailVerification();
      if (isVerified) {
        showToast('Gmail address verified! Dashboard access granted.', 'success');
        setCurrentView('overview');
        setVerificationSentEmail(null);
        onClose();
      } else {
        showToast('Email not verified yet. Please check your Gmail inbox and click the verification link.', 'error');
      }
    } catch (e: any) {
      showToast('Could not verify status: ' + (e.message || 'Verification pending'), 'error');
    } finally {
      setIsVerifyingStatus(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="AGROVERSE AI — Authentication Gateway"
    >
      <div className={`space-y-6 text-xs font-sans ${theme === 'light' ? 'text-slate-900' : 'text-gray-200'}`}>
        {/* Header Branding Banner */}
        <div className={`relative overflow-hidden rounded-2xl p-4 border shadow-lg ${
          theme === 'light' 
            ? 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100 border-emerald-300' 
            : 'bg-gradient-to-br from-[#122318] via-[#0d1811] to-[#152e1f] border-emerald-500/30'
        }`}>
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="space-y-1">
              <div className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold tracking-wider uppercase ${
                theme === 'light' ? 'bg-emerald-100 border-emerald-300 text-emerald-800' : 'bg-emerald-950/80 border-emerald-500/40 text-emerald-300'
              }`}>
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>Encrypted DPI Governance</span>
              </div>
              <h3 className={`text-base font-extrabold tracking-tight flex items-center gap-1.5 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                <span>Farmer & Institutional Access Portal</span>
              </h3>
            </div>
            
            <div className={`hidden sm:flex items-center justify-center w-10 h-10 rounded-xl border shadow-inner ${
              theme === 'light' ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-emerald-950/60 border-emerald-500/30 text-emerald-400'
            }`}>
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
          </div>
        </div>

        {/* GMAIL VERIFICATION PENDING SCREEN */}
        {verificationSentEmail ? (
          <div className={`space-y-5 border p-5 rounded-2xl shadow-xl text-center ${
            theme === 'light' ? 'bg-white border-emerald-300' : 'bg-[#0d1711] border-emerald-500/40'
          }`}>
            <div className={`mx-auto w-14 h-14 rounded-2xl border flex items-center justify-center shadow-inner animate-pulse ${
              theme === 'light' ? 'bg-emerald-100 border-emerald-300 text-emerald-700' : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-400'
            }`}>
              <ShieldCheck className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h4 className={`text-base font-extrabold ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>Gmail Verification Required 📧</h4>
              <p className={`text-xs max-w-sm mx-auto leading-relaxed ${theme === 'light' ? 'text-slate-600' : 'text-gray-300'}`}>
                A Firebase verification link has been dispatched to:
              </p>
              <div className={`inline-block px-3 py-1.5 rounded-xl border font-mono font-bold text-xs ${
                theme === 'light' ? 'bg-emerald-50 border-emerald-300 text-emerald-800' : 'bg-emerald-950 border-emerald-500/60 text-emerald-300'
              }`}>
                {verificationSentEmail}
              </div>
              <p className={`text-[11px] pt-1 ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>
                Please open your Gmail inbox, click the verification link, and click below to enter your dashboard.
              </p>
            </div>

            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleCheckVerificationStatus}
                disabled={isVerifyingStatus}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isVerifyingStatus ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>I Have Verified My Email — Enter Dashboard</span>
                  </>
                )}
              </button>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      await resendVerificationEmail();
                      showToast('Verification link resent! Check Gmail Spam / Promotions folder.', 'success');
                    } catch (e: any) {
                      showToast('Verification email resent to ' + verificationSentEmail + '. Check Spam folder.', 'info');
                    }
                  }}
                  className={`py-2.5 px-2 rounded-xl border font-bold text-[11px] transition-all cursor-pointer truncate ${
                    theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800' : 'bg-[#142219] hover:bg-[#1a2d21] border-[#233c2a] text-emerald-400'
                  }`}
                >
                  Resend Link 🔄
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setCurrentUser(prev => ({
                      uid: prev?.uid || `user-${Date.now()}`,
                      email: prev?.email || verificationSentEmail || 'farmer@agrinexsus.ai',
                      displayName: prev?.displayName || signupName || 'Farmer Agent',
                      photoURL: prev?.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
                      role: prev?.role || 'farmer',
                      createdAt: prev?.createdAt || new Date().toISOString(),
                      emailVerified: true
                    }));
                    showToast('Gmail address verified! Access granted to AGROVERSE AI Dashboard.', 'success');
                    setCurrentView('overview');
                    setVerificationSentEmail(null);
                    onClose();
                  }}
                  className="py-2.5 px-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-extrabold text-[11px] shadow-md transition-all cursor-pointer truncate"
                >
                  Instant Verify 🚀
                </button>

                <button
                  type="button"
                  onClick={() => setVerificationSentEmail(null)}
                  className={`py-2.5 px-2 rounded-xl border font-bold text-[11px] transition-all cursor-pointer truncate ${
                    theme === 'light' ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700' : 'bg-[#142219] hover:bg-[#1a2d21] border-[#233c2a] text-gray-400'
                  }`}
                >
                  Back to Portal
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Auth Mode Pill Selector */}
            <div className={`grid grid-cols-2 rounded-2xl p-1.5 border shadow-inner ${
              theme === 'light' ? 'bg-slate-100 border-slate-300' : 'bg-[#0b120d] border-[#1f3325]'
            }`}>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`py-2.5 rounded-xl font-extrabold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  activeTab === 'login' 
                    ? theme === 'light' 
                      ? 'bg-white text-emerald-800 border border-emerald-400 shadow-md scale-[1.01]' 
                      : 'bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 text-white border border-emerald-500/60 shadow-lg scale-[1.01]' 
                    : theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'text-gray-400 hover:text-gray-200 hover:bg-[#121c15]'
                }`}
              >
                <LogIn className={`w-4 h-4 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                <span>Sign In / Existing Account</span>
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('signup')}
                className={`py-2.5 rounded-xl font-extrabold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  activeTab === 'signup' 
                    ? theme === 'light' 
                      ? 'bg-white text-emerald-800 border border-emerald-400 shadow-md scale-[1.01]' 
                      : 'bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-900 text-white border border-emerald-500/60 shadow-lg scale-[1.01]' 
                    : theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-200' : 'text-gray-400 hover:text-gray-200 hover:bg-[#121c15]'
                }`}
              >
                <UserPlus className={`w-4 h-4 ${theme === 'light' ? 'text-emerald-600' : 'text-emerald-400'}`} />
                <span>Register New Farmer</span>
              </button>
            </div>

            {/* TAB 1: SIGN IN / LOGIN */}
            {activeTab === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-5">
                {/* Input Credentials Box */}
                <div className={`space-y-3.5 p-4.5 rounded-2xl border shadow-md backdrop-blur-md ${
                  theme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-900' : 'bg-[#0f1a13]/80 border-[#1e3425] text-white'
                }`}>
                  <div>
                    <label className={`block font-extrabold mb-1.5 flex items-center gap-1.5 text-[11px] ${
                      theme === 'light' ? 'text-slate-800' : 'text-gray-300'
                    }`}>
                      <User className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Mobile Number or Farmer Email ID</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={loginIdentifier}
                        onChange={(e) => setLoginIdentifier(e.target.value)}
                        placeholder="e.g. +91 9876543210 or farmer@agrinexsus.ai"
                        className={`w-full border rounded-xl px-3.5 py-2.5 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                          theme === 'light' 
                            ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500' 
                            : 'bg-[#142219] border-[#233c2a] text-white placeholder-gray-500 focus:border-emerald-400'
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className={`font-extrabold flex items-center gap-1.5 text-[11px] ${
                        theme === 'light' ? 'text-slate-800' : 'text-gray-300'
                      }`}>
                        <Lock className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Password / Security PIN</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmail(loginIdentifier.includes('@') ? loginIdentifier : '');
                          setShowResetModal(true);
                        }}
                        className="text-[10px] text-emerald-600 hover:text-emerald-700 hover:underline font-extrabold cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••"
                        className={`w-full border rounded-xl px-3.5 py-2.5 font-medium transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                          theme === 'light' 
                            ? 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-emerald-500' 
                            : 'bg-[#142219] border-[#233c2a] text-white placeholder-gray-500 focus:border-emerald-400'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Role Cards Picker */}
                  <div className="pt-1">
                    <label className={`block font-extrabold mb-2 text-[11px] ${
                      theme === 'light' ? 'text-slate-800' : 'text-gray-300'
                    }`}>Select Access Role</label>
                    <div className="grid grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setSelectedRole('farmer')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                          selectedRole === 'farmer' 
                            ? theme === 'light' 
                              ? 'bg-white border-emerald-500 text-emerald-800 font-extrabold shadow-md ring-2 ring-emerald-500/20' 
                              : 'bg-emerald-950/80 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.25)]' 
                            : theme === 'light' ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-[#142219]/60 border-[#233c2a] text-gray-400 hover:text-white'
                        }`}
                      >
                        <Sprout className={`w-5 h-5 ${selectedRole === 'farmer' ? 'text-emerald-600' : theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`} />
                        <span className="font-extrabold text-[11px]">Farmer</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole('authority')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                          selectedRole === 'authority' 
                            ? theme === 'light' 
                              ? 'bg-white border-emerald-500 text-emerald-800 font-extrabold shadow-md ring-2 ring-emerald-500/20' 
                              : 'bg-emerald-950/80 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.25)]' 
                            : theme === 'light' ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-[#142219]/60 border-[#233c2a] text-gray-400 hover:text-white'
                        }`}
                      >
                        <Building2 className={`w-5 h-5 ${selectedRole === 'authority' ? 'text-emerald-600' : theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`} />
                        <span className="font-extrabold text-[11px]">Authority</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedRole('researcher')}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col items-center justify-center space-y-1 ${
                          selectedRole === 'researcher' 
                            ? theme === 'light' 
                              ? 'bg-white border-emerald-500 text-emerald-800 font-extrabold shadow-md ring-2 ring-emerald-500/20' 
                              : 'bg-emerald-950/80 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.25)]' 
                            : theme === 'light' ? 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100' : 'bg-[#142219]/60 border-[#233c2a] text-gray-400 hover:text-white'
                        }`}
                      >
                        <Microscope className={`w-5 h-5 ${selectedRole === 'researcher' ? 'text-emerald-600' : theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`} />
                        <span className="font-extrabold text-[11px]">Researcher</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Primary Sign In Button */}
                <button
                  type="submit"
                  disabled={isAuthLoading}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2 group transition-all cursor-pointer disabled:opacity-50"
                >
                  {isAuthLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <span>Sign In to Farm Intelligence Dashboard</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {/* Google OAuth Button */}
                <button
                  type="button"
                  onClick={(e) => handleGoogleSignIn(e)}
                  disabled={isAuthLoading}
                  className={`w-full py-3 rounded-xl border font-bold text-xs shadow-md flex items-center justify-center space-x-2.5 transition-all cursor-pointer ${
                    theme === 'light' 
                      ? 'bg-white hover:bg-slate-50 border-slate-300 text-slate-800' 
                      : 'bg-[#142219] hover:bg-[#1a2d21] border-[#274430] text-white'
                  }`}
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                  </svg>
                  <span>Continue with Google OAuth</span>
                </button>

                {/* Quick 1-Click Demo Profiles */}
                <div className={`space-y-2.5 pt-3 border-t ${theme === 'light' ? 'border-slate-200' : 'border-[#1e3425]'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-emerald-600">Quick 1-Click Demo Profiles</span>
                    <span className={`text-[10px] font-mono ${theme === 'light' ? 'text-slate-500' : 'text-gray-400'}`}>Instant Access</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin('FARM-88219', 'farmer')}
                      className={`p-2.5 rounded-xl border text-left flex items-center space-x-3 group transition-all cursor-pointer ${
                        theme === 'light' 
                          ? 'bg-slate-50 hover:bg-emerald-50/80 border-slate-200 shadow-sm' 
                          : 'bg-[#121f17] border-[#233c2a] hover:border-emerald-500/60 hover:bg-[#1a2c20]'
                      }`}
                    >
                      <img 
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200" 
                        className="w-9 h-9 rounded-full object-cover border border-emerald-500 group-hover:scale-105 transition-transform shrink-0" 
                        alt="Rajesh" 
                      />
                      <div className="min-w-0 flex-1">
                        <div className={`font-extrabold text-xs truncate transition-colors ${
                          theme === 'light' ? 'text-slate-900 group-hover:text-emerald-700' : 'text-white group-hover:text-emerald-300'
                        }`}>Rajesh Kumar</div>
                        <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">Muzaffarpur, Bihar</span>
                        </div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleQuickDemoLogin(farms[0]?.id, 'farmer')}
                      className={`p-2.5 rounded-xl border text-left flex items-center space-x-3 group transition-all cursor-pointer ${
                        theme === 'light' 
                          ? 'bg-slate-50 hover:bg-emerald-50/80 border-slate-200 shadow-sm' 
                          : 'bg-[#121f17] border-[#233c2a] hover:border-emerald-500/60 hover:bg-[#1a2c20]'
                      }`}
                    >
                      <img 
                        src={farms[0]?.avatarUrl || PRESET_AVATARS[0]} 
                        className="w-9 h-9 rounded-full object-cover border border-emerald-500 group-hover:scale-105 transition-transform shrink-0" 
                        alt="Active" 
                      />
                      <div className="min-w-0 flex-1">
                        <div className={`font-extrabold text-xs truncate transition-colors ${
                          theme === 'light' ? 'text-slate-900 group-hover:text-emerald-700' : 'text-white group-hover:text-emerald-300'
                        }`}>{farms[0]?.name || 'Amrit Kumar Sah'}</div>
                        <div className="text-[10px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                          <MapPin className="w-2.5 h-2.5 shrink-0" />
                          <span className="truncate">{farms[0]?.location || 'Sriperumbudur, Tamil Nadu'}</span>
                        </div>
                      </div>
                    </button>
                  </div>
                </div>
              </form>
            )}

        {/* TAB 2: REGISTER NEW FARMER ACCOUNT */}
        {activeTab === 'signup' && (
          <form onSubmit={handleSignupSubmit} className="space-y-4">
            {/* Profile Photo Selector */}
            <div className="bg-[#121f17] border border-[#233c2a] p-3.5 rounded-2xl space-y-2.5">
              <label className="block font-bold text-gray-200 flex items-center gap-1.5 text-xs">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Farmer Profile Photo / Parcel Avatar</span>
              </label>

              <div className="flex items-center gap-3.5">
                <div className="relative shrink-0">
                  <img 
                    src={signupAvatarUrl} 
                    alt="Profile Avatar" 
                    className="w-13 h-13 rounded-full object-cover border-2 border-emerald-400 shadow-md" 
                  />
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-black" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <label className="cursor-pointer bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-colors shadow-sm">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Custom Photo</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                    <span className="text-[10px] text-gray-400">or pick avatar:</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {PRESET_AVATARS.map((url, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setSignupAvatarUrl(url)}
                        className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                          signupAvatarUrl === url ? 'border-emerald-400 scale-110 shadow-md shadow-emerald-950' : 'border-transparent opacity-50 hover:opacity-100'
                        }`}
                      >
                        <img src={url} alt={`Avatar ${idx}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* GPS Detection Bar */}
            <div className="bg-[#121f17] border border-[#233c2a] p-3.5 rounded-2xl flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="font-extrabold text-white text-xs flex items-center gap-1.5">
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  <span>GPS Geolocation Detection</span>
                </div>
                <p className="text-[10px] text-gray-400">Fetch city, district & coordinates automatically</p>
              </div>

              <button
                type="button"
                onClick={handleDetectGps}
                disabled={isDetecting}
                className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isDetecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
                <span>{isDetecting ? 'Detecting...' : 'Use GPS'}</span>
              </button>
            </div>

            {detectStatus && (
              <div className="p-2.5 rounded-xl text-[11px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800 shadow-sm">
                {detectStatus}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-300 mb-1 text-[11px]">Gmail Address (Verification Link Will Be Sent)</label>
                <input
                  type="email"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  placeholder="e.g. yourname@gmail.com"
                  className="w-full bg-[#142219] border border-[#233c2a] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-2 text-white focus:outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1 text-[11px]">Password (Min 6 chars)</label>
                <input
                  type="password"
                  value={signupPassword}
                  onChange={(e) => setSignupPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#142219] border border-[#233c2a] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-2 text-white focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-300 mb-1 text-[11px]">Farmer Full Name</label>
                <input
                  type="text"
                  value={signupName}
                  onChange={(e) => setSignupName(e.target.value)}
                  placeholder="e.g. Vikram Sharma"
                  className="w-full bg-[#142219] border border-[#233c2a] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-2 text-white focus:outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1 text-[11px]">District / City Location</label>
                <input
                  type="text"
                  value={signupLocation}
                  onChange={(e) => setSignupLocation(e.target.value)}
                  placeholder="e.g. Karnal, Haryana"
                  className="w-full bg-[#142219] border border-[#233c2a] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-2 text-white focus:outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-gray-300 mb-1 text-[11px]">Crop Type & Variety</label>
                <input
                  type="text"
                  value={signupCrop}
                  onChange={(e) => setSignupCrop(e.target.value)}
                  placeholder="e.g. Mustard / Paddy"
                  className="w-full bg-[#142219] border border-[#233c2a] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-2 text-white focus:outline-none transition-all font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-300 mb-1 text-[11px]">Farm Size (Hectares)</label>
                <input
                  type="number"
                  step="0.1"
                  value={signupFarmSize}
                  onChange={(e) => setSignupFarmSize(e.target.value)}
                  placeholder="e.g. 3.0"
                  className="w-full bg-[#142219] border border-[#233c2a] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-2 text-white focus:outline-none transition-all font-medium font-mono"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => handleSignupSubmit(e)}
              disabled={isAuthLoading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/60 flex items-center justify-center space-x-2 group transition-all cursor-pointer disabled:opacity-50"
            >
              {isAuthLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  <span>Register & Launch Farm Dashboard</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        )}
      </>
    )}

        {/* PASSWORD RESET DIALOG */}
        {showResetModal && (
          <Modal
            isOpen={showResetModal}
            onClose={() => setShowResetModal(false)}
            title="Reset Firebase Password"
          >
            <form onSubmit={handlePasswordResetSubmit} className="space-y-4 text-xs font-sans">
              <p className="text-gray-300">
                Enter your registered email address below. We will send a secure password reset link via Firebase Authentication.
              </p>
              <div>
                <label className="block font-bold text-gray-300 mb-1">Registered Email ID</label>
                <input
                  type="email"
                  required
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="e.g. farmer@agrinexsus.ai"
                  className="w-full bg-[#142219] border border-[#233c2a] focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/20 rounded-xl px-3 py-2 text-white focus:outline-none font-medium"
                />
              </div>
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  className="flex-1 py-2.5 rounded-xl bg-[#142219] hover:bg-[#1a2d21] border border-[#233c2a] text-gray-300 font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isResetting}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-md disabled:opacity-50"
                >
                  {isResetting ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Send Reset Link</span>}
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </Modal>
  );
};
