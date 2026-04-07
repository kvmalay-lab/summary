# **App Name**: Agentic Canvas

## Core Features:

- Session & Prompt Input: Allow users to initiate new content generation sessions by providing a primary topic and review their historical sessions.
- Generative Agent Pipeline: Orchestrates a 4-agent (News Collector, Summarizer, Content Writer, Editor) execution chain, serving as a tool to automatically create structured content from the input topic.
- Real-time Process Monitor: Displays live progress and detailed, step-by-step output of each agent's execution within a dynamic, terminal-inspired dashboard.
- Contextual Memory Recall: Leverages past conversational turns as a tool to maintain context, enabling agents to understand and respond to follow-up commands for refining content.
- Interactive Content Chat: Presents the final AI-generated content within an interactive chat interface, allowing users to engage with it and request iterative edits.
- Firestore Data Persistence: Configures Firestore for state and memory management across sessions, messages, and pipeline logs.
- Firebase Cloud Function Integration: Securely executes the OpenAI-compatible agent pipeline logic and handles memory integration on the backend.

## Style Guidelines:

- Dark-mode background color: #182521, a very dark, slightly desaturated blue-green, evoking a deep terminal environment.
- Primary interactive color: #47B5EB, a bright and futuristic blue for active elements and key information, reminiscent of system prompts and highlights.
- Accent and alert color: #7DE8D6, a vibrant aqua that provides high contrast against the dark background, suitable for alerts or important status indicators.
- Headline and body font: 'Inter' (sans-serif) for its modern, clean, and highly readable appearance.
- Code and log font: 'Source Code Pro' (monospace sans-serif) to simulate a true terminal output and ensure readability of agent logs.
- Use sharp, geometric, and outline-style icons to complement the terminal-inspired aesthetic, differentiating each agent and process visually.
- Implement a multi-panel layout with clear separation for the 4-agent topology dashboard, the main prompt input area, and the real-time session log, facilitating easy information hierarchy and flow.
- Subtle, non-distracting animations for real-time log updates (e.g., character-by-character text appearance or smooth scrolling) and state transitions within the agent topology view to enhance the interactive terminal feel.