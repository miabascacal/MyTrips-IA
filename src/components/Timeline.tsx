import React from 'react';
import { TripItem, TripItemType } from '../types';
import { Plane, Hotel, Map, Calendar, Coffee, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface TimelineProps {
  items: TripItem[];
}

const getIcon = (type: TripItemType) => {
  switch (type) {
    case TripItemType.FLIGHT: return Plane;
    case TripItemType.HOTEL: return Hotel;
    case TripItemType.ACTIVITY: return Map;
    case TripItemType.MEAL: return Coffee;
    default: return FileText;
  }
};

const getColor = (type: TripItemType) => {
  switch (type) {
    case TripItemType.FLIGHT: return 'bg-blue-500';
    case TripItemType.HOTEL: return 'bg-indigo-500';
    case TripItemType.ACTIVITY: return 'bg-green-500';
    case TripItemType.MEAL: return 'bg-orange-500';
    default: return 'bg-slate-400';
  }
};

export const Timeline: React.FC<TimelineProps> = ({ items }) => {
  if (items.length === 0) {
    return <div className="text-center py-12 text-slate-400">No items in itinerary yet. Upload a document or add manually.</div>;
  }

  return (
    <div className="relative border-l-2 border-slate-200 ml-4 space-y-8 py-4">
      {items.map((item) => {
        const Icon = getIcon(item.type);
        const colorClass = getColor(item.type);
        
        return (
          <div key={item.id} className="relative pl-8">
            {/* Timeline Dot */}
            <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${colorClass} shadow-sm`}></div>
            
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center space-x-2">
                  <div className={`p-1.5 rounded-md ${colorClass} bg-opacity-10 text-${colorClass.replace('bg-', '')}`}>
                    <Icon className={`w-4 h-4 text-${item.type === TripItemType.FLIGHT ? 'blue' : 'slate'}-600`} />
                  </div>
                  <span className="font-semibold text-slate-800">{item.title}</span>
                </div>
                <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded">
                  {format(parseISO(item.start_time), 'HH:mm')}
                </span>
              </div>
              
              {item.location && (
                <p className="text-sm text-slate-600 mb-2 flex items-center">
                  <Map className="w-3 h-3 mr-1" /> {item.location}
                </p>
              )}
              
              {item.description && (
                <p className="text-sm text-slate-500 mt-2 p-2 bg-slate-50 rounded-md">
                  {item.description}
                </p>
              )}

              {/* Specific metadata rendering */}
              {item.type === TripItemType.FLIGHT && item.metadata && (
                <div className="mt-2 flex gap-2 text-xs">
                   <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded border border-blue-100">
                     {item.metadata.airline} {item.metadata.flightNumber}
                   </span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
