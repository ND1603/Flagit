import { useNavigate } from 'react-router-dom';

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center page-enter">
        <p className="text-6xl mb-4">🗺️</p>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Page not found
        </h1>
        <p className="text-gray-500 mb-6">
          The page you are looking for does not exist.
        </p>
        <button
          onClick={() => navigate('/')}
          className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
        >
          Go to Map
        </button>
      </div>
    </div>
  );
}