import React from 'react';
import { Trip, TripStatus } from '../types';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

interface TripCardProps {
  trip: Trip;
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const statusColors = {
    [TripStatus.PLANNING]: 'bg-yellow-100 text-yellow-800',
    [TripStatus.BOOKED]: 'bg-blue-100 text-blue-800',
    [TripStatus.ACTIVE]: 'bg-green-100 text-green-800',
    [TripStatus.COMPLETED]: 'bg-slate-100 text-slate-800',
    [TripStatus.CANCELLED]: 'bg-red-100 text-red-800',
  };

  return (
    <Link to={`/trips/${trip.id}`} className="group relative block bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
      <div className="h-48 overflow-hidden relative">
        <img 
          src={trip.cover_image || 'https://via.placeholder.com/400x200'} 
          alt={trip.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${statusColors[trip.status]}`}>
            {trip.status}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <h3 className="text-xl font-bold text-white mb-1">{trip.title}</h3>
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex items-center text-slate-600 mb-2">
          <MapPin className="w-4 h-4 mr-2" />
          <span className="text-sm">{trip.destination_city}, {trip.destination_country}</span>
        </div>
        <div className="flex items-center text-slate-600 mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          <span className="text-sm">
            {format(parseISO(trip.start_date), 'MMM d')} - {format(parseISO(trip.end_date), 'MMM d, yyyy')}
          </span>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <span className="text-xs text-slate-500 font-medium">View Itinerary</span>
          <ArrowRight className="w-4 h-4 text-brand-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};
