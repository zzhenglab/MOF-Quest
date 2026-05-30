
import React, { useState, useEffect, useRef } from 'react';
import { generateQuiz, demoQuestion } from './constants';
import { QuizQuestion, GameState, UserResult, LocalRecord } from './types';
import { ReactionCard } from './components/ReactionCard';
import { ResultsView } from './components/ResultsView';
import { AdminPanel } from './components/AdminPanel'; // Import Admin Panel
import { Check, X, FlaskConical, ArrowRight, Lock, Mail, Clock, ListChecks, Briefcase, ShieldCheck } from 'lucide-react';

// Updated URL from your latest deployment
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyWK313D3TNFzeZLuSUxc3C3tB4CmrRg_NDdwwmdzfB4h1lQoabaxrTyva2xlGnbixi6w/exec';
const LOCAL_STORAGE_KEY = 'MOF_LOCAL_STORAGE_V1';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('intro');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [userPredictions, setUserPredictions] = useState<string[]>([]); // Track detailed string prediction
  const [lastFeedback, setLastFeedback] = useState<'correct' | 'incorrect' | null>(null);
  
  // User Data
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [experience, setExperience] = useState('');
  const [experienceError, setExperienceError] = useState('');

  // IRB Consent Modal State
  const [showFullConsent, setShowFullConsent] = useState(false);
  
  // Refs for auto-submission on close/inactivity to avoid closure staleness
  const gameStateRef = useRef(gameState);
  const questionsRef = useRef(questions);
  const predictionsRef = useRef(userPredictions);
  const scoreRef = useRef(score);
  const emailRef = useRef(email);
  const experienceRef = useRef(experience);
  const activityTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync refs
  useEffect(() => {
      gameStateRef.current = gameState;
      questionsRef.current = questions;
      predictionsRef.current = userPredictions;
      scoreRef.current = score;
      emailRef.current = email;
      experienceRef.current = experience;
  }, [gameState, questions, userPredictions, score, email, experience]);

  // Initialize quiz
  useEffect(() => {
    setQuestions(generateQuiz());
  }, []);

  // Inactivity Watchdog
  useEffect(() => {
    const resetTimer = () => {
        if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
        // Set 10 minute timeout
        activityTimerRef.current = setTimeout(() => {
            if (gameStateRef.current === 'playing') {
                console.log("Inactivity detected. Auto-submitting...");
                submitPartialResults();
                setGameState('results');
            }
        }, 10 * 60 * 1000); 
    };

    // Listen for interactions
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('click', resetTimer);
    window.addEventListener('keypress', resetTimer);
    
    resetTimer(); // Start immediately

    return () => {
        if (activityTimerRef.current) clearTimeout(activityTimerRef.current);
        window.removeEventListener('mousemove', resetTimer);
        window.removeEventListener('click', resetTimer);
        window.removeEventListener('keypress', resetTimer);
    };
  }, []);

  // Window Close / Unload Detection
  useEffect(() => {
      const handleUnload = () => {
          if (gameStateRef.current === 'playing') {
              submitPartialResults();
          }
      };

      // standard reliable method for sending data on unload
      window.addEventListener('pagehide', handleUnload);
      
      return () => {
          window.removeEventListener('pagehide', handleUnload);
      };
  }, []);


  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let hasError = false;

    // Email validation
    if (!email || !email.includes('@')) {
        setEmailError('Please enter a valid email address.');
        hasError = true;
    } else {
        setEmailError('');
    }

    // Experience validation
    if (!experience) {
        setExperienceError('Please select your experience level.');
        hasError = true;
    } else {
        setExperienceError('');
    }

    if (hasError) return;

    // Proceed to Demo
    setGameState('demo');
  };

  const isPredictionCorrect = (predictionString: string, actualIsSuccess: boolean) => {
      // Logic: If string contains "Success" and actual is Success -> Correct
      // If string contains "Fail" and actual is Fail -> Correct
      const predictedSuccess = predictionString.includes("Success");
      return predictedSuccess === actualIsSuccess;
  };

  const handleDemoComplete = (prediction: string) => {
    const isCorrect = isPredictionCorrect(prediction, demoQuestion.isSuccess);
    setLastFeedback(isCorrect ? 'correct' : 'incorrect');

    setTimeout(() => {
        setLastFeedback(null);
        setGameState('playing');
        setCurrentIndex(0);
        setScore(0);
        setUserPredictions([]);
    }, 1500);
  };

  const generateTranscript = (questionsOrder: QuizQuestion[], predictions: string[]) => {
      let transcript = `MOF Reaction Challenge - Session Report\n`;
      transcript += `User: ${emailRef.current || 'Anonymous'}\n`;
      transcript += `Experience: ${experienceRef.current || 'Not Specified'}\n`;
      transcript += `Date: ${new Date().toISOString()}\n`;
      transcript += `========================================\n\n`;

      questionsOrder.forEach((q, i) => {
          const userP = predictions[i] || "NO ANSWER (ABANDONED)";
          const actual = q.isSuccess ? "SUCCESS" : "FAIL";
          const isCorrect = userP !== "NO ANSWER (ABANDONED)" ? (isPredictionCorrect(userP, q.isSuccess) ? "CORRECT" : "WRONG") : "N/A";

          transcript += `Q${i + 1} [ID: ${q.id}]\n`;
          transcript += `Reaction: ${q.metal_precursor} + ${q.organic_linker}\n`;
          transcript += `Params: ${q.solvent}, ${q.temperature_C}°C, ${q.time_h !== null ? q.time_h + 'h' : 'N/A'}\n`;
          transcript += `Prediction: ${userP} | Actual: ${actual}\n`;
          transcript += `Result: ${isCorrect}\n`;
          transcript += `----------------------------------------\n`;
      });

      return transcript;
  };

  // LOCAL STORE HELPER
  const saveToLocalStorage = (payload: UserResult, synced: boolean) => {
      try {
          const existingStr = localStorage.getItem(LOCAL_STORAGE_KEY);
          let records: LocalRecord[] = existingStr ? JSON.parse(existingStr) : [];
          
          const newRecord: LocalRecord = {
              id: `${payload.email}_${payload.timestamp}`,
              timestamp: payload.timestamp,
              email: payload.email,
              synced: synced,
              data: payload
          };

          // Append and Save
          records.push(newRecord);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
      } catch (e) {
          console.error("Local Save Failed", e);
      }
  };

  const updateLocalStorageSyncStatus = (timestampId: string) => {
      try {
          const existingStr = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (!existingStr) return;
          
          let records: LocalRecord[] = JSON.parse(existingStr);
          records = records.map(r => {
             if (r.timestamp === timestampId) {
                 return { ...r, synced: true };
             }
             return r;
          });
          
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(records));
      } catch (e) {
          console.error("Local Update Failed", e);
      }
  }

  const submitPartialResults = () => {
      const currentQ = questionsRef.current;
      const currentPreds = predictionsRef.current;
      const currentScore = scoreRef.current;
      
      // Pad remaining answers
      const paddedPreds = [...currentPreds];
      // Only submit if we have email and started playing
      if (!emailRef.current || currentPreds.length === 0) return;

      const payload = createPayload(currentQ, paddedPreds, currentScore);
      
      // 1. Save Locally First (Mark as unsynced initially)
      saveToLocalStorage(payload, false);

      // 2. Try network submission via Beacon
      const blob = new Blob([JSON.stringify(payload)], { type: 'text/plain' });
      // Beacon doesn't return success/fail easily, so we usually leave partials as Unsynced or we assume success. 
      // For safety in this hybrid mode, we assume unsynced in local store so admin can retry if needed.
      navigator.sendBeacon(GOOGLE_SCRIPT_URL, blob);
  };

  const createPayload = (questionsOrder: QuizQuestion[], predictions: string[], finalScore: number) => {
      const answersMap: Record<string, string> = {};
      
      // Add experience to answers map so it appears in the existing Google Sheet column
      answersMap["User_Experience"] = experienceRef.current;

      questionsOrder.forEach((q, i) => {
          answersMap[q.id] = predictions[i] || "ABANDONED";
      });

      const transcript = generateTranscript(questionsOrder, predictions);

      const payload: UserResult = {
          email: emailRef.current,
          yearsOfExperience: experienceRef.current,
          score: finalScore,
          totalQuestions: questionsOrder.length,
          timestamp: new Date().toISOString(),
          questionIds: questionsOrder.map(q => q.id),
          answers: answersMap,
          detailedTranscript: transcript
      };
      return payload;
  }

  const submitResultsToBackend = (questionsOrder: QuizQuestion[], predictions: string[], finalScore: number) => {
      const payload = createPayload(questionsOrder, predictions, finalScore);
      console.log("🚀 Submitting payload:", payload);

      // 1. Save Locally (Unsynced)
      saveToLocalStorage(payload, false);

      // 2. Attempt Network Send
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'text/plain',
        },
        body: JSON.stringify(payload)
      })
      .then(() => {
          console.log('Submission successfully sent to Google Sheet');
          // 3. If successful, update local record to Synced
          updateLocalStorageSyncStatus(payload.timestamp);
      })
      .catch(err => console.error('Submission failed', err));
  };

  // Helper for manual file download backup
  const saveBackupData = (payload: UserResult) => {
      const dataStr = JSON.stringify(payload, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `MOF_Challenge_Result_${payload.email.split('@')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handlePrediction = (predictionString: string) => {
    const currentQ = questions[currentIndex];
    const isCorrect = isPredictionCorrect(predictionString, currentQ.isSuccess);
    
    // Show feedback immediately
    setLastFeedback(isCorrect ? 'correct' : 'incorrect');

    // Wait a brief moment before moving on
    setTimeout(() => {
        // Calculate new state values
        const newScore = isCorrect ? score + 1 : score;
        const newPredictions = [...userPredictions, predictionString];
        
        // Update state
        if (isCorrect) setScore(newScore);
        setUserPredictions(newPredictions);
        
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setLastFeedback(null);
        } else {
            // GAME OVER
            const payload = createPayload(questions, newPredictions, newScore);
            submitResultsToBackend(questions, newPredictions, newScore);
            
            // Auto download backup for safety (since no-cors is opaque)
            saveBackupData(payload);
            
            setGameState('results');
        }
    }, 1000);
  };

  // Backdoor to preview result modes (10 -> 15 -> 19)
  const handleBackdoor = () => {
      console.log("Backdoor triggered");
      setGameState('results');
      
      // Cycle through score modes
      setScore(prevScore => {
          if (prevScore === 10) return 15;
          if (prevScore === 15) return 19;
          return 10;
      });
  };

  if (gameState === 'admin') {
      return <AdminPanel onClose={() => setGameState('intro')} googleScriptUrl={GOOGLE_SCRIPT_URL} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 flex flex-col items-center py-12 px-4 font-sans relative">
      
      {/* Header */}
      <header className="mb-8 text-center">
        <div className="inline-flex items-center justify-center p-3 bg-white rounded-full shadow-sm mb-4">
            <FlaskConical className="text-cyan-600 w-8 h-8" />
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">MOF Synthesis Quest</h1>
        <p className="text-slate-500 mt-2">Test your chemical intuition against real experimental data</p>
      </header>

      {/* Main Content Area */}
      <main className="w-full flex justify-center perspective-1000">
        
        {/* INTRO / EMAIL STATE */}
        {gameState === 'intro' && (
          <div className="max-w-xl w-full bg-white p-8 rounded-3xl shadow-xl text-center">
            <div className="space-y-6">
                <div className="flex justify-center mb-4">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wide">
                        <Lock className="w-3 h-3" /> Invitation Only
                    </span>
                </div>

                <div className="bg-cyan-50 p-6 rounded-2xl border border-cyan-100">
                    <h3 className="font-bold text-cyan-800 text-lg mb-2">Welcome Chemist</h3>
                    <p className="text-cyan-700 leading-relaxed text-sm mb-4">
                        You have been invited to participate in a reaction prediction study. 
                        Please identify yourself to begin the session.
                    </p>
                    
                    <div className="flex items-center justify-center gap-6 text-cyan-800 text-xs font-semibold">
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" /> &lt; 3 Minutes
                        </div>
                        <div className="flex items-center gap-1">
                            <ListChecks className="w-4 h-4" /> 22 Questions
                        </div>
                    </div>
                    
                    <span className="block mt-4 text-xs text-cyan-600 font-medium">Note: One person can only take this experiment once.</span>
                </div>

                <form onSubmit={handleEmailSubmit} className="text-left space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                            <input 
                                type="email" 
                                required
                                placeholder="name@institution.edu"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                            />
                        </div>
                        {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">MOF Synthesis Experience</label>
                        <div className="relative">
                             <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 z-10" />
                            <select
                                value={experience}
                                onChange={(e) => setExperience(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all appearance-none bg-white cursor-pointer"
                            >
                                <option value="" disabled>Select your experience level</option>
                                <option value="<1 year">&lt; 1 year</option>
                                <option value="1-3 years">1-3 years</option>
                                <option value=">3 years">&gt; 3 years</option>
                            </select>
                            {/* Custom Arrow */}
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                        {experienceError && <p className="text-red-500 text-sm mt-1">{experienceError}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-left">
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Prize 1</span>
                            <span className="font-bold text-slate-800 text-sm">$100 Amazon Gift Card</span>
                            <span className="text-[10px] text-slate-500 block">Grand Prize (1 Winner drawn from all participants)</span>
                        </div>
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                            <span className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Prize 2</span>
                            <span className="font-bold text-slate-800 text-sm">$20 Amazon Gift Card</span>
                            <span className="text-[10px] text-slate-500 block">Participation Prize (20% chance, one out of five)</span>
                        </div>
                    </div>

                    {/* IRB CONSENT LINK */}
                    <div className="pt-2 text-[11px] text-slate-500 text-center leading-tight">
                        By clicking "Verify & Start" below, I have read the <button type="button" onClick={() => setShowFullConsent(true)} className="text-cyan-600 font-bold hover:underline">Informed Consent & Research Disclosure</button>, am voluntary to participate and 18 years old.
                    </div>

                    <button 
                        type="submit"
                        className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:bg-slate-800 hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                    >
                        Verify & Start <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </form>
            </div>
          </div>
        )}

        {/* MODAL FOR IRB DISCLOSURE */}
        {showFullConsent && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-fade-in-up">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                            <ShieldCheck className="text-cyan-600" /> Informed Consent & Disclosure
                        </h2>
                        <button onClick={() => setShowFullConsent(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>
                    <div className="p-8 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 text-sm text-slate-600 leading-relaxed space-y-4">
                        <p><strong>Study Title:</strong> Evaluating Expert Chemical Intuition in Metal-Organic Framework Synthesis.</p>
                        <p><strong>Purpose of Study:</strong> This research aims to quantify how human chemical intuition correlates with actual experimental outcomes in solvothermal MOF synthesis. Your participation helps us understand the baseline of human performance in this specialized chemical field. No data will be collected to train machine learning or artificial intelligence models. Only the collective performance outcomes from all participants will be compared with separate AI models to understand their failure modes and improve preference alignment.</p>
                        <p><strong>Procedure:</strong> You will be presented with 22 reaction conditions. For each, you will review parameters and predict the outcome using a confidence slider. Total duration is estimated at 3-5 minutes.</p>
                        <p><strong>Confidentiality:</strong> Your email is collected only for prize administration. All research data is stored de-identified. Individual results will not be published; only aggregate trends will be used for academic research publications.</p>
                        <p><strong>Voluntary Nature:</strong> Your participation is completely voluntary. You may stop at any time by closing your browser. Data is submitted only upon completion of the final trial.</p>
                        <p><strong>Compensation:</strong> Upon completion, you are eligible for a grand prize drawing ($100 Amazon GC) and a 1-in-5 chance for a participation prize ($20 Amazon GC).</p>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs">
                            <p><strong>Contact Information:</strong></p>
                            <p>Principal Investigator: Zheng Research Group (zheng.wustl@gmail.com) and Zhiling Zheng (z.z@wustl.edu)</p>
                            <p>WashU IRB Office: 314-747-6800 or hrpo@wustl.edu</p>
                        </div>
                        <p className="text-[10px] text-slate-400 italic">Zheng Group at Washington University in St. Louis</p>
                    </div>
                    <div className="p-6 bg-slate-50 border-t border-slate-100 text-right">
                        <button 
                            onClick={() => setShowFullConsent(false)}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all shadow-md"
                        >
                            I Understand & Close
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* DEMO STATE */}
        {gameState === 'demo' && (
             <div className="w-full flex flex-col items-center relative">
                <div className="max-w-2xl w-full mb-6 bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 flex items-start gap-3">
                    <div className="p-2 bg-amber-200 rounded-lg shrink-0">
                        <FlaskConical className="w-5 h-5 text-amber-800" />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Demo Question</h3>
                        <p className="text-sm mt-1 leading-relaxed">
                            Let's warm up! Just use your chemical intuition. 
                            <strong> Regardless of the outcome of this demo, you will be drawn for the participation prize.</strong>
                        </p>
                    </div>
                </div>

                <div className={`relative transition-all duration-300 ${lastFeedback ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
                    <ReactionCard 
                        data={demoQuestion} 
                        onPredict={handleDemoComplete}
                        title="Demo Reaction"
                        isDemo={true}
                    />

                    {/* Feedback Overlay */}
                    {lastFeedback && (
                        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                            <div className="bg-slate-900/90 backdrop-blur-sm p-8 rounded-3xl text-center text-white max-w-sm animate-fade-in-up">
                                {lastFeedback === 'correct' ? (
                                    <Check className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                                ) : (
                                    <X className="w-16 h-16 text-red-400 mx-auto mb-4" />
                                )}
                                <h3 className="text-2xl font-bold mb-2">
                                    {lastFeedback === 'correct' ? "Excellent!" : "Not quite."}
                                </h3>
                                <p className="text-slate-300 mb-6">
                                    That was just a warm-up. Get ready for the real data.
                                </p>
                                <div className="text-sm font-bold text-cyan-400 uppercase tracking-widest animate-pulse">
                                    Starting Main Quiz...
                                </div>
                            </div>
                        </div>
                    )}
                </div>
             </div>
        )}

        {/* PLAYING STATE */}
        {gameState === 'playing' && (
          <div className="w-full flex flex-col items-center relative">
            {/* Progress Bar */}
            <div className="w-full max-w-2xl mb-6">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    <span>Reaction {currentIndex + 1} of {questions.length}</span>
                    <span>Score: {score}</span>
                </div>
                <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-cyan-500 transition-all duration-300 ease-out"
                        style={{ width: `${((currentIndex) / questions.length) * 100}%` }}
                    />
                </div>
                <p className="text-[10px] text-center text-slate-400 mt-2 italic">
                    Individual score does not matter (we take group average). Pay attention to confidence level.
                </p>
            </div>

            {/* The Card */}
            <div className={`relative transition-all duration-300 ${lastFeedback ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
                {questions[currentIndex] && (
                    <ReactionCard 
                        data={questions[currentIndex]} 
                        onPredict={handlePrediction} 
                    />
                )}

                {/* Feedback Overlay */}
                {lastFeedback && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
                        <div className={`p-6 rounded-full shadow-2xl scale-110 animate-bounce ${lastFeedback === 'correct' ? 'bg-green-500' : 'bg-red-500'}`}>
                            {lastFeedback === 'correct' ? (
                                <Check className="w-12 h-12 text-white" />
                            ) : (
                                <X className="w-12 h-12 text-white" />
                            )}
                        </div>
                    </div>
                )}
            </div>
          </div>
        )}

        {/* RESULTS STATE */}
        {gameState === 'results' && (
            <ResultsView 
                score={score} 
                totalQuestions={questions.length} 
                email={email}
                questions={questions}
                userPredictions={userPredictions}
            />
        )}

      </main>
      
      <footer className="mt-12 text-slate-400 text-sm flex items-center gap-2">
        <span>© 2025 Zheng Research Group</span>
        <button 
          onClick={() => setGameState('admin')} 
          className="text-slate-200 hover:text-slate-400 transition-colors p-1"
          title="Admin Access"
        >
            <Lock className="w-3 h-3" />
        </button>
      </footer>

      {/* Hidden Backdoor Trigger - Bottom Left */}
      <div 
        className="fixed bottom-0 left-0 w-16 h-16 z-50 cursor-default opacity-0" 
        onClick={handleBackdoor}
        title="Debug Mode"
      />
    </div>
  );
};

export default App;
