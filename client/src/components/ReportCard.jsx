import toast from 'react-hot-toast';
import categoryConfig from '../categoryConfig';
import formatTimeAgo from '../timeHelper';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import api from '../api';

export default function ReportCard({ report, onUpvote, onResolve }) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const cfg = categoryConfig[report.type];

  const handleUpvote = async () => {
    if (!user) {
      toast.error('Please login to confirm a report');
      return;
    }
    try {
      const { data } = await api.put(`/reports/${report._id}/upvote`);
      onUpvote(data);
      toast.success('Confirmation updated!');
    } catch (err) {
      toast.error('Failed to update confirmation');
      console.error('Upvote failed:', err);
    }
  };

  const handleResolve = async () => {
    try {
      await api.put(`/reports/${report._id}/resolve`);
      toast.success('Report marked as resolved!');
      if (onResolve) onResolve(report._id);
    } catch (err) {
      toast.error('Failed to resolve report');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
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
      <p className="text-gray-800 mb-3 leading-relaxed">
        {report.description}
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
        <span>📍 {report.city}</span>
        {report.location.address && (
          <span>— {report.location.address}</span>
        )}
      </div>
      <div className="text-xs text-gray-400 mb-3">
        {t.reportedBy} {report.submittedBy?.name}
      </div>
      {report.photo && (
        <img
          src={`${import.meta.env.VITE_API_URL}${report.photo}`}
          alt="report"
          className="w-full rounded-lg mb-3 max-h-48 object-cover"
          onError={e => e.target.style.display = 'none'}
        />
      )}
      <div className="flex items-center justify-between">
        <button
          onClick={handleUpvote}
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition"
        >
          <span className="text-lg">👍</span>
          <span>{report.upvoteCount} {report.upvoteCount !== 1 ? t.confirmations : t.confirmation}</span>
        </button>

        {report.status === 'resolved' ? (
          <span className="text-xs bg-green-100 text-green-600 px-3 py-1 rounded-full font-medium">
            ✅ {t.resolved}
          </span>
        ) : (user && (user.id === report.submittedBy?._id || user.role === 'admin')) && (
          <button
            onClick={handleResolve}
            className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full hover:bg-green-100 hover:text-green-600 transition"
          >
            {t.markResolved}
          </button>
        )}
      </div>
    </div>
  );
}
