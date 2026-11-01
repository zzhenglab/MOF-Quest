import React, { useState, useEffect } from 'react';
import { LocalRecord, UserResult } from '../types';
import { Lock, Unlock, Download, RefreshCw, Trash2, CheckCircle2, XCircle, ArrowLeft, FileJson } from 'lucide-react';

interface AdminPanelProps {
  onClose: () => void;
  googleScriptUrl: string;
}

const STORAGE_KEY = 'MOF_LOCAL_STORAGE_V1';
const ADMIN_PASSWORD = 'MOF2025';

export const AdminPanel: React.FC<AdminPanelProps> = ({ onClose, googleScriptUrl }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [records, setRecords] = useState<LocalRecord[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState('');

  // Load records on mount
  useEffect(() => {
    const loadRecords = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setRecords(JSON.parse(stored).reverse()); // Newest first
        }
      } catch (e) {
        console.error("Failed to load local records", e);
      }
    };
    loadRecords();
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid Access Code');
    }
  };

  const handleExportCSV = () => {
    if (records.length === 0) return;

    // Flatten data for CSV
    const headers = ["Timestamp", "Email", "Experience", "Score", "Total", "Synced", "Transcript"];
    const rows = records.map(r => {
      const safe = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
      return [
        safe(r.timestamp),
        safe(r.email),
        safe(r.data.yearsOfExperience),
        r.data.score,
        r.data.totalQuestions,
        r.synced ? "YES" : "NO",
        safe(r.data.detailedTranscript)
      ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MOF_ALL_RECORDS_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSyncPending = async () => {
    setSyncing(true);
    const unsynced = records.filter(r => !r.synced);
    let successCount = 0;

    // Clone records to update state
    let updatedRecords = [...records];

    for (const record of unsynced) {
      try {
        await fetch(googleScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify(record.data)
        });
        
        // Optimistically assume success if no-cors doesn't throw (standard behavior for opaque response)
        // Update the record in our local copy
        const index = updatedRecords.findIndex(r => r.id === record.id);
        if (index !== -1) {
          updatedRecords[index] = { ...updatedRecords[index], synced: true };
        }
        successCount++;
      } catch (e) {
        console.error(`Failed to sync record ${record.id}`, e);
      }
    }

    // Save back to local storage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedRecords.reverse())); // Store chronological
    setRecords(updatedRecords);
    setSyncing(false);
    alert(`Sync Process Complete. Attempted to send ${unsynced.length} records.`);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 bg-slate-900 z-[100] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-slate-100 rounded-full">
              <Lock className="w-8 h-8 text-slate-600" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Admin Access</h2>
          <p className="text-slate-500 mb-6 text-sm">View local records stored on this device.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="Enter Access Code"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 outline-none"
              autoFocus
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-slate-200 font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const unsyncedCount = records.filter(r => !r.synced).length;

  return (
    <div className="fixed inset-0 bg-slate-100 z-[100] flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Unlock className="w-4 h-4 text-emerald-500" /> Local Data Store
             </h2>
             <p className="text-xs text-slate-500">Device specific records</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <div className="bg-slate-100 px-3 py-1 rounded-lg text-xs font-semibold text-slate-600">
                Total: {records.length}
            </div>
            <div className={`px-3 py-1 rounded-lg text-xs font-semibold ${unsyncedCount > 0 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                Pending Sync: {unsyncedCount}
            </div>
        </div>
      </div>

      {/* Actions Toolbar */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap gap-3">
        <button 
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg font-bold text-sm hover:bg-slate-800 transition-colors shadow-sm"
        >
            <Download className="w-4 h-4" /> Export All (CSV)
        </button>
        
        <button 
            onClick={handleSyncPending}
            disabled={syncing || unsyncedCount === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-colors shadow-sm border ${
                unsyncedCount === 0 
                ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' 
                : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
            }`}
        >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} /> 
            {syncing ? 'Syncing...' : 'Retry Failed Uploads'}
        </button>
      </div>

      {/* Data Table */}
      <div className="flex-1 overflow-auto p-4">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider text-xs border-b border-slate-200">
                    <tr>
                        <th className="p-4">Status</th>
                        <th className="p-4">Time</th>
                        <th className="p-4">Email</th>
                        <th className="p-4">Score</th>
                        <th className="p-4">Details</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {records.map((record) => (
                        <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4">
                                {record.synced ? (
                                    <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded text-xs font-bold border border-emerald-100">
                                        <CheckCircle2 className="w-3 h-3" /> Synced
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded text-xs font-bold border border-amber-100">
                                        <XCircle className="w-3 h-3" /> Failed
                                    </span>
                                )}
                            </td>
                            <td className="p-4 text-slate-600 font-mono text-xs">
                                {new Date(record.timestamp).toLocaleString()}
                            </td>
                            <td className="p-4 font-medium text-slate-800">
                                {record.email}
                            </td>
                            <td className="p-4 text-slate-600">
                                <span className="font-bold">{record.data.score}</span> / {record.data.totalQuestions}
                            </td>
                            <td className="p-4">
                                <div className="text-xs text-slate-400 truncate max-w-[200px]" title={record.id}>
                                    Exp: {record.data.yearsOfExperience}
                                </div>
                            </td>
                        </tr>
                    ))}
                    {records.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-400">
                                No records found on this device.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};