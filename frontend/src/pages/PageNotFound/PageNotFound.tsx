import { Link as LinkIcon } from "lucide-react";
import { Link } from 'react-router-dom';

const PageNotFound = () => {
  return (
    <div className="h-full min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-8xl font-bold text-gray-200 mb-6">404</h1>

      <h2 className="text-4xl font-bold mb-6">
        Omae wa mou shindeiru!
      </h2>

      <p className="text-gray-500 mb-8 max-w-md">
        Unfortunately, this is only a 404 page. You may have mistyped the address, or the page has been moved to another URL.
      </p>
      <Link className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors" to={'/'}>
        <LinkIcon size={20} />
        Take me back to home page
      </Link>
    </div>
  );
};

export default PageNotFound;

// import React, { useState, useEffect } from 'react';
// import { Home } from "lucide-react";

// const PageNotFound = () => {
//   const [showNani, setShowNani] = useState(false);
//   const [showExplosion, setShowExplosion] = useState(false);

//   useEffect(() => {
//     const timer1 = setTimeout(() => setShowNani(true), 2000);
//     const timer2 = setTimeout(() => setShowExplosion(true), 3000);
//     return () => {
//       clearTimeout(timer1);
//       clearTimeout(timer2);
//     };
//   }, []);

//   return (
//     <div className="h-full flex flex-col items-center justify-center text-center  bg-gradient-to-b from-red-900 to-gray-900 relative overflow-hidden">
//       {/* Initial message */}
//       <div className="mb-8">
//         <h1 className="text-9xl font-bold text-red-500 opacity-20 mb-6">404</h1>
//         <h2 className="text-5xl font-bold mb-6 text-white tracking-wider">
//           お前はもう死んでいる
//         </h2>
//         <p className="text-2xl text-red-200 mb-4">
//           Omae wa mou shindeiru
//         </p>
//       </div>

//       {/* NANI?! appears after delay */}
//       {showNani && (
//         <div className="animate-bounce">
//           <p className="text-7xl font-bold text-white mb-8">
//             NANI?!
//           </p>
//         </div>
//       )}

//       {/* Explosion effect */}
//       {showExplosion && (
//         <div className="absolute inset-0 flex items-center justify-center">
//           <div className="animate-ping absolute w-96 h-96 bg-red-500 rounded-full opacity-20"></div>
//           <div className="animate-ping absolute w-64 h-64 bg-red-600 rounded-full opacity-30 delay-75"></div>
//           <div className="animate-ping absolute w-32 h-32 bg-red-700 rounded-full opacity-40 delay-100"></div>
//         </div>
//       )}

//       {/* Error message */}
//       <div className="relative z-10">
//         <p className="text-red-200 mb-8 max-w-md mx-auto">
//           You have encountered a legendary 404 technique of Hokuto Shinken.
//           This page's pressure points have already been struck.
//         </p>

//         <a
//           href="/"
//           className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-full hover:bg-red-500 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/50"
//         >
//           <Home size={20} />
//           Return to the Wasteland
//         </a>
//       </div>

//       {/* Background kanji effect */}
//       <div className="absolute inset-0 overflow-hidden opacity-5 pointer-events-none">
//         <div className="animate-float absolute top-0 left-1/4 text-8xl text-white">北</div>
//         <div className="animate-float absolute top-1/3 right-1/4 text-8xl text-white delay-300">斗</div>
//         <div className="animate-float absolute bottom-1/4 left-1/3 text-8xl text-white delay-700">拳</div>
//       </div>
//     </div>
//   );
// };

// export default PageNotFound;

// const keyframes = `
// @keyframes float {
//   0% { transform: translateY(0px); }
//   50% { transform: translateY(-20px); }
//   100% { transform: translateY(0px); }
// }
// `;