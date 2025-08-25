import React from 'react';

const Experiences = ({ gameState }) => {
  if (gameState.experiences.length === 0) return null;

  return (
    <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
      <h3 className="font-semibold text-green-800 mb-2">✨ 最近的感悟</h3>
      <div className="space-y-1">
        {gameState.experiences.slice(-3).map((exp, index) => (
          <p key={index} className="text-sm text-green-700">• {exp}</p>
        ))}
      </div>
    </div>
  );
};

export default Experiences;