import { motion } from 'framer-motion';
import type { AnimeProfile } from '../types';

interface ProfileCardProps {
  profile: AnimeProfile;
  side: 'left' | 'right';
  isWinner: boolean;
}

export function ProfileCard({ profile, side, isWinner }: ProfileCardProps) {
  const { profile: profileData, stats, totalPower, archetype, techniques, guild, battleExperience, specialAbility, missions } = profile;

  const glowColor = side === 'left' ? 'glow-purple' : 'glow-pink';
  const borderColor = side === 'left' ? 'border-anime-purple' : 'border-anime-pink';
  const textColor = side === 'left' ? 'text-anime-purple' : 'text-anime-pink';

  return (
    <motion.div
      initial={{ opacity: 0, x: side === 'left' ? -50 : 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className={`battle-card rounded-xl p-6 ${isWinner ? 'winner-aura' : ''} ${glowColor}`}
    >
      {/* Avatar and Name */}
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br from-anime-purple to-anime-pink flex items-center justify-center text-2xl font-bold ${borderColor} border-2`}>
          {profileData.avatar ? (
            <img src={profileData.avatar} alt={profileData.name} className="w-full h-full rounded-full object-cover" />
          ) : (
            profileData.name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{profileData.name}</h3>
          <p className="text-gray-400 text-sm">{profileData.title}</p>
        </div>
      </div>

      {/* Archetype Badge */}
      <div className={`inline-block px-3 py-1 rounded-full ${textColor} bg-opacity-20 bg-current text-sm font-semibold mb-4`}>
        {archetype}
      </div>

      {/* Power Level */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-400 text-sm">Power Level</span>
          <span className={`text-xl font-bold ${textColor}`}>{totalPower}</span>
        </div>
        <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden power-bar">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${totalPower}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={`h-full ${side === 'left' ? 'bg-anime-purple' : 'bg-anime-pink'}`}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {Object.entries(stats).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center text-sm">
            <span className="text-gray-400 capitalize">{key}</span>
            <span className="text-white font-semibold">{value}</span>
          </div>
        ))}
      </div>

      {/* Guild */}
      <div className="mb-4">
        <span className="text-gray-500 text-xs uppercase tracking-wider">Guild</span>
        <p className="text-white font-medium">{guild}</p>
      </div>

      {/* Battle Experience */}
      <div className="mb-4">
        <span className="text-gray-500 text-xs uppercase tracking-wider">Battle Experience</span>
        <p className="text-gray-300 text-sm">{battleExperience}</p>
      </div>

      {/* Special Ability */}
      <div className="mb-4 p-3 bg-black bg-opacity-30 rounded-lg">
        <span className="text-anime-gold text-xs uppercase tracking-wider">Special Ability</span>
        <p className="text-white text-sm mt-1">{specialAbility}</p>
      </div>

      {/* Techniques */}
      <div className="mb-4">
        <span className="text-gray-500 text-xs uppercase tracking-wider">Techniques</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {techniques.slice(0, 4).map((technique, index) => (
            <span
              key={index}
              className={`px-2 py-1 text-xs rounded ${side === 'left' ? 'bg-anime-purple' : 'bg-anime-pink'} bg-opacity-20 text-white`}
            >
              {technique}
            </span>
          ))}
        </div>
      </div>

      {/* Top Missions */}
      {missions.length > 0 && (
        <div>
          <span className="text-gray-500 text-xs uppercase tracking-wider">Top Missions</span>
          <div className="mt-2 space-y-2">
            {missions.slice(0, 2).map((mission, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-bold rounded ${
                  mission.rank === 'S' ? 'bg-anime-gold text-black' :
                  mission.rank === 'A' ? 'bg-red-500 text-white' :
                  mission.rank === 'B' ? 'bg-blue-500 text-white' :
                  'bg-gray-500 text-white'
                }`}>
                  {mission.rank}
                </span>
                <span className="text-white text-sm truncate">{mission.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Winner Badge */}
      {isWinner && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring' }}
          className="absolute -top-4 -right-4 bg-anime-gold text-black px-4 py-2 rounded-full font-bold text-sm shadow-lg"
        >
          WINNER
        </motion.div>
      )}
    </motion.div>
  );
}

export default ProfileCard;
