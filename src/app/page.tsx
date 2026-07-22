import Link from "next/link";
import React from "react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-sans selection:bg-primary/30 selection:text-primary-fixed-dim">
      
      {/* Navigation */}
      <header className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-surface-container-high/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="material-symbols-outlined text-primary group-hover:text-primary-fixed-dim transition-colors text-2xl">
              swap_calls
            </span>
            <span className="font-bold text-xl tracking-wide">CONVERTA</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="text-sm font-semibold tracking-wide text-on-surface-variant hover:text-primary transition-colors hidden md:block"
            >
              Dashboard
            </Link>
            <Link href="/dashboard">
              <div className="w-8 h-8 rounded-full bg-surface-container-high border border-surface-container-highest overflow-hidden flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <img 
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=b0d500" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center">
        
        {/* Hero Section */}
        <section className="w-full max-w-4xl mx-auto px-6 pt-24 pb-16 flex flex-col items-center text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-container border border-surface-container-high mb-8">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-bold tracking-widest text-primary uppercase">V2.0 Now Live</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
            The Future of <br className="md:hidden" />
            <span className="text-primary cyber-glow">File Precision</span>
          </h1>

          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mb-10 leading-relaxed">
            Cloud-accelerated conversion for images, video, and audio with lossless integrity. Experience precision like never before.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/dashboard"
              className="px-8 py-4 rounded-xl bg-primary text-surface font-bold hover:bg-primary-fixed-dim transition-colors cyber-glow-hover flex items-center justify-center gap-2"
            >
              Get Started Free
            </Link>
            <button className="px-8 py-4 rounded-xl bg-transparent border border-surface-container-highest text-on-surface font-bold hover:bg-surface-container-high transition-colors flex items-center justify-center gap-2">
              View API Docs
            </button>
          </div>

        </section>

        {/* Social Proof */}
        <section className="w-full max-w-5xl mx-auto px-6 py-12 border-y border-surface-container-high/30 mb-20">
          <p className="text-center text-[10px] font-bold tracking-[0.2em] text-on-surface-variant uppercase mb-8">
            Trusted by 10k+ Creators
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 font-bold text-xl tracking-wider"><span className="material-symbols-outlined">change_history</span> NEXUS</div>
            <div className="flex items-center gap-2 font-bold text-xl tracking-wider"><span className="material-symbols-outlined">donut_large</span> ORBITAL</div>
            <div className="flex items-center gap-2 font-bold text-xl tracking-wider"><span className="material-symbols-outlined">grid_view</span> MATRIX</div>
            <div className="flex items-center gap-2 font-bold text-xl tracking-wider"><span className="material-symbols-outlined">hub</span> SYNAPSE</div>
            <div className="flex items-center gap-2 font-bold text-xl tracking-wider"><span className="material-symbols-outlined">deployed_code</span> QUANTUM</div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="w-full max-w-7xl mx-auto px-6 mb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="glass-panel p-8 rounded-3xl border border-surface-container-high cyber-glow-hover group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">bolt</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Lightning Speed</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Proprietary server-side rendering nodes process your largest 8K assets in seconds, not minutes.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-panel p-8 rounded-3xl border border-surface-container-high cyber-glow-hover group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">high_quality</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Lossless Quality</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Zero compression artifacts. We use mathematical precision to ensure every pixel and decibel remains intact.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-panel p-8 rounded-3xl border border-surface-container-high cyber-glow-hover group">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-3xl">layers</span>
              </div>
              <h3 className="text-2xl font-bold mb-3">Multi-Format Support</h3>
              <p className="text-on-surface-variant leading-relaxed">
                Over 100+ individual file extensions supported, including RAW, ProRes, and High-fidelity spatial audio.
              </p>
            </div>

          </div>
        </section>

        {/* Demo UI Card */}
        <section className="w-full max-w-3xl mx-auto px-6 mb-32 relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-surface to-primary/20 rounded-[2.5rem] blur-2xl opacity-50"></div>
          
          <div className="relative glass-panel rounded-[2rem] p-6 md:p-10 border border-surface-container-highest shadow-2xl">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary">
                <span className="material-symbols-outlined">movie</span>
              </div>
              <div>
                <h4 className="font-mono font-bold text-sm md:text-base">production_cut_final_v2.mov</h4>
                <p className="text-on-surface-variant text-xs font-mono mt-1">1.4 GB • MP4 • H.265</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden mb-8">
              <div className="h-full bg-primary w-2/3 shadow-[0_0_10px_#b0d500]"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-surface-container/50 rounded-xl p-4 border border-surface-container-high">
                <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase mb-1">Time Left</p>
                <p className="font-mono font-bold text-lg">00:12s</p>
              </div>
              <div className="bg-surface-container/50 rounded-xl p-4 border border-surface-container-high">
                <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase mb-1">Speed</p>
                <p className="font-mono font-bold text-lg">45 Mbps</p>
              </div>
              <div className="bg-surface-container/50 rounded-xl p-4 border border-surface-container-high">
                <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase mb-1">Framerate</p>
                <p className="font-mono font-bold text-lg">60 FPS</p>
              </div>
              <div className="bg-surface-container/50 rounded-xl p-4 border border-surface-container-high">
                <p className="text-[10px] text-on-surface-variant font-bold tracking-widest uppercase mb-1">Status</p>
                <p className="font-mono font-bold text-lg text-primary animate-pulse">Optimizing</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full max-w-4xl mx-auto px-6 mb-32">
          <div className="bg-surface-container rounded-[3rem] p-10 md:p-20 flex flex-col items-center text-center border border-surface-container-high relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-primary/10 blur-[100px] rounded-full pointer-events-none"></div>
            
            <h2 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight relative z-10">
              Ready to <br className="md:hidden" /> transform your <br className="md:hidden" /> assets?
            </h2>
            <p className="text-on-surface-variant max-w-md mx-auto mb-10 relative z-10">
              Join thousands of creators using Converta for enterprise-grade asset management.
            </p>
            <Link 
              href="/dashboard"
              className="px-8 py-4 rounded-xl bg-primary text-surface font-bold hover:bg-primary-fixed-dim transition-colors cyber-glow-hover flex items-center justify-center gap-2 relative z-10 w-full sm:w-auto"
            >
              <span className="material-symbols-outlined">cloud_upload</span>
              Upload Now
            </Link>
            <p className="text-xs text-on-surface-variant/60 font-medium mt-6 relative z-10 uppercase tracking-widest">
              No credit card required. Free 10 conversions on us.
            </p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full border-t border-surface-container-high/50 bg-surface-container-low pt-16 pb-8 md:pb-24 px-6 relative z-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <span className="material-symbols-outlined text-primary text-2xl">
                swap_calls
              </span>
              <span className="font-bold text-xl tracking-wide">CONVERTA</span>
            </Link>
            <p className="text-on-surface-variant max-w-sm text-sm leading-relaxed">
              The precision tool for modern creatives. Cloud-powered, security-first, and lightning fast.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-sm tracking-widest uppercase mb-6">Product</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Features</Link></li>
              <li><Link href="#" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Pricing</Link></li>
              <li><Link href="#" className="text-on-surface-variant hover:text-primary transition-colors text-sm">API</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm tracking-widest uppercase mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Documentation</Link></li>
              <li><Link href="#" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Security</Link></li>
              <li><Link href="#" className="text-on-surface-variant hover:text-primary transition-colors text-sm">Changelog</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-surface-container-high/50 gap-6">
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-surface-container-high border border-surface-container-highest flex items-center justify-center hover:text-primary hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-sm">public</span>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-surface-container-high border border-surface-container-highest flex items-center justify-center hover:text-primary hover:border-primary transition-colors">
              <span className="material-symbols-outlined text-sm">mail</span>
            </a>
          </div>
          
          <div className="flex items-center gap-6 text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
            <span>© 2024 CONVERTA CORP.</span>
            <Link href="#" className="hover:text-primary transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms</Link>
          </div>
        </div>
      </footer>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-low/90 backdrop-blur-md border-t border-surface-container-high px-6 py-4 flex justify-between items-center z-50">
        <Link href="/" className="flex flex-col items-center text-primary group">
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">home</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Home</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center text-on-surface-variant hover:text-primary transition-colors group">
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">history</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">History</span>
        </Link>
        <Link href="/dashboard" className="flex flex-col items-center text-on-surface-variant hover:text-primary transition-colors group">
          <span className="material-symbols-outlined group-hover:scale-110 transition-transform">settings</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">Settings</span>
        </Link>
      </div>

    </div>
  );
}
