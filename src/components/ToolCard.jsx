// Tool card component for displaying AI tools
import { getAssetPath } from '../utils/paths.js';

const ToolCard = (props) => {
  const { tool } = props;

  return (
    <div class="card h-full flex flex-col">
      <div class="p-6 flex-grow">
        <div class="flex items-center mb-4">
          <div class="w-12 h-12 mr-4 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
            {tool.logo ? 
              <img 
                src={getAssetPath(tool.logo)} 
                alt={`${tool.name} logo`} 
                class="w-10 h-10 object-contain" 
                onError={(e) => { e.target.src = getAssetPath('/images/logos/placeholder.svg'); }}
              /> :
              <img 
                src={getAssetPath('/images/logos/placeholder.svg')} 
                alt={`${tool.name} logo`} 
                class="w-10 h-10 object-contain" 
              />
            }
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">{tool.name}</h3>
            <div class="flex flex-wrap gap-1">
              {tool.tags && tool.tags.slice(0, 2).map((tag) => (
                <span class="tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
        
        <p class="text-gray-600 dark:text-gray-400 text-sm mb-4">
          {tool.description}
        </p>
        
        <div class="mb-4">
          <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Use Cases</h4>
          <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1 list-disc list-inside">
            {tool.useCases && tool.useCases.slice(0, 3).map((useCase) => (
              <li>{useCase}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <div class="p-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
        <div class="flex justify-between items-center">
          <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
            {tool.pricing}
          </span>
          <a href={tool.url} target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary text-sm">
            Learn More
          </a>
        </div>
      </div>
    </div>
  );
};

export default ToolCard;