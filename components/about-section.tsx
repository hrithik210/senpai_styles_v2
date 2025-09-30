"use client"

export const AboutSection = () => {
  const scrollToHero = () => {
    const heroElement = document.getElementById('hero');
    if (heroElement) {
      heroElement.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section id="about" className="py-20 bg-black text-white relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-black to-gray-900/10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative max-w-7xl mx-auto px-8 lg:px-16">
        {/* Header - Centered */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-5xl font-bold tracking-tight mb-6 font-serif text-white animate-fade-in">
            Who We Are
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-white rounded-full animate-expand mx-auto"></div>
        </div>

        {/* Main Content - Centered Grid */}
        <div className="max-w-6xl mx-auto">
          {/* About - Full Width Centered */}
          <div className="mb-8 flex justify-center">
            <div className="group hover:scale-[1.02] transition-all duration-300 ease-out max-w-4xl w-full">
              <div className="relative p-8 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/30 to-black/50 backdrop-blur-sm hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <p className="relative text-gray-300 text-xl leading-relaxed text-center">
                  Senpai Styles is a <span className="text-white font-semibold hover:text-red-300 transition-colors duration-300 cursor-default">tiny brand</span> with <span className="text-white font-semibold hover:text-red-300 transition-colors duration-300 cursor-default">loud energy</span>. We kicked off with one tee (yep, just one), but it's not about quantity — it's about <span className="text-red-400 font-bold">attitude</span>. Think less "generic clothing store," more "wearable personality."
                </p>
              </div>
            </div>
          </div>

          {/* Three Columns - Equal Height and Spacing */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* The Vibe Section */}
            <div className="group hover:scale-[1.02] transition-all duration-300 ease-out">
              <div className="relative p-6 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/30 to-black/50 backdrop-blur-sm hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <h3 className="relative text-xl lg:text-2xl font-bold mb-4 text-center text-white hover:text-red-300 transition-colors duration-300 cursor-default">
                  The Vibe
                </h3>
                <div className="w-12 h-0.5 bg-red-500 mx-auto mb-4"></div>
                <p className="relative text-gray-300 text-base leading-relaxed text-center flex-grow flex items-center">
                  No filler. No boring basics. Just pieces that make you feel like the <span className="text-white font-bold">main character</span>.
                </p>
              </div>
            </div>

            {/* Refunds Section */}
            <div className="group hover:scale-[1.02] transition-all duration-300 ease-out">
              <div className="relative p-6 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/30 to-black/50 backdrop-blur-sm hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <h3 className="relative text-xl lg:text-2xl font-bold mb-4 text-center text-white hover:text-red-300 transition-colors duration-300 cursor-default">
                  Refunds
                </h3>
                <div className="w-12 h-0.5 bg-red-500 mx-auto mb-4"></div>
                <p className="relative text-gray-300 text-base leading-relaxed text-center flex-grow flex items-center">
                  Didn't vibe? Wrong size? Shipping messed it up? <span className="text-red-400 font-semibold hover:text-red-300 transition-colors duration-300 cursor-default">Send it back — simple</span>.
                </p>
              </div>
            </div>

            {/* What's Next Section */}
            <div className="group hover:scale-[1.02] transition-all duration-300 ease-out">
              <div className="relative p-6 rounded-2xl border border-gray-800/50 bg-gradient-to-br from-gray-900/30 to-black/50 backdrop-blur-sm hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-500/20 transition-all duration-300 h-full flex flex-col">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <h3 className="relative text-xl lg:text-2xl font-bold mb-4 text-center text-white hover:text-red-300 transition-colors duration-300 cursor-default">
                  What's Next
                </h3>
                <div className="w-12 h-0.5 bg-red-500 mx-auto mb-4"></div>
                <p className="relative text-gray-300 text-base leading-relaxed text-center flex-grow flex items-center">
                  Tees today. <span className="text-red-400 font-semibold hover:text-red-300 transition-colors duration-300 cursor-default">Hoodies, accessories, and wilder drops</span> coming soon.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-white rounded-full blur-lg opacity-20 animate-pulse"></div>
            <button 
              onClick={scrollToHero}
              className="relative text-gray-300 text-lg font-medium px-8 py-4 rounded-full border border-red-500/30 bg-black/70 backdrop-blur-sm hover:text-white hover:border-red-500/60 hover:bg-red-500/10 transition-all duration-300 cursor-pointer"
            >
              Ready to be the main character?
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes expand {
          from {
            width: 0;
          }
          to {
            width: 6rem;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-expand {
          animation: expand 1.5s ease-out 0.5s both;
        }
      `}</style>
    </section>
  );
};