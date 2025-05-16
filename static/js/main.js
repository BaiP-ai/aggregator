/**
 * BAIP.ai AI Tools Aggregator
 * Main JavaScript file for the AI tools aggregator site
 */

// Initialize when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Initialize scroll to top button
  initScrollToTop();
  
  // Current year for footer
  document.querySelectorAll('.currentYear').forEach(element => {
    element.textContent = new Date().getFullYear();
  });
  
  // Initialize link highlighting based on current page
  highlightCurrentPageLink();
});

/**
 * Initialize scroll to top button
 */
function initScrollToTop() {
  const scrollToTopBtn = document.getElementById('scrollToTop');
  if (!scrollToTopBtn) return;
  
  // Show button when page is scrolled down
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('visible');
    } else {
      scrollToTopBtn.classList.remove('visible');
    }
  });
  
  // Scroll to top when button is clicked
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Highlight the current page link in the navigation
 */
function highlightCurrentPageLink() {
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  const baseUrl = window.BAIP_BASE_PATH || '/aggregator/';
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && currentPath.includes(href) && href !== baseUrl) {
      link.classList.add('active');
    } else if (href === baseUrl && (currentPath === baseUrl || currentPath.endsWith('/aggregator/index.html'))) {
      link.classList.add('active');
    }
  });
}

/**
 * Filter tools based on search criteria
 * @param {Array} tools - Array of tools from search index
 * @param {Object} criteria - Search criteria
 * @returns {Array} - Filtered tools
 */
function filterTools(tools, criteria) {
  return tools.filter(tool => {
    // Filter by search query
    if (criteria.query) {
      const query = criteria.query.toLowerCase();
      const nameMatch = tool.name.toLowerCase().includes(query);
      const descriptionMatch = tool.description.toLowerCase().includes(query);
      const tagMatch = tool.tags && tool.tags.some(tag => tag.toLowerCase().includes(query));
      
      if (!nameMatch && !descriptionMatch && !tagMatch) {
        return false;
      }
    }
    
    // Filter by category
    if (criteria.category && tool.categoryId !== criteria.category) {
      return false;
    }
    
    // Filter by subcategory
    if (criteria.subcategory && tool.subcategoryId !== criteria.subcategory) {
      return false;
    }
    
    // Filter by complexity
    if (criteria.complexity && tool.implementationComplexity !== criteria.complexity) {
      return false;
    }
    
    // Filter by pricing
    if (criteria.pricing && tool.pricingModel !== criteria.pricing) {
      return false;
    }
    
    // Filter by region
    if (criteria.region && !tool.regions.includes(criteria.region)) {
      return false;
    }
    
    // Filter by minimum score
    if (criteria.minScore && tool.smeSuitabilityScore < criteria.minScore) {
      return false;
    }
    
    return true;
  });
}

/**
 * Sort tools based on sort criteria
 * @param {Array} tools - Array of tools to sort
 * @param {string} sortBy - Sort criteria
 * @returns {Array} - Sorted tools
 */
function sortTools(tools, sortBy) {
  const sortedTools = [...tools];
  
  switch (sortBy) {
    case 'name-asc':
      sortedTools.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      sortedTools.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case 'score-desc':
      sortedTools.sort((a, b) => b.smeSuitabilityScore - a.smeSuitabilityScore);
      break;
    case 'score-asc':
      sortedTools.sort((a, b) => a.smeSuitabilityScore - b.smeSuitabilityScore);
      break;
    case 'relevance':
    default:
      // Relevance is the default, no special sorting needed
      break;
  }
  
  return sortedTools;
}

/**
 * Log search query to analytics
 * @param {string} query - Search query
 */
function logSearchQuery(query) {
  if (!query) return;
  
  // This would typically send the query to a server for logging
  // For now, we just log to console
  console.log('Search query:', query);
}

/**
 * Get complexity badge class based on complexity
 * @param {string} complexity - Complexity level
 * @returns {string} - Badge class
 */
function getComplexityBadgeClass(complexity) {
  switch (complexity) {
    case 'Low':
      return 'bg-green-500';
    case 'Medium':
      return 'bg-yellow-500';
    case 'High':
      return 'bg-red-500';
    default:
      return 'bg-gray-500';
  }
}
