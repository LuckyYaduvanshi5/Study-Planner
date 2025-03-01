import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PomodoroTimer = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [isBreathing, setIsBreathing] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            clearInterval(interval);
            const audio = new Audio('/notification.mp3');
            audio.play();
            if (isBreak) {
              setMinutes(25);
              setIsBreak(false);
            } else {
              setMinutes(5);
              setIsBreak(true);
            }
            setIsActive(false);
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, minutes, seconds, isBreak]);

  const toggleMode = () => {
    setIsActive(false);
    setIsBreak(!isBreak);
    setMinutes(isBreak ? 25 : 5);
    setSeconds(0);
    setIsBreathing(false);
  };

  const getProgress = () => {
    const totalSeconds = isBreak ? 5 * 60 : 25 * 60;
    const currentSeconds = minutes * 60 + seconds;
    return ((totalSeconds - currentSeconds) / totalSeconds) * 100;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Mode Toggle Switch */}
      <div className="mb-6">
        <label className="inline-flex items-center cursor-pointer">
          <span className={`mr-3 text-sm font-medium ${!isBreak ? 'text-blue-600' : 'text-gray-400'}`}>
            Focus
          </span>
          <div className="relative">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={isBreak}
              onChange={toggleMode}
            />
            <motion.div
              className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-500"
              animate={{
                backgroundColor: isBreak ? '#22c55e' : '#3b82f6'
              }}
            />
          </div>
          <span className={`ml-3 text-sm font-medium ${isBreak ? 'text-green-600' : 'text-gray-400'}`}>
            Break
          </span>
        </label>
      </div>

      <motion.div 
        className="relative w-72 h-72"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        {/* Timer Ring */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke={isBreak ? '#22c55e' : '#3b82f6'}
            strokeWidth="4"
            fill="none"
            strokeOpacity="0.2"
          />
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke={isBreak ? '#22c55e' : '#3b82f6'}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${getProgress() * 2.827}, 282.7`}
            className="transition-all duration-200"
          />
        </svg>

        {/* Breathing Animation Circle */}
        {isBreak && isBreathing && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ 
              scale: [0.8, 1.2, 0.8], 
              opacity: [0.5, 0.8, 0.5] 
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className={`w-32 h-32 rounded-full ${
              isBreak ? 'bg-green-200' : 'bg-blue-200'
            } filter blur-md`}/>
          </motion.div>
        )}

        {/* Timer Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            className={`text-5xl font-bold ${
              isBreak ? 'text-green-600' : 'text-blue-600'
            }`}
            key={`${minutes}:${seconds}`}
          >
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </motion.span>
          {isBreak && isBreathing && (
            <motion.p
              className="mt-2 text-lg text-gray-600"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {seconds % 8 < 4 ? "Inhale..." : "Exhale..."}
            </motion.p>
          )}
        </div>
      </motion.div>

      {/* Controls */}
      <div className="mt-8 space-y-3 w-full max-w-xs">
        <motion.button
          onClick={() => {
            setIsActive(!isActive);
            if (isBreak) setIsBreathing(!isBreathing);
          }}
          className={`w-full py-3 px-6 rounded-lg font-medium text-white shadow-lg 
            ${isActive
              ? 'bg-red-500 hover:bg-red-600'
              : isBreak
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isActive ? 'Pause' : 'Start'}
        </motion.button>

        <motion.button
          onClick={() => {
            setIsActive(false);
            setMinutes(isBreak ? 5 : 25);
            setSeconds(0);
            setIsBreathing(false);
          }}
          className="w-full py-3 px-6 rounded-lg font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 shadow"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Reset
        </motion.button>
      </div>

      {/* Break Mode Message */}
      {isBreak && (
        <motion.div 
          className="mt-6 text-center text-green-600"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm">
            {isBreathing 
              ? "🌿 Follow the breathing rhythm..." 
              : "🧘‍♂️ Take a mindful break"}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PomodoroTimer;
