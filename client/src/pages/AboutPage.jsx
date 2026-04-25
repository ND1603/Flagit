import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto p-6 pb-12 page-enter">

      <div className="text-center mb-8">
        <p className="text-5xl mb-3">🚩</p>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Flagit</h1>
        <p className="text-gray-500">Community Infrastructure Reporter</p>
      </div>

      <div className="bg-gray-900 text-white rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-lg mb-2 text-yellow-400">
          The Problem
        </h2>
        <p className="text-gray-300 leading-relaxed">
          When electricity goes out, WiFi drops, a water pipe bursts, or
          a road cracks in Ethiopia, people find out by posting in
          crowded Telegram groups or calling neighbors. There is no
          central place to see what is happening, where it is happening,
          or how widespread a problem is.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-lg mb-2 text-gray-900">
          The Solution
        </h2>
        <p className="text-gray-600 leading-relaxed">
          Flagit gives every Ethiopian a simple way to pin a problem on
          a map, so their whole community can see it, confirm it, and
          track when it is resolved. Reports expire after 24 hours unless
          confirmed by other users, keeping the map accurate and current.
        </p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-lg mb-3 text-gray-900">
          Tech Stack
        </h2>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
          {[
            'React + Vite',
            'Node.js + Express',
            'MongoDB + Mongoose',
            'Leaflet.js Maps',
            'JWT Authentication',
            'Tailwind CSS',
            'Railway (Backend)',
            'Vercel (Frontend)',
          ].map(tech => (
            <div key={tech} className="flex items-center gap-2">
              <span className="text-yellow-400">▸</span>
              {tech}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6">
        <h2 className="font-bold text-lg mb-2 text-gray-900">
          Built by
        </h2>
        <p className="text-gray-600">
          Developed as an internship project by a software engineering
          student to solve real
          Ethiopian community problems.
        </p>
      </div>

      <button
        onClick={() => navigate('/')}
        className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-700 transition"
      >
        View the Map
      </button>

    </div>
  );
}