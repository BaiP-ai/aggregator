/**
 * Initialization script for the AI Aggregator page
 * Ensures all UI components display correctly and handle interactions properly
 */

// Wait for DOM content to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  // Ensure header is visible and positioned correctly
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    navbar.style.visibility = 'visible';
    
    // Fix any styling issues
    navbar.style.position = 'fixed';
    navbar.style.top = '0';
    navbar.style.left = '0';
    navbar.style.width = '100%';
    navbar.style.zIndex = '100';
  }
  
  // Ensure footer is visible and positioned correctly
  const footer = document.querySelector('footer');
  if (footer) {
    footer.style.visibility = 'visible';
    footer.style.zIndex = '10';
  }
  
  // Ensure dropdown menus work properly
  const dropdowns = document.querySelectorAll('.relative.group');
  dropdowns.forEach(dropdown => {
    const menu = dropdown.querySelector('.dropdown-menu');
    if (menu) {
      dropdown.addEventListener('mouseenter', () => {
        menu.classList.add('show');
      });
      
      dropdown.addEventListener('mouseleave', () => {
        menu.classList.remove('show');
      });
    }
  });
  
  // Fix scroll handling
  window.addEventListener('scroll', function() {
    const scrollY = window.scrollY;
    
    // Add shadow to header on scroll
    if (navbar) {
      if (scrollY > 10) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
    
    // Show/hide scroll to top button
    const scrollToTopBtn = document.getElementById('scrollToTop');
    if (scrollToTopBtn) {
      if (scrollY > 300) {
        scrollToTopBtn.classList.remove('opacity-0', 'invisible');
        scrollToTopBtn.classList.add('opacity-100', 'visible');
      } else {
        scrollToTopBtn.classList.add('opacity-0', 'invisible');
        scrollToTopBtn.classList.remove('opacity-100', 'visible');
      }
    }
  });
  
  // Log initialization
  console.log('AI Aggregator UI initialized successfully');
});
