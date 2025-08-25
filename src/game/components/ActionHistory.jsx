import React from 'react';

const ActionHistory = ({ actionHistory }) => {
  if (actionHistory.length === 0) return null;

  return (
    <div className="mb-6 max-h-60 overflow-y-auto">
      <h3 className="text-lg font-medium text-gray-800 mb-3">📜 互动记录</h3>
      {actionHistory.slice(-2).map((entry, index) => (
        <div key={index} className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800 font-medium">你的行动：{entry.action}</p>
          <p className="text-sm text-gray-700 mt-1">{entry.result}</p>
          {entry.dialogue && (
            <div className="mt-2 p-2 bg-white rounded border-l-4 border-blue-400">
              <p className="text-sm text-blue-600 italic">💬 "{entry.dialogue}"</p>
            </div>
          )}
          {entry.suggestions && entry.suggestions.length > 0 && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">建议行动：</p>
              <ul className="text-xs text-gray-600 ml-2">
                {entry.suggestions.map((suggestion, i) => (
                  <li key={i}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ActionHistory;