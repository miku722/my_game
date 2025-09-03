# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Running the Application
```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Project Architecture

### Overview
This is a React/Vite application with a museum-themed adventure game where players interact with AI-powered文物化身 (artifact avatars) through natural language conversations. The game uses an AI API to generate dynamic responses based on player actions.

### Core Architecture
- **Game Flow**: Player starts in museum -> discovers portal -> interacts with artifact avatars -> recruits allies -> faces challenges -> reaches ending
- **AI Integration**: Uses Qwen API service to process player actions and generate narrative responses in JSON format
- **State Management**: Custom hook `useGameState` manages game state with useState and useCallback

### Component Structure
- `MuseumPortalGame`: Main game component that orchestrates the game experience
- `StatusBar`: Displays player status (mood, danger level, etc.)
- `CurrentScene`: Shows current location description and context
- `AlliesList`: Displays recruited artifact avatars
- `ActionHistory`: Shows previous player actions and results
- `ActionInput`: Handles player input for actions
- `CollectionsInfo`: Displays information about available artifact avatars
- `Experiences`: Shows player's growth and insights gained

## Key Data Structures

### Game State (managed by useGameState)
- `currentLocation`: Current game scene (museum, portal_discovery, ancient_court, void_market, ending)
- `playerMood`: Player's emotional state (1-5 scale)
- `companionsFound`: Number of recruited artifact avatars
- `totalCompanions`: Total number of recruitable avatars (4)
- `experiences`: Array of player's insights and growth moments
- `inventory`: Player's collected items
- `allies`: Array of names of recruited artifact avatars
- `dangerLevel`: Current danger level (1-5 scale)

### Data Modules
- `@data/collections`: Artifact avatars (翠娘, 秦烈, 骏影, 墨笙) with their personalities, abilities, and descriptions
- `@data/locations`: Game locations with descriptions, context, and danger levels
- `@data/villains`: Antagonists (凤冠魔姬, 无名) with backstories and characteristics
- `@data/player`: Player character (小张) with initial attributes

## AI Service Integration

### QwenAPI Service
- Located at `src/services/QwenAPI.js`
- Uses environment variables for configuration:
  - `VITE_QWEN_API_URL`: API endpoint
  - `VITE_QWEN_MODEL`: Model name
  - `VITE_QWEN_API_KEY`: API key
- Sends player actions as prompts to the AI with comprehensive game state context
- Expects JSON responses with structured game state updates

### AI Prompt Structure
The prompt sent to the AI includes:
- Current game state (location, danger level, player mood, allies, inventory)
- Descriptions of available artifact avatars
- Player's action
- Game rules for the AI to follow
- Required JSON response format with fields like `feasible`, `result`, `moodChange`, `experienceGained`, `allyRecruited`, etc.

## Environment Configuration
- Copy `.env.example` to `.env.local` and modify as needed
- Key environment variables:
  - `VITE_QWEN_API_URL`: Qwen API endpoint
  - `VITE_QWEN_MODEL`: AI model to use
  - `VITE_QWEN_API_KEY`: API key for authentication
  - `VITE_GAME_VERSION`: Game version
  - `VITE_DEBUG_MODE`: Debug mode toggle

## Styling
- Uses Tailwind CSS for styling
- Main styles in `src/styles/tailwind.css`
- Component-specific styles in `src/styles/components.css`
- Global styles in `src/styles/globals.css`

## Key Dependencies
- React 18.2
- Vite 4.4
- Tailwind CSS 3.3
- lucide-react for icons
- clsx for conditional class names

## Limitations
  UI 设计要求：
- 所有新增 UI 元素（例如血条、SAN 值、体力条、宝箱奖励提示、文物收集展示、关卡进度等），必须完全继承本项目原有的 UI 风格和代码规范。
- 本项目的前端使用 React + Tailwind CSS，整体风格简洁、卡片式、圆角和柔和阴影。
- 新增的组件或进度条请复用已有组件的样式（例如 `StatusBar`、`Card`、`ActionHistory`），保持一致的字体、颜色和间距。
- 禁止引入和原有项目不一致的外观（例如不统一的配色、陌生的 UI 库、不同风格的动画）。
- 所有 UI 改动必须“看起来像是原本游戏里就有的”，无突兀感。

  UI 要求：请严格遵守上面的 UI 风格约束说明。

  代码设计要求：
    时刻要注意封装和单一职责的原则。