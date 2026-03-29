import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import WorkerCard from "@/components/shared/WorkerCard";
import { Search, Loader2, Filter } from "lucide-react";
import api from "@/services/api";
import { getWorkerPortfolio, ExperienceLevel } from "@/services/portfolioService";
import { CONSTRUCTION_SKILLS } from "@/constants/skills";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

type FilterLevel = 'All' | 'Beginner' | 'Intermediate' | 'Pro';

const HireWorkersPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [workers, setWorkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState<FilterLevel>('All');
  const [skillFilter, setSkillFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [portfolioData, setPortfolioData] = useState<Record<string, { count: number; level: ExperienceLevel }>>({});

  useEffect(() => {
    const fetchWorkers = async () => {
      try {
        const res = await api.get('/users/workers');
        const fetchedWorkers = res.data.data || [];
        setWorkers(fetchedWorkers);

        // Fetch portfolio data for all workers in parallel (for experience levels)
        const portfolioResults = await Promise.allSettled(
          fetchedWorkers.map((w: any) => getWorkerPortfolio(w._id))
        );
        const map: Record<string, { count: number; level: ExperienceLevel }> = {};
        fetchedWorkers.forEach((w: any, i: number) => {
          const r = portfolioResults[i];
          if (r.status === 'fulfilled') {
            map[w._id] = {
              count: r.value.count || 0,
              level: r.value.experienceLevel || 'Beginner'
            };
          } else {
            map[w._id] = { count: 0, level: 'Beginner' };
          }
        });
        setPortfolioData(map);
      } catch (err) {
        console.error("Error fetching workers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchWorkers();
  }, []);

  const filteredWorkers = workers.filter(w => {
    const matchSearch = w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.skills?.some((s: string) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const level = portfolioData[w._id]?.level || 'Beginner';
    const matchLevel = filterLevel === 'All' || level === filterLevel;
    const matchSkill = skillFilter === 'All' || w.skills?.includes(skillFilter);
    
    let matchRating = true;
    if (ratingFilter === '4+') matchRating = w.averageRating >= 4;
    else if (ratingFilter === '3+') matchRating = w.averageRating >= 3;
    
    return matchSearch && matchLevel && matchSkill && matchRating;
  });

  const LEVEL_FILTERS: FilterLevel[] = ['All', 'Beginner', 'Intermediate', 'Pro'];
  const LEVEL_STYLES: Record<FilterLevel, string> = {
    All:          'bg-primary text-white',
    Beginner:     'bg-emerald-500 text-white',
    Intermediate: 'bg-blue-500 text-white',
    Pro:          'bg-purple-500 text-white',
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-foreground mb-1" style={{ fontFamily: "var(--font-heading)" }}>
            {t("hireWorkers")}
          </h2>
          <p className="text-muted-foreground text-sm font-medium">Find skilled talent for your construction teams. Click a card to view their portfolio.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-secondary/60 rounded-xl px-4 py-3 w-full md:w-80 border border-border/50 focus-within:border-primary transition-colors">
          <Search size={18} className="text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search by skill or name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent text-sm font-medium outline-none flex-1 placeholder:text-muted-foreground/50" 
          />
        </div>
      </motion.div>

      {/* Comprehensive Filters Bar */}
      <motion.div variants={item} className="flex flex-col sm:flex-row flex-wrap gap-4 items-start sm:items-center bg-secondary/30 p-4 rounded-2xl border border-border/50">
        <div className="flex items-center gap-2 mr-2">
          <Filter size={16} className="text-muted-foreground" />
          <span className="text-sm font-bold text-foreground tracking-tight">Filters</span>
        </div>
        
        <select 
          value={skillFilter} 
          onChange={(e) => setSkillFilter(e.target.value)}
          className="h-9 px-3 w-40 rounded-lg border border-border bg-background text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="All">All Skills</option>
          {CONSTRUCTION_SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        
        <select 
          value={ratingFilter} 
          onChange={(e) => setRatingFilter(e.target.value)}
          className="h-9 px-3 w-36 rounded-lg border border-border bg-background text-xs font-bold focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="All">Any Rating</option>
          <option value="4+">4+ Stars</option>
          <option value="3+">3+ Stars</option>
        </select>

        <div className="w-full sm:w-px sm:h-6 bg-border mx-1 my-2 sm:my-0"></div>
        
        <div className="flex gap-2 flex-wrap">
          {LEVEL_FILTERS.map(level => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                filterLevel === level
                  ? LEVEL_STYLES[level] + ' shadow-md'
                  : 'bg-background border border-border text-muted-foreground hover:text-foreground'
              }`}
            >
              {level === 'Beginner' && '🌱 '}
              {level === 'Intermediate' && '⚒️ '}
              {level === 'Pro' && '🏆 '}
              {level}
            </button>
          ))}
        </div>
      </motion.div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
      ) : (
        <motion.div variants={item} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((w) => {
            const pData = portfolioData[w._id];
            return (
              <WorkerCard 
                key={w._id} 
                name={w.name}
                skill={w.skills?.[0] || "General Worker"}
                rating={w.averageRating || 0}
                jobs={w.completedJobs || 0}
                badges={w.badges?.map((b: string) => ({ label: b, variant: "topRated" })) || []}
                available={w.availability !== false}
                avatar={w.profileImage || "👷"}
                score={w.score}
                rank={w.rank}
                hype={w.hype}
                experienceLevel={pData?.level}
                portfolioCount={pData?.count}
                onNavigate={() => navigate(`/dashboard/contractor/workers/${w._id}`)}
              />
            );
          })}
          {filteredWorkers.length === 0 && (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No workers found matching your search
              {filterLevel !== 'All' ? ` in the ${filterLevel} level` : ''}.
            </div>
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default HireWorkersPage;
