import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { BattleStats } from '../types';

interface StatsRadarChartProps {
  stats1: BattleStats;
  stats2: BattleStats;
  name1: string;
  name2: string;
}

export function StatsRadarChart({ stats1, stats2, name1, name2 }: StatsRadarChartProps) {
  const data = [
    {
      stat: 'Technical',
      [name1]: stats1.technical,
      [name2]: stats2.technical,
      fullMark: 100,
    },
    {
      stat: 'Strategy',
      [name1]: stats1.strategy,
      [name2]: stats2.strategy,
      fullMark: 100,
    },
    {
      stat: 'Execution',
      [name1]: stats1.execution,
      [name2]: stats2.execution,
      fullMark: 100,
    },
    {
      stat: 'Leadership',
      [name1]: stats1.leadership,
      [name2]: stats2.leadership,
      fullMark: 100,
    },
    {
      stat: 'Impact',
      [name1]: stats1.impact,
      [name2]: stats2.impact,
      fullMark: 100,
    },
    {
      stat: 'Experience',
      [name1]: stats1.experience,
      [name2]: stats2.experience,
      fullMark: 100,
    },
  ];

  return (
    <div className="radar-container w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#4B5563" />
          <PolarAngleAxis 
            dataKey="stat" 
            tick={{ fill: '#E5E7EB', fontSize: 12 }}
          />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 100]} 
            tick={{ fill: '#9CA3AF', fontSize: 10 }}
          />
          <Radar
            name={name1}
            dataKey={name1}
            stroke="#8B5CF6"
            fill="#8B5CF6"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Radar
            name={name2}
            dataKey={name2}
            stroke="#EC4899"
            fill="#EC4899"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Legend 
            wrapperStyle={{ 
              paddingTop: '10px',
              color: '#E5E7EB'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatsRadarChart;
