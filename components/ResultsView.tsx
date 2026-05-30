import React from 'react';
import { Gift, Award, CheckCircle2, Download, BookOpen, Users } from 'lucide-react';
import { QuizQuestion } from '../types';

interface ResultsViewProps {
  score: number;
  totalQuestions: number;
  email: string;
  questions: QuizQuestion[];
  userPredictions: string[];
}

export const ResultsView: React.FC<ResultsViewProps> = ({ score, totalQuestions, email, questions, userPredictions }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const today = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  
  // Extract unique DOIs
  const uniqueDois = Array.from(new Set(questions.map(q => q.doi).filter(Boolean)));

  // Dynamic Message Logic
  let feedbackMessage = "";
  let feedbackColor = "text-slate-400";
  
  if (score >= 16) {
      feedbackMessage = "Unbelievable! Your chemical intuition is world-class.";
      feedbackColor = "text-amber-400";
  } else if (score >= 13) {
      feedbackMessage = "Excellent job. You have a strong grasp of these systems.";
      feedbackColor = "text-emerald-400";
  } else if (score < 11) {
      feedbackMessage = "Challenging dataset. Most chemists get around 8-12 correct.";
      feedbackColor = "text-slate-400";
  } else {
      // 11, 12
      feedbackMessage = "Solid performance. Most chemists get around 8-12 correct.";
      feedbackColor = "text-cyan-400";
  }

  const handleDownload = () => {
    // Generate CSV content
    // REMOVED: "Notes" column as requested
    const headers = ["QuestionID", "Metal", "Linker", "User Prediction", "Actual Outcome", "Correct?", "DOI"];
    const rows = questions.map((q, i) => {
        const userP = userPredictions[i] || "N/A";
        const actual = q.isSuccess ? "Success" : "Fail";
        const isCorrect = userP.includes(actual) ? "Yes" : "No";
        
        // Escape content for CSV
        const safe = (str: string | null | undefined) => `"${(str || '').replace(/"/g, '""')}"`;

        return [
            safe(q.id),
            safe(q.metal_precursor),
            safe(q.organic_linker),
            safe(userP),
            safe(actual),
            safe(isCorrect),
            safe(q.doi)
        ].join(",");
    });

    const csvContent = [headers.join(","), ...rows].join("\n");
    
    // Add BOM (\uFEFF) to force Excel to recognize UTF-8
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `mof_results_${email.split('@')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100 text-center">
      
      {/* Top Stats Header */}
      <div className="bg-slate-50 border-b border-slate-100 p-3 text-xs text-slate-500 font-medium flex items-center justify-center gap-2">
         <Users className="w-3 h-3" /> Average score by all players as of {today}: <span className="font-bold text-slate-700">10.7</span>
      </div>

      <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
        <h2 className="text-3xl font-bold relative z-10">Experiment Complete</h2>
        
        <div className="mt-6 inline-flex items-center justify-center w-32 h-32 rounded-full border-4 border-cyan-400 bg-slate-800 relative z-10 shadow-lg">
            <div className="flex flex-col animate-fade-in">
                <span className="text-4xl font-extrabold text-white">{score}</span>
                <span className="text-xs text-slate-400 uppercase tracking-widest">of {totalQuestions}</span>
            </div>
        </div>

        <p className={`mt-6 text-lg font-medium relative z-10 ${feedbackColor}`}>
            {feedbackMessage}
        </p>
      </div>

      <div className="p-8">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 mb-8 text-left">
            <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-100 rounded-full text-emerald-600">
                    <Gift className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-emerald-800">Submission Received</h3>
                    <p className="text-emerald-700 mt-1 text-sm">
                        Results for <strong>{email || "Participant"}</strong> have been automatically submitted. You will be contacted via email no later than Jan 31, 2026 if you win.
                    </p>
                    <ul className="mt-3 space-y-2 text-xs md:text-sm text-emerald-700">
                        <li className="flex items-center gap-2">
                           <CheckCircle2 className="w-4 h-4"/> 
                           Participation Entry: <strong>Confirmed</strong>
                        </li>
                        <li className="flex items-center gap-2">
                           <Award className="w-4 h-4"/> 
                           Grand Prize Draw ($100): <strong>Entered</strong>
                        </li>
                        <li className="flex items-center gap-2">
                           <Gift className="w-4 h-4"/> 
                           Participation Draw ($20): <strong>Entered</strong> (20% Chance)
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div className="flex flex-col gap-4">
             <button 
                onClick={handleDownload}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors border border-slate-200"
             >
                <Download className="w-4 h-4" /> Download Detailed Results (CSV)
             </button>

             {uniqueDois.length > 0 && (
                <div className="text-left text-xs text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <h4 className="font-bold flex items-center gap-2 mb-2 text-slate-700">
                        <BookOpen className="w-3 h-3" /> References used in this study:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {uniqueDois.map((doi) => (
                            <a 
                                key={doi} 
                                href={`https://doi.org/${doi}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="bg-white border border-slate-200 px-2 py-1 rounded hover:text-cyan-600 hover:border-cyan-300 transition-colors"
                            >
                                doi:{doi}
                            </a>
                        ))}
                    </div>
                </div>
             )}
        </div>

        <div className="mt-6 text-slate-400 text-sm">
            Thank you for your contribution to MOF science. You may close this window.
        </div>
      </div>
    </div>
  );
};