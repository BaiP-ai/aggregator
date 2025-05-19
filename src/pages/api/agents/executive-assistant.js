import { executiveAssistantAgent } from '../../../agents/executiveAssistant/index.js';

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
    
    // Check if we're in a production environment and have the API key
    const apiKey = import.meta.env.OPENAI_API_KEY;
    if (!apiKey || apiKey === 'dummy-key-for-build-process') {
      return new Response(
        JSON.stringify({
          response: "This is a placeholder response. The AI agent is not available in the build environment.",
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
