import React from 'react';

const CurrentScene = ({ currentLocation }) => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        📍 {currentLocation.name}
      </h2>
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <p className="text-gray-700 leading-relaxed">
          {currentLocation.description}
        </p>
        <div className="mt-3 pt-3 border-t border-amber-300">
          <p className="text-sm text-amber-800">
            <strong>场景信息：</strong>{currentLocation.context}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CurrentScene;