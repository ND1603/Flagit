import toast from 'react-hot-toast';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import LocationPicker from '../components/LocationPicker';
import categoryConfig from '../categoryConfig';

export default function SubmitPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    type: 'electricity',
    description: '',
    city: 'Addis Ababa'
  });
  const [position, setPosition] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            You need to be logged in to submit a report
          </p>
          <button
            onClick={() => navigate('/login')}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!position) {
      return setError('Please click on the map to select a location');
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('type', form.type);
    formData.append('description', form.description);
    formData.append('city', form.city);
    formData.append('lat', position.lat);
    formData.append('lng', position.lng);
    if (photo) formData.append('photo', photo);

    try {
      await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
       toast.success('Report submitted successfully!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-12 page-enter">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">
        📍 Submit a Report
      </h1>
      <p className="text-gray-500 mb-6">
        Report an infrastructure problem in your area
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type of Issue
          </label>
          <select
            value={form.type}
            onChange={e => setForm({ ...form, type: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {Object.entries(categoryConfig).map(([key, val]) => (
              <option key={key} value={key}>
                {val.emoji} {val.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            required
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
            rows={3}
            placeholder="Describe the problem briefly..."
            maxLength={500}
          />
          <p className="text-xs text-gray-400 mt-1">
            {form.description.length}/500
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            City
          </label>
          <select
            value={form.city}
            onChange={e => setForm({ ...form, city: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            {[
              'Addis Ababa',
              'Hawassa',
              'Dire Dawa',
              'Mekelle',
              'Bahir Dar',
              'Adama',
              'Jimma'
            ].map(city => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Photo (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={e => setPhoto(e.target.files[0])}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-900 file:text-white hover:file:bg-gray-700"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            📍 Click on the map to set the exact location
            {position && (
              <span className="text-green-600 ml-2 font-normal">
                ✓ Location selected
              </span>
            )}
          </label>
          <MapContainer
            center={[9.0249, 38.7469]}
            zoom={6}
            style={{ height: 300 }}
            className="rounded-lg border border-gray-300"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationPicker onSelect={setPosition} />
            {position && <Marker position={position} />}
          </MapContainer>
        </div>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-700 transition disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Submit Report'}
        </button>

      </form>
    </div>
  );
}