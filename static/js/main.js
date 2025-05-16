/**
 * BAIP.ai AI Aggregator
 * Main JavaScript file for the AI tools aggregator site
 */

// Base URL for all API requests
const BASE_URL = '';  // Empty string for relative paths with the <base> tag

document.addEventListener('DOMContentLoaded', function() {
    // Initialize search functionality
    initSearch();
    
    // Initialize category request form
    initCategoryRequestForm();
    
    // Initialize tool suggestion form
    initToolSuggestionForm();
    
    // Initialize subcategory selection in search form
    initSubcategorySelection();
    
    // Initialize copy to clipboard functionality
    initCopyToClipboard();
    
    // Current year for footer
    document.querySelectorAll('.currentYear').forEach(element => {
        element.textContent = new Date().getFullYear();
    });
});

/**
 * Initialize search functionality
 */
function initSearch() {
    const searchForm = document.getElementById('advanced-search-form');
    if (!searchForm) return;
    
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');
    
    // If there's a query parameter, fill the search form and trigger search
    if (query) {
        document.getElementById('searchQuery').value = query;
        
        // Fill other form fields if present in URL
        const category = urlParams.get('category');
        if (category) document.getElementById('category').value = category;
        
        const subcategory = urlParams.get('subcategory');
        if (subcategory) document.getElementById('subcategory').value = subcategory;
        
        const complexity = urlParams.get('complexity');
        if (complexity) document.getElementById('complexity').value = complexity;
        
        const pricing = urlParams.get('pricing');
        if (pricing) document.getElementById('pricing').value = pricing;
        
        const region = urlParams.get('region');
        if (region) document.getElementById('region').value = region;
        
        const minScore = urlParams.get('minScore');
        if (minScore) document.getElementById('minScore').value = minScore;
        
        // Perform search
        performSearch();
    }
    
    // Add event listener to search form
    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        performSearch();
    });
}

/**
 * Perform search based on form inputs
 */
function performSearch() {
    const searchQuery = document.getElementById('searchQuery').value.trim();
    const category = document.getElementById('category').value;
    const subcategory = document.getElementById('subcategory').value;
    const complexity = document.getElementById('complexity').value;
    const pricing = document.getElementById('pricing').value;
    const region = document.getElementById('region').value;
    const minScore = document.getElementById('minScore').value;
    
    // Show loading state
    const resultsContainer = document.getElementById('resultsContainer');
    resultsContainer.innerHTML = `
        <div class="search-loading">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3">Searching for tools...</p>
        </div>
    `;
    
    document.getElementById('searchResults').style.display = 'block';
    document.getElementById('noResults').style.display = 'none';
    document.getElementById('loadMoreResults').style.display = 'none';
    
    // Log search query to server
    logSearchQuery(searchQuery);
    
    // Update URL with search parameters
    const searchParams = new URLSearchParams();
    if (searchQuery) searchParams.set('q', searchQuery);
    if (category) searchParams.set('category', category);
    if (subcategory) searchParams.set('subcategory', subcategory);
    if (complexity) searchParams.set('complexity', complexity);
    if (pricing) searchParams.set('pricing', pricing);
    if (region) searchParams.set('region', region);
    if (minScore) searchParams.set('minScore', minScore);
    
    const newUrl = window.location.pathname + '?' + searchParams.toString();
    window.history.pushState({ path: newUrl }, '', newUrl);
    
    // Fetch search index and perform search
    fetch(`${BASE_URL}data/search-index.json`)
        .then(response => response.json())
        .then(searchIndex => {
            // Filter tools based on search criteria
            let results = filterTools(searchIndex, {
                query: searchQuery,
                category,
                subcategory,
                complexity,
                pricing,
                region,
                minScore: minScore ? parseFloat(minScore) : null
            });
            
            // Show results
            displaySearchResults(results);
        })
        .catch(error => {
            console.error('Error fetching search index:', error);
            resultsContainer.innerHTML = `
                <div class="alert alert-danger">
                    <p class="mb-0">Error loading search results. Please try again later.</p>
                </div>
            `;
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
            const tagMatch = tool.tags.some(tag => tag.toLowerCase().includes(query));
            
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
 * Display search results
 * @param {Array} results - Array of filtered tools
 */
function displaySearchResults(results) {
    const resultsContainer = document.getElementById('resultsContainer');
    const resultCount = document.getElementById('resultCount');
    const noResults = document.getElementById('noResults');
    const loadMoreResults = document.getElementById('loadMoreResults');
    
    // Update result count
    resultCount.textContent = results.length;
    
    // Show no results message if no results
    if (results.length === 0) {
        resultsContainer.innerHTML = '';
        noResults.style.display = 'block';
        return;
    }
    
    // Fetch full tool data
    fetch(`${BASE_URL}data/tools.json`)
        .then(response => response.json())
        .then(allTools => {
            // Create a map of tool IDs to full tool data
            const toolMap = {};
            allTools.forEach(tool => {
                toolMap[tool.id] = tool;
            });
            
            // Clear results container
            resultsContainer.innerHTML = '';
            
            // Display first batch of results
            const batchSize = 12;
            const firstBatch = results.slice(0, batchSize);
            
            firstBatch.forEach(result => {
                const tool = toolMap[result.id];
                if (tool) {
                    const toolElement = createToolElement(tool);
                    resultsContainer.appendChild(toolElement);
                }
            });
            
            // Show load more button if there are more results
            if (results.length > batchSize) {
                loadMoreResults.style.display = 'inline-block';
                loadMoreResults.dataset.currentPage = 1;
                loadMoreResults.dataset.totalResults = results.length;
                
                loadMoreResults.addEventListener('click', function() {
                    const currentPage = parseInt(this.dataset.currentPage);
                    const nextPage = currentPage + 1;
                    const startIndex = currentPage * batchSize;
                    const endIndex = startIndex + batchSize;
                    const nextBatch = results.slice(startIndex, endIndex);
                    
                    nextBatch.forEach(result => {
                        const tool = toolMap[result.id];
                        if (tool) {
                            const toolElement = createToolElement(tool);
                            resultsContainer.appendChild(toolElement);
                        }
                    });
                    
                    this.dataset.currentPage = nextPage;
                    
                    // Hide load more button if no more results
                    if (endIndex >= results.length) {
                        this.style.display = 'none';
                    }
                });
            }
        })
        .catch(error => {
            console.error('Error fetching tool data:', error);
            resultsContainer.innerHTML = `
                <div class="alert alert-danger">
                    <p class="mb-0">Error loading tool data. Please try again later.</p>
                </div>
            `;
        });
}

/**
 * Create tool element from template
 * @param {Object} tool - Tool data
 * @returns {HTMLElement} - Tool element
 */
function createToolElement(tool) {
    // Clone template
    const template = document.getElementById('tool-template');
    const toolElement = template.content.cloneNode(true);
    
    // Update tool data
    toolElement.querySelector('.tool-name').textContent = tool.name;
    toolElement.querySelector('.tool-description').textContent = tool.description;
    toolElement.querySelector('.tool-details-link').href = `tool/${tool.id}.html`;
    toolElement.querySelector('.tool-website-link').href = tool.url;
    
    // Update logo if available
    if (tool.logo) {
        const logoContainer = toolElement.querySelector('.tool-logo-container');
        logoContainer.innerHTML = `<img src="${BASE_URL}static/images/logos/${tool.logo}" alt="${tool.name} Logo" class="tool-logo">`;
    }
    
    // Add badges
    const badgesContainer = toolElement.querySelector('.tool-badges');
    
    if (tool.implementationComplexity) {
        const complexityBadge = document.createElement('span');
        complexityBadge.className = `badge ${getComplexityBadgeClass(tool.implementationComplexity)}`;
        complexityBadge.innerHTML = `<i class="bi bi-gear"></i> ${tool.implementationComplexity}`;
        badgesContainer.appendChild(complexityBadge);
    }
    
    if (tool.pricingModel) {
        const pricingBadge = document.createElement('span');
        pricingBadge.className = 'badge bg-secondary';
        pricingBadge.innerHTML = `<i class="bi bi-tag"></i> ${tool.pricingModel}`;
        badgesContainer.appendChild(pricingBadge);
    }
    
    if (tool.smeSuitabilityScore) {
        const scoreBadge = document.createElement('span');
        scoreBadge.className = 'badge bg-primary';
        scoreBadge.innerHTML = `<i class="bi bi-star"></i> SME Score: ${tool.smeSuitabilityScore}`;
        badgesContainer.appendChild(scoreBadge);
    }
    
    return toolElement.querySelector('.col');
}

/**
 * Get badge class based on complexity
 * @param {string} complexity - Complexity level
 * @returns {string} - Badge class
 */
function getComplexityBadgeClass(complexity) {
    switch (complexity) {
        case 'Low':
            return 'bg-success';
        case 'Medium':
            return 'bg-warning';
        case 'High':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

/**
 * Log search query to server
 * @param {string} query - Search query
 */
function logSearchQuery(query) {
    if (!query) return;
    
    fetch(`${BASE_URL}api/search`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
    })
    .catch(error => {
        console.error('Error logging search query:', error);
    });
}

/**
 * Initialize subcategory selection in search form
 */
function initSubcategorySelection() {
    const categorySelect = document.getElementById('category');
    const subcategorySelect = document.getElementById('subcategory');
    
    if (!categorySelect || !subcategorySelect) return;
    
    // Fetch categories data
    fetch(`${BASE_URL}data/categories.json`)
        .then(response => response.json())
        .then(categories => {
            // Create category map
            const categoryMap = {};
            categories.forEach(category => {
                categoryMap[category.id] = category.subcategories;
            });
            
            // Update subcategories when category changes
            categorySelect.addEventListener('change', function() {
                const categoryId = this.value;
                
                // Clear subcategory options
                subcategorySelect.innerHTML = '<option value="">All Subcategories</option>';
                
                // Disable subcategory select if no category selected
                if (!categoryId) {
                    subcategorySelect.disabled = true;
                    return;
                }
                
                // Get subcategories for selected category
                const subcategories = categoryMap[categoryId];
                
                if (subcategories && subcategories.length > 0) {
                    // Add subcategory options
                    subcategories.forEach(subcategory => {
                        const option = document.createElement('option');
                        option.value = subcategory.id;
                        option.textContent = `${subcategory.name} (${subcategory.count})`;
                        subcategorySelect.appendChild(option);
                    });
                    
                    // Enable subcategory select
                    subcategorySelect.disabled = false;
                } else {
                    subcategorySelect.disabled = true;
                }
            });
            
            // Trigger change event if category is already selected (e.g. from URL params)
            if (categorySelect.value) {
                categorySelect.dispatchEvent(new Event('change'));
                
                // Select subcategory if present in URL params
                const urlParams = new URLSearchParams(window.location.search);
                const subcategory = urlParams.get('subcategory');
                if (subcategory) {
                    subcategorySelect.value = subcategory;
                }
            }
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
}

/**
 * Initialize category request form
 */
function initCategoryRequestForm() {
    const submitButton = document.getElementById('submitCategoryRequest');
    if (!submitButton) return;
    
    submitButton.addEventListener('click', function() {
        const form = document.getElementById('categoryRequestForm');
        
        // Simple validation
        const categoryName = document.getElementById('categoryName').value.trim();
        const description = document.getElementById('description').value.trim();
        const businessNeed = document.getElementById('businessNeed').value.trim();
        
        if (!categoryName || !description || !businessNeed) {
            alert('Please fill out all required fields.');
            return;
        }
        
        // Get optional fields
        const industryFocus = document.getElementById('industryFocus').value.trim();
        const companySize = document.getElementById('companySize').value;
        const contactEmail = document.getElementById('contactEmail').value.trim();
        
        // Submit request
        fetch(`${BASE_URL}api/request-category`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                categoryName,
                description,
                businessNeed,
                industryFocus,
                companySize,
                contactEmail
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Clear form
                form.reset();
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('requestCategoryModal'));
                modal.hide();
                
                // Show success message
                alert('Thank you for your category request! We\'ll review it and consider adding it to our directory.');
            } else {
                alert('Error submitting category request. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error submitting category request:', error);
            alert('Error submitting category request. Please try again.');
        });
    });
}

/**
 * Initialize tool suggestion form
 */
function initToolSuggestionForm() {
    const submitButton = document.getElementById('submitToolSuggestion');
    if (!submitButton) return;
    
    submitButton.addEventListener('click', function() {
        const form = document.getElementById('toolSuggestionForm');
        
        // Simple validation
        const toolName = document.getElementById('toolName').value.trim();
        const toolUrl = document.getElementById('toolUrl').value.trim();
        const toolDescription = document.getElementById('toolDescription').value.trim();
        
        if (!toolName || !toolUrl || !toolDescription) {
            alert('Please fill out all required fields.');
            return;
        }
        
        // Get optional fields
        const contactEmail = document.getElementById('contactEmail').value.trim();
        
        // Submit request
        fetch(`${BASE_URL}api/suggest-tool`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                toolName,
                toolUrl,
                toolDescription,
                contactEmail
            })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Clear form
                form.reset();
                
                // Close modal
                const modal = bootstrap.Modal.getInstance(document.getElementById('requestToolModal'));
                modal.hide();
                
                // Show success message
                alert('Thank you for suggesting this tool! We\'ll review it and consider adding it to our directory.');
            } else {
                alert('Error submitting tool suggestion. Please try again.');
            }
        })
        .catch(error => {
            console.error('Error submitting tool suggestion:', error);
            alert('Error submitting tool suggestion. Please try again.');
        });
    });
}

/**
 * Initialize copy to clipboard functionality
 */
function initCopyToClipboard() {
    const copyButtons = document.querySelectorAll('.copy-button');
    
    copyButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.dataset.clipboardTarget;
            const targetElement = document.querySelector(targetId);
            
            if (!targetElement) return;
            
            // Copy to clipboard
            navigator.clipboard.writeText(targetElement.value)
                .then(() => {
                    // Show success state
                    this.classList.add('copied');
                    this.innerHTML = '<i class="bi bi-check"></i> Copied';
                    
                    // Reset after 2 seconds
                    setTimeout(() => {
                        this.classList.remove('copied');
                        this.innerHTML = '<i class="bi bi-clipboard"></i> Copy';
                    }, 2000);
                })
                .catch(error => {
                    console.error('Error copying to clipboard:', error);
                    alert('Error copying to clipboard. Please try again.');
                });
        });
    });
}
