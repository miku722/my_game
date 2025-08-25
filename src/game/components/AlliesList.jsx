import React from 'react';

const AlliesList = ({ gameState, collections }) => {
  if (gameState.allies.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-medium text-gray-800 mb-3">👥 当前伙伴</h3>
      <div className="flex flex-wrap gap-2">
        {gameState.allies.map(ally => {
          const char = collections[ally];
          return char ? (
            <div key={ally} className="bg-green-100 border border-green-300 rounded-lg p-2 text-sm">
              <span className="text-lg mr-1">{char.icon}</span>
              <span className="font-medium">{char.name}</span>
              <span className="text-gray-600 ml-1">({char.ability})</span>
            </div>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default AlliesList;