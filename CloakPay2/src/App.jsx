import React, { useState, useEffect, useRef } from 'react';
import { 
  Zap, 
  Globe, 
  Lock, 
  ArrowRight,
  Menu,
  X,
  CreditCard,
  Search,
  CheckCircle2,
  Activity,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { getPoolBalance, createPayroll, getVoucher } from './api';
import './index.css';

// --- Components ---

const Logo = () => (
  <div className="flex items-center gap-3 group cursor-pointer transition-all hover:scale-105 active:scale-95">
    <div className="relative w-10 h-10 flex items-center justify-center">
      {/* Modern Abstract 'C' Logo */}
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-pulse">
        <path d="M20 5C11.7157 5 5 11.7157 5 20C5 28.2843 11.7157 35 20 35C28.2843 35 35 28.2843 35 20" stroke="url(#logo-grad)" strokeWidth="6" strokeLinecap="round"/>
        <circle cx="20" cy="20" r="4" fill="white" className="animate-pulse" />
        <defs>
          <linearGradient id="logo-grad" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
            <stop stopColor="#6d28d9" />
            <stop offset="1" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 bg-purple-500/20 blur-xl scale-125 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </div>
    <span className="font-black text-2xl tracking-tighter text-white font-['Space_Grotesk']">CLOAK<span className="text-purple-500">PAY</span></span>
  </div>
);

const TechVisual = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - (left + width / 2)) / (width / 2);
    const y = (e.clientY - (top + height / 2)) / (height / 2);
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => setMousePos({ x: 0, y: 0 });

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full aspect-square max-w-[500px] flex items-center justify-center animate-float parallax-container"
    >
      {/* 1. Layered Parallax Background (Glows) */}
      <div 
        className="absolute top-1/2 left-1/2 w-4/5 h-4/5 bg-purple-600/20 blur-[120px] rounded-full animate-morph"
        style={{ 
          transform: `translate(calc(-50% + ${mousePos.x * 50}px), calc(-50% + ${mousePos.y * 50}px))` 
        }}
      ></div>
      <div 
        className="absolute top-1/2 left-1/2 w-3/4 h-3/4 bg-blue-500/10 blur-[100px] rounded-full animate-morph delay-500"
        style={{ 
          transform: `translate(calc(-50% + ${mousePos.x * -50}px), calc(-50% + ${mousePos.y * -50}px))` 
        }}
      ></div>
      
      {/* 2. 3D Perspective Tilt (Main Panel) */}
      <div 
        className="relative z-10 w-72 h-72 glass-panel rounded-[3rem] border-white/20 flex items-center justify-center transition-all duration-300 full-image-3d group shadow-2xl"
        style={{ 
          transform: `rotateX(${mousePos.y * -25}deg) rotateY(${mousePos.x * 25}deg) translateZ(30px)` 
        }}
      >
         <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[3rem]"></div>
         <div className="relative">
            <Activity className="text-purple-400 w-32 h-32 animate-pulse" strokeWidth={1} />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 border-2 border-dashed border-white/5 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
         </div>
         
         {/* Decorative HUD Elements */}
         <div className="absolute top-8 left-8 w-12 h-[1px] bg-white/30"></div>
         <div className="absolute top-8 left-8 w-[1px] h-12 bg-white/30"></div>
         <div className="absolute bottom-8 right-8 w-12 h-[1px] bg-white/30"></div>
         <div className="absolute bottom-8 right-8 w-[1px] h-12 bg-white/30"></div>
      </div>
      
      {/* 3. Reactive HUD Particles (Interactive bits) */}
      {[...Array(12)].map((_, i) => (
        <div 
          key={i}
          className="absolute w-1 h-1 bg-white/40 rounded-full blur-[0.5px]"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${10 + Math.random() * 80}%`,
            transform: `translate(${mousePos.x * (30 + i * 10)}px, ${mousePos.y * (30 + i * 10)}px)`,
            transition: 'transform 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
            opacity: 0.1 + Math.random() * 0.4
          }}
        ></div>
      ))}
      
      {/* Small Data Squares for added HUD feel */}
      <div 
        className="absolute top-10 left-20 w-4 h-4 border border-white/10 animate-[spin_8s_linear_infinite]"
        style={{ transform: `translate(${mousePos.x * 60}px, ${mousePos.y * 60}px)` }}
      />
      <div 
        className="absolute bottom-10 right-20 w-3 h-3 bg-purple-500/20 rounded-sm"
        style={{ transform: `translate(${mousePos.x * -50}px, ${mousePos.y * -50}px)` }}
      />
    </div>
  );
};

const EcosystemVisual = () => {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => (p + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full aspect-square flex items-center justify-center">
       <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full animate-morph"></div>
       <div className="relative z-10 w-full h-full flex items-center justify-center">
          {/* Abstract Node Network */}
          <svg width="100%" height="100%" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            {[...Array(8)].map((_, i) => (
              <circle 
                key={i}
                cx={200 + Math.cos(i * Math.PI / 4) * 120} 
                cy={200 + Math.sin(i * Math.PI / 4) * 120} 
                r={4 + Math.sin(pulse / 10 + i) * 2} 
                fill="#3b82f6" 
                className="opacity-50"
              />
            ))}
            <circle cx="200" cy="200" r="40" stroke="#6d28d9" strokeWidth="2" strokeDasharray="10 5" className="animate-[spin_20s_linear_infinite]" />
            <circle cx="200" cy="200" r="80" stroke="#3b82f6" strokeWidth="1" strokeDasharray="5 15" className="animate-[spin_30s_linear_infinite_reverse]" />
            <path 
              d="M200 80 L200 320 M80 200 L320 200" 
              stroke="url(#grad1)" 
              strokeWidth="0.5" 
              className="opacity-20"
            />
            <defs>
              <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6d28d9" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
             <Globe className="text-white w-20 h-20 animate-pulse" strokeWidth={1} />
          </div>
       </div>
    </div>
  );
};

const Navbar = ({ onOpenApp }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 px-6 py-4 flex justify-between items-center transition-all duration-500 ${scrolled ? 'glass-panel border-x-0 border-t-0 rounded-none bg-black/60 shadow-2xl' : 'bg-transparent'}`}>
      <Logo />
      
      {/* Desktop Menu */}
      <div className="hidden md:flex items-center gap-10">
        {['Features', 'Ecosystem'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="text-zinc-400 hover:text-white transition-colors font-bold text-sm tracking-widest uppercase">{item}</a>
        ))}
        <MagneticButton 
          onClick={onOpenApp}
          className="bg-white text-black px-8 py-3 rounded-full font-black hover:bg-zinc-200 transition-all hover:scale-110 active:scale-95 shadow-xl"
        >
          Launch App
        </MagneticButton>
      </div>

      {/* Mobile Toggle */}
      <button className="md:hidden text-white" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <Menu size={28} />}
      </button>
      
      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 w-full glass-panel border-none p-6 animate-fade-in flex flex-col gap-6 md:hidden">
           <a href="#features" onClick={() => setIsOpen(false)} className="text-xl font-bold">Features</a>
           <a href="#ecosystem" onClick={() => setIsOpen(false)} className="text-xl font-bold">Ecosystem</a>
           <button onClick={onOpenApp} className="w-full bg-white text-black p-5 rounded-2xl font-black">Launch App</button>
        </div>
      )}
    </nav>
  );
};

