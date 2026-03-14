import os

css_path = os.path.join(os.getcwd(), 'styles.css')

mobile_optimizations = """
/* ============================================
   GLOBAL MOBILE OPTIMIZATIONS (ADDED)
   ============================================ */
@media (max-width: 768px) {
  /* Fluid Typography Overrides */
  html {
    font-size: 14px; /* Slightly smaller base font on mobile */
  }
  
  h1, .hero-title {
    font-size: clamp(2.5rem, 8vw, 4rem) !important;
    line-height: 1.1 !important;
    word-wrap: break-word;
    word-break: break-word; /* Prevent overflow on long words like INNOVATIONS */
  }
  
  h2, .section-title {
    font-size: clamp(2rem, 6vw, 3rem) !important;
    line-height: 1.2 !important;
    word-wrap: break-word;
  }
  
  h3 {
    font-size: clamp(1.5rem, 5vw, 2rem) !important;
  }
  
  /* Container and Padding Adjustments */
  .container {
    padding: 0 1rem !important;
    overflow-x: hidden;
  }
  
  section {
    padding: 3rem 0 !important; /* Reduce excessive vertical padding */
  }
  
  /* Grid Collapses */
  .grid, .bento-grid, .services-grid, .features-grid, .stats-grid, .skills-container, .client-logos, .metrics-grid {
    grid-template-columns: 1fr !important;
    gap: 1.5rem !important; /* Smaller gap on mobile */
  }
  
  .bento-large, .bento-medium, .bento-small, .bento-item {
    grid-column: span 1 !important;
    padding: 1.5rem !important; /* Reduce padding inside cards */
  }
  
  /* Hero section specific */
  .hero {
    min-height: auto !important;
    padding: 6rem 0 3rem 0 !important;
  }
  
  /* Buttons and Touch Targets */
  .btn, .btn-primary, .btn-secondary, .btn-live, .filter-btn {
    width: 100%;
    margin-bottom: 0.5rem;
    padding: 1rem 1.5rem !important; /* Ensure min 44px touch target */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .hero-cta {
    flex-direction: column;
    gap: 1rem;
    width: 100%;
  }
  
  /* Prevent horizontal scrolling globally */
  body {
    overflow-x: hidden;
    width: 100%;
  }
  
  /* Form adjustments */
  .form-input, .form-select, .form-textarea {
    font-size: 16px !important; /* Prevent iOS zoom on focus */
    padding: 0.8rem 1rem !important;
  }
  
  /* Nav Mobile Adjustment */
  .nav-menu.active {
    padding: 2rem !important;
    width: 100vw !important;
    box-sizing: border-box;
  }
  
  .nav-item {
    margin: 1rem 0 !important;
  }
}

@media (max-width: 480px) {
  /* Extra small devices */
  h1, .hero-title {
    font-size: clamp(2rem, 10vw, 3rem) !important;
  }
  
  .testimonial-card {
    padding: 1.5rem !important;
  }
  
  .metric-value {
    font-size: 2.5rem !important;
  }
}
"""

with open(css_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Make sure we don't append it multiple times inadvertently
if "GLOBAL MOBILE OPTIMIZATIONS (ADDED)" not in content:
    with open(css_path, 'a', encoding='utf-8') as f:
        f.write("\n" + mobile_optimizations)
    print("Mobile optimizations appended to styles.css.")
else:
    print("Mobile optimizations already present.")

