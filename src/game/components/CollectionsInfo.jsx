import React from 'react';

const CollectionsInfo = ({ collections, villains }) => {
  return (
    <div className="mt-6 grid md:grid-cols-2 gap-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-800 mb-2">📚 文物伙伴</h3>
        <div className="space-y-2">
          {Object.values(collections).map(char => (
            <div key={char.name} className={`text-sm ${char.recruited ? 'text-green-600' : 'text-gray-600'}`}>
              <span className="text-lg mr-1">{char.icon}</span>
              <strong>{char.name}</strong>({char.origin})
              {char.recruited && <span className="ml-2 text-green-500">✓已招募</span>}
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="font-semibold text-red-800 mb-2">⚠️ 危险角色</h3>
        <div className="space-y-2">
          {Object.values(villains).map(villain => (
            <div key={villain.name} className="text-sm text-red-600">
              <span className="text-lg mr-1">{villain.icon}</span>
              <strong>{villain.name}</strong>({villain.origin})
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CollectionsInfo;