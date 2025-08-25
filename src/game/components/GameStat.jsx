import React from 'react';

const GameStat = ({ icon: Icon, label, value, valueColor = 'text-gray-600' }) => {
  return (
    <div className="text-center">
      <Icon className={`w-6 h-6 ${valueColor} mx-auto mb-2`} />
      <p className="text-sm font-medium">{label}</p>
      <p className={`text-xs ${valueColor}`}>{value}</p>
    </div>
  );
};

export default GameStat;