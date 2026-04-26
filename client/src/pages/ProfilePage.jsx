import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import categoryConfig from '../categoryConfig';
import formatTimeAgo from '../timeHelper';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchMyReports = async () => {
      try {
        const { data } = await api.get('/reports/my-reports');
        setReports(data);
      } catch (err) {
        console.error('Failed to fetch reports:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyReports();
  }, [user]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      await api.delete(`/reports/${id}`);
      setReports(prev => prev.filter(r => r._id !== id));
      toast.success('Report deleted');
    } catch (err) {
      toast.error('Failed to delete report');
      console.error('Delete failed:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalUpvotes = reports.reduce((sum, r) => sum + r.upvoteCount, 0);
  const mostCommonType = reports.length > 0
    ? Object.entries(
        reports.reduce((acc, r) => {
          acc[r.type] = (acc[r.type] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0][0]
    : null;

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 pb-12 page-enter">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-24 bg-gray-200 rounded" />
          <div className="h-24 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 pb-12">

      <div className="bg-gray-900 text-white rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">{user.name}</h1>
            <p className="text-gray-400 text-sm">{user.email}</p>
            <p className="text-gray-400 text-sm">📍 {user.city}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-300 transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {reports.length}
          </p>
          <p className="text-xs text-gray-500 mt-1">Reports</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {totalUpvotes}
          </p>
          <p className="text-xs text-gray-500 mt-1">Confirmations</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {mostCommonType
              ? categoryConfig[mostCommonType].emoji
              : '—'}
          </p>
          <p className="text-xs text-gray-500 mt-1">Top Issue</p>
        </div>
      </div>

      <h2 className="text-lg font-bold text-gray-900 mb-4">
        My Reports
      </h2>

      {reports.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-4xl mb-4">📝</p>
          <p className="text-gray-700 font-medium mb-2">
            No reports yet
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Submit your first infrastructure report
          </p>
          <button
            onClick={() => navigate('/submit')}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-700 transition"
          >
            Submit a Report
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map(report => {
            const cfg = categoryConfig[report.type];
            return (
              <div
                key={report._id}
                className="bg-white rounded-2xl border border-gray-100 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      backgroundColor: cfg.color + '20',
                      color: cfg.color
                    }}
                  >
                    {cfg.emoji} {cfg.label}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(report.createdAt)}
                  </span>
                </div>

                <p className="text-gray-800 text-sm mb-2">
                  {report.description}
                </p>

                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span>📍 {report.city}</span>
                    <span>👍 {report.upvoteCount}</span>
                    <span className={`px-2 py-0.5 rounded-full ${
                      report.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {report.isActive ? 'Active' : 'Expired'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDelete(report._id)}
                    className="text-xs text-red-400 hover:text-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}