// ImageShuffler removed in favor of TechVisual dynamic component

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPx = window.scrollY;
      const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (scrollPx / winHeightPx) * 100;
      setScrollProgress(scrolled);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="scroll-progress-container">
      <div className="scroll-progress-bar" style={{ width: `${scrollProgress}%` }}></div>
    </div>
  );
};

const CursorGlow = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setOpacity(1);
    };
    const handleMouseLeave = () => setOpacity(0);
    const handleMouseEnter = () => setOpacity(1);

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  return (
    <div 
      className="cursor-glow hidden lg:block" 
      style={{ 
        left: `${mousePos.x}px`, 
        top: `${mousePos.y}px`,
        opacity: opacity
      }} 
    />
  );
};

const MagneticButton = ({ children, className, onClick }) => {
  const buttonRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = buttonRef.current.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);
    setPosition({ x: x * 0.3, y: y * 0.3 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="magnetic-area">
      <button
        ref={buttonRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={onClick}
        className={className}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          transition: position.x === 0 ? 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)' : 'none'
        }}
      >
        {children}
      </button>
    </div>
  );
};

const Hero = ({ onOpenApp }) => {
  return (
    <section className="relative pt-44 pb-20 px-6 max-w-7xl mx-auto min-h-screen flex items-center">
      <div className="grid lg:grid-cols-2 gap-16 items-center w-full">
        {/* Left Content */}
        <div className="text-left space-y-8 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel text-[10px] uppercase tracking-[0.2em] text-purple-300 font-black border-purple-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            Private Bitcoin Payroll Layer
          </div>
          
          <h1 className="text-6xl md:text-7xl lg:text-9xl font-black leading-[0.85] text-white tracking-tighter">
            Global <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
              Private.
            </span>
          </h1>
          
          <p className="text-zinc-400 text-xl md:text-2xl max-w-xl font-medium leading-relaxed">
            The world's first private Bitcoin payroll distribution network on Starknet. <br/>
            <span className="text-white/60 font-normal">Scale your global team with Zero-Knowledge finality and unmatched efficiency.</span>
          </p>
          
          <div className="flex flex-col sm:flex-row gap-5">
            <MagneticButton 
              onClick={onOpenApp}
              className="bg-purple-600 hover:bg-purple-500 text-white px-10 py-6 rounded-full font-black text-xl transition-all shadow-[0_0_40px_rgba(109,40,217,0.4)] flex items-center justify-center gap-3 hover:-translate-y-1 active:scale-95"
            >
              Start Distributing <ArrowRight size={24} />
            </MagneticButton>
          </div>
        </div>

        {/* Right Content - Visual */}
        <div className="flex justify-center lg:justify-end animate-fade-in delay-300">
           <TechVisual />
        </div>
      </div>
    </section>
  );
};

const RevealOnScroll = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(ref.current);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`section-reveal ${isVisible ? 'visible' : ''}`}>
      {children}
    </div>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-32 px-6 max-w-7xl mx-auto overflow-hidden border-t border-white/5">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Side: Text */}
        <RevealOnScroll>
          <div className="space-y-8">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-[0.9]">
              Engineered <br/>
              <span className="text-purple-500">for Privacy.</span>
            </h2>
            <p className="text-zinc-400 text-xl md:text-2xl font-medium leading-relaxed max-w-lg">
              Utilizing state-of-the-art ZK-STARKs to ensure that employee compensation remains completely confidential while maintaining absolute transparency on-chain.
            </p>
            <div className="flex items-center gap-6 pt-4">
               <div className="flex flex-col">
                  <span className="text-white text-3xl font-black">99.9%</span>
                  <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Uptime</span>
               </div>
               <div className="w-px h-12 bg-white/10"></div>
               <div className="flex flex-col">
                  <span className="text-white text-3xl font-black">0.01$</span>
                  <span className="text-zinc-500 text-[10px] uppercase font-black tracking-widest">Global Fee</span>
               </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Right Side: Video */}
        <RevealOnScroll>
          <div className="relative group">
            <div className="absolute -inset-4 bg-purple-500/10 blur-3xl rounded-full opacity-50"></div>
            <div className="relative glass-panel rounded-[3rem] overflow-hidden border-white/10 aspect-square flex items-center justify-center shadow-2xl">
              <video 
                autoPlay loop muted playsInline 
                className="w-full h-full object-cover opacity-80"
                poster="https://assets.website-files.com/626912d685fd092a4de0ab21/62695552df14327116195ff5_2779985078-poster-00001.jpg"
              >
                <source src="https://assets.website-files.com/626912d685fd092a4de0ab21/62695552df14327116195ff5_2779985078-transcode.mp4" type="video/mp4" />
                <source src="https://assets.website-files.com/626912d685fd092a4de0ab21/62695552df14327116195ff5_2779985078-transcode.webm" type="video/webm" />
              </video>
              <div className="absolute bottom-8 left-8 flex items-center gap-3 bg-black/40 backdrop-blur-xl px-4 py-2 rounded-full border border-white/10 text-[10px] font-black tracking-widest uppercase">
                <RefreshCw size={12} className="animate-spin text-purple-500" /> Proof Generation Active
              </div>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

const FastForeverSection = () => {
  return (
    <section id="ecosystem" className="py-32 px-6 max-w-7xl mx-auto border-t border-white/5">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        {/* Left Side: Transform Image */}
        <RevealOnScroll>
          <div className="parallax-container relative group">
             <div className="absolute -inset-10 bg-blue-500/10 blur-[100px] rounded-full opacity-30"></div>
             <EcosystemVisual />
          </div>
        </RevealOnScroll>

        {/* Right Side: Text info */}
        <RevealOnScroll>
          <div className="space-y-10">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight text-white">
              Fast, <br/>
              <span className="text-blue-500 italic">Forever.</span>
            </h2>
            <div className="space-y-6">
              <div className="flex gap-6">
                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 flex-shrink-0">
                    <Cpu className="text-blue-400" size={24} />
                 </div>
                 <div>
                    <h4 className="text-xl font-bold mb-2">Instant Validation</h4>
                    <p className="text-zinc-500 font-medium">Deploy infinite payroll batches without worrying about congestion. Starknet handles the load, Bitcoin handles the value.</p>
                 </div>
              </div>
              <div className="flex gap-6">
                 <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 flex-shrink-0">
                    <RefreshCw className="text-purple-400" size={24} />
                 </div>
                 <div>
                    <h4 className="text-xl font-bold mb-2">Continuous Finality</h4>
                    <p className="text-zinc-500 font-medium">Decentralized ZK-Rollups provide a mathematical guarantee of correctness for every single payment voucher generated.</p>
                 </div>
              </div>
            </div>
            <button className="text-white font-black text-lg border-b-2 border-purple-500 pb-1 hover:border-white transition-all flex items-center gap-3">
               Explore Protocol <ArrowRight size={20} />
            </button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
};

const AppPortal = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState('create');
  const [addresses, setAddresses] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [poolBalance, setPoolBalance] = useState(null);
  
  const [voucherId, setVoucherId] = useState('');
  const [voucherResult, setVoucherResult] = useState(null);

  useEffect(() => {
    fetchPoolBalance();
  }, []);

  const fetchPoolBalance = async () => {
    try {
      const res = await getPoolBalance();
      setPoolBalance(res.total_balance ?? 0);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePayroll = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const addressList = addresses.split(',').map(a => a.trim()).filter(a => a);
      const entries = addressList.map(addr => ({
        employee_address: addr,
        amount: parseInt(amount)
      }));
      
      const res = await createPayroll(entries);
      setResult(res);
      setAddresses('');
      setAmount('');
    } catch (err) {
      setResult({ error: err.message || 'Failed to process payroll' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyVoucher = async (e) => {
    e.preventDefault();
    setLoading(true);
    setVoucherResult(null);
    try {
      const res = await getVoucher(voucherId);
      setVoucherResult(res);
    } catch (err) {
      setVoucherResult({ error: err.message || 'Voucher not found' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-4 animate-fade-in w-full h-full overflow-y-auto">
      <div className="glass-panel w-full max-w-5xl relative shadow-[0_0_100px_rgba(0,0,0,0.8)] border-white/20">
        <button onClick={onClose} className="absolute top-8 right-8 text-zinc-400 hover:text-white bg-white/5 rounded-full p-2 transition-colors z-[110]">
          <X size={28} />
        </button>
        
        <div className="grid md:grid-cols-5 min-h-[700px]">
          {/* Sidebar / Info */}
          <div className="md:col-span-2 p-12 bg-black/40 border-r border-white/10 hidden md:flex flex-col">
             <Logo />
             <div className="mt-20 space-y-10 flex-1">
               <div>
                 <h4 className="text-[10px] uppercase font-black text-zinc-500 tracking-[0.3em] mb-4">Network Status</h4>
                 <div className="flex items-center gap-3 text-emerald-400 font-black bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                   <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                   ZK PROOF ENGINE READY
                 </div>
               </div>

               <div>
                 <h4 className="text-[10px] uppercase font-black text-zinc-500 tracking-[0.3em] mb-4">Total Pool Liquidity</h4>
                 <div className="space-y-1">
                   <div className="text-4xl font-black text-white">{poolBalance ?? 0} BTC</div>
                   <div className="text-sm text-zinc-500 font-bold">Aggregated Protocol TVL</div>
                 </div>
               </div>
             </div>
             
             <div className="p-8 bg-gradient-to-tr from-purple-500 to-blue-600 rounded-3xl text-white">
                <h5 className="font-black text-lg mb-2 italic">Unprotected No More.</h5>
                <p className="text-white/80 text-sm font-medium">Switch to the privacy standard. Global payroll finalized in seconds.</p>
             </div>
          </div>

          {/* Main Form Content */}
          <div className="md:col-span-3 h-full flex flex-col">
             <div className="flex border-b border-white/10">
                <button 
                  className={`flex-1 py-8 font-black text-xs uppercase tracking-widest flex justify-center items-center gap-3 transition-all ${activeTab === 'create' ? 'text-white bg-white/5 border-b-4 border-purple-500' : 'text-zinc-500 hover:text-white'}`}
                  onClick={() => setActiveTab('create')}
                >
                  <CreditCard size={20} /> Distribution
                </button>
                <button 
                  className={`flex-1 py-8 font-black text-xs uppercase tracking-widest flex justify-center items-center gap-3 transition-all ${activeTab === 'verify' ? 'text-white bg-white/5 border-b-4 border-blue-500' : 'text-zinc-500 hover:text-white'}`}
                  onClick={() => setActiveTab('verify')}
                >
                  <Search size={20} /> Verification
                </button>
             </div>

             <div className="p-12 flex-1 overflow-y-auto">
                {activeTab === 'create' && (
                  <form onSubmit={handleCreatePayroll} className="space-y-10 animate-fade-in">
                    <div>
                      <label className="block text-[10px] font-black text-zinc-500 tracking-[0.2em] mb-4 uppercase">Recipient Manifest (Addresses)</label>
                      <textarea 
                        required
                        value={addresses}
                        onChange={(e) => setAddresses(e.target.value)}
                        placeholder="0x..., 0x..."
                        className="w-full bg-black/60 border border-white/10 rounded-[2rem] p-8 text-white focus:outline-none focus:border-purple-600 transition-all h-48 font-mono text-sm resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-zinc-500 tracking-[0.2em] mb-4 uppercase">Batch Allocation (BTC Equiv.)</label>
                      <input 
                        type="number"
                        required
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.000"
                        className="w-full bg-black/60 border border-white/10 rounded-full p-8 text-white focus:outline-none focus:border-purple-600 transition-all font-mono text-2xl"
                      />
                    </div>
                    <MagneticButton 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-white text-black py-8 rounded-full font-black text-2xl flex justify-center items-center gap-4 disabled:opacity-50 transition-all hover:scale-[1.03] active:scale-95 shadow-2xl shadow-white/10"
                    >
                      {loading ? 'Processing Cryptography...' : 'Generate Private Vouchers'}
                    </MagneticButton>
                    
                    {result && !result.error && (
                      <div className="p-8 bg-emerald-500/10 border border-emerald-500/20 rounded-[2rem] animate-fade-in">
                        <h4 className="flex items-center gap-3 text-emerald-400 font-black mb-6 uppercase tracking-widest text-xs">
                          <CheckCircle2 size={24} /> Vouchers Serialized
                        </h4>
                        <div className="space-y-3 max-h-56 overflow-y-auto custom-scrollbar">
                          {result.vouchers?.map((v, i) => (
                            <div key={i} className="flex justify-between items-center text-[10px] bg-black/40 p-5 rounded-2xl border border-white/5 font-mono">
                              <span className="text-zinc-500">#{i+1}</span>
                              <span className="text-zinc-300 truncate mx-6">{v.employee.slice(0,18)}...</span>
                              <span className="text-purple-400 font-black">{v.voucher_id}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </form>
                )}

                {activeTab === 'verify' && (
                   <form onSubmit={handleVerifyVoucher} className="space-y-10 animate-fade-in">
                   <div>
                     <label className="block text-[10px] font-black text-zinc-500 tracking-[0.2em] mb-4 uppercase">Cryptographic Voucher Root</label>
                     <input 
                       type="text"
                       required
                       value={voucherId}
                       onChange={(e) => setVoucherId(e.target.value)}
                       placeholder="voucher_root_..."
                       className="w-full bg-black/60 border border-white/10 rounded-full p-8 text-white focus:outline-none focus:border-blue-600 transition-all font-mono text-xl"
                     />
                   </div>
                   <MagneticButton 
                     type="submit"
                     disabled={loading}
                     className="w-full bg-blue-600 text-white py-8 rounded-full font-black text-2xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/40"
                   >
                     {loading ? 'Fetching Witness Data...' : 'Verify Proof Registry'}
                   </MagneticButton>

                   {voucherResult && !voucherResult.error && (
                     <div className="p-10 glass-panel border-blue-500/40 relative overflow-hidden animate-fade-in rounded-[2rem]">
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full"></div>
                        <div className="flex items-center justify-between mb-10 relative z-10">
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Verified Payload</span>
                          <span className={`px-5 py-2 rounded-full text-[10px] font-black tracking-[0.2em] border ${voucherResult.claimed ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'}`}>
                            {voucherResult.claimed ? 'ALREADY CLAIMED' : 'READY FOR REDEMPTION'}
                          </span>
                        </div>
                        <div className="space-y-8 relative z-10">
                          <div>
                            <div className="text-[10px] text-zinc-500 font-black uppercase mb-2 tracking-widest">RECIPIENT CHANNEL</div>
                            <div className="font-mono text-white text-sm break-all font-bold line-clamp-2">{voucherResult.employee}</div>
                          </div>
                          <div>
                            <div className="text-[10px] text-zinc-500 font-black uppercase mb-2 tracking-widest">COMMITMENT VALUE</div>
                            <div className="font-black text-white text-5xl tracking-tight">{voucherResult.amount} <span className="text-xl font-bold text-blue-500">SAT</span></div>
                          </div>
                        </div>
                     </div>
                   )}
                 </form>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isAppOpen, setIsAppOpen] = useState(false);

  return (
    <div className="min-h-screen relative w-full selection:bg-purple-500 selection:text-white overflow-x-hidden">
      <ScrollProgress />
      <CursorGlow />
      <Navbar onOpenApp={() => setIsAppOpen(true)} />
      
      <Hero onOpenApp={() => setIsAppOpen(true)} />
      
      <Features />

      <FastForeverSection />

      <section className="py-40 px-6 max-w-7xl mx-auto">
         <RevealOnScroll>
           <div 
             className="glass-panel p-20 md:p-40 rounded-[4rem] border-white/5 flex flex-col items-center text-center shadow-2xl relative overflow-hidden group min-h-[600px] justify-center"
             style={{ 
               backgroundImage: `linear-gradient(rgba(10, 10, 12, 0.85), rgba(10, 10, 12, 0.85)), url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2940&auto=format&fit=crop')`,
               backgroundSize: 'cover',
               backgroundPosition: 'center',
               backgroundAttachment: 'fixed'
             }}
           >
             <div className="absolute inset-0 bg-purple-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
             
             {/* Centered Content */}
             <div className="max-w-4xl relative z-10 flex flex-col items-center">
               <h2 className="text-6xl md:text-8xl font-black mb-10 tracking-tighter text-gradient leading-tight">Start Shielding <br/>your Capital.</h2>
               <p className="text-zinc-400 text-2xl mb-16 font-medium leading-relaxed max-w-2xl">Join global organizations managing trillions in private Bitcoin assets on the secure rail of Starknet.</p>
               <MagneticButton 
                  onClick={() => setIsAppOpen(true)}
                  className="bg-white text-black px-16 py-8 rounded-full font-black text-3xl hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-white/10"
               >
                  Enter Protocol
               </MagneticButton>
             </div>
           </div>
         </RevealOnScroll>
      </section>
      
      {isAppOpen && <AppPortal onClose={() => setIsAppOpen(false)} />}
      
      <footer className="border-t border-white/10 py-24 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-16">
          <Logo />
          <div className="flex gap-12 text-zinc-500 font-black text-[10px] uppercase tracking-[0.3em]">
            <a href="https://github.com/CloakPay/CloakPay1" className="hover:text-white transition-all">Github</a>
          </div>
          <p className="text-zinc-600 font-bold text-xs">CLOAKPAY ECOSYSTEM &copy; {new Date().getFullYear()} &bull; GLOBAL PRIVACY STANDARD</p>
        </div>
      </footer>
    </div>
  );
}

export default App;