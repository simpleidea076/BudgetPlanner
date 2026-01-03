import { Trophy, Star, Flame, TrendingUp, Lock } from 'lucide-react';
import { Achievement } from '../App';

type AchievementsPanelProps = {
  achievements: Achievement[];
  level: number;
  totalPoints: number;
  streak: number;
};

export function AchievementsPanel({ achievements, level, totalPoints, streak }: AchievementsPanelProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const progressToNextLevel = (totalPoints % 500) / 500 * 100;

  return (
    <div className="w-80 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-2xl sticky top-6">
      {/* Level & Points */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-400 mb-3 shadow-lg shadow-amber-500/30 animate-bounce-slow">
          <Trophy className="w-8 h-8 text-slate-900" />
        </div>
        <h2 className="text-slate-100 mb-1">Level {level}</h2>
        <p className="text-slate-400 text-sm">{totalPoints} Points</p>
        
        {/* Progress to Next Level */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>Next Level</span>
            <span>{Math.floor(progressToNextLevel)}%</span>
          </div>
          <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-400 transition-all duration-500"
              style={{ width: `${progressToNextLevel}%` }}
            />
          </div>
        </div>
      </div>

      {/* Streak */}
      <div className="bg-gradient-to-r from-orange-900/20 to-red-900/20 border border-orange-500/30 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-400 animate-pulse" />
            <span className="text-slate-300">Daily Streak</span>
          </div>
          <span className="text-orange-400">{streak} days</span>
        </div>
      </div>

      {/* Achievements */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-slate-200 flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            Achievements
          </h3>
          <span className="text-slate-400 text-sm">
            {unlockedCount}/{achievements.length}
          </span>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto custom-scrollbar">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-xl p-3 transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-r from-emerald-900/20 to-cyan-900/20 border border-emerald-500/30 animate-scale-in'
                  : 'bg-slate-900/40 border border-slate-700/50 opacity-60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`text-2xl ${achievement.unlocked ? 'animate-bounce-slow' : 'grayscale'}`}>
                  {achievement.unlocked ? achievement.icon : '🔒'}
                </div>
                <div className="flex-1">
                  <h4 className={`text-sm ${achievement.unlocked ? 'text-slate-100' : 'text-slate-400'}`}>
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {achievement.description}
                  </p>
                  {achievement.unlocked && achievement.unlockedAt && (
                    <p className="text-xs text-emerald-400 mt-1">
                      Unlocked! 🎉
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-6 p-3 bg-gradient-to-r from-purple-900/20 to-pink-900/20 border border-purple-500/30 rounded-xl">
        <p className="text-purple-400 text-xs text-center">
          {unlockedCount === 0 && "🎯 Start your journey to financial freedom!"}
          {unlockedCount > 0 && unlockedCount < 3 && "🔥 You're on fire! Keep going!"}
          {unlockedCount >= 3 && unlockedCount < 6 && "⭐ Amazing progress! You're a natural!"}
          {unlockedCount >= 6 && unlockedCount < achievements.length && "👑 Almost there! Just a few more!"}
          {unlockedCount === achievements.length && "🏆 Legend! You've mastered budgeting!"}
        </p>
      </div>
    </div>
  );
}
