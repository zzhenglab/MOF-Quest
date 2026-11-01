import React, { useState } from 'react';
import { QuizQuestion } from '../types';
import { Atom, FlaskConical, Thermometer, Clock, Beaker, Scale, ChevronRight } from 'lucide-react';
import { getLinkerImageUrl } from '../constants';

interface ReactionCardProps {
  data: QuizQuestion;
  onPredict: (prediction: string) => void;
  title?: string;
  isDemo?: boolean;
}

const PREDICTION_OPTIONS = [
  { value: 0, label: "Very Confident Fail", color: "text-red-700", ring: "ring-red-600", bg: "bg-red-600" },
  { value: 1, label: "Likely Fail", color: "text-red-500", ring: "ring-red-400", bg: "bg-red-400" },
  { value: 2, label: "Likely Success", color: "text-emerald-500", ring: "ring-emerald-400", bg: "bg-emerald-400" },
  { value: 3, label: "Very Confident Success", color: "text-emerald-700", ring: "ring-emerald-600", bg: "bg-emerald-600" },
];

export const ReactionCard: React.FC<ReactionCardProps> = ({ data, onPredict, title, isDemo }) => {
  const [sliderValue, setSliderValue] = useState(2);

  const currentOption = PREDICTION_OPTIONS[sliderValue];

  const handleSubmit = () => {
    onPredict(currentOption.label);
  };

  return (
    // Removed overflow-hidden to allow tooltip to pop out
    <div className={`w-full max-w-2xl bg-white rounded-3xl shadow-xl border ${isDemo ? 'border-amber-200' : 'border-slate-100'}`}>
      <div className={`${isDemo ? 'bg-amber-600' : 'bg-slate-900'} p-6 text-white transition-colors rounded-t-3xl`}>
        <h3 className="text-xl font-bold flex items-center gap-2">
          <Atom className={isDemo ? 'text-amber-200' : 'text-cyan-400'} />
          {title || "Reaction Parameters"}
        </h3>
        <p className={`${isDemo ? 'text-amber-100' : 'text-slate-400'} text-sm mt-1`}>
            {isDemo ? "This is a warm-up. Use the slider to indicate your confidence." : "Review conditions and drag the slider to predict."}
        </p>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative">
        
        {/* Precursors */}
        <div className="space-y-4 relative z-20">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Metal Precursor</div>
            <div className="text-lg font-medium text-slate-800 break-words font-mono">{data.metal_precursor}</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 group relative">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-2">
                Organic Linker 
                <span className="text-[10px] normal-case bg-slate-200 px-1.5 rounded text-slate-500">hover for structure</span>
            </div>
            
            <div className="relative">
                <div className="text-lg font-medium text-slate-800 break-words cursor-help underline decoration-dotted decoration-slate-400 underline-offset-4">
                    {data.organic_linker}
                </div>

                {/* Structure Tooltip */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 w-64 p-3 bg-white rounded-2xl shadow-2xl border border-slate-200 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50 pointer-events-none">
                     <div className="w-full h-40 bg-white flex items-center justify-center overflow-hidden rounded-lg mb-1">
                        <img 
                            src={getLinkerImageUrl(data.organic_linker)} 
                            alt="Chemical Structure" 
                            className="max-w-full max-h-full object-contain"
                            onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                const parent = (e.target as HTMLImageElement).parentElement;
                                if (parent) parent.innerText = 'Preview Unavailable';
                            }}
                        />
                    </div>
                    <div className="text-[10px] text-center text-slate-400 font-medium">Structure via NCI/Cactus</div>
                    {/* Arrow */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-white border-b border-r border-slate-200 rotate-45"></div>
                </div>
            </div>
          </div>

           <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Modulator</div>
            <div className="text-lg font-medium text-slate-800 break-words">
              {data.modulator || <span className="text-slate-400 italic">None</span>}
            </div>
          </div>
        </div>

        {/* Conditions */}
        <div className="grid grid-cols-2 gap-4 relative z-10">
          <div className="col-span-2 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <FlaskConical className="w-4 h-4 text-blue-500" />
              <div className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Solvent</div>
            </div>
            <div className="text-md font-medium text-slate-800">{data.solvent}</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl">
             <div className="flex items-center gap-1 mb-1">
              <Thermometer className="w-3 h-3 text-orange-500" />
              <div className="text-[10px] font-bold text-slate-500 uppercase">Temp</div>
            </div>
            <div className="text-lg font-bold text-slate-800">{data.temperature_C}°C</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl">
             <div className="flex items-center gap-1 mb-1">
              <Clock className="w-3 h-3 text-purple-500" />
              <div className="text-[10px] font-bold text-slate-500 uppercase">Time</div>
            </div>
            <div className="text-lg font-bold text-slate-800">
               {data.time_h !== null ? `${data.time_h}h` : <span className="text-slate-400 text-sm italic">N/A</span>}
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl">
             <div className="flex items-center gap-1 mb-1">
              <Beaker className="w-3 h-3 text-green-500" />
              <div className="text-[10px] font-bold text-slate-500 uppercase">Conc.</div>
            </div>
            <div className="text-lg font-bold text-slate-800">{data.metal_concentration_mM} mM</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl">
             <div className="flex items-center gap-1 mb-1">
              <Scale className="w-3 h-3 text-indigo-500" />
              <div className="text-[10px] font-bold text-slate-500 uppercase">M:L Ratio</div>
            </div>
            <div className="text-lg font-bold text-slate-800">{data.M_L_ratio}:1</div>
          </div>
        </div>
      </div>

      <div className="bg-slate-50 p-6 border-t border-slate-100 flex flex-col items-center rounded-b-3xl relative z-10">
        <h4 className="text-sm font-semibold text-slate-500 mb-6 uppercase tracking-widest w-full text-center">Prediction & Confidence</h4>
        
        <div className="w-full max-w-lg px-4">
            {/* Custom Range Slider */}
            <div className="relative h-12 flex items-center justify-center">
                {/* Track */}
                <div className="absolute w-full h-3 bg-gradient-to-r from-red-500 via-slate-200 to-emerald-500 rounded-full opacity-50"></div>
                
                {/* Input */}
                <input 
                    type="range" 
                    min="0" 
                    max="3" 
                    step="1"
                    value={sliderValue}
                    onChange={(e) => setSliderValue(parseInt(e.target.value))}
                    className="w-full absolute z-20 opacity-0 cursor-pointer h-12"
                />

                {/* Visible Thumb / Indicator */}
                <div 
                    className="absolute h-8 w-8 bg-white border-4 rounded-full shadow-lg z-10 transition-all duration-150 pointer-events-none"
                    style={{ 
                        left: `calc(${(sliderValue / 3) * 100}% - 16px)`,
                        borderColor: sliderValue < 2 ? '#ef4444' : '#10b981'
                    }}
                ></div>

                {/* Ticks */}
                <div className="w-full flex justify-between px-1 absolute top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                    <div className="w-2 h-2 rounded-full bg-white/50"></div>
                </div>
            </div>

            {/* Labels */}
            <div className="flex justify-between text-[10px] md:text-xs font-bold text-slate-400 mt-2 uppercase tracking-tight">
                <span className="text-red-600">Conf. Fail</span>
                <span className="text-red-400">Likely Fail</span>
                <span className="text-emerald-400">Likely Success</span>
                <span className="text-emerald-600">Conf. Success</span>
            </div>
        </div>

        {/* Selected Value Display & Confirm Button */}
        <div className="mt-8 w-full max-w-md flex flex-col items-center gap-4">
            <div className={`px-6 py-2 rounded-lg font-bold text-sm uppercase tracking-wide transition-colors ${currentOption.color} bg-white border shadow-sm`}>
                Selected: {currentOption.label}
            </div>

            <button
                onClick={handleSubmit}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg shadow-lg transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 ${currentOption.bg} hover:brightness-110`}
            >
                Confirm Prediction <ChevronRight className="w-5 h-5" />
            </button>
        </div>
      </div>
    </div>
  );
};