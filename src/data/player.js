export const player = {
  name: '小张',
  age: 28,
  occupation: '博物馆文物修复师',
  personality: '好奇心强，富有同情心，有时过于冲动',
  background: '在整理博物馆地下室时意外发现了一个神秘的 portal',
  health: 100,
  san: 80,
  stamina: 50,
  mood: 3,
  inventory: ['手电筒', '对讲机']
};

export const updatePlayer = (updates) => {
  Object.keys(updates).forEach(key => {
    if (player.hasOwnProperty(key)) {
      player[key] = updates[key];
    }
  });
};