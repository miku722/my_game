import { useState } from 'react';

const CollectionPage = ({ onBack }) => {
  // Initial collection with the bronze key
  const [collection] = useState([
    {
      id: 1,
      name: '青铜钥匙',
      type: '普通文物',
      origin: '入门关卡',
      description: '一把古老的青铜钥匙，表面刻有神秘的符文。在博物馆的中央展厅角落发现，散发着微弱的魔法光芒。传说这把钥匙能开启通往神秘世界的大门。',
      story: '在那个寂静的夜晚，当月光洒在博物馆的石质地面上时，你发现了这把静静躺在石台上的青铜钥匙。掌心触碰到冰凉的金属瞬间，一股奇异的力量涌入全身，仿佛整个展厅都在为你颤动。低沉而悠远的声音在心底回响：\"守护者……尘封已久的力量在呼唤你，未解的秘密正在等待勇者开启。\"从此，你的冒险正式拉开序幕。',
      image: '/images/artifacts/bronze-key.jpg' // Placeholder image path
    }
  ]);
  
  const [selectedItem, setSelectedItem] = useState(null);
  
  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-blue-100 to-purple-100 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">馆藏收集</h1>
        <button 
          onClick={onBack}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回主菜单
        </button>
      </div>
      
      {collection.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">暂无收藏品，开始冒险之旅来收集文物吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collection.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
              onClick={() => setSelectedItem(item)}
            >
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-1"><strong>类型：</strong>{item.type}</p>
                <p className="text-gray-600 mb-1"><strong>来源：</strong>{item.origin}</p>
                <p className="text-gray-700 mt-3 line-clamp-3">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal for item details */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedItem(null)}
        >
          <div 
            className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold text-gray-800">{selectedItem.name}</h2>
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-gray-600"><strong>类型：</strong>{selectedItem.type}</p>
                  <p className="text-gray-600"><strong>来源：</strong>{selectedItem.origin}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">文物描述</h3>
                  <p className="text-gray-700">{selectedItem.description}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">背后故事</h3>
                  <p className="text-gray-700 whitespace-pre-line">{selectedItem.story}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionPage;