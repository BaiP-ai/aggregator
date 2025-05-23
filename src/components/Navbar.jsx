import { createSignal, onMount } from 'solid-js';
import AILogoChip from './AILogoChip';

// Function to dispatch a custom event to open the modal
const openContactModal = () => {
  window.dispatchEvent(new CustomEvent('open-contact-modal'));
};

const Navbar = () => {
  const [isScrolled, setIsScrolled] = createSignal(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false);
  const [activeSection, setActiveSection] = createSignal("hero");
  const [currentPath, setCurrentPath] = createSignal("");
  
  onMount(() => {
    let ticking = false;
    
    // Set current path on mount
    setCurrentPath(window.location.pathname);
    
    const handleScroll = () => {
      // Check if we're at the top
      const isAtTop = window.scrollY < 20;
      
      if (isAtTop) {
        // At the top: not scrolled styling
        setIsScrolled(false);
      } else {
        // Scrolled down: scrolled styling
        setIsScrolled(true);
      }

      // Determine active section based on scroll position
      const sections = ["hero", "about", "services", "approach", "why", "testimonials", "contact-trigger"];
      
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = document.getElementById(sections[i]);
        if (section) {
          const rect = section.getBoundingClientRect();
          if (rect.top <= 100) {
            setActiveSection(sections[i]);
            break;
          }
        }
      }
    };
    
    // Use requestAnimationFrame for better performance
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };    
    // Initial check for page load with scroll already happened
    handleScroll();
    
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  const toggleMobileMenu = (isOpen) => {
    setIsMobileMenuOpen(isOpen);
  };

  return (
    <header
      class={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled() 
          ? 'py-2 bg-white/90 backdrop-blur-md shadow-sm border-b border-b-gradient' 
          : 'py-4 bg-white'
      }`}
    >
      {/* Gradient border line animation that appears when scrolled */}
      <div 
        class={`absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-blue-400 via-primary to-secondary transform transition-transform duration-700 ${
          isScrolled() ? 'scale-x-100' : 'scale-x-0'
        }`} 
      />
      
      <div class="container mx-auto px-4">
        <div class="flex items-center justify-between">
          <a href="/" class="flex items-center group">
            {/* Further reduced margin between logo and text */}
            <div class="relative overflow-hidden mr-1">
              <AILogoChip size="70" class="transition-transform duration-300 group-hover:scale-110" />
              <div class="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 rounded-full transform scale-0 group-hover:scale-100 transition-all duration-300"></div>
            </div>
            <div class="flex flex-col">
              <span class={`text-base md:text-lg lg:text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent transform transition-all duration-300 group-hover:translate-x-1`}>
                Boston AI Partners
              </span>
              <span class="text-xs md:text-sm text-gray-500 group-hover:text-primary transition-colors duration-300">
                Responsible AI Solutions
              </span>
            </div>
          </a>

          <nav class="hidden md:flex space-x-8 items-center">
            {/* Navigation links with enhanced hover and active effects */}
            <a 
              href="/#about" 
              class={`relative font-medium transition-colors text-gray-700 hover:text-primary py-1 px-1 overflow-hidden group`}
            >
              About
              <span class={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ${
                activeSection() === 'about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </a>            
            <a 
              href="/#services" 
              class={`relative font-medium transition-colors text-gray-700 hover:text-primary py-1 px-1 overflow-hidden group`}
            >
              Services
              <span class={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ${
                activeSection() === 'services' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </a>
            
            <a 
              href="/#approach" 
              class={`relative font-medium transition-colors text-gray-700 hover:text-primary py-1 px-1 overflow-hidden group`}
            >
              Approach
              <span class={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ${
                activeSection() === 'approach' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </a>
            
            <a 
              href="/aggregator" 
              class={`relative font-medium transition-colors text-gray-700 hover:text-primary py-1 px-1 overflow-hidden group`}
            >
              AI Aggregator
              <span class={`absolute bottom-0 left-0 w-full h-0.5 bg-primary transform transition-transform duration-300 ${
                currentPath() === '/aggregator' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></span>
            </a>
            
            <button 
              onClick={openContactModal} 
              class={`cta-button relative overflow-hidden group`}
            >
              <span class="relative z-10">Contact Us</span>
              <span class="absolute top-0 left-0 w-full h-full bg-white opacity-0 group-hover:opacity-25 transform translate-y-full group-hover:translate-y-0 transition-all duration-300"></span>
            </button>
          </nav>

          <button
            onClick={() => toggleMobileMenu(!isMobileMenuOpen())}
            class={`md:hidden p-2 transition-colors text-gray-700 rounded-full hover:bg-gray-100 active:bg-gray-200`}
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
      </div>

      <div
        class={`md:hidden absolute top-full left-0 right-0 transition-all duration-300 ease-in-out overflow-hidden bg-white shadow-lg border-t border-gray-200/50 ${
          isMobileMenuOpen() ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav class="flex flex-col px-4 py-2 space-y-2">
          <a 
            href="#about" 
            onClick={() => toggleMobileMenu(false)} 
            class={`block py-2 font-medium transition-colors hover:text-primary ${
              activeSection() === 'about' ? 'text-primary pl-2 border-l-2 border-primary bg-blue-50/50' : 'text-gray-700'
            }`}
          >
            About
          </a>
          <a 
            href="#services" 
            onClick={() => toggleMobileMenu(false)} 
            class={`block py-2 font-medium transition-colors hover:text-primary ${
              activeSection() === 'services' ? 'text-primary pl-2 border-l-2 border-primary bg-blue-50/50' : 'text-gray-700'
            }`}
          >
            Services
          </a>
          <a 
            href="#approach" 
            onClick={() => toggleMobileMenu(false)} 
            class={`block py-2 font-medium transition-colors hover:text-primary ${
              activeSection() === 'approach' ? 'text-primary pl-2 border-l-2 border-primary bg-blue-50/50' : 'text-gray-700'
            }`}
          >
            Approach
          </a>
          <a 
            href="/aggregator" 
            onClick={() => toggleMobileMenu(false)} 
            class={`block py-2 font-medium transition-colors hover:text-primary ${
              currentPath() === '/aggregator' ? 'text-primary pl-2 border-l-2 border-primary bg-blue-50/50' : 'text-gray-700'
            }`}
          >
            AI Aggregator
          </a>
          <button 
            onClick={() => {
              openContactModal();
              toggleMobileMenu(false); // Close menu after clicking
            }} 
            class={`block py-2 cta-button w-full text-center relative overflow-hidden`}
          >
            <span class="relative z-10">Contact Us</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;