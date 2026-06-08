import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function AdminPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/admin/stats")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
    console.error('Admin error:', err.response?.data || err.message);
    alert('Error: ' + (err.response?.data?.message || err.message));
  });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-yellow-400 rounded-xl p-6 text-center">
          <p className="text-4xl font-bold">{stats.totalReports}</p>
          <p className="text-lg mt-1">Total Reports</p>
        </div>
        <div className="bg-gray-800 text-white rounded-xl p-6 text-center">
          <p className="text-4xl font-bold">{stats.totalUsers}</p>
          <p className="text-lg mt-1">Total Users</p>
        </div>
      </div>

      {/* Reports by Category */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Reports by Category</h2>
        {stats.byCategory.map((item) => (
          <div key={item._id} className="flex items-center justify-between mb-2">
            <span className="capitalize">{item._id}</span>
            <div className="flex items-center gap-2">
              <div className="bg-yellow-400 h-4 rounded" style={{ width: `${item.count * 20}px`, minWidth: '20px' }}></div>
              <span className="font-bold">{item.count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Reports by City */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="text-xl font-bold mb-4">Reports by City</h2>
        {stats.byCity.map((item) => (
          <div key={item._id} className="flex items-center justify-between mb-2">
            <span>{item._id}</span>
            <div className="flex items-center gap-2">
              <div className="bg-gray-800 h-4 rounded" style={{ width: `${item.count * 20}px`, minWidth: '20px' }}></div>
              <span className="font-bold">{item.count}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Most Upvoted Reports */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Most Upvoted Reports</h2>
        {stats.topReports.map((report) => (
          <div key={report._id} className="flex items-center justify-between border-b py-2">
            <div>
              <p className="font-semibold">{report.title}</p>
              <p className="text-sm text-gray-500">{report.type} · {report.city}</p>
            </div>
            <span className="bg-yellow-400 px-3 py-1 rounded-full font-bold">
              👍 {report.upvotes?.length || 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
