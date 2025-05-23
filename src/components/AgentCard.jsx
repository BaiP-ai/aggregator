// Agent card component for displaying AI agents
import { getSitePath } from '../utils/paths.js';

const AgentCard = (props) => {
  const { agent } = props;

  return (
    <div class="card h-full flex flex-col">
      <div class="p-6 flex-grow">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 mr-4 flex-shrink-0 bg-purple-100 dark:bg-purple-900 rounded-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-purple-600 dark:text-purple-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">{agent.name}</h3>
            <span class="text-xs font-medium text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900 px-2 py-1 rounded-full">
              {agent.model.split('/')[1]}
            </span>
          </div>
        </div>
        
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {agent.description}
        </p>
        
        <div class="mb-4">
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Features</h4>
          <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
            {agent.features && agent.features.slice(0, 3).map((feature) => (
              <li>{feature}</li>
            ))}
          </ul>
        </div>
        
        <div class="mb-4">
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Use Case Example</h4>
          <div class="text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900 rounded-md p-3 border border-gray-200 dark:border-gray-700">
            {agent.useCases && agent.useCases[0]?.title}: {agent.useCases && agent.useCases[0]?.description}
          </div>
        </div>
      </div>
      
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div class="flex justify-between items-center">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
            Powered by {agent.implementation.platform}
          </span>
          <a href={getSitePath(`/agents/${agent.id}`)} class="btn btn-sm btn-accent text-sm bg-purple-600 hover:bg-purple-700 text-white">
            Try Agent
          </a>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;