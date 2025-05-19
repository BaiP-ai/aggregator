# BAIP.AI Enterprise AI Aggregator

A comprehensive AI aggregator platform designed for Fortune 500 companies to discover and leverage enterprise-ready AI tools and custom AI agents.

## Overview

The BAIP.AI Enterprise AI Aggregator is a centralized hub for Fortune 500 companies to discover, evaluate, and implement AI tools across different business functions. The platform includes:

- Curated collection of enterprise-ready AI tools
- Business-focused categorization
- Custom AI agents powered by GROQ
- Detailed information about each tool and agent

## Features

- **Comprehensive Tool Directory**: Curated list of enterprise AI tools organized by business function
- **Custom AI Agents**: Specialized AI assistants built for enterprise use cases
- **Business-Focused Categories**: Tools organized by business functions and departments
- **Responsive Design**: Works on all devices and screen sizes
- **Enterprise Security Focus**: All tools vetted for enterprise security and compliance

## Technology Stack

- [Astro](https://astro.build/): Fast and flexible static site generator
- [SolidJS](https://www.solidjs.com/): Reactive JavaScript library for UI components
- [Tailwind CSS](https://tailwindcss.com/): Utility-first CSS framework
- [OpenAI](https://openai.com/): AI models for custom agents

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/BaiP-ai/agent-ai-aggregator.git

# Navigate to the project directory
cd agent-ai-aggregator

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build and Deployment

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

The site is deployed to GitHub Pages at https://baip-ai.github.io/aggregator/

## Project Structure

```
/
├── public/            # Static assets
│   └── images/        # Images and logos
├── src/               # Source code
│   ├── components/    # UI components
│   ├── data/          # Data files for tools and categories
│   ├── layouts/       # Page layouts
│   ├── pages/         # Page components
│   ├── agents/        # Custom AI agent implementations
│   └── styles/        # CSS styles
└── package.json       # Project manifest
```

## License

MIT

## Contact

For questions or support, please contact [contact@baip.ai](mailto:contact@baip.ai)
