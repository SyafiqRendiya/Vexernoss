/**
 * Vexernoss - Jasa Video Editing Profesional
 * Three.js Animation & Interactive Elements
 * Author: AI Assistant
 * License: Free to modify
 */

(function() {
  'use strict';
  
  // Global variables
  let scene, camera, renderer, robot;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let windowHalfX = window.innerWidth / 2;
  let windowHalfY = window.innerHeight / 2;
  let animationId;
  let isWebGLAvailable = false;
  
  // DOM Elements
  const canvas = document.getElementById('robotCanvas');
  const fallbackImage = document.querySelector('.robot-fallback');
  const appIcons = document.querySelectorAll('.app-icon');
  const particlesContainer = document.getElementById('particles');
  
  /**
   * Initialize the application
   */
  function init() {
    checkWebGLSupport();
    initParticles();
    initFloatingIcons();
    initMouseMove();
    initResizeHandler();
    
    if (isWebGLAvailable) {
      initThreeJS();
      // Skip loading robot model for now since we don't have the asset
      showFallback();
      animate();
    } else {
      showFallback();
    }
  }
  
  /**
   * Check if WebGL is supported
   */
  function checkWebGLSupport() {
    try {
      const canvas = document.createElement('canvas');
      isWebGLAvailable = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
    } catch (e) {
      isWebGLAvailable = false;
    }
  }
  
  /**
   * Show fallback image when WebGL is not available
   */
  function showFallback() {
    if (canvas) canvas.style.display = 'none';
    if (fallbackImage) fallbackImage.hidden = false;
    console.warn('WebGL not supported or model not available. Showing fallback image.');
  }
  
  /**
   * Initialize Three.js scene
   */
  function initThreeJS() {
    // Scene
    scene = new THREE.Scene();
    scene.background = null;
    
    // Camera
    const aspectRatio = canvas.clientWidth / canvas.clientHeight;
    camera = new THREE.PerspectiveCamera(45, aspectRatio, 0.1, 1000);
    camera.position.z = 2.2;
    
    // Renderer
    renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    
    // Lighting
    const ambientLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xA259FF, 0.8);
    directionalLight1.position.set(1, 1, 1);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0x3B82F6, 0.6);
    directionalLight2.position.set(-1, -1, 0.5);
    scene.add(directionalLight2);
    
    const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight3.position.set(0, 1, 0);
    scene.add(directionalLight3);
  }
  
  /**
   * Animation loop
   */
  function animate() {
    animationId = requestAnimationFrame(animate);
    
    // Smooth mouse movement
    targetX = mouseX * 0.001;
    targetY = mouseY * 0.001;
    
    // Update camera position based on mouse
    if (camera) {
      camera.position.x += (targetX - camera.position.x) * 0.08;
      camera.position.y += (-targetY - camera.position.y) * 0.08;
      camera.lookAt(scene.position);
    }
    
    // Render the scene
    if (renderer && scene && camera) {
      renderer.render(scene, camera);
    }
  }
  
  /**
   * Initialize mouse move parallax effect
   */
  function initMouseMove() {
    document.addEventListener('mousemove', onMouseMove, false);
    document.addEventListener('touchmove', onTouchMove, { passive: true });
    
    // Handle device orientation for mobile
    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', onDeviceOrientation, false);
    }
  }
  
  function onMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
  }
  
  function onTouchMove(event) {
    if (event.touches.length === 1) {
      mouseX = event.touches[0].pageX - windowHalfX;
      mouseY = event.touches[0].pageY - windowHalfY;
    }
  }
  
  function onDeviceOrientation(event) {
    // Reduced effect for device orientation
    mouseX = event.gamma * 10; // -90 to 90
    mouseY = event.beta * 10;  // -180 to 180
  }
  
  /**
   * Initialize floating animation for app icons
   */
  function initFloatingIcons() {
    // Set random delays and durations for each icon
    appIcons.forEach((icon, index) => {
      const duration = 3.6 + Math.random() * 2.4; // 3.6s to 6s
      const delay = Math.random() * 2;
      
      icon.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
    });
  }
  
  /**
   * Initialize particle background
   */
  function initParticles() {
    if (!particlesContainer) return;
    
    const particleCount = 50;
    let particles = '';
    
    for (let i = 0; i < particleCount; i++) {
      const size = Math.random() * 2 + 1;
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      const opacity = Math.random() * 0.3 + 0.1;
      const animationDelay = Math.random() * 20;
      
      particles += `
        <div class="particle" style="
          width: ${size}px;
          height: ${size}px;
          left: ${posX}%;
          top: ${posY}%;
          opacity: ${opacity};
          animation-delay: ${animationDelay}s;
        "></div>
      `;
    }
    
    particlesContainer.innerHTML = particles;
    
    // Add CSS for particles
    const style = document.createElement('style');
    style.textContent = `
      .particle {
        position: absolute;
        background: var(--accent-1);
        border-radius: 50%;
        animation: particleFloat 20s linear infinite;
        pointer-events: none;
      }
      
      @keyframes particleFloat {
        0% {
          transform: translateY(0) translateX(0);
          opacity: 0;
        }
        10% {
          opacity: 1;
        }
        90% {
          opacity: 1;
        }
        100% {
          transform: translateY(-100px) translateX(20px);
          opacity: 0;
        }
      }
      
      @media (prefers-reduced-motion: reduce) {
        .particle {
          animation: none;
        }
      }
    `;
    
    document.head.appendChild(style);
  }
  
  /**
   * Handle window resize
   */
  function initResizeHandler() {
    window.addEventListener('resize', onWindowResize, false);
    
    // Initial call to set sizes
    onWindowResize();
  }
  
  function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    if (camera && renderer && canvas) {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    }
  }
  
  /**
   * Clean up resources
   */
  function cleanup() {
    if (animationId) {
      cancelAnimationFrame(animationId);
    }
    
    if (renderer) {
      renderer.dispose();
    }
    
    // Remove event listeners
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('touchmove', onTouchMove);
    window.removeEventListener('deviceorientation', onDeviceOrientation);
    window.removeEventListener('resize', onWindowResize);
  }
  
  // Handle page visibility changes
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      }
    } else {
      if (!animationId && isWebGLAvailable) {
        animate();
      }
    }
  });
  
  // Handle ESC key to pause animations (accessibility feature)
  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
      } else if (isWebGLAvailable) {
        animate();
      }
    }
  });
  
  // Initialize when DOM is loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', cleanup);
  
})();