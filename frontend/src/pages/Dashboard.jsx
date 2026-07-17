import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { getDashboardData } from "@/lib/progress";
import { Calendar } from "@/components/ui/calendar";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Flame, BookOpen, Clock, Trophy, Play, CheckCircle2, ListChecks, Video, FileText, ClipboardList } from "lucide-react";

function StatCard({ icon: Icon, label, value, accent, sublabel }) {
  return (
    <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 bento-shadow">
      <div className="flex items-center justify-between">
        <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">{label}</div>
        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${accent}15` }}>
          <Icon className="w-4 h-4" style={{ color: accent }} strokeWidth={1.8} />
        </div>
      </div>
      <div className="font-display text-4xl font-bold mt-4">{value}</div>
      {sublabel && <div className="text-xs text-[#78716C] mt-1">{sublabel}</div>}
    </div>
  );
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    // No login/backend involved — progress is read straight from this browser's
    // localStorage (see src/lib/progress.js). Chapter catalog still comes from
    // the API so "continue learning" can show real chapter details.
    api
      .get("/catalog/chapters")
      .then((r) => setData(getDashboardData(r.data)))
      .catch(() => setData(getDashboardData([])));
  }, []);

  if (!data) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#7B1E1E] border-t-transparent animate-spin" />
      </div>
    );
  }

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  })();

  const { stats, continue_learning, daily_goal, achievements, leaderboard, recent_activity, weekly_minutes } = data;
  const maxMin = Math.max(...weekly_minutes, 1);
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="max-w-7xl mx-auto px-6 py-10" data-testid="dashboard-page">
      {/* Greeting */}
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Your dashboard</div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mt-2">
            {greeting}, <span className="text-[#7B1E1E]">{data.user?.name?.split(" ")[0] || "Learner"}</span> <span className="inline-block">👋</span>
          </h1>
          <p className="text-[#78716C] mt-2">Pick up where you left off — your streak is on fire.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#FDE68A]/60 border border-[#F5B400]/40 rounded-full px-4 py-2">
          <Flame className="w-4 h-4 text-[#7B1E1E]" />
          <span className="font-mono-em text-sm">{stats.current_streak}-day streak</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10" data-testid="stats-row">
        <StatCard icon={BookOpen} label="Chapters" value={stats.chapters_completed} accent="#7B1E1E" sublabel="completed" />
        <StatCard icon={Clock} label="Hours" value={stats.hours_studied} accent="#B45309" sublabel="studied this month" />
        <StatCard icon={ClipboardList} label="Tests" value={stats.tests_taken} accent="#0F766E" sublabel="taken" />
        <StatCard icon={Flame} label="Streak" value={`${stats.current_streak}d`} accent="#F5B400" sublabel="keep it going" />
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Continue learning + daily goal */}
        <div className="md:col-span-8 space-y-6">
          {continue_learning ? (
            <Link to={`/chapter/${continue_learning.id}`} data-testid="continue-learning-card" className="block bg-white rounded-[20px] border border-[#E7E5E4] overflow-hidden bento-shadow hover:-translate-y-0.5 transition-transform">
              <div className="grid md:grid-cols-12">
                <div className="md:col-span-5 h-48 md:h-auto relative">
                  <img src={continue_learning.thumbnail} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="md:col-span-7 p-6 flex flex-col justify-between">
                  <div>
                    <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Continue learning</div>
                    <h3 className="font-display text-2xl font-bold mt-2">{continue_learning.name}</h3>
                    <Badge variant="outline" className="mt-2 font-mono-em text-[10px]">{continue_learning.difficulty} · {continue_learning.duration}</Badge>
                  </div>
                  <div className="mt-6">
                    <Progress value={continue_learning.progress} className="h-1.5 mb-3" />
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#78716C]">{continue_learning.progress}% complete</span>
                      <span className="inline-flex items-center gap-2 text-[#7B1E1E] font-semibold"><Play className="w-4 h-4"/> Resume</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ) : (
            <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-8 bento-shadow">
              <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Get started</div>
              <h3 className="font-display text-2xl font-bold mt-2">Pick a chapter and begin your journey.</h3>
              <Link to="/search" className="inline-block mt-4 text-[#7B1E1E] font-semibold">Browse chapters →</Link>
            </div>
          )}

          {/* Daily goal */}
          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 bento-shadow" data-testid="daily-goal-card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Daily Goal</div>
                <h3 className="font-display text-xl font-bold mt-1">Today&apos;s checklist</h3>
              </div>
              <ListChecks className="w-5 h-5 text-[#7B1E1E]" />
            </div>
            <div className="space-y-4">
              {[
                { label: `Study ${daily_goal.chapters.target} chapter${daily_goal.chapters.target > 1 ? "s" : ""}`, done: daily_goal.chapters.done, target: daily_goal.chapters.target },
                { label: `Complete ${daily_goal.quiz.target} quiz`, done: daily_goal.quiz.done, target: daily_goal.quiz.target },
                { label: `Watch ${daily_goal.lecture.target} lecture`, done: daily_goal.lecture.done, target: daily_goal.lecture.target },
              ].map((g) => {
                const pct = Math.min(100, (g.done / g.target) * 100);
                const complete = g.done >= g.target;
                return (
                  <div key={g.label} className="flex items-center gap-4">
                    <CheckCircle2 className={`w-5 h-5 ${complete ? "text-[#7B1E1E]" : "text-[#E7E5E4]"}`} />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm">{g.label}</span>
                        <span className="text-xs font-mono-em text-[#78716C]">{g.done}/{g.target}</span>
                      </div>
                      <div className="h-1.5 bg-[#F5F5F4] rounded-full overflow-hidden">
                        <div className="h-full bg-[#F5B400] rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Weekly study time */}
          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 bento-shadow">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Performance</div>
                <h3 className="font-display text-xl font-bold mt-1">Weekly study time</h3>
              </div>
              <div className="text-sm text-[#78716C]">{weekly_minutes.reduce((a, b) => a + b, 0)} min total</div>
            </div>
            <div className="flex items-end gap-3 h-32">
              {weekly_minutes.map((m, i) => (
                <div key={`day-${days[i]}-${i}`} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-[#FDE68A] rounded-t-lg relative overflow-hidden" style={{ height: `${(m / maxMin) * 100}%`, minHeight: 8 }}>
                    <div className="absolute inset-x-0 bottom-0 bg-[#7B1E1E] rounded-t-lg" style={{ height: `${Math.min(100, (m / maxMin) * 80)}%` }} />
                  </div>
                  <div className="text-xs font-mono-em text-[#78716C]">{days[i]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Calm Study Music */}
          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 bento-shadow" data-testid="study-music-card">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Focus Mode</div>
                <h3 className="font-display text-xl font-bold mt-1">Calm Study Music</h3>
              </div>
            </div>
            <audio controls loop className="w-full" data-testid="study-music-player">
              {/* TODO: replace with a working link once the MP3 is compressed under ~50MB.
                  Drive's /uc?export=download intercepts large files with a warning page
                  instead of streaming raw audio, which breaks this player. */}
              <source src="https://drive.google.com/uc?export=download&id=1hZd972sXMN1e0a0iMhHWG8DFlRuj90Ax" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <p className="text-xs text-[#78716C] mt-3">Play calm background music while you study — pause anytime.</p>
          </div>
        </div>

        {/* Right column: Calendar, Leaderboard, Achievements, Recent */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-5 bento-shadow" data-testid="study-planner">
            <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C] mb-3">Study Planner</div>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md" />
            <div className="mt-3 space-y-2">
              <div className="text-xs font-mono-em uppercase tracking-[0.15em] text-[#78716C]">Today&apos;s tasks</div>
              <div className="flex items-center gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-[#7B1E1E]" /> Read Light – Reflection</div>
              <div className="flex items-center gap-2 text-sm"><div className="w-1.5 h-1.5 rounded-full bg-[#F5B400]" /> Quadratic Eq. quiz</div>
            </div>
          </div>

          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 bento-shadow" data-testid="leaderboard">
            <div className="flex items-center justify-between mb-4">
              <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C]">Leaderboard</div>
              <Trophy className="w-4 h-4 text-[#F5B400]" />
            </div>
            <div className="space-y-3">
              {leaderboard.length === 0 ? (
                <div className="text-sm text-[#78716C]">No leaderboard data yet.</div>
              ) : (
                leaderboard.map((l) => (
                  <div key={l.rank} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-mono-em font-bold ${l.rank <= 3 ? "bg-[#F5B400] text-[#292524]" : "bg-[#F5F5F4] text-[#78716C]"}`}>{l.rank}</div>
                    <div className="w-8 h-8 rounded-full bg-[#7B1E1E] text-white flex items-center justify-center text-sm">{l.avatar}</div>
                    <div className="flex-1 text-sm">{l.name}</div>
                    <div className="font-mono-em text-xs text-[#78716C]">{l.points}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 bento-shadow" data-testid="achievements-card">
            <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C] mb-4">Achievements</div>
            <div className="grid grid-cols-2 gap-3">
              {achievements.length === 0 ? (
                <div className="text-sm text-[#78716C] col-span-2">Keep studying to unlock badges.</div>
              ) : (
                achievements.map((a) => (
                  <div key={a.id} className="bg-[#FAF9F6] rounded-2xl p-4 text-center">
                    <div className="text-3xl">{a.icon}</div>
                    <div className="font-display font-semibold text-sm mt-2">{a.name}</div>
                    <div className="text-[10px] text-[#78716C] mt-1">{a.description}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white rounded-[20px] border border-[#E7E5E4] p-6 bento-shadow" data-testid="recent-activity">
            <div className="text-xs uppercase tracking-[0.2em] font-mono-em text-[#78716C] mb-4">Recent Activity</div>
            <div className="space-y-3">
              {recent_activity.length === 0 ? (
                <div className="text-sm text-[#78716C]">Nothing yet — go study a chapter!</div>
              ) : (
                recent_activity.map((r, idx) => {
                  const Icon = r.type === "video" ? Video : r.type === "notes" ? FileText : ClipboardList;
                  return (
                    <div key={`${r.type}-${r.title}-${idx}`} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] flex items-center justify-center"><Icon className="w-4 h-4 text-[#7B1E1E]" strokeWidth={1.5} /></div>
                      <div className="flex-1 text-sm">{r.title}</div>
                      <div className="text-xs text-[#78716C] font-mono-em">{r.time}</div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

  
      
              
