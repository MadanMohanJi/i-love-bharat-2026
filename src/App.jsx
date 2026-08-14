import React, { useState, useEffect } from 'react';
import { 
  User, CheckCircle, ArrowRight, Loader2, Phone, 
  Users, LogOut, Download, Lock, ShieldCheck 
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

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

const app = initializeApp(firebaseConfig);
isSupported().then((supported) => {
  if (supported) {
    getAnalytics(app);
  }
});

const auth = getAuth(app);
const db = getFirestore(app);

// ==========================================
// ⭐ ADMIN: PUT YOUR TWO WHATSAPP LINKS HERE
// ==========================================
const MALE_GROUP_LINK = "https://chat.whatsapp.com/MaleDemoLink2026";
const FEMALE_GROUP_LINK = "https://chat.whatsapp.com/FemaleDemoLink2026";

// --- Custom Tricolor Heart Component ---
const TriColorHeart = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tricolor" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="33%" stopColor="#FF9933" />
        <stop offset="33%" stopColor="#FFFFFF" />
        <stop offset="66%" stopColor="#FFFFFF" />
        <stop offset="66%" stopColor="#138808" />
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
  const [formData, setFormData] = useState({ name: '', contact: '', gender: '' });
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [countdown, setCountdown] = useState(3);
  const [user, setUser] = useState(null);
  const [redirectLink, setRedirectLink] = useState('');

  // Admin states
  const [isAdminRoute, setIsAdminRoute] = useState(window.location.hash === '#admin');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  
  const [adminMembers, setAdminMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      setIsAdminRoute(window.location.hash === '#admin');
    };
    window.addEventListener('hashchange', handleHashChange);

    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        if (window.location.hash === '#admin') {
          fetchMembers();
        }
      } else {
        signInAnonymously(auth).catch(console.error);
      }
    });

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      unsubscribe();
    };
  }, []);

  const fetchMembers = async () => {
    setLoadingMembers(true);
    try {
      const querySnapshot = await getDocs(collection(db, 'community_joins'));
      const membersList = [];
      querySnapshot.forEach((doc) => {
        membersList.push({ id: doc.id, ...doc.data() });
      });
      membersList.sort((a, b) => (b.joinedAt?.toMillis() || 0) - (a.joinedAt?.toMillis() || 0));
      setAdminMembers(membersList);
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    try {
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      fetchMembers();
    } catch (err) {
      console.error(err);
      setAdminError('Invalid email or password.');
    }
  };

  const handleAdminLogout = async () => {
    await signOut(auth);
    window.location.hash = '';
  };

  const exportToExcel = () => {
    let csvContent = "data:text/csv;charset=utf-8,Full Name,WhatsApp Number,Gender,Joined At\n";
    adminMembers.forEach((m) => {
      const dateStr = m.joinedAt?.toDate ? m.joinedAt.toDate().toLocaleString() : 'Recent';
      csvContent += `"${m.name}","${m.contact}","${m.gender || 'N/A'}","${dateStr}"\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `i_love_bharat_members.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.gender) {
      setErrorMsg('Please select your gender first.');
      return;
    }
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
    
    // Choose the link based on Gender
    const targetLink = formData.gender === 'Male' ? MALE_GROUP_LINK : FEMALE_GROUP_LINK;
    setRedirectLink(targetLink);

    try {
      await addDoc(collection(db, 'community_joins'), {
        name: formData.name,
        contact: formData.contact,
        gender: formData.gender,
        joinedAt: new Date(),
        userId: user ? user.uid : 'anonymous'
      });
      setStatus('success');
      startRedirectTimer(targetLink);
    } catch (err) {
      console.error("Error saving data:", err);
      setStatus('success');
      startRedirectTimer(targetLink);
    }
  };

  const startRedirectTimer = (link) => {
    let timer = 3;
    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer <= 0) {
        clearInterval(interval);
        window.location.href = link;
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-gray-50 selection:bg-orange-500 selection:text-white font-sans">
      
      <div className="fixed inset-0 z-0 pointer-events-none flex justify-center items-center overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[#FF671F] rounded-full mix-blend-multiply filter blur-[130px] opacity-40 animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#046A38] rounded-full mix-blend-multiply filter blur-[130px] opacity-40 animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {}
      {isAdminRoute ? (
        <div className="w-full max-w-6xl bg-white/95 backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl border border-gray-100 relative z-10 p-5 sm:p-10 my-10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-gray-100 pb-6">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-800 flex items-center gap-3">
              <Lock className="text-[#FF671F] w-6 h-6 sm:w-8 sm:h-8" /> Admin Dashboard
            </h2>
            <button onClick={() => window.location.hash = ''} className="w-full sm:w-auto px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium text-sm transition-colors text-center">
              Back to Website
            </button>
          </div>

          {(!user || user.isAnonymous) ? (
            <div className="max-w-md mx-auto py-8">
              <div className="text-center mb-6">
                <ShieldCheck className="w-16 h-16 text-[#FF671F] mx-auto mb-3" />
                <h3 className="text-xl font-bold text-gray-800">Secure Admin Login</h3>
                <p className="text-sm text-gray-500">Enter your credentials to manage the community.</p>
              </div>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Email Address</label>
                  <input type="email" required value={adminEmail} onChange={(e) => setAdminEmail(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF671F]/30"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Password</label>
                  <input type="password" required value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF671F]/30"/>
                </div>
                {adminError && <p className="text-red-500 text-xs font-medium">{adminError}</p>}
                <button type="submit" className="w-full py-3 bg-[#FF671F] text-white font-bold rounded-xl shadow-lg hover:bg-orange-600 transition-all">Login</button>
              </form>
            </div>
          ) : (
            <div className="animate-in fade-in duration-500">
              
              <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center mb-6">
                <div className="flex items-center justify-center lg:justify-start gap-3 text-[#046A38] bg-green-50 border border-green-100 px-5 py-3 rounded-xl font-bold text-base sm:text-lg">
                  Total Members: {adminMembers.length}
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button onClick={exportToExcel} className="flex-1 flex justify-center items-center gap-2 px-5 py-2.5 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors border border-blue-100 text-sm">
                    <Download size={18} /> Export Excel
                  </button>
                  <button onClick={fetchMembers} className="flex-1 px-5 py-2.5 bg-orange-50 text-[#FF671F] font-bold rounded-xl hover:bg-orange-100 transition-colors border border-orange-100 text-sm">Refresh Data</button>
                  <button onClick={handleAdminLogout} className="flex-1 flex justify-center items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 font-bold rounded-xl hover:bg-red-100 transition-colors border border-red-100 text-sm">
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-4">#</th>
                      <th className="p-4">Full Name</th>
                      <th className="p-4">WhatsApp Number</th>
                      <th className="p-4">Gender</th>
                      <th className="p-4">Joined At</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {loadingMembers ? (
                      <tr><td colSpan="5" className="p-8 text-center text-gray-400">Loading...</td></tr>
                    ) : adminMembers.length === 0 ? (
                      <tr><td colSpan="5" className="p-8 text-center text-gray-400">No registrations found.</td></tr>
                    ) : (
                      adminMembers.map((m, idx) => (
                        <tr key={m.id} className="hover:bg-gray-50/80">
                          <td className="p-4 text-gray-400">{idx + 1}</td>
                          <td className="p-4 font-bold text-gray-800">{m.name}</td>
                          <td className="p-4 font-mono text-gray-600">+91 {m.contact}</td>
                          <td className="p-4">
                            {m.gender === 'Male' ? (
                              <span className="px-2.5 py-1 bg-blue-50 text-blue-600 rounded text-xs font-bold border border-blue-100">Male</span>
                            ) : m.gender === 'Female' ? (
                              <span className="px-2.5 py-1 bg-pink-50 text-pink-600 rounded text-xs font-bold border border-pink-100">Female</span>
                            ) : (
                              <span className="text-gray-400">-</span>
                            )}
                          </td>
                          <td className="p-4 text-gray-500 text-xs">{m.joinedAt?.toDate ? m.joinedAt.toDate().toLocaleString() : 'Just now'}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <main className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] border border-white relative z-10 p-6 sm:p-10 transition-all duration-300">
          
          <div className="text-center mb-8 sm:mb-10 mt-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-[#FF671F] drop-shadow-sm">I</span> 
              <TriColorHeart className="w-12 h-12 sm:w-16 sm:h-16 transform hover:scale-110 transition-transform duration-300 shrink-0" />
              <span className="text-[#046A38] drop-shadow-sm">BHARAT</span>
            </h1>
          </div>

          {status !== 'success' ? (
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              
              {/* Gender Selection is now FIRST */}
              <div>
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">1. Select Gender</label>
                <div className="flex gap-3">
                  <label className={`flex-1 flex items-center justify-center py-3.5 sm:py-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.gender === 'Male' ? 'bg-orange-50 border-[#FF671F] text-[#FF671F] shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100 hover:border-gray-300'}`}>
                    <input 
                      type="radio" name="gender" value="Male" className="hidden" 
                      onChange={(e) => setFormData({...formData, gender: e.target.value})} 
                    />
                    <span className="font-bold text-sm">Male</span>
                  </label>
                  <label className={`flex-1 flex items-center justify-center py-3.5 sm:py-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.gender === 'Female' ? 'bg-orange-50 border-[#FF671F] text-[#FF671F] shadow-sm' : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-gray-100 hover:border-gray-300'}`}>
                    <input 
                      type="radio" name="gender" value="Female" className="hidden" 
                      onChange={(e) => setFormData({...formData, gender: e.target.value})} 
                    />
                    <span className="font-bold text-sm">Female</span>
                  </label>
                </div>
              </div>

              {/* Data Entry is SECOND */}
              <div className={`transition-opacity duration-500 ${!formData.gender ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                <div className="mb-4">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">2. Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User size={18} className="text-gray-400" />
                    </div>
                    <input 
                      type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="block w-full pl-11 pr-4 py-3.5 sm:py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#FF671F]/30 focus:border-[#FF671F] transition-all text-sm font-medium" placeholder="Enter your name"
                      disabled={!formData.gender}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1">3. WhatsApp Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Phone size={18} className="text-gray-400" />
                      <span className="text-gray-400 font-medium ml-2 text-sm">+91</span>
                      <div className="h-4 w-[1px] bg-gray-200 ml-2"></div>
                    </div>
                    <input 
                      type="tel" value={formData.contact} onChange={(e) => setFormData({...formData, contact: e.target.value})}
                      className="block w-full pl-[85px] pr-4 py-3.5 sm:py-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-900 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#046A38]/30 focus:border-[#046A38] transition-all text-sm font-medium" placeholder="98765 43210"
                      disabled={!formData.gender}
                    />
                  </div>
                </div>
              </div>

              {errorMsg && (
                <div className="bg-red-50 text-red-500 px-4 py-3 rounded-2xl text-sm flex items-center border border-red-100 font-medium">
                  {errorMsg}
                </div>
              )}

              <button 
                type="submit" disabled={status === 'submitting'}
                className={`w-full flex items-center justify-center py-4 px-4 rounded-2xl shadow-[0_8px_20px_rgba(37,211,102,0.25)] text-base font-bold text-white transition-all duration-300 active:scale-95 mt-6 ${!formData.gender ? 'bg-gray-300 cursor-not-allowed' : 'bg-[#25D366] hover:bg-[#20bd5a] transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-green-500/30'}`}
              >
                {status === 'submitting' ? <><Loader2 className="animate-spin mr-2" size={20} /> Processing...</> : <>Join WhatsApp Group</>}
              </button>
            </form>
          ) : (
            <div className="mt-4 p-6 sm:p-8 bg-gray-50 border border-gray-100 rounded-3xl text-center animate-in fade-in zoom-in duration-500">
              <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-green-100 text-[#25D366] mb-4 shadow-inner">
                <CheckCircle size={32} />
              </div>
              <h3 className="text-gray-900 font-bold text-xl mb-2">Welcome Aboard!</h3>
              <p className="text-sm text-gray-500 mb-6">You are being redirected to the {formData.gender}s community group.</p>
              
              <a href={redirectLink} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center w-full py-3.5 sm:py-4 px-4 bg-white border border-gray-200 rounded-2xl text-[#128C7E] font-bold text-sm hover:border-[#25D366] hover:shadow-md transition-all group">
                Click here if not redirected 
                <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
              </a>
              <p className="text-xs text-gray-400 mt-4 font-medium">Redirecting in {countdown}s...</p>
            </div>
          )}
        </main>
      )}

      {/* Secret Floating Admin Button */}
      {!isAdminRoute && (
        <button 
          onClick={() => window.location.hash = '#admin'}
          className="fixed bottom-4 right-4 z-50 p-4 bg-black text-white rounded-full shadow-[0_10px_25px_rgba(0,0,0,0.5)] hover:bg-gray-900 transition-all duration-300 transform hover:scale-110 active:scale-95 border-2 border-white/20 animate-bounce"
          title="Admin Access"
        >
          <Lock size={24} className="text-[#FF671F]" />
        </button>
      )}

    </div>
  );
}