import React from 'react';
import { useAuth } from '../services/auth';
import { isSupabaseConfigured } from '../supabaseClient';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const Settings = () => {
    const { user } = useAuth();
    const isConnected = isSupabaseConfigured();

    return (
        <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Settings</h1>
            
            {/* Connection Status Indicator */}
            <div className={`mb-8 p-4 rounded-xl border ${isConnected ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <div className="flex items-center space-x-3">
                    {isConnected ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                        <AlertCircle className="w-6 h-6 text-amber-600" />
                    )}
                    <div>
                        <h3 className={`font-bold ${isConnected ? 'text-green-800' : 'text-amber-800'}`}>
                            {isConnected ? 'System Operational' : 'Demo Mode Active'}
                        </h3>
                        <p className={`text-sm ${isConnected ? 'text-green-700' : 'text-amber-700'}`}>
                            {isConnected 
                                ? 'Connected to production Supabase instance.' 
                                : 'Using mock data. To connect your account, configure REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY in your environment variables.'}
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm divide-y divide-slate-100">
                <div className="p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Profile</h2>
                    <p className="text-sm text-slate-500 mb-4">Manage your personal information.</p>
                    
                    <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-xl font-bold text-slate-500">
                            {user?.email?.[0].toUpperCase()}
                        </div>
                        <div>
                            <p className="font-medium text-slate-900">{user?.user_metadata?.full_name || 'Voyage User'}</p>
                            <p className="text-slate-500">{user?.email}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-1">Integrations</h2>
                    <p className="text-sm text-slate-500 mb-4">Connect external services.</p>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">W</div>
                                <span className="font-medium text-slate-700">WhatsApp Notifications</span>
                            </div>
                            <button className="text-brand-600 hover:text-brand-700 font-medium text-sm">Connect</button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">G</div>
                                <span className="font-medium text-slate-700">Google Calendar</span>
                            </div>
                            <span className="text-green-600 text-sm font-medium flex items-center">Connected</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
