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

# Start development server on remote (for mobile testing)
npm run dev:remote
```

## Project Architecture

### Overview
This is a React/Vite application with a museum-themed adventure game where players interact with AI-powered文物化身 (artifact avatars) through natural language conversations. The game uses an AI API to generate dynamic responses based on player actions.

### Core Architecture
- **Game Flow**: Player starts in museum -> discovers portal -> interacts with artifact avatars -> recruits allies -> faces challenges -> reaches ending
- **AI Integration**: Uses Qwen API service to process player actions and generate narrative responses in JSON format
- **State Management**: Custom hook `useGameState` manages game state with useState and useCallback
- **Component Structure**: The application follows a modular component architecture with clear separation between game logic, UI components, and data

### Component Hierarchy and Relationships
- `App`: Root component that renders the `MuseumPortalGame`
- `MuseumPortalGame`: Main game orchestrator that manages game phases (start, level_selection, playing, ending)
- `useGameState`: Central state management hook that maintains game state and provides state update functions
- `LevelTemplate`: Reusable template for level scenes with typewriter effect and action interface
- `Level*Scene`: Level-specific components that provide content to the LevelTemplate
- `ActionProcessor`: Handles player actions by generating prompts and processing AI responses

### Key Data Structures

#### Game State (managed by useGameState)
- `currentLocation`: Current game scene (museum, portal_discovery, ancient_court, void_market, ending)
- `playerMood`: Player's emotional state (1-5 scale)
- `companionsFound`: Number of recruited artifact avatars
- `totalCompanions`: Total number of recruitable avatars (4)
- `experiences`: Array of player's insights and growth moments
- `inventory`: Player's collected items
- `allies`: Array of names of recruited artifact avatars
- `dangerLevel`: Current danger level (1-5 scale)
- `currentLevel`: Current level number (1, 2, etc.)
- `currentStep`: Current step within a level
- `levelProgress`: Object tracking completion status of levels
- `levelX_flags`: Flag objects for tracking progress within specific levels

### Data Modules
- `@data/collections`: Artifact avatars (翠娘, 秦烈, 骏影, 墨笙) with their personalities, abilities, and descriptions
- `@data/locations`: Game locations with descriptions, context, and danger levels
- `@data/villains`: Antagonists (凤冠魔姬, 无名) with backstories and characteristics
- `@data/player`: Player character (小张) with initial attributes

### AI Service Integration

#### QwenAPI Service
- Located at `src/services/QwenAPI.js`
- Uses environment variables for configuration:
  - `VITE_QWEN_API_URL`: API endpoint
  - `VITE_QWEN_MODEL`: Model name
  - `VITE_QWEN_API_KEY`: API key
- Sends player actions as prompts to the AI with comprehensive game state context
- Expects JSON responses with structured game state updates

#### AI Prompt Structure
The prompt sent to the AI includes:
- Current game state (location, danger level, player mood, allies, inventory)
- Descriptions of available artifact avatars
- Player's action
- Game rules for the AI to follow
- Required JSON response format with fields like `feasible`, `result`, `moodChange`, `experienceGained`, `allyRecruited`, etc.

#### Action Processing Workflow
1. Player submits action through `ActionInput` component
2. `processPlayerAction` in `ActionProcessor.jsx` generates a prompt using `generatePrompt`
3. The prompt is sent to the Qwen API via `qwenAPI.sendMessage`
4. The AI response is parsed and used to update game state
5. Game state updates trigger UI changes and progress tracking

### Level System Architecture

#### Level Template Pattern
The game uses a reusable template pattern for levels:
- `LevelTemplate.jsx`: Generic component handling typewriter effects, navigation, and action interface
- Level-specific components (e.g., `Level1Scene.jsx`): Provide content to the template while reusing common functionality

#### Level Flow
1. Intra-step navigation: After each paragraph within a step, show "点击空白处继续..." and wait for click
2. Inter-step actions: After completing all paragraphs in a step, show action interface with "该你行动了"
3. Action submission: When action is submitted, show "让我来看看这样是否可行？" during API processing
4. Text persistence: All previously displayed text is preserved throughout the game progression

### Development Best Practices

#### UI Design Requirements
- All new UI elements must follow the project's existing UI style and code conventions
- The project uses React + Tailwind CSS with a clean, card-based design with rounded corners and soft shadows
- Reuse existing component styles (e.g., `StatusBar`, `Card`, `ActionHistory`) for consistency in fonts, colors, and spacing
- All UI changes must appear as if they belong in the original game, without jarring visual differences

#### Code Design Principles
- Follow single responsibility principle and encapsulation
- Prefer editing existing files over creating new ones
- When creating new components, follow existing patterns in naming, structure, and implementation
- Maintain consistent code style with existing codebase

#### Environment Configuration
- Copy `.env.example` to `.env.local` and modify as needed
- Key environment variables:
  - `VITE_QWEN_API_URL`: Qwen API endpoint
  - `VITE_QWEN_MODEL`: AI model to use
  - `VITE_QWEN_API_KEY`: API key for authentication
  - `VITE_GAME_VERSION`: Game version
  - `VITE_DEBUG_MODE`: Debug mode toggle