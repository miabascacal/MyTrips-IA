import React, { useEffect, useState } from 'react';
import { getTrips } from '../services/tripService';
import { Trip } from '../types';
import { TripCard } from '../components/TripCard';
import { Plus, Globe, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export const Dashboard = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      const data = await getTrips();
      setTrips(data);
    } catch (error) {
      toast.error("Failed to load trips");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Trips</h1>
          <p className="text-slate-500 mt-1">Manage your upcoming adventures and past memories.</p>
        </div>
        <button 
          onClick={() => toast.success("Create Trip Feature Coming Soon")}
          className="flex items-center justify-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>New Trip</span>
        </button>
      </div>

      {/* Stats Summary Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Countries Visited</p>
            <p className="text-2xl font-bold text-slate-900">12</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-purple-50 rounded-lg text-purple-600">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Trips</p>
            <p className="text-2xl font-bold text-slate-900">{trips.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Upcoming</p>
            <p className="text-2xl font-bold text-slate-900">{trips.filter(t => t.status === 'planning' || t.status === 'booked').length}</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-slate-200 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map(trip => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
};
