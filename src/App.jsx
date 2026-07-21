import React, { useState, useEffect } from 'react';
import { User, CheckCircle, ArrowRight, Loader2, Phone } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

// --- Firebase Configuration ---
const firebaseConfig = {
  apiKey: "AIzaSyCy_gaaxo0Vd-0llMEi1h3BD5t_zfiVYyI",
  authDomain: "i-love-bharat.firebaseapp.com",
  projectId: "i-love-bharat",
  storageBucket: "i-love-bharat.firebasestorage.app",
  messagingSenderId: "960030069619",
  appId: "1:960030069619:web:037404bcf35a848f302b06",
  measurementId: "G-1Z5HK31G0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics safely (prevents adblocker crashes)
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});

const auth = getAuth(app);
const db = getFirestore(app);

// ⭐ ADMIN INSTRUCTION: REPLACE THIS LINK WITH YOUR ACTUAL GROUP LINK ⭐
const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/invite/DemoUjjainYouthGroup2026';

// --- Custom Tricolor Heart Component ---
const TriColorHeart = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tricolor" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="33%" stopColor="#FF9933" /> {/* Saffron */}
        <stop offset="33%" stopColor="#FFFFFF" />
        <stop offset="66%" stopColor="#FFFFFF" /> {/* White */}
        <stop offset="66%" stopColor="#138808" /> {/* Green */}
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodOpacity="0.3"/>
      </filter>
    </defs>
    <path 
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
      fill="url(#tricolor)" 
      stroke="#e5e5e5" 
      strokeWidth="0.5"
      filter="url(#shadow)"
    />
    {/* Ashoka Chakra - Centered in the white band */}
    <g transform="translate(12, 12)" style={{transformBox: 'fill-box', transformOrigin: 'center'}}> 
      <circle r="3.2" stroke="#000080" strokeWidth="0.4" fill="white" fillOpacity="0.5" />
      <circle r="0.5" fill="#000080" />
      {[...Array(24)].map((_, i) => (
        <line 
          key={i}
          x1="0" y1="0" 
          x2="0" y2="-3.2" 
          stroke="#000080" 
          strokeWidth="0.2"
          transform={`rotate(${i * 15})`} 
        />
      ))}
    </g>
  </svg>
);

export default function App() {
  const [formData, setFormData] = useState({ name: '', contact: '' });
  const [status, setStatus] = useState('idle'); // 'idle', 'submitting', 'success'
  const [errorMsg, setErrorMsg] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [user, setUser] = useState(null);

  // Authenticate user anonymously in the background so they can save to DB
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        signInAnonymously(auth).catch(console.error);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.name.trim() || !formData.contact.trim()) {
      setErrorMsg('Please fill out all fields.');
      return;
    }

    const digitsOnly = formData.contact.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setErrorMsg('Please enter a valid 10-digit number.');
      return;
    }

    setStatus('submitting');

    try {
      // Save data to Firebase
      await addDoc(collection(db, 'community_joins'), {
        name: formData.name,
        contact: formData.contact,
        joinedAt: new Date(),
        userId: user ? user.uid : 'anonymous'
      });

      setStatus('success');
      startRedirectTimer();
    } catch (err) {
      console.error("Error saving data:", err);
      // Even if database fails, we still want them to join the group!
      setStatus('success');
      startRedirectTimer();
    }
  };

  const startRedirectTimer = () => {
    let timer = 3;
    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer <= 0) {
        clearInterval(interval);
        window.location.href = WHATSAPP_GROUP_LINK;
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-gray-50 selection:bg-orange-500 selection:text-white font-sans">
      
      {/* Ambient Background Lights */}
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center items-center overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF671F] rounded-full mix-blend-multiply filter blur-[130px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#046A38] rounded-full mix-blend-multiply filter blur-[130px] opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Main Card */}
      <main className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white relative z-10 p-8 sm:p-10 transition-all duration-300">
        
        {/* Title Area */}
        <div className="text-center mb-10">
          <h1 className="text-5xl sm:text-6xl font-black tracking-tight flex items-center justify-center gap-3 mb-4">
            <span className="text-[#FF671F] drop-shadow-sm">I</span> 
            <TriColorHeart className="w-16 h-16 transform hover:scale-110 transition-transform duration-300" />
            <span className="text-[#046A38] drop-shadow-sm">BHARAT</span>
          </h1>
          <p className="text-gray-500 text-sm leading-relaxed max-w-sm mx-auto font-medium">
            Join our vibrant community. Connect with your roots, build character, and serve the nation together.
          </p>
        </div>

        {/* Dynamic Form Area */}
        {status !== 'success' ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF671F]/30 focus:border-[#FF671F] transition-all text-sm font-medium"
                  placeholder="Enter your name"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">WhatsApp Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone size={18} className="text-gray-400" />
                  <span className="text-gray-400 font-medium ml-2 text-sm">+91</span>
                  <div className="h-4 w-[1px] bg-gray-200 ml-2"></div>
                </div>
                <input 
                  type="tel" 
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({...formData, contact: e.target.value})}
                  className="block w-full pl-[85px] pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#046A38]/30 focus:border-[#046A38] transition-all text-sm font-medium"
                  placeholder="98765 43210"
                />
              </div>
            </div>

            {errorMsg && (
              <div className="bg-red-50 text-red-500 px-4 py-3 rounded-2xl text-sm flex items-center border border-red-100 font-medium">
                {errorMsg}
              </div>
            )}

            <button 
              type="submit" 
              disabled={status === 'submitting'}
              className="w-full flex items-center justify-center py-4 px-4 rounded-2xl shadow-[0_8px_20px_rgba(37,211,102,0.25)] text-base font-bold text-white bg-[#25D366] hover:bg-[#20bd5a] disabled:bg-[#25D366]/70 transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30 transition-all duration-300 active:scale-95 mt-6"
            >
              {status === 'submitting' ? (
                <><Loader2 className="animate-spin mr-2" size={20} /> Processing...</>
              ) : (
                <>Join WhatsApp Group</>
              )}
            </button>
          </form>
        ) : (
          /* Success/Redirect View */
          <div className="mt-4 p-8 bg-gray-50 border border-gray-100 rounded-3xl text-center animate-in fade-in zoom-in duration-500">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-[#25D366] mb-4 shadow-inner">
              <CheckCircle size={32} />
            </div>
            <h3 className="text-gray-900 font-bold text-xl mb-2">Welcome Aboard!</h3>
            <p className="text-sm text-gray-500 mb-6">You are being redirected to the community group.</p>
            
            <a 
              href={WHATSAPP_GROUP_LINK} 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center justify-center w-full py-4 px-4 bg-white border border-gray-200 rounded-2xl text-[#128C7E] font-bold text-sm hover:border-[#25D366] hover:shadow-md transition-all group"
            >
              Click here if not redirected 
              <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </a>
            <p className="text-xs text-gray-400 mt-4 font-medium">Redirecting in {countdown}s...</p>
          </div>
        )}

      </main>
    </div>
  );
}