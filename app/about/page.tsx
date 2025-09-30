"use client"

export default function About() {
  return (
    <div className="h-screen bg-black text-white relative overflow-hidden flex items-center">
      {/* Background gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-black to-blue-900/10"></div>
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative max-w-6xl mx-auto px-6 lg:px-12 w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4 font-serif bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent animate-fade-in">
            Who We Are
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full animate-expand"></div>
        </div>

        {/* Main Content - Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* About */}
          <div className="lg:col-span-2 group hover:scale-[1.01] transition-all duration-300 ease-out">
            <div className="relative p-6 rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/20 to-gray-800/10 backdrop-blur-sm hover:border-purple-500/30 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <p className="relative text-gray-300 text-lg leading-relaxed">
                Senpai Styles is a <span className="text-white font-semibold hover:text-purple-300 transition-colors duration-300 cursor-default">tiny brand</span> with <span className="text-white font-semibold hover:text-blue-300 transition-colors duration-300 cursor-default">loud energy</span>. We kicked off with one tee (yep, just one), but it's not about quantity — it's about <span className="text-transparent bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text font-semibold">attitude</span>. Think less "generic clothing store," more "wearable personality."
              </p>
            </div>
          </div>

          {/* The Vibe Section */}
          <div className="group hover:scale-[1.01] transition-all duration-300 ease-out">
            <div className="relative p-6 rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/20 to-gray-800/10 backdrop-blur-sm hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h2 className="relative text-xl lg:text-2xl font-bold mb-4 text-white hover:text-blue-300 transition-colors duration-300 cursor-default">
                The Vibe ✨
              </h2>
              <p className="relative text-gray-300 text-base leading-relaxed">
                No filler. No boring basics. Just pieces that make you feel like the <span className="text-transparent bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text font-bold">main character</span>.
              </p>
            </div>
          </div>

          {/* Refunds Section */}
          <div className="group hover:scale-[1.01] transition-all duration-300 ease-out">
            <div className="relative p-6 rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/20 to-gray-800/10 backdrop-blur-sm hover:border-green-500/30 hover:shadow-xl hover:shadow-green-500/10 transition-all duration-300 h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h2 className="relative text-xl lg:text-2xl font-bold mb-4 text-white hover:text-green-300 transition-colors duration-300 cursor-default">
                Refunds 💫
              </h2>
              <p className="relative text-gray-300 text-base leading-relaxed">
                Didn't vibe? Wrong size? Shipping messed it up? <span className="text-green-400 font-semibold hover:text-green-300 transition-colors duration-300 cursor-default">Send it back — simple</span>.
              </p>
            </div>
          </div>
        </div>

        {/* What's Next & CTA - Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* What's Next Section */}
          <div className="group hover:scale-[1.01] transition-all duration-300 ease-out">
            <div className="relative p-6 rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/20 to-gray-800/10 backdrop-blur-sm hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-red-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <h2 className="relative text-xl lg:text-2xl font-bold mb-4 text-white hover:text-orange-300 transition-colors duration-300 cursor-default">
                What's Next 🚀
              </h2>
              <p className="relative text-gray-300 text-base leading-relaxed">
                Tees today. <span className="text-orange-400 font-semibold hover:text-orange-300 transition-colors duration-300 cursor-default">Hoodies, accessories, and wilder drops</span> coming soon.
              </p>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="flex items-center justify-center">
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full blur-lg opacity-30 animate-pulse"></div>
              <p className="relative text-gray-400 text-sm font-medium px-6 py-4 rounded-full border border-gray-700/50 bg-gray-900/50 backdrop-blur-sm hover:text-white hover:border-purple-500/50 transition-all duration-300 cursor-default">
                Ready to be the main character? 🎌
              </p>
            </div>
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
            width: 5rem;
          }
        }
        
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        
        .animate-expand {
          animation: expand 1.5s ease-out 0.5s both;
        }
      `}</style>
    </div>

  );
}