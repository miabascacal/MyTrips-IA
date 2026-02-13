import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Globe, Plane, Clock } from 'lucide-react';

const data = [
  { name: '2020', flights: 2 },
  { name: '2021', flights: 4 },
  { name: '2022', flights: 8 },
  { name: '2023', flights: 12 },
  { name: '2024', flights: 6 },
];

export const Analytics = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Travel Stats</h1>
        <p className="text-slate-500 mt-1">Your personal travel history and insights.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center space-x-3 mb-2">
             <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Plane className="w-5 h-5"/></div>
             <h3 className="font-semibold text-slate-700">Distance Traveled</h3>
           </div>
           <p className="text-3xl font-bold text-slate-900">42,503 <span className="text-sm font-normal text-slate-500">km</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center space-x-3 mb-2">
             <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Globe className="w-5 h-5"/></div>
             <h3 className="font-semibold text-slate-700">World Coverage</h3>
           </div>
           <p className="text-3xl font-bold text-slate-900">8% <span className="text-sm font-normal text-slate-500">of countries</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
           <div className="flex items-center space-x-3 mb-2">
             <div className="p-2 bg-orange-100 text-orange-600 rounded-lg"><Clock className="w-5 h-5"/></div>
             <h3 className="font-semibold text-slate-700">Time in Air</h3>
           </div>
           <p className="text-3xl font-bold text-slate-900">142 <span className="text-sm font-normal text-slate-500">hours</span></p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h3 className="text-lg font-bold mb-6">Flights Per Year</h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="flights" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
