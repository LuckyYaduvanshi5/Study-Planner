import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';

const RadialTaskProgress = ({ tasks }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;

  const data = [{
    name: 'Completion',
    value: completionPercentage,
    fill: getProgressColor(completionPercentage),
  }];

  function getProgressColor(percentage) {
    if (percentage >= 75) return '#22c55e'; // green-500
    if (percentage >= 50) return '#3b82f6'; // blue-500
    if (percentage >= 25) return '#f59e0b'; // amber-500
    return '#ef4444'; // red-500
  }

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full max-w-md h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart
            width={500}
            height={300}
            cx="50%"
            cy="50%"
            innerRadius="60%"
            outerRadius="85%"
            barSize={25}
            data={data}
            startAngle={90}
            endAngle={-270}
          >
            <RadialBar
              minAngle={15}
              background
              clockWise
              dataKey="value"
              cornerRadius={15}
            />
            <Tooltip
              content={({ payload }) => {
                if (payload && payload.length) {
                  return (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-white px-4 py-2 shadow-lg rounded-lg border border-gray-100"
                    >
                      <p className="text-gray-900 font-medium">
                        {`${payload[0].value}% Completed`}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {`${completedTasks} of ${totalTasks} tasks`}
                      </p>
                    </motion.div>
                  );
                }
                return null;
              }}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mt-4"
      >
        <h4 className="text-3xl font-bold text-gray-900">{completionPercentage}%</h4>
        <p className="text-gray-600 mt-2">
          {completedTasks} of {totalTasks} tasks completed
        </p>
      </motion.div>
    </div>
  );
};

export default RadialTaskProgress;
