// Hero component for the main page
const Hero = (props) => {
  const { 
    title = "Enterprise AI Aggregator", 
    subtitle = "Discover the best AI tools for Fortune 500 companies",
    showSearch = true
  } = props;

  return (
    <section class="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 md:py-24">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">{title}</h1>
        <p class="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">{subtitle}</p>
        
        {showSearch && (
          <div class="max-w-2xl mx-auto">
            <div class="relative">
              <input
                type="text"
                placeholder="Search for AI tools and agents..."
                class="w-full py-4 px-6 rounded-full bg-white text-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button class="absolute right-2 top-2 bg-primary hover:bg-blue-700 text-white p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
            </div>
            
            <div class="flex flex-wrap justify-center mt-4 gap-2">
              <span class="text-sm bg-white bg-opacity-20 text-white px-3 py-1 rounded-full cursor-pointer hover:bg-opacity-30">
                Data Analytics
              </span>
              <span class="text-sm bg-white bg-opacity-20 text-white px-3 py-1 rounded-full cursor-pointer hover:bg-opacity-30">
                Customer Experience
              </span>
              <span class="text-sm bg-white bg-opacity-20 text-white px-3 py-1 rounded-full cursor-pointer hover:bg-opacity-30">
                AI Agents
              </span>
              <span class="text-sm bg-white bg-opacity-20 text-white px-3 py-1 rounded-full cursor-pointer hover:bg-opacity-30">
                Cybersecurity
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;