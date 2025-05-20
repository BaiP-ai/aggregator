import { createSignal, onMount } from 'solid-js';
import AILogoChip from './AILogoChip';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false);
  const [isScrolled, setIsScrolled] = createSignal(false);
  
  onMount(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Check initial scroll position
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up event listener
    return () => window.removeEventListener('scroll', handleScroll);
  });
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen());
  };
  
  const basePath = import.meta.env.BASE_URL || '/';
  
  return (
    <header class={`bg-white shadow-sm ${isScrolled() ? 'py-2' : 'py-4'} transition-all duration-300`}>
      <div class="container mx-auto px-4 flex items-center justify-between">
        <a href={basePath} class="flex items-center group">
          <div class="relative overflow-hidden mr-1">
            <AILogoChip size="70" class="transition-transform duration-300 group-hover:scale-110" />
            <div class="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 rounded-full transform scale-0 group-hover:scale-100 transition-all duration-300"></div>
          </div>
          <div class="flex flex-col">
            <span class="text-base md:text-lg lg:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transform transition-all duration-300 group-hover:translate-x-1">
              Boston AI Partners
            </span>
            <span class="text-xs md:text-sm text-gray-500 group-hover:text-primary transition-colors duration-300">
              Responsible AI Solutions
            </span>
          </div>
        </a>
        
        <nav class="hidden md:flex items-center space-x-8">
          <a href={`${basePath}about`} class="relative font-medium transition-colors text-gray-700 hover:text-primary py-1 px-1 overflow-hidden group">
            About
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></span>
          </a>
          <a href={`${basePath}services`} class="relative font-medium transition-colors text-gray-700 hover:text-primary py-1 px-1 overflow-hidden group">
            Services
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></span>
          </a>
          <a href={`${basePath}approach`} class="relative font-medium transition-colors text-gray-700 hover:text-primary py-1 px-1 overflow-hidden group">
            Approach
            <span class="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></span>
          </a>
          <a href={`${basePath}contact`} class="bg-gradient-to-r from-primary to-secondary px-6 py-3 rounded-full font-medium text-white shadow-lg transition-all duration-300 relative overflow-hidden group">
            <span class="relative z-10">Contact Us</span>
            <span class="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-25 transform translate-y-full group-hover:translate-y-0 transition-all duration-300"></span>
          </a>
        </nav>
        
        <button 
          onClick={toggleMobileMenu} 
          class="md:hidden p-2 transition-colors text-gray-700 rounded-full hover:bg-gray-100 active:bg-gray-200"
          aria-label="Toggle menu"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d={isMobileMenuOpen() ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
            ></path>
          </svg>
        </button>
      </div>
      
      <div
        class={`md:hidden absolute top-full left-0 right-0 transition-all duration-300 ease-in-out overflow-hidden bg-white shadow-lg border-t border-gray-200/50 ${
          isMobileMenuOpen() ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav class="flex flex-col px-4 py-2 space-y-2">
          <a 
            href={`${basePath}about`} 
            onClick={() => setIsMobileMenuOpen(false)} 
            class="block py-2 font-medium transition-colors hover:text-primary text-gray-700"
          >
            About
          </a>
          <a 
            href={`${basePath}services`} 
            onClick={() => setIsMobileMenuOpen(false)} 
            class="block py-2 font-medium transition-colors hover:text-primary text-gray-700"
          >
            Services
          </a>
          <a 
            href={`${basePath}approach`} 
            onClick={() => setIsMobileMenuOpen(false)} 
            class="block py-2 font-medium transition-colors hover:text-primary text-gray-700"
          >
            Approach
          </a>
          <a 
            href={`${basePath}contact`} 
            onClick={() => setIsMobileMenuOpen(false)} 
            class="block py-2 bg-gradient-to-r from-primary to-secondary px-4 rounded-full font-medium text-white text-center my-2"
          >
            Contact Us
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;