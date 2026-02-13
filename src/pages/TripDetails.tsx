import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getTripById, getTripItems } from '../services/tripService';
import { Trip, TripItem } from '../types';
import { Timeline } from '../components/Timeline';
import { generateTripAdvice } from '../services/geminiService';
import { Calendar, Upload, Sparkles, Send, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { format, parseISO } from 'date-fns';

export const TripDetails = () => {
  const { tripId } = useParams<{ tripId: string }>();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [items, setItems] = useState<TripItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // AI Chat State
  const [question, setQuestion] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (tripId) {
      Promise.all([getTripById(tripId), getTripItems(tripId)])
        .then(([tripData, itemsData]) => {
          if (tripData) {
            setTrip(tripData);
            setItems(itemsData);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [tripId]);

  const handleAskAI = async () => {
    if (!question.trim() || !trip) return;
    setAiLoading(true);
    setAiResponse('');
    
    try {
      const answer = await generateTripAdvice(trip, items, question);
      setAiResponse(answer);
    } catch (err) {
      toast.error("AI failed to respond");
    } finally {
      setAiLoading(false);
    }
  };

  const handleFileUpload = () => {
    // In a real app, this would open a file picker and upload to Supabase Storage
    // Then trigger n8n workflow.
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf,image/*';
    input.onchange = (e: any) => {
        const file = e.target.files[0];
        if(file) {
            toast.promise(
                new Promise((resolve) => setTimeout(resolve, 2000)),
                {
                    loading: 'Uploading & Extracting with AI...',
                    success: 'Document processed! (Demo)',
                    error: 'Failed'
                }
            );
        }
    };
    input.click();
  };

  if (loading) return <div className="p-8">Loading trip details...</div>;
  if (!trip) return <div className="p-8">Trip not found</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Itinerary */}
      <div className="lg:col-span-2 space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{trip.title}</h1>
              <div className="flex items-center text-slate-500 mt-2 space-x-4">
                <span className="flex items-center"><Calendar className="w-4 h-4 mr-1" /> {format(parseISO(trip.start_date), 'MMM d')} - {format(parseISO(trip.end_date), 'MMM d, yyyy')}</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs uppercase font-bold">{trip.status}</span>
              </div>
            </div>
            <div className="flex space-x-2">
                <button 
                  onClick={() => toast.success("Share link copied!")}
                  className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                >
                    <Share2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={handleFileUpload}
                  className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors"
                >
                  <Upload className="w-4 h-4" />
                  <span>Import Doc</span>
                </button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-lg font-bold mb-4">Itinerary</h2>
          <Timeline items={items} />
        </div>
      </div>

      {/* Right Column: AI Assistant & Tools */}
      <div className="space-y-6">
        {/* AI Chat Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[500px]">
          <div className="p-4 bg-gradient-to-r from-brand-600 to-indigo-600 text-white flex items-center space-x-2">
            <Sparkles className="w-5 h-5" />
            <h2 className="font-bold">Trip Assistant</h2>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
             {!aiResponse && !aiLoading && (
                 <p className="text-sm text-slate-500 text-center mt-10">
                     Ask me about your schedule, local recommendations, or weather in {trip.destination_city}.
                 </p>
             )}
             
             {aiResponse && (
                 <div className="bg-white p-3 rounded-lg shadow-sm text-sm text-slate-700 whitespace-pre-wrap">
                     {aiResponse}
                 </div>
             )}

             {aiLoading && (
                 <div className="flex items-center justify-center space-x-2 mt-10">
                     <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce"></div>
                     <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce delay-75"></div>
                     <div className="w-2 h-2 bg-brand-500 rounded-full animate-bounce delay-150"></div>
                 </div>
             )}
          </div>

          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                  placeholder="Ask a question..."
                  className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button 
                  onClick={handleAskAI}
                  disabled={aiLoading}
                  className="bg-brand-600 hover:bg-brand-700 text-white p-2 rounded-lg disabled:opacity-50"
                >
                    <Send className="w-4 h-4" />
                </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="font-bold text-sm mb-3">Quick Actions</h3>
            <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded text-sm text-slate-600">Export to PDF</button>
                <button className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded text-sm text-slate-600">Sync to Calendar</button>
                <button className="w-full text-left px-3 py-2 hover:bg-slate-50 rounded text-sm text-slate-600">Flight Tracker</button>
            </div>
        </div>
      </div>
    </div>
  );
};
