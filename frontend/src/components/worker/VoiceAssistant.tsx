import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Mic, MicOff, X, Sparkles, Volume2, MapPin, Briefcase,
  TrendingUp, FolderOpen, Loader2, CheckCircle2,
  TrendingDown, IndianRupee, Globe,
} from "lucide-react";
import { useVoiceAssistant, AssistantState, Lang } from "@/hooks/useVoiceAssistant";

// ─── State config ──────────────────────────────────────────────────────────────
const stateConfig: Record<AssistantState, { label: string; color: string; bg: string }> = {
  idle:       { label: "Tap mic to speak",     color: "text-muted-foreground", bg: "bg-muted/60" },
  listening:  { label: "Listening…",           color: "text-emerald-400",      bg: "bg-emerald-500/15" },
  processing: { label: "Processing…",          color: "text-amber-400",        bg: "bg-amber-500/15" },
  speaking:   { label: "Speaking…",            color: "text-blue-400",         bg: "bg-blue-500/15" },
  error:      { label: "Error – try again",    color: "text-destructive",      bg: "bg-destructive/15" },
};

const commandExamples = [
  { icon: MapPin,     en: "Show nearby work",  hi: "Paas mein kaam",    mr: "Javalik kaam dakha" },
  { icon: Briefcase,  en: "My work",           hi: "Aaj ka kaam",       mr: "Maza kaam" },
  { icon: TrendingUp, en: "My earnings",       hi: "Kitna paisa kamaya", mr: "Maze paise kiti" },
  { icon: FolderOpen, en: "Show projects",     hi: "Projects dikhao",   mr: "Prakalp dakha" },
];

const langLabel: Record<Lang, string> = {
  en: "English",
  hi: "हिंदी",
  mr: "मराठी",
};

// ─── Waveform ─────────────────────────────────────────────────────────────────
function WaveformBars({ active }: { active: boolean }) {
  return (
    <div className="va-waveform">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="va-waveform__bar"
          style={{ animationPlayState: active ? "running" : "paused", animationDelay: `${i * 0.1}s` }}
        />
      ))}
    </div>
  );
}

// ─── Mic button ───────────────────────────────────────────────────────────────
function MicButton({ state, onClick }: { state: AssistantState; onClick: () => void }) {
  const isListening = state === "listening";
  const isBusy = state === "processing" || state === "speaking";
  return (
    <button
      id="va-mic-btn"
      onClick={onClick}
      disabled={isBusy}
      aria-label={isListening ? "Stop listening" : "Start voice assistant"}
      className="va-mic-button"
      data-listening={isListening}
    >
      {isListening && (
        <>
          <span className="va-pulse va-pulse--1" />
          <span className="va-pulse va-pulse--2" />
        </>
      )}
      <span className="va-mic-icon-wrap">
        {isBusy ? <Loader2 size={22} className="animate-spin" /> :
         isListening ? <MicOff size={22} /> : <Mic size={22} />}
      </span>
    </button>
  );
}

// ─── Job mini-card ────────────────────────────────────────────────────────────
function JobMiniCard({
  job, applyingId, onApply,
}: {
  job: { _id: string; title: string; wage: number; location: string; skillRequired?: string };
  applyingId: string | null;
  onApply: (id: string) => void;
}) {
  const isApplying = applyingId === job._id;
  return (
    <div className="va-job-card">
      <div className="va-job-card__info">
        <p className="va-job-card__title">{job.title}</p>
        <p className="va-job-card__meta">
          <MapPin size={10} className="shrink-0" />
          {job.location}
          {job.skillRequired && <> · {job.skillRequired}</>}
        </p>
      </div>
      <div className="va-job-card__right">
        <span className="va-job-card__wage">₹{job.wage.toLocaleString()}</span>
        <button
          className="va-job-card__apply"
          onClick={() => onApply(job._id)}
          disabled={isApplying}
        >
          {isApplying ? <Loader2 size={10} className="animate-spin" /> : <CheckCircle2 size={10} />}
          {isApplying ? "..." : "Apply"}
        </button>
      </div>
    </div>
  );
}

// ─── Earnings mini-summary ────────────────────────────────────────────────────
function EarningsSummary({ data }: { data: { totalEarned: number; totalSpent: number; net: number } }) {
  return (
    <div className="va-earnings">
      <div className="va-earnings__row">
        <div className="va-earnings__item va-earnings__item--earn">
          <TrendingUp size={12} />
          <span className="va-earnings__label">Earned</span>
          <span className="va-earnings__amount">₹{data.totalEarned.toLocaleString()}</span>
        </div>
        <div className="va-earnings__item va-earnings__item--spent">
          <TrendingDown size={12} />
          <span className="va-earnings__label">Spent</span>
          <span className="va-earnings__amount">₹{data.totalSpent.toLocaleString()}</span>
        </div>
        <div className="va-earnings__item va-earnings__item--net">
          <IndianRupee size={12} />
          <span className="va-earnings__label">Net</span>
          <span className="va-earnings__amount">₹{data.net.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function VoiceAssistant() {
  const [open, setOpen] = useState(false);
  const {
    state, transcript, response,
    jobCount, jobList, earnings,
    applyingId, detectedLang,
    applyToJob,
    startListening, stopListening, cancelAll, isSupported,
  } = useVoiceAssistant();

  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [transcript, response, jobList, earnings]);

  const handleClose = () => { cancelAll(); setOpen(false); };
  const handleMic = () => {
    if (!isSupported) return;
    if (state === "listening") stopListening();
    else if (state === "speaking") cancelAll();
    else if (state === "idle" || state === "error") startListening();
  };

  const { label, color, bg } = stateConfig[state];
  const showJobs = jobList.length > 0;
  const showEarnings = earnings !== null;
  const showExamples = !showJobs && !showEarnings && !response;

  return (
    <>
      {/* ── FAB ─────────────────────────────────────────────────────── */}
      <motion.button
        id="va-fab"
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.94 }}
        aria-label="Open AI Voice Assistant"
        title="AI Voice Assistant"
        className="va-fab"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 300 }}
      >
        <span className="va-fab__glow" aria-hidden />
        <span className="va-fab__shimmer" aria-hidden />
        <span className="va-fab__inner">
          <Sparkles size={14} className="va-fab__star" />
          <Mic size={17} />
          <span className="va-fab__label">AI Voice</span>
        </span>
      </motion.button>

      {/* ── Popup ────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Light backdrop — very subtle, no heavy blur */}
            <motion.div
              className="va-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            <motion.div
              id="va-panel"
              role="dialog"
              aria-label="AI Voice Assistant"
              className="va-panel"
              initial={{ opacity: 0, scale: 0.88, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88, y: 24 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              {/* Panel top glow line */}
              <div className="va-panel__topline" aria-hidden />

              {/* Header */}
              <div className="va-panel__header">
                <div className="va-panel__title">
                  <div className="va-panel__title-icon"><Sparkles size={13} /></div>
                  <span>AI Voice Assistant</span>
                  <span className="va-panel__subtitle">EN · हिंदी · मराठी</span>
                </div>
                <button onClick={handleClose} className="va-close" aria-label="Close">
                  <X size={15} />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="va-panel__body" ref={bodyRef}>

                {/* Mic section */}
                <div className="va-mic-section">
                  <MicButton state={state} onClick={handleMic} />
                  <WaveformBars active={state === "listening"} />
                  <div className={`va-status-badge ${bg}`}>
                    <span className={`va-status-dot ${color}`} />
                    <span className={`text-xs font-semibold ${color}`}>{label}</span>
                  </div>
                  {!isSupported && (
                    <p className="va-unsupported">Browser doesn't support voice. Use Chrome.</p>
                  )}
                  {/* Detected language indicator */}
                  {(state === "speaking" || state === "processing") && (
                    <div className="va-lang-pill">
                      <Globe size={10} />
                      {langLabel[detectedLang]}
                    </div>
                  )}
                </div>

                {/* Transcript */}
                <AnimatePresence>
                  {transcript && (
                    <motion.div className="va-transcript"
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <span className="va-transcript__label">You said:</span>
                      <p className="va-transcript__text">"{transcript}"</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Response */}
                <AnimatePresence>
                  {response && (
                    <motion.div className="va-response"
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <div className="va-response__inner">
                        <Volume2 size={13} className="va-response__icon" />
                        <p className="va-response__text">{response}</p>
                      </div>
                      {jobCount !== null && jobList.length === 0 && (
                        <div className="va-job-badge">
                          <MapPin size={11} /> {jobCount} jobs found
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Earnings summary */}
                <AnimatePresence>
                  {showEarnings && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <EarningsSummary data={earnings!} />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Job list */}
                <AnimatePresence>
                  {showJobs && (
                    <motion.div className="va-job-list"
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                      <p className="va-job-list__label">
                        {jobCount !== null ? `${jobCount} jobs found` : "Available jobs"} — tap to apply:
                      </p>
                      {jobList.map(job => (
                        <JobMiniCard
                          key={job._id}
                          job={job}
                          applyingId={applyingId}
                          onApply={applyToJob}
                        />
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Examples (only when nothing else is showing) */}
                {showExamples && (
                  <div className="va-examples">
                    <p className="va-examples__label">Try saying:</p>
                    <div className="va-examples__grid">
                      {commandExamples.map(({ icon: Icon, en, hi, mr }) => (
                        <button
                          key={en}
                          className="va-example-chip"
                          onClick={handleMic}
                          title={`Say: "${en}" or "${hi}" or "${mr}"`}
                        >
                          <Icon size={11} className="shrink-0 text-primary" />
                          <span className="va-example-chip__en">{en}</span>
                          <span className="va-example-chip__hi">· {hi}</span>
                          <span className="va-example-chip__mr">· {mr}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
