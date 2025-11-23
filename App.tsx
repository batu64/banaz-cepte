import React, { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, useLocation, Link, Navigate } from 'react-router-dom';
import { PWAInstallPrompt, Ad } from './types';
import { authService, fetchActiveAds, trackAdClick, trackAdView } from './services/db';

// Pages
import Home from './pages/Home';
import Guide from './pages/Guide';
import Market from './pages/Market';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

// Icons
import { HomeIcon, MapIcon, ShoppingBagIcon, UserIcon, X } from 'lucide-react';

const BottomNav = () => {
  const location = useLocation();
  const isHidden = location.pathname.startsWith('/admin');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!authService.getCurrentUser());
  }, [location]);

  if (isHidden) return null;

  const navItemClass = (path: string) => 
    `flex flex-col items-center justify-center w-full h-full ${location.pathname === path ? 'text-primary' : 'text-gray-400'}`;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200 pb-safe">
      <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
        <Link to="/" className={navItemClass('/')}>
          <HomeIcon className="w-6 h-6 mb-1" />
          <span className="text-xs">Anasayfa</span>
        </Link>
        <Link to="/guide" className={navItemClass('/guide')}>
          <MapIcon className="w-6 h-6 mb-1" />
          <span className="text-xs">Rehber</span>
        </Link>
        <Link to="/market" className={navItemClass('/market')}>
          <ShoppingBagIcon className="w-6 h-6 mb-1" />
          <span className="text-xs">Pazar</span>
        </Link>
        <Link to="/login" className={navItemClass('/login')}>
          <UserIcon className="w-6 h-6 mb-1" />
          <span className="text-xs">{isLoggedIn ? 'Profil' : 'Giriş'}</span>
        </Link>
      </div>
    </div>
  );
};

const PopupAd = () => {
  const [ad, setAd] = useState<Ad | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadPopup = async () => {
      const allAds = await fetchActiveAds();
      // Find active popup
      const popup = allAds.find(a => a.type === 'popup' && a.is_active);
      if (popup) {
        setAd(popup);
        // Simulate delay for impact
        setTimeout(() => setIsVisible(true), 1000);
        trackAdView(popup.id);
      }
    };
    loadPopup();
  }, []);

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleClick = () => {
    if (ad) {
      trackAdClick(ad.id);
      window.open(ad.target_link, '_blank');
    }
  };

  if (!isVisible || !ad) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
       <div className="relative w-full max-w-sm bg-white rounded-2xl overflow-hidden shadow-2xl">
         <button 
            onClick={handleClose}
            className="absolute top-2 right-2 z-10 bg-black/50 text-white p-1.5 rounded-full hover:bg-black/70 transition"
         >
            <X size={20} />
         </button>
         
         <div className="cursor-pointer" onClick={handleClick}>
            <img src={ad.image_url} alt={ad.advertiser_name} className="w-full h-auto object-cover" />
         </div>
         
         <div className="p-4 bg-white text-center">
            <p className="text-xs text-gray-400 font-bold uppercase mb-1">SPONSORLU İÇERİK</p>
            <h3 className="font-bold text-xl text-gray-800 mb-3">{ad.advertiser_name}</h3>
            <button 
              onClick={handleClick}
              className="bg-primary text-white font-bold py-2 px-6 rounded-full shadow-lg hover:bg-red-700 transition"
            >
              Fırsatı İncele
            </button>
         </div>
       </div>
    </div>
  );
};

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<PWAInstallPrompt | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as PWAInstallPrompt);
      setShow(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
        setShow(false);
      });
    }
  };

  if (!show) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-primary text-white shadow-lg flex justify-between items-center animate-slideDown">
      <div>
        <p className="font-bold text-sm">Banaz Cepte'yi Yükle</p>
        <p className="text-xs opacity-90">Daha hızlı erişim için ana ekrana ekle.</p>
      </div>
      <button 
        onClick={handleInstall}
        className="bg-white text-primary px-4 py-2 rounded-full text-xs font-bold"
      >
        Yükle
      </button>
    </div>
  );
};

// Auth Guard Component
const AuthGuard = ({ children }: { children: React.ReactElement }) => {
  const user = authService.getCurrentUser();
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen pb-20 bg-gray-50 font-sans">
        <InstallPrompt />
        <PopupAd />
        <Routes>
          <Route path="/" element={<AuthGuard><Home /></AuthGuard>} />
          <Route path="/guide" element={<AuthGuard><Guide /></AuthGuard>} />
          <Route path="/market" element={<AuthGuard><Market /></AuthGuard>} />
          <Route path="/login" element={<Login />} />
          {/* Note the /* wildcard for nested routes in AdminDashboard */}
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </div>
    </HashRouter>
  );
}