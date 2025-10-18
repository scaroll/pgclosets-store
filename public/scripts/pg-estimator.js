/**
 * PG Closets Instant Estimator
 * Inline price calculation with GA4 tracking
 */

(async function () {
  // Load estimator configuration
  const cfg = await fetch('/estimator.config.json')
    .then((r) => r.json())
    .catch((err) => {
      console.error('Failed to load estimator config:', err);
      return null;
    });

  if (!cfg) {
    console.error('Estimator config not available');
    return;
  }

  /**
   * Calculate area in square meters
   */
  function area_m2(width_mm, height_mm) {
    return (width_mm / 1000) * (height_mm / 1000);
  }

  /**
   * Calculate installed price range
   */
  function calculatePrice(cfg, type, area, panels, finish) {
    // Find size factor based on area
    const sizeFactor =
      cfg.size_factor.find((x) => area <= x.max_area_m2)?.factor ||
      cfg.size_factor[cfg.size_factor.length - 1].factor;

    // Get base price for door type
    const base = cfg.base_model[type] || cfg.base_model.bypass;

    // Apply all factors
    const panelFactor = cfg.panel_factor[panels] || 1.0;
    const finishFactor = cfg.finish_factor[finish] || 1.0;

    // Calculate low and high estimates
    const basePrice = base * sizeFactor * panelFactor * finishFactor;
    const low = basePrice * (1 - cfg.range_margin);
    const high = basePrice * (1 + cfg.range_margin);

    return [Math.round(low), Math.round(high)];
  }

  /**
   * Determine door type from product context
   */
  function detectDoorType(element) {
    const text = element.textContent.toLowerCase();
    if (text.includes('bifold')) return 'bifold';
    if (text.includes('pivot')) return 'pivot';
    if (text.includes('barn')) return 'barn';
    if (text.includes('bypass')) return 'bypass';
    if (text.includes('divider') || text.includes('room divider')) return 'divider';
    return 'bypass'; // default fallback
  }

  /**
   * Format price in Canadian dollars
   */
  function formatPrice(amount) {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  /**
   * Track estimate event in GA4
   */
  function trackEstimate(data) {
    if (typeof window.dataLayer !== 'undefined') {
      window.dataLayer.push({
        event: 'instant_estimate_submit',
        estimate: {
          width_mm: data.width,
          height_mm: data.height,
          type: data.type,
          panels: data.panels,
          finish: data.finish,
          low_cad: data.low,
          high_cad: data.high,
          product_handle: data.productHandle,
        },
      });
    }
  }

  /**
   * Initialize estimator on all estimate buttons
   */
  document.querySelectorAll('.pg-estimate-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const form = e.target.closest('form');
      if (!form) return;

      // Get form values
      const width = parseInt(form.width_mm?.value);
      const height = parseInt(form.height_mm?.value);
      const panels = form.panels?.value || '2';
      const finish = form.finish?.value || 'matte_white';

      // Validation
      if (!width || !height || width <= 0 || height <= 0) {
        alert('Please enter valid width and height measurements');
        return;
      }

      // Detect door type
      const article = form.closest('article') || form.closest('.pg-card');
      const type = detectDoorType(article || form);

      // Calculate price
      const area = area_m2(width, height);
      const [low, high] = calculatePrice(cfg, type, area, panels, finish);

      // Display result
      const output = form.parentElement?.querySelector('.pg-estimate-result') ||
                     form.querySelector('.pg-estimate-result');

      if (output) {
        output.innerHTML = `
          <div class="pg-estimate-success">
            <strong>Estimated Installed Price:</strong>
            <span class="pg-price-range">${formatPrice(low)} – ${formatPrice(high)}</span>
            <small>Includes measure, delivery, and professional installation</small>
          </div>
        `;
        output.hidden = false;
        output.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Track in GA4
      trackEstimate({
        width,
        height,
        type,
        panels,
        finish,
        low,
        high,
        productHandle: btn.dataset.productHandle,
      });

      // Add success styling
      btn.classList.add('estimate-submitted');
      btn.textContent = 'Estimate Calculated ✓';
      setTimeout(() => {
        btn.classList.remove('estimate-submitted');
        btn.textContent = 'Instant Estimate';
      }, 3000);
    });
  });

  console.log('PG Estimator initialized');
})();
