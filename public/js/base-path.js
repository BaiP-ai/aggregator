// Astro Base Path Helper
(function() {
  // Base path is set from Layout.astro
  var basePath = window.BASE_PATH || '/';

  // Add helper functions to the window object
  window.getSitePath = function(path) {
    var cleanPath = path.startsWith('/') ? path : '/' + path;
    if (cleanPath === '/') {
      return basePath || '/';
    }
    return basePath + cleanPath;
  };

  window.getAssetPath = function(path) {
    var cleanPath = path.startsWith('/') ? path : '/' + path;
    return basePath + cleanPath;
  };

  // Fix all links on the page
  function fixLinks() {
    // Fix all relative links
    var links = document.querySelectorAll('a[href^="/"]');
    for (var i = 0; i < links.length; i++) {
      var link = links[i];
      // Skip links that are already fixed or external links
      if (link.getAttribute('data-fixed') === 'true' || link.href.startsWith('http')) {
        continue;
      }
      
      // Fix the link
      var originalPath = link.getAttribute('href');
      link.setAttribute('href', window.getSitePath(originalPath));
      link.setAttribute('data-fixed', 'true');
    }
    
    // Fix all image sources
    var images = document.querySelectorAll('img[src^="/"]');
    for (var j = 0; j < images.length; j++) {
      var img = images[j];
      // Skip images that are already fixed
      if (img.getAttribute('data-fixed') === 'true') {
        continue;
      }
      
      // Fix the image source
      var originalSrc = img.getAttribute('src');
      img.setAttribute('src', window.getAssetPath(originalSrc));
      img.setAttribute('data-fixed', 'true');
    }
  }

  // Run the fix links function when the DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', fixLinks);
  } else {
    fixLinks();
  }

  // Also run it after any navigation events
  window.addEventListener('popstate', fixLinks);
})();
