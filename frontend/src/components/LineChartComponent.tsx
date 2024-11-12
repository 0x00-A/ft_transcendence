import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Target, Clock } from 'lucide-react';
import css from './LineChartComponent.module.css';

const LineChartComponent = () => {
  const performanceData = [
    { day: 'Mon', duration: 2.5 },
    { day: 'Tue', duration: 3 },
    { day: 'Wed', duration: 1.8 },
    { day: 'Thu', duration: 2.2 },
    { day: 'Fri', duration: 2.9 },
    { day: 'Sat', duration: 3.5 },
    { day: 'Sun', duration: 4 },
  ];

  return (
    <div className={css.container}>
      <h3 className={css.title}>Weekly Gaming Duration</h3>

      <div className={css.statsContainer}>
        <div className={css.statCard}>
          <div className={css.statTitle}>
            <Trophy className={css.longestSessionIcon} size={20} />
            <span className={css.statText}>Longest Session</span>
          </div>
          <p className={css.statValue}>4 hrs</p>
        </div>

        <div className={css.statCard}>
          <div className={css.statTitle}>
            <Target className={css.totalPlayIcon} size={20} />
            <span className={css.statText}>Total Play Time</span>
          </div>
          <p className={css.statValue}>19.9 hrs</p>
        </div>

        <div className={css.statCard}>
          <div className={css.statTitle}>
            <Clock className={css.avgDailyIcon} size={20} />
            <span className={css.statText}>Avg. Daily Time</span>
          </div>
          <p className={css.statValue}>2.85 hrs</p>
        </div>
      </div>

      <div className={css.chartContainer}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={performanceData}>
            <XAxis 
              dataKey="day" 
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8' }}
            />
            <YAxis
              stroke="#94a3b8"
              tick={{ fill: '#94a3b8' }}
              label={{ 
                value: "Hours", 
                angle: -90, 
                position: "insideLeft", 
                fill: "#94a3b8" 
              }}
            />
            <Tooltip
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: 'none',
                borderRadius: '0.375rem',
                padding: '0.75rem'
              }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(value) => `${value} hrs`}
            />
            <Line
              type="monotone"
              dataKey="duration"
              stroke="#60a5fa"
              strokeWidth={2}
              dot={{ fill: '#60a5fa', r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartComponent;