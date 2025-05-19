// Executive Assistant agent implementation
// This file is designed to work in both development and production environments

// Executive Assistant system prompt
const EXECUTIVE_ASSISTANT_PROMPT = `You are an Executive Assistant AI agent designed to help Fortune 500 executives with their daily tasks and decision-making. 

Your capabilities include:
1. Email prioritization and summarization
2. Meeting preparation and agenda setting
3. Information synthesis from multiple sources
4. Decision support with data analysis
5. Task and project tracking

As an executive assistant, you should:
- Be concise and to the point
- Prioritize important information
- Provide structured, scannable responses
- Offer clear recommendations when appropriate
- Maintain a professional and helpful tone

Please help the executive with their request in the most efficient and effective way possible.`;

// Mock implementation - used during build or when API is unavailable
class MockOpenAIClient {
  constructor() {
    this.chat = {
      completions: {
        create: async () => ({
          choices: [
            {
              message: {
                content: "This is a placeholder response. The AI agent is not available in this environment."
              }
            }
          ]
        })
      }
    };
  }
}

// Create a client - real or mock depending on environment
async function createClient() {
  // Always use mock client in build/production mode
  if (process.env.NODE_ENV === 'production' || process.env.DISABLE_API_CALLS === 'true') {
    return new MockOpenAIClient();
  }
  
  // In development, try to use the real OpenAI client
  try {
    const { default: OpenAI } = await import('openai');
    return new OpenAI({
      apiKey: process.env.OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY
    });
  } catch (error) {
    console.warn('OpenAI SDK not available, using mock client:', error.message);
    return new MockOpenAIClient();
  }
}

/**
 * Executive Assistant AI Agent
 * @param {string} userPrompt - The user's prompt or question
 * @returns {Promise<string>} - The agent's response
 */
export async function executiveAssistantAgent(userPrompt) {
  try {
    // Check if we're in a build/production environment
    if (process.env.NODE_ENV === 'production' || process.env.DISABLE_API_CALLS === 'true') {
      return "This is a placeholder response. The AI agent is not available in this environment.";
    }
    
    // Create a client - will be real in dev, mock in production
    const client = await createClient();
    
    // Call the API with the system prompt and user input
    const chatCompletion = await client.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: EXECUTIVE_ASSISTANT_PROMPT,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      model: 'gpt-4-turbo',
    });

    // Return the assistant's response
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error('Error calling Executive Assistant Agent:', error);
    return 'I apologize, but I encountered an error processing your request. Please try again or contact support if the issue persists.';
  }
}

// API endpoint handler for the Executive Assistant agent
export async function POST({ request }) {
  try {
    const data = await request.json();
    const { prompt } = data;
    
    if (!prompt) {
      return new Response(
        JSON.stringify({
          error: 'Missing required field: prompt',
        }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    // Check if we're in a production environment
    if (process.env.NODE_ENV === 'production' || process.env.DISABLE_API_CALLS === 'true') {
      return new Response(
        JSON.stringify({
          response: "This is a placeholder response. The AI agent is not available in this environment.",
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
    
    const response = await executiveAssistantAgent(prompt);
    
    return new Response(
      JSON.stringify({
        response,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Failed to process request',
        details: error.message,
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
