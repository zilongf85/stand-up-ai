import React from 'react';
import { ComedianProfile } from '../types';
import { PRESET_COMEDIANS } from '../constants';

interface ProfileSelectorProps {
  selectedId: string;
  onSelect: (id: string) => void;
  customName: string;
  setCustomName: (name: string) => void;
}

export const ProfileSelector: React.FC<ProfileSelectorProps> = ({ 
  selectedId, 
  onSelect, 
  customName, 
  setCustomName 
}) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm uppercase tracking-wider text-slate-400 font-bold mb-2">选择演员风格</h3>
      <div className="grid grid-cols-1 gap-3">
        {PRESET_COMEDIANS.map((profile) => {
          const isSelected = selectedId === profile.id;
          return (
            <div 
              key={profile.id}
              onClick={() => onSelect(profile.id)}
              className={`p-3 rounded-xl cursor-pointer transition-all border ${
                isSelected 
                  ? 'bg-slate-800 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                  : 'bg-slate-900 border-slate-700 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${profile.avatarColor} text-white font-bold`}>
                  {profile.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-slate-200">{profile.name}</div>
                  <div className="text-xs text-slate-500 line-clamp-1">{profile.styleDescription}</div>
                </div>
              </div>
              
              {/* Custom Input Field expands if Custom is selected */}
              {profile.isCustom && isSelected && (
                <div className="mt-3 pt-3 border-t border-slate-700 animate-fadeIn">
                  <label className="text-xs text-slate-400 block mb-1">你想模仿哪位演员？</label>
                  <input 
                    type="text" 
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="例如：周奇墨, 黄西, Dave Chappelle..."
                    className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1.5 text-sm focus:border-red-500 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <p className="text-[10px] text-emerald-500 mt-1">
                    *AI 将通过 Google 搜索来学习该演员的风格。
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
