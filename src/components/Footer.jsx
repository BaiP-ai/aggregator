import { Motion } from '@motionone/solid';
import AILogoChip from './AILogoChip';

// Import the same function used in the Navbar
const openContactModal = () => {
  window.dispatchEvent(new CustomEvent('open-contact-modal'));
};

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer class="bg-gradient-to-b from-light to-gray-100 border-t border-gray-200 pt-16 pb-8">
      <div class="container mx-auto px-4">
        <div class="grid md:grid-cols-3 gap-8 mb-12">
          <div>
            <div class="flex items-center mb-4">
              {/* Further reduced margin between logo and text to match Navbar */}
              <div class="relative overflow-hidden mr-1">
                <AILogoChip size="70" class="transition-transform duration-300 hover:scale-110" />
              </div>
              <div class="flex flex-col">
                <span class="text-base md:text-lg lg:text-2xl font-display font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Boston AI Partners
                </span>
                <span class="text-xs md:text-sm text-gray-500">
                  Responsible AI Solutions
                </span>
              </div>
            </div>
            <p class="text-dark/80 max-w-xs">
              Empowering the future with responsible, real-world AI solutions that respect people and data.
            </p>
          </div>
          
          <div>
            <h3 class="font-display font-bold text-dark mb-4">Quick Links</h3>
            <ul class="space-y-2">
              <li><a href="#about" class="text-dark/80 hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#services" class="text-dark/80 hover:text-primary transition-colors">Services</a></li>
              <li><a href="#approach" class="text-dark/80 hover:text-primary transition-colors">Our Approach</a></li>
              <li><button onClick={openContactModal} class="text-dark/80 hover:text-primary transition-colors text-left">Contact</button></li>
            </ul>
          </div>
          
          <div>
            <h3 class="font-display font-bold text-dark mb-4">Get in Touch</h3>
            <p class="text-dark/80 mb-4">
              Boston, Massachusetts<br />
              <a href="mailto:contact@baip.ai" class="hover:text-primary transition-colors">contact@baip.ai</a>
            </p>
            
            <div class="flex space-x-4">
              {/* LinkedIn */}
              <Motion.a                href="https://www.linkedin.com/company/baip-ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-dark/80 hover:bg-primary/20 hover:text-primary transition-all shadow-sm"
                whileHover={{ scale: 1.1 }}
                aria-label="LinkedIn"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </Motion.a>
              
              {/* X (Twitter) */}
              <Motion.a 
                href="https://x.com/BAIP_AI" 
                target="_blank" 
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-dark/80 hover:bg-primary/20 hover:text-primary transition-all shadow-sm"
                whileHover={{ scale: 1.1 }}
                aria-label="X (Twitter)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </Motion.a>
              
              {/* GitHub */}
              <Motion.a 
                href="https://github.com/BaiP-ai" 
                target="_blank" 
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-dark/80 hover:bg-primary/20 hover:text-primary transition-all shadow-sm"
                whileHover={{ scale: 1.1 }}
                aria-label="GitHub"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </Motion.a>              
              {/* YouTube */}
              <Motion.a 
                href="https://www.youtube.com/@BAIP-AI" 
                target="_blank" 
                rel="noopener noreferrer"
                class="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-dark/80 hover:bg-primary/20 hover:text-primary transition-all shadow-sm"
                whileHover={{ scale: 1.1 }}
                aria-label="YouTube"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                </svg>
              </Motion.a>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-8 text-center text-dark/60 text-sm">
          <p>&copy; {currentYear} Boston AI Partners. All rights reserved.</p>
          <div class="mt-2 flex justify-center space-x-6">
            <a href="#" class="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" class="hover:text-primary transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;