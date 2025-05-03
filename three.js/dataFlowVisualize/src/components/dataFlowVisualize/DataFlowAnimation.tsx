import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Database,   Files,   LineChart, } from "lucide-react";

const sourceColors: Record<string, string> = {
  AiGizmo: "text-green-400",
};

const DataFlowAnimation: React.FC = () => {
  const [showGraph, setShowGraph] = useState(false);
  const sourceColor =  sourceColors.Default;
  const icon = <Database size={32} className="text-gray-400" />;

  useEffect(() => {
    const timer = setTimeout(() => setShowGraph(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-64 flex items-center justify-center dark:bg-gray-900 bg-gray-50 shadow-xl text-gray-700 dark:text-gray-50 rounded-lg p-8">
      <motion.div
        className="absolute left-12 text-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Files  size={48} className={`${sourceColor} mb-2 mx-auto`}/>
        <span className="text-sm font-medium">{'Data Sources'}</span>
      </motion.div>

      <motion.div
        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        {icon}
        <span className="text-sm font-medium">{'AI Gizmo Agent'}</span>
      </motion.div>

      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="h-2 w-2 rounded-full bg-blue-400 absolute"
          initial={{ opacity: 0 }}
          animate={{
            x: ["0%", "50%"],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 1,
            delay: i * 0.05,
            ease: "linear",
          }}
          style={{ left: `${12 + i * 2}%`, top: "50%" }}
        />
      ))}

      {showGraph &&
        [...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="h-2 w-2 rounded-full bg-green-400 absolute"
            initial={{ opacity: 0 }}
            animate={{
              x: ["50%", "85%"],
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 1,
              delay: i * 0.05,
              ease: "linear",
            }}
            style={{ left: `${50 + i * 2}%`, top: "50%" }}
          />
        ))}

      {showGraph ? (
        <motion.div
          className="absolute right-12 text-center"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full bg-yellow-400/20"
              animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ repeat: Infinity, ease: "easeInOut" }}
            />
            <LineChart size={48} className="text-yellow-400 relative z-10 mb-2" />
          </div>
          <span className="text-sm font-medium">Analysis</span>
        </motion.div>
      ) : (
        <motion.div
          className="absolute bottom-4 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <motion.div
            className="text-sm font-medium text-center text-blue-400"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            Processing Data...
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DataFlowAnimation;
