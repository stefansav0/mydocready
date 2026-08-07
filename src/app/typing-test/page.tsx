"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Keyboard, Timer, RotateCcw, Trophy, Target, 
  Activity, HelpCircle, CheckCircle2, ChevronLeft,
  Volume2, VolumeX, Zap, Brain, Flame, BookOpen, PenTool
} from "lucide-react";

// ============================================
// RANDOM WORD POOLS (For Speed Practice)
// ============================================
const WORD_POOLS = {
  easy: [
    "the", "be", "to", "of", "and", "a", "in", "it", "is", "we", "cat", "dog", "run", "sun", "hot",
    "box", "top", "day", "out", "now", "see", "two", "way", "who", "boy", "did", "let", "put", "say"
  ],
  medium: [
    "people", "history", "knowledge", "world", "information", "system", "computer", "music", "reading",
    "method", "understanding", "theory", "government", "health", "science", "library", "nature", "fact",
    "product", "idea", "temperature", "investment", "society", "activity", "story", "industry", "media"
  ],
  hard: [
    "Philosophy,", "Exaggerate!", "1984.", "O'Clock", "Rhythm;", "Unprecedented", "Hypothesis?", 
    "Supercalifragilistic", "It's", "Wait-for-it", "Over-the-counter", "$100.00", "Algorithm:", 
    "Bureaucracy!", "Connoisseur", "Entrepreneurship", "Incomprehensible", "Maneuver", "Onomatopoeia"
  ]
};

// ============================================
// GUIDED LESSONS (Long Paragraphs)
// ============================================
const GUIDED_LESSONS = {
  easy: [
    {
      id: "e1",
      title: "The Morning Walk",
      content: "The sun is up and the sky is blue. We go out to walk the dog in the park. The grass is very green and the wind is soft. It is a good day to run and play. The dog is happy to see his friends. We throw a ball and he brings it back. I am glad we came here today. It makes me feel good."
    },
    {
      id: "e2",
      title: "Making Breakfast",
      content: "I wake up early in the morning and go to the kitchen. I take out a pan to cook an egg. I put some bread in the toaster. I pour a tall glass of cold milk. When the food is hot, I sit down at the table to eat. It tastes great. Now I have energy to start my long day at work."
    }
  ],
  medium: [
    {
      id: "m1",
      title: "The Industrial Revolution",
      content: "The Industrial Revolution was a period of global transition of the human economy towards more widespread, efficient and stable manufacturing processes. It began in Great Britain and spread to continental Europe and the United States. This transition included going from hand production methods to machines, new chemical manufacturing and iron production processes, and the increasing use of steam power."
    },
    {
      id: "m2",
      title: "Ocean Exploration",
      content: "The ocean covers more than seventy percent of the surface of our planet. It is hard to imagine, but we have mapped more of the surface of the moon than we have of the ocean floor. Deep sea exploration requires advanced technology to withstand extreme pressure, freezing temperatures, and total darkness. Scientists continue to discover strange new species hidden in the deep trenches."
    }
  ],
  hard: [
    {
      id: "h1",
      title: "The Great Gatsby (Excerpt)",
      content: "In my younger and more vulnerable years my father gave me some advice that I've been turning over in my mind ever since. 'Whenever you feel like criticizing any one,' he told me, 'just remember that all the people in this world haven't had the advantages that you've had.' He didn't say any more, but we've always been unusually communicative in a reserved way, and I understood that he meant a great deal more than that."
    },
    {
      id: "h2",
      title: "Scientific Hypothesis",
      content: "Quantum mechanics is a fundamental theory in physics that provides a description of the physical properties of nature at the scale of atoms and subatomic particles. It is the foundation of all quantum physics, including quantum chemistry, quantum field theory, and quantum information science. Classical physics, the collection of theories that existed before the advent of quantum mechanics, describes many aspects of nature at an ordinary (macroscopic) scale, but is not sufficient for describing them at small (atomic and subatomic) scales."
    }
  ]
};

const generateWords = (difficulty: 'easy' | 'medium' | 'hard', count = 50) => {
  const pool = WORD_POOLS[difficulty];
  let result = [];
  for (let i = 0; i < count; i++) {
    result.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return result.join(" ");
};

let audioCtx: AudioContext | null = null;

export default function TypingTestSuite() {
  // Navigation State
  const [currentView, setCurrentView] = useState<'landing' | 'practice-select' | 'lesson-select' | 'test'>('landing');
  const [testMode, setTestMode] = useState<'practice' | 'lesson'>('practice');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  
  // Test Settings
  const [duration, setDuration] = useState<number>(30); // 15, 30, 60, or infinite for lessons
  
  // Test Runtime States
  const [status, setStatus] = useState<'idle' | 'running' | 'finished'>('idle');
  const [timeLeft, setTimeLeft] = useState<number>(duration);
  const [targetText, setTargetText] = useState<string>("");
  const [userInput, setUserInput] = useState<string>("");
  
  // Live Metrics
  const [correctChars, setCorrectChars] = useState(0);
  const [incorrectChars, setIncorrectChars] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const inputRef = useRef<HTMLInputElement>(null);
  const textDisplayRef = useRef<HTMLDivElement>(null);

  // --- AUDIO ENGINE INITIALIZER ---
  const initAudio = () => {
    if (!audioCtx) {
      try { audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)(); } 
      catch (e) { console.error("AudioContext not supported"); }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  };

  // --- DUAL-TONE AUDIO ENGINE ---
  const playSound = useCallback((type: 'click' | 'error') => {
    if (!soundEnabled || !audioCtx) return;
    try {
      if (audioCtx.state === 'suspended') audioCtx.resume();
      
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      if (type === 'click') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, audioCtx.currentTime); 
        osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.04);
        gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.04);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.04);
      } else {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime); 
        osc.frequency.exponentialRampToValueAtTime(50, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start(audioCtx.currentTime);
        osc.stop(audioCtx.currentTime + 0.1);
      }
      osc.connect(gain);
      gain.connect(audioCtx.destination);
    } catch (e) {}
  }, [soundEnabled]);

  // --- CORE LOGIC ---
  const startPractice = (selectedLevel: 'easy' | 'medium' | 'hard') => {
    initAudio(); 
    setTestMode('practice');
    setDifficulty(selectedLevel);
    setCurrentView('test');
    resetTest('practice', selectedLevel);
  };

  const startLesson = (lessonText: string, selectedLevel: 'easy' | 'medium' | 'hard') => {
    initAudio();
    setTestMode('lesson');
    setDifficulty(selectedLevel);
    setCurrentView('test');
    
    // For lessons, give them plenty of time (e.g., 300 seconds), 
    // the test will auto-stop when they finish the paragraph.
    setDuration(120); 
    resetTest('lesson', selectedLevel, lessonText);
  };

  const resetTest = useCallback((mode = testMode, level = difficulty, lessonText?: string) => {
    if (mode === 'practice') {
      setTargetText(generateWords(level, 80));
    } else if (lessonText) {
      setTargetText(lessonText);
    }
    
    setUserInput("");
    setStatus('idle');
    setTimeLeft(mode === 'lesson' ? 120 : duration); // 2 minutes default for lessons
    setCorrectChars(0);
    setIncorrectChars(0);
    setWpm(0);
    setAccuracy(100);
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
    }, 50);
  }, [difficulty, duration, testMode]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === 'running' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (status === 'running' && timeLeft === 0) {
      finishTest();
    }
    return () => clearInterval(timer);
  }, [status, timeLeft]);

  // Auto-finish lesson when typed completely
  useEffect(() => {
    if (testMode === 'lesson' && status === 'running' && userInput.length === targetText.length) {
      finishTest();
    }
  }, [userInput, targetText, status, testMode]);

  useEffect(() => {
    if (textDisplayRef.current && status === 'running') {
      const activeCaret = textDisplayRef.current.querySelector('.caret-active');
      if (activeCaret) {
        activeCaret.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [userInput, status]);

  const finishTest = useCallback(() => {
    setStatus('finished');
    if (inputRef.current) inputRef.current.blur();
    
    // Calculate WPM based on ACTUAL time elapsed
    const actualDuration = testMode === 'lesson' ? 120 : duration;
    const timeElapsed = actualDuration - timeLeft;
    const timeInMinutes = timeElapsed > 0 ? timeElapsed / 60 : 1 / 60; // Prevent divide by zero
    
    const finalWpm = Math.round((correctChars / 5) / timeInMinutes);
    const finalAccuracy = Math.round((correctChars / (correctChars + incorrectChars)) * 100) || 0;
    
    setWpm(finalWpm);
    setAccuracy(finalAccuracy);
  }, [correctChars, duration, incorrectChars, testMode, timeLeft]);

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'finished') return;
    const val = e.target.value;
    
    if (val.length > userInput.length) {
      const lastCharIdx = val.length - 1;
      const isError = val[lastCharIdx] !== targetText[lastCharIdx];
      playSound(isError ? 'error' : 'click');
    } else if (val.length < userInput.length) {
      playSound('click'); // Backspace
    }
    
    if (status === 'idle' && val.length > 0) {
      setStatus('running');
    }

    // Only regenerate infinite words if we are in practice mode
    if (testMode === 'practice' && val.length > targetText.length - 20) {
      setTargetText(prev => prev + " " + generateWords(difficulty, 30));
    }

    // Prevent typing beyond the lesson length
    if (testMode === 'lesson' && val.length > targetText.length) {
      return; 
    }

    setUserInput(val);

    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === targetText[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }
    setCorrectChars(correct);
    setIncorrectChars(incorrect);
  };

  const focusInput = () => {
    initAudio(); 
    if (status !== 'finished' && inputRef.current) {
      inputRef.current.focus();
    }
  };

  const renderText = () => {
    return targetText.split("").map((char, index) => {
      let colorClass = "text-slate-300"; 
      let isCaret = index === userInput.length;
      
      if (index < userInput.length) {
        if (userInput[index] === char) {
          colorClass = "text-indigo-600 font-medium"; 
        } else {
          colorClass = "text-red-500 bg-red-100/50 rounded-sm"; 
        }
      }

      return (
        <span key={index} className={`relative ${colorClass} ${isCaret ? 'caret-active' : ''}`}>
          {isCaret && (
            <span className="absolute -left-[1px] top-0.5 bottom-0.5 w-[2px] bg-indigo-500 animate-pulse"></span>
          )}
          {char}
        </span>
      );
    });
  };

  // ============================================
  // VIEW: LANDING PAGE (CHOOSE MODE)
  // ============================================
  if (currentView === 'landing') {
    return (
      <div className="min-h-screen bg-[#f4f6fa] font-sans text-slate-900 flex flex-col pt-16 md:pt-24 pb-12">
        <div className="max-w-[1200px] w-full mx-auto px-6 flex-1">
          
          <div className="text-center max-w-3xl mx-auto mb-16 animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Keyboard size={32} />
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900">
              Master Your Typing Speed
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed">
              Test your WPM (Words Per Minute), improve your accuracy, and build muscle memory. Choose how you want to practice today.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-24 animate-in slide-in-from-bottom-8 duration-700">
            
            {/* Speed Practice Card */}
            <button 
              onClick={() => setCurrentView('practice-select')}
              className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 transition-all text-left flex flex-col group"
            >
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap size={28} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-3">Speed Practice</h3>
              <p className="text-slate-500 mb-8 text-base leading-relaxed">
                Type an endless stream of random words against the clock. Perfect for raw speed training and muscle memory.
              </p>
              <span className="mt-auto inline-flex items-center text-sm font-bold text-indigo-600 bg-indigo-50 w-max px-4 py-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                Select Difficulties →
              </span>
            </button>

            {/* Guided Lessons Card */}
            <button 
              onClick={() => setCurrentView('lesson-select')}
              className="bg-white p-10 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-300 transition-all text-left flex flex-col group relative overflow-hidden"
            >
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BookOpen size={28} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-3">Lessons</h3>
              <p className="text-slate-500 mb-8 text-base leading-relaxed">
                Type full paragraphs, stories, and literature excerpts. Practice real-world typing with capitalization and punctuation.
              </p>
              <span className="mt-auto inline-flex items-center text-sm font-bold text-emerald-600 bg-emerald-50 w-max px-4 py-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                Browse Lessons →
              </span>
            </button>

          </div>

          {/* How It Works & FAQ */}
          <div className="border-t border-slate-200 pt-20 mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4">How it Works</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-[#f4f6fa] shadow-sm -mt-12 mb-4">
                  <PenTool className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">1. Choose a Mode</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Select between random word speed drills or guided full-paragraph lessons to match your goal.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-[#f4f6fa] shadow-sm -mt-12 mb-4">
                  <Target className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">2. Start Typing</h3>
                <p className="text-slate-500 text-sm leading-relaxed">The timer starts automatically the moment you hit your first key. Focus on the blinking caret.</p>
              </div>
              <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center border-4 border-[#f4f6fa] shadow-sm -mt-12 mb-4">
                  <Activity className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">3. Review Metrics</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Your dashboard will reveal your exact WPM, accuracy percentage, and total keystrokes.</p>
              </div>
            </div>
          </div>

          <div className="mb-20">
            <div className="flex items-center gap-3 mb-8">
              <HelpCircle className="w-8 h-8 text-indigo-600" />
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Frequently Asked Questions</h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">How is WPM calculated?</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">We use the standard international metric where 1 "word" equals exactly 5 characters. We divide your total correct characters by 5, then divide by the minutes elapsed.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">Can I take the test on my phone?</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">Yes! We use a specially designed hidden input field that triggers your phone's native keyboard, allowing you to test your mobile thumb-typing speed easily.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">What happens if I make a mistake?</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">Mistakes are highlighted in red, and a distinct sound will play (if audio is enabled). You can press backspace to fix them. Only correct keystrokes count toward your final WPM score.</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex gap-3">
                <CheckCircle2 className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-800 mb-2">What is a good WPM score?</h4>
                  <p className="text-slate-500 text-sm leading-relaxed">The average typing speed is around 40 WPM. A speed of 60 WPM is considered good for professional work, while 80+ WPM is excellent.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // VIEW: SELECT PRACTICE DIFFICULTY
  // ============================================
  if (currentView === 'practice-select') {
    return (
      <div className="min-h-screen bg-[#f4f6fa] font-sans text-slate-900 flex flex-col pt-16 md:pt-24 pb-12">
        <div className="max-w-[1200px] w-full mx-auto px-6">
          <button onClick={() => setCurrentView('landing')} className="text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-1.5 mb-8 transition-colors">
            <ChevronLeft size={20} /> Back to Modes
          </button>
          
          <div className="mb-12">
            <h1 className="text-4xl font-black tracking-tight mb-4 text-slate-900">Speed Practice</h1>
            <p className="text-lg text-slate-500">Select your word pool difficulty. You will type infinite random words against a timer.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl animate-in slide-in-from-bottom-8 duration-500">
            <button onClick={() => startPractice('easy')} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-300 transition-all text-left flex flex-col group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Beginner</h3>
              <p className="text-slate-500 mb-6 text-sm leading-relaxed">Short, simple dictionary words without punctuation. Perfect for building base speed.</p>
              <span className="mt-auto inline-flex items-center text-sm font-bold text-emerald-600">Start Beginner →</span>
            </button>

            <button onClick={() => startPractice('medium')} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-indigo-300 transition-all text-left flex flex-col group">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Brain size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Intermediate</h3>
              <p className="text-slate-500 mb-6 text-sm leading-relaxed">Standard professional vocabulary. Great for testing your everyday typing speed.</p>
              <span className="mt-auto inline-flex items-center text-sm font-bold text-indigo-600">Start Intermediate →</span>
            </button>

            <button onClick={() => startPractice('hard')} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-rose-300 transition-all text-left flex flex-col group">
              <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Flame size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Advanced</h3>
              <p className="text-slate-500 mb-6 text-sm leading-relaxed">Complex vocabulary with capital letters, numbers, and dense punctuation.</p>
              <span className="mt-auto inline-flex items-center text-sm font-bold text-rose-600">Start Advanced →</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // VIEW: SELECT GUIDED LESSON
  // ============================================
  if (currentView === 'lesson-select') {
    return (
      <div className="min-h-screen bg-[#f4f6fa] font-sans text-slate-900 flex flex-col pt-16 md:pt-24 pb-12">
        <div className="max-w-[1000px] w-full mx-auto px-6">
          <button onClick={() => setCurrentView('landing')} className="text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-1.5 mb-8 transition-colors">
            <ChevronLeft size={20} /> Back to Modes
          </button>
          
          <div className="mb-12">
            <h1 className="text-4xl font-black tracking-tight mb-4 text-slate-900">Guided Lessons</h1>
            <p className="text-lg text-slate-500">Select a paragraph to type. The test will finish automatically when you complete the text.</p>
          </div>

          <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-500">
            {/* Easy Lessons */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Zap className="text-emerald-500" /> Easy Lessons
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {GUIDED_LESSONS.easy.map(lesson => (
                  <button key={lesson.id} onClick={() => startLesson(lesson.content, 'easy')} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all text-left group">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors">{lesson.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{lesson.content}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Medium Lessons */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Brain className="text-indigo-500" /> Intermediate Lessons
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {GUIDED_LESSONS.medium.map(lesson => (
                  <button key={lesson.id} onClick={() => startLesson(lesson.content, 'medium')} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all text-left group">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{lesson.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{lesson.content}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Hard Lessons */}
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <Flame className="text-rose-500" /> Advanced Literature
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {GUIDED_LESSONS.hard.map(lesson => (
                  <button key={lesson.id} onClick={() => startLesson(lesson.content, 'hard')} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-rose-300 transition-all text-left group">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">{lesson.title}</h3>
                    <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">{lesson.content}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // VIEW: ACTIVE TEST (BOTH MODES)
  // ============================================
  return (
    <div className="min-h-screen bg-[#f4f6fa] font-sans text-slate-900 flex flex-col">
      <div className="max-w-[1200px] w-full mx-auto p-4 sm:p-6 lg:p-8 pt-6 sm:pt-8 flex flex-col gap-6 flex-shrink-0 animate-in fade-in duration-300">
        
        {/* HEADER / NAVIGATION */}
        <div className="w-full flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-200 gap-4 sm:gap-0">
          
          <button 
            onClick={() => setCurrentView(testMode === 'practice' ? 'practice-select' : 'lesson-select')}
            className="text-slate-500 hover:text-indigo-600 font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
          >
            <ChevronLeft size={20} /> Back
          </button>
          
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Mode & Difficulty Badge */}
            <span className={`px-3 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg border ${
              difficulty === 'easy' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
              difficulty === 'medium' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' :
              'bg-rose-50 text-rose-600 border-rose-200'
            }`}>
              {testMode === 'lesson' ? 'Lesson: ' : ''}{difficulty}
            </span>

            {/* Sound Toggle */}
            <button 
              onClick={() => {
                initAudio();
                setSoundEnabled(!soundEnabled);
              }}
              className={`p-1.5 rounded-lg transition-colors border ${soundEnabled ? 'text-indigo-600 bg-indigo-50 border-indigo-200' : 'text-slate-400 border-transparent hover:bg-slate-50 hover:border-slate-200'}`}
              title="Toggle Typing Sound"
            >
              {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>

            {/* Duration Selector (Only show for practice mode) */}
            {testMode === 'practice' && (
              <div className="flex items-center bg-slate-50 p-1.5 rounded-xl border border-slate-200">
                {[15, 30, 60].map(time => (
                  <button 
                    key={time}
                    onClick={() => { setDuration(time); }}
                    className={`px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all ${duration === time ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {time}s
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* MAIN TEST AREA */}
        <div className="w-full bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative min-h-[450px] flex flex-col items-center justify-center p-6 md:p-12">
          
          {status !== 'finished' ? (
            <div className="w-full max-w-4xl mx-auto relative flex flex-col h-full animate-in zoom-in-95 duration-200">
              
              {/* Top Stats Bar */}
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2 text-2xl font-black text-indigo-600">
                  <Timer className="w-6 h-6" /> {testMode === 'lesson' ? `${120 - timeLeft}s elapsed` : timeLeft}
                </div>
                
                {status === 'running' && (
                  <div className="flex items-center gap-6 opacity-60">
                    <div className="text-sm font-bold text-slate-500 text-right">
                      Live WPM: <span className="text-slate-800">
                        {(() => {
                          const elapsed = (testMode === 'lesson' ? 120 : duration) - timeLeft;
                          const mins = elapsed > 0 ? elapsed / 60 : 1/60;
                          return Math.round((correctChars / 5) / mins) || 0;
                        })()}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* The Typist Block */}
              <div 
                className="relative text-[26px] md:text-[36px] leading-[1.6] tracking-wide font-mono select-none outline-none overflow-hidden h-[240px] md:h-[280px]"
                onClick={focusInput}
              >
                {/* Hidden input overlay */}
                <input 
                  ref={inputRef}
                  type="text"
                  className="absolute inset-0 opacity-0 w-full h-full cursor-default z-10"
                  value={userInput}
                  onChange={handleTyping}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck="false"
                  autoFocus
                />
                
                <div 
                  ref={textDisplayRef}
                  className="absolute inset-0 transition-transform duration-200 pointer-events-none"
                >
                  {renderText()}
                </div>
              </div>

              {/* Reset Instruction */}
              <div className="mt-auto pt-8 flex justify-center">
                <button 
                  onClick={() => resetTest()}
                  className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-colors font-semibold"
                >
                  <RotateCcw size={18} /> Restart {testMode === 'lesson' ? 'Lesson' : 'Sprint'}
                </button>
              </div>

            </div>
          ) : (
            
            // RESULTS DASHBOARD
            <div className="w-full max-w-3xl mx-auto flex flex-col items-center animate-in zoom-in-95 duration-300">
              <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6">
                <Trophy size={40} />
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-8">{testMode === 'lesson' ? 'Lesson Complete!' : 'Time\'s Up!'}</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full mb-10">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">WPM</p>
                  <p className="text-5xl font-black text-indigo-600">{wpm}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Accuracy</p>
                  <p className="text-5xl font-black text-slate-800">{accuracy}%</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Keystrokes</p>
                  <p className="text-3xl font-black text-emerald-600 mt-2">{correctChars} <span className="text-lg text-slate-300 font-medium">/</span> <span className="text-red-500">{incorrectChars}</span></p>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center">
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Time</p>
                  <p className="text-3xl font-black text-slate-800 mt-2">
                    {testMode === 'lesson' ? 120 - timeLeft : duration}s
                  </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={() => resetTest()}
                  className="px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <RotateCcw size={18} /> Try Again
                </button>
                <button 
                  onClick={() => setCurrentView(testMode === 'practice' ? 'practice-select' : 'lesson-select')}
                  className="px-8 py-3.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Choose Another
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}