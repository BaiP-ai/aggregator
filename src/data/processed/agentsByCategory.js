// This file is auto-generated - do not edit directly
export const agentsByCategory = {
  "specialized-agents": [
    {
      "id": "marketing-strategist",
      "name": "Marketing Strategist Agent",
      "description": "AI agent specialized in marketing strategy, campaign analysis, and optimization",
      "category": "ai-agents",
      "subcategory": "specialized-agents",
      "model": "openai/gpt-4-turbo",
      "features": [
        "Campaign performance analysis",
        "Audience targeting suggestions",
        "Content strategy recommendations",
        "Competitive marketing analysis",
        "ROI optimization"
      ],
      "implementation": {
        "platform": "OpenAI",
        "apiEndpoint": "/api/agents/marketing-strategist",
        "authentication": "API Key",
        "dataIntegrations": [
          "Google Analytics",
          "HubSpot",
          "Marketo",
          "Social media platforms",
          "CRM systems"
        ]
      },
      "useCases": [
        {
          "title": "Campaign Optimization",
          "description": "Analyzes campaign performance and provides recommendations for optimization and improvement"
        },
        {
          "title": "Content Strategy",
          "description": "Develops content strategies based on audience analysis, trends, and competitive landscape"
        },
        {
          "title": "Marketing ROI Analysis",
          "description": "Analyzes marketing spend across channels and initiatives to identify ROI and optimization opportunities"
        }
      ],
      "demoPrompt": "Analyze our recent LinkedIn ad campaign performance. What's working, what isn't, and how should we adjust our strategy for the next quarter?"
    },
    {
      "id": "product-manager",
      "name": "Product Manager Agent",
      "description": "AI agent that assists with product development, management, and strategy",
      "category": "ai-agents",
      "subcategory": "specialized-agents",
      "model": "openai/gpt-4-turbo",
      "features": [
        "Competitive product analysis",
        "Feature prioritization assistance",
        "User feedback analysis",
        "Roadmap planning support",
        "Product metrics tracking"
      ],
      "implementation": {
        "platform": "OpenAI",
        "apiEndpoint": "/api/agents/product-manager",
        "authentication": "OAuth",
        "dataIntegrations": [
          "Jira",
          "Asana",
          "GitHub",
          "Customer feedback tools",
          "Analytics platforms"
        ]
      },
      "useCases": [
        {
          "title": "Feature Prioritization",
          "description": "Analyzes user feedback, market trends, and business goals to assist with feature prioritization"
        },
        {
          "title": "Competitive Analysis",
          "description": "Conducts ongoing analysis of competitor products, features, and positioning to identify opportunities"
        },
        {
          "title": "User Feedback Analysis",
          "description": "Analyzes and synthesizes user feedback from multiple channels to identify patterns and insights"
        }
      ],
      "demoPrompt": "Help me prioritize our product backlog for Q3. Consider our goal of expanding into the healthcare vertical and recent customer feedback."
    }
  ],
  "productivity-agents": [
    {
      "id": "data-analyst",
      "name": "Data Analyst Agent",
      "description": "AI agent that specializes in data analysis, visualization, and interpretation",
      "category": "ai-agents",
      "subcategory": "productivity-agents",
      "model": "openai/gpt-4-turbo",
      "features": [
        "Automated data cleaning and preprocessing",
        "Statistical analysis and modeling",
        "Interactive data visualization",
        "Insight generation and interpretation",
        "Predictive analytics"
      ],
      "implementation": {
        "platform": "OpenAI",
        "apiEndpoint": "/api/agents/data-analyst",
        "authentication": "API Key",
        "dataIntegrations": [
          "SQL databases",
          "Excel/CSV files",
          "Tableau",
          "Power BI",
          "Data warehouses"
        ]
      },
      "useCases": [
        {
          "title": "Sales Data Analysis",
          "description": "Analyzes sales data to identify trends, opportunities, and areas for improvement"
        },
        {
          "title": "Financial Performance",
          "description": "Evaluates financial metrics and KPIs to provide insights on performance and recommendations for optimization"
        },
        {
          "title": "Customer Behavior Analysis",
          "description": "Analyzes customer data to identify patterns, preferences, and opportunities for enhanced engagement"
        }
      ],
      "demoPrompt": "Analyze our Q1 sales data compared to last year. Identify top performing products, regions, and any concerning trends."
    }
  ],
  "research-agents": [
    {
      "id": "research-analyst",
      "name": "Research Analyst Agent",
      "description": "AI agent specialized in comprehensive research and analysis on business topics",
      "category": "ai-agents",
      "subcategory": "research-agents",
      "model": "openai/gpt-4-turbo",
      "features": [
        "Multi-source information gathering",
        "Data analysis and insight generation",
        "Competitive landscape mapping",
        "Report generation with visualizations",
        "Trend identification and forecasting"
      ],
      "implementation": {
        "platform": "OpenAI",
        "apiEndpoint": "/api/agents/research-analyst",
        "authentication": "API Key",
        "dataIntegrations": [
          "Bloomberg Terminal",
          "Refinitiv Eikon",
          "FactSet",
          "S&P Capital IQ",
          "Industry reports"
        ]
      },
      "useCases": [
        {
          "title": "Market Analysis",
          "description": "Conducts comprehensive market research, identifies trends, and provides insights on market opportunities and threats"
        },
        {
          "title": "Competitive Intelligence",
          "description": "Monitors competitors, analyzes their strategies, and identifies potential competitive advantages or threats"
        },
        {
          "title": "Investment Research",
          "description": "Analyzes investment opportunities, conducts due diligence, and provides data-driven investment recommendations"
        }
      ],
      "demoPrompt": "Research the current state of the electric vehicle market in North America. Include key players, market share, growth trends, and regulatory influences."
    }
  ],
  "executive-assistants": [
    {
      "id": "executive-assistant",
      "name": "Executive Assistant Agent",
      "description": "AI agent designed to assist executives with daily tasks and decision support",
      "category": "ai-agents",
      "subcategory": "executive-assistants",
      "model": "openai/gpt-4-turbo",
      "features": [
        "Email prioritization and summarization",
        "Meeting preparation and agenda setting",
        "Information synthesis from multiple sources",
        "Decision support with data analysis",
        "Task and project tracking"
      ],
      "implementation": {
        "platform": "OpenAI",
        "apiEndpoint": "/api/agents/executive-assistant",
        "authentication": "OAuth",
        "dataIntegrations": [
          "Microsoft 365",
          "Google Workspace",
          "Slack",
          "Salesforce",
          "Notion"
        ]
      },
      "useCases": [
        {
          "title": "Meeting Prep",
          "description": "Automatically gathers relevant information about meeting participants and topics, prepares briefing documents, and suggests talking points"
        },
        {
          "title": "Email Management",
          "description": "Prioritizes and summarizes emails, drafts responses to routine inquiries, and flags important messages requiring attention"
        },
        {
          "title": "Strategic Decision Support",
          "description": "Analyzes data from multiple sources to provide insights and recommendations for strategic decisions"
        }
      ],
      "demoPrompt": "Prepare a briefing for my meeting with the marketing team tomorrow. Include recent campaign performance data and key discussion points."
    }
  ]
};
