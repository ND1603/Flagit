import { useEffect, useState } from 'react';
import api from '../api';
import ReportCard from '../components/ReportCard';

export default function FeedPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [city, setCity] = useState('all');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filter !== 'all') params.type = filter;
        if (city !== 'all') params.city = city;
        const { data } = await api.get('/reports', { params });
        setReports(data);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [filter, city]);

  const handleUpvote = (updatedReport) => {
    setReports(prev =>
      prev.map(r => r._id === updatedReport._id ? updatedReport : r)
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-4">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          📋 Reports Feed
        </h1>
        <p className="text-gray-500 text-sm">
          {loading ? 'Loading...' : `${reports.length} active report${reports.length !== 1 ? 's' : ''}`}
        </p>
      </div>

      <div className="flex gap-3 mb-4 flex-wrap">
        <select
          value={city}
          onChange={e => setCity(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="all">All Cities</option>
          {[
            'Addis Ababa',
            'Hawassa',
            'Dire Dawa',
            'Mekelle',
            'Bahir Dar',
            'Adama',
            'Jimma'
          ].map(c => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          value={filter}
          onChange={e => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
        >
          <option value="all">All Types</option>
          <option value="electricity">⚡ Electricity</option>
          <option value="wifi">📶 WiFi</option>
          <option value="water">💧 Water</option>
          <option value="road">🚧 Road</option>
          <option value="other">⚠️ Other</option>
        </select>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-full mb-2" />
              <div className="h-3 bg-gray-200 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">🗺️</p>
          <p className="text-gray-700 font-medium mb-2">
            No active reports right now
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Be the first to report an issue!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map(report => (
            <ReportCard
              key={report._id}
              report={report}
              onUpvote={handleUpvote}
            />
          ))}
        </div>
      )}
    </div>
  );
}