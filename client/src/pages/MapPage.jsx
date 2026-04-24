import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import api from '../api';
import categoryConfig from '../categoryConfig';

function createIcon(type) {
  const config = categoryConfig[type];
  return L.divIcon({
    html: `<div style="
      background:${config.color};
      width:36px;
      height:36px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:18px;
      border:2px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.3)
    ">${config.emoji}</div>`,
    className: '',
    iconSize: [36, 36],
    iconAnchor: [18, 18]
  });
}

export default function MapPage() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const params = filter !== 'all' ? { type: filter } : {};
        const { data } = await api.get('/reports', { params });
        setReports(data);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [filter]);

  return (
    <div className="flex flex-col h-screen">

      <div className="flex gap-2 p-3 bg-white shadow-sm z-10 overflow-x-auto">
        {['all', 'electricity', 'wifi', 'water', 'road', 'other'].map(type => {
          const cfg = categoryConfig[type];
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap border transition
                ${filter === type
                  ? 'bg-gray-900 text-white border-gray-900'
                  : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                }`}
            >
              {type === 'all' ? '🗺️ All' : `${cfg.emoji} ${cfg.label}`}
            </button>
          );
        })}
      </div>

      {loading && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-50 bg-white px-4 py-2 rounded-full shadow text-sm text-gray-600">
          Loading reports...
        </div>
      )}

      <MapContainer
        center={[9.0249, 38.7469]}
        zoom={6}
        className="flex-1 z-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />

        {reports.map(report => (
          <Marker
            key={report._id}
            position={[report.location.lat, report.location.lng]}
            icon={createIcon(report.type)}
          >
            <Popup>
              <div className="text-sm min-w-48">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">
                    {categoryConfig[report.type].emoji}
                  </span>
                  <span className="font-bold capitalize">
                    {categoryConfig[report.type].label}
                  </span>
                </div>
                <p className="text-gray-700 mb-2">
                  {report.description}
                </p>
                <p className="text-gray-500 text-xs mb-1">
                  📍 {report.city}
                  {report.location.address && ` — ${report.location.address}`}
                </p>
                <p className="text-gray-500 text-xs mb-2">
                  👤 {report.submittedBy?.name}
                </p>
                <p className="text-gray-500 text-xs">
                  👍 {report.upvoteCount} confirmations
                </p>
                {report.photo && (
                  <img
                    src={`${import.meta.env.VITE_API_URL}${report.photo}`}
                    className="mt-2 w-full rounded"
                    alt="report"
                  />
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}