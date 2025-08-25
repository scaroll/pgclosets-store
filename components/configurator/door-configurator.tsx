'use client';

import { useState, useEffect } from 'react';
import { Home, Clock, Truck, Shield, Settings, Ruler, Package } from 'lucide-react';

interface DoorConfig {
  style: 'sliding' | 'bifold' | 'barn' | 'french';
  material: 'wood' | 'glass' | 'mirror' | 'composite';
  finish: string;
  width: number;
  height: number;
  hardware: string;
}

interface ConfigOption {
  value: string;
  label: string;
  price?: number;
  image?: string;
  description?: string;
}

const doorStyles: ConfigOption[] = [
  { value: 'sliding', label: 'Sliding Doors', price: 0, description: 'Space-saving, smooth operation' },
  { value: 'bifold', label: 'Bifold Doors', price: -70, description: 'Classic accordion style' },
  { value: 'barn', label: 'Barn Doors', price: 100, description: 'Rustic, statement piece' },
  { value: 'french', label: 'French Doors', price: 230, description: 'Elegant, traditional look' }
];

const materials: ConfigOption[] = [
  { value: 'wood', label: 'Premium Wood', price: 0, description: 'Natural oak or maple' },
  { value: 'glass', label: 'Tempered Glass', price: 150, description: 'Modern, light-enhancing' },
  { value: 'mirror', label: 'Mirrored Glass', price: 120, description: 'Space-enlarging effect' },
  { value: 'composite', label: 'Composite Wood', price: -80, description: 'Durable, eco-friendly' }
];

const finishes: Record<string, ConfigOption[]> = {
  wood: [
    { value: 'oak-natural', label: 'Natural Oak', price: 0 },
    { value: 'oak-stained', label: 'Stained Oak', price: 25 },
    { value: 'maple-natural', label: 'Natural Maple', price: 40 },
    { value: 'walnut', label: 'Rich Walnut', price: 80 }
  ],
  glass: [
    { value: 'clear', label: 'Clear Glass', price: 0 },
    { value: 'frosted', label: 'Frosted Glass', price: 30 },
    { value: 'tinted', label: 'Tinted Glass', price: 40 }
  ],
  mirror: [
    { value: 'standard', label: 'Standard Mirror', price: 0 },
    { value: 'antiqued', label: 'Antiqued Mirror', price: 60 }
  ],
  composite: [
    { value: 'white', label: 'White Finish', price: 0 },
    { value: 'espresso', label: 'Espresso Brown', price: 20 }
  ]
};

const hardware: ConfigOption[] = [
  { value: 'brushed-nickel', label: 'Brushed Nickel', price: 0 },
  { value: 'oil-bronze', label: 'Oil-Rubbed Bronze', price: 40 },
  { value: 'chrome', label: 'Polished Chrome', price: 20 },
  { value: 'brass', label: 'Antique Brass', price: 60 }
];

export default function DoorConfigurator() {
  const [config, setConfig] = useState<DoorConfig>({
    style: 'sliding',
    material: 'wood',
    finish: 'oak-natural',
    width: 72,
    height: 80,
    hardware: 'brushed-nickel'
  });

  const [basePrice, setBasePrice] = useState(450);
  const [totalPrice, setTotalPrice] = useState(450);
  const [leadTime, setLeadTime] = useState('2 weeks');

  useEffect(() => {
    // Base prices by door style
    const basePrices = {
      sliding: 450,
      bifold: 380,
      barn: 550,
      french: 680
    };

    // Material multipliers
    const materialPrices = {
      wood: 0,
      glass: 150,
      mirror: 120,
      composite: -80
    };

    // Get additional costs
    const styleUpcharge = doorStyles.find(s => s.value === config.style)?.price || 0;
    const materialUpcharge = materialPrices[config.material] || 0;
    const finishUpcharge = finishes[config.material]?.find(f => f.value === config.finish)?.price || 0;
    const hardwareUpcharge = hardware.find(h => h.value === config.hardware)?.price || 0;
    
    // Size factor (width in inches / 36 inches standard)
    const sizeFactor = config.width / 36;

    const calculatedPrice = Math.round(
      (basePrices[config.style] + styleUpcharge + materialUpcharge + finishUpcharge + hardwareUpcharge) * sizeFactor
    );

    setBasePrice(basePrices[config.style]);
    setTotalPrice(calculatedPrice);

    // Estimate lead time based on material and style
    if (config.material === 'glass' || config.style === 'french') {
      setLeadTime('3-4 weeks');
    } else if (config.material === 'mirror' || config.style === 'barn') {
      setLeadTime('2-3 weeks');
    } else {
      setLeadTime('2 weeks');
    }
  }, [config]);

  return (
    <div className="configurator-container max-w-7xl mx-auto px-4 py-12">
      {/* Header with Trust Signals */}
      <div className="configurator-header mb-12 text-center">
        <h1 className="text-4xl lg:text-5xl font-light text-navy-700 mb-4">
          Design Your Perfect <strong className="text-sky-600">Closet Doors</strong>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          Professional-grade doors with lifetime warranty, free design consultation, and expert installation
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
          <span className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-sky-500" />
            Lifetime Warranty
          </span>
          <span className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-sky-500" />
            Free Delivery Over $1000
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-sky-500" />
            Professional Installation
          </span>
          <span className="flex items-center gap-2">
            <Home className="w-5 h-5 text-sky-500" />
            500+ Happy Customers
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* Door Style Selection */}
          <div className="config-section bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium text-navy-700 mb-2 flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Door Style
            </h3>
            <p className="text-gray-600 mb-6">Choose the opening mechanism that works best for your space</p>
            
            <div className="grid grid-cols-2 gap-4">
              {doorStyles.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setConfig({...config, style: option.value as any})}
                  className={`
                    p-6 rounded-lg border-2 transition-all duration-200 text-left
                    ${config.style === option.value 
                      ? 'border-sky-500 bg-sky-50 shadow-sm' 
                      : 'border-gray-200 hover:border-sky-300 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="font-medium text-navy-700 mb-1">{option.label}</div>
                  <div className="text-sm text-gray-600 mb-2">{option.description}</div>
                  {option.price !== 0 && (
                    <div className="text-xs text-sky-600 font-medium">
                      {option.price > 0 ? '+' : ''}${option.price}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Material Selection */}
          <div className="config-section bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium text-navy-700 mb-2 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Material
            </h3>
            <p className="text-gray-600 mb-6">Select from our premium material options</p>
            
            <div className="grid grid-cols-2 gap-4">
              {materials.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setConfig({
                    ...config, 
                    material: option.value as any,
                    finish: finishes[option.value as keyof typeof finishes]?.[0]?.value || ''
                  })}
                  className={`
                    p-6 rounded-lg border-2 transition-all duration-200 text-left
                    ${config.material === option.value 
                      ? 'border-sky-500 bg-sky-50 shadow-sm' 
                      : 'border-gray-200 hover:border-sky-300 hover:shadow-sm'
                    }
                  `}
                >
                  <div className="font-medium text-navy-700 mb-1">{option.label}</div>
                  <div className="text-sm text-gray-600 mb-2">{option.description}</div>
                  {option.price !== 0 && (
                    <div className="text-xs text-sky-600 font-medium">
                      {option.price > 0 ? '+' : ''}${option.price}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Size Configuration */}
          <div className="config-section bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium text-navy-700 mb-2 flex items-center gap-2">
              <Ruler className="w-5 h-5" />
              Dimensions
            </h3>
            <p className="text-gray-600 mb-6">Specify your closet opening dimensions</p>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Width (inches)</label>
                <input
                  type="range"
                  min="24"
                  max="120"
                  value={config.width}
                  onChange={(e) => setConfig({...config, width: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--color-sky-500) 0%, var(--color-sky-500) ${((config.width - 24) / (120 - 24)) * 100}%, #e5e7eb ${((config.width - 24) / (120 - 24)) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>24"</span>
                  <span className="font-medium text-navy-600">{config.width}"</span>
                  <span>120"</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Height (inches)</label>
                <input
                  type="range"
                  min="72"
                  max="96"
                  value={config.height}
                  onChange={(e) => setConfig({...config, height: parseInt(e.target.value)})}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, var(--color-sky-500) 0%, var(--color-sky-500) ${((config.height - 72) / (96 - 72)) * 100}%, #e5e7eb ${((config.height - 72) / (96 - 72)) * 100}%, #e5e7eb 100%)`
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>72"</span>
                  <span className="font-medium text-navy-600">{config.height}"</span>
                  <span>96"</span>
                </div>
              </div>
            </div>
          </div>

          {/* Finish Selection */}
          {finishes[config.material] && (
            <div className="config-section bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-medium text-navy-700 mb-6">
                {config.material.charAt(0).toUpperCase() + config.material.slice(1)} Finish
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                {finishes[config.material].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setConfig({...config, finish: option.value})}
                    className={`
                      p-4 rounded-lg border-2 transition-all duration-200 text-left
                      ${config.finish === option.value 
                        ? 'border-sky-500 bg-sky-50' 
                        : 'border-gray-200 hover:border-sky-300'
                      }
                    `}
                  >
                    <span className="block text-sm font-medium text-navy-700">{option.label}</span>
                    {option.price !== 0 && (
                      <span className="block text-xs text-sky-600 mt-1">
                        +${option.price}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Hardware Selection */}
          <div className="config-section bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-medium text-navy-700 mb-6">Hardware Finish</h3>
            
            <div className="grid grid-cols-2 gap-3">
              {hardware.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setConfig({...config, hardware: option.value})}
                  className={`
                    p-4 rounded-lg border-2 transition-all duration-200 text-left
                    ${config.hardware === option.value 
                      ? 'border-sky-500 bg-sky-50' 
                      : 'border-gray-200 hover:border-sky-300'
                    }
                  `}
                >
                  <span className="block text-sm font-medium text-navy-700">{option.label}</span>
                  {option.price !== 0 && (
                    <span className="block text-xs text-sky-600 mt-1">
                      +${option.price}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Preview and Pricing Panel */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 space-y-6">
            {/* 3D Preview Placeholder */}
            <div className="preview-panel">
              <div className="aspect-square bg-gradient-to-br from-gray-50 to-sky-50 rounded-xl overflow-hidden shadow-lg border border-gray-100 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-24 h-24 bg-sky-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Home className="w-12 h-12 text-sky-600" />
                  </div>
                  <p className="text-gray-600 font-medium">3D Preview</p>
                  <p className="text-sm text-gray-500">Interactive view coming soon</p>
                </div>
              </div>
            </div>
            
            {/* Price Display Card */}
            <div className="pricing-panel bg-white rounded-xl border border-gray-100 shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500 mb-1">
                    Your Configuration
                  </p>
                  <p className="text-sm text-gray-600">
                    {doorStyles.find(s => s.value === config.style)?.label} • {materials.find(m => m.value === config.material)?.label}
                  </p>
                  <p className="text-xs text-gray-500">
                    {config.width}" × {config.height}" • {finishes[config.material]?.find(f => f.value === config.finish)?.label}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-light text-navy-700">${totalPrice}</p>
                  <p className="text-xs text-gray-500">per door</p>
                </div>
              </div>
              
              <div className="space-y-3 pb-6 mb-6 border-b border-gray-100">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Estimated Delivery</span>
                  <span className="font-medium text-navy-600">{leadTime}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Professional Installation</span>
                  <span className="font-medium text-navy-600">+$200</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Old Door Removal</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Design Consultation</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button className="w-full px-6 py-3 bg-navy text-white rounded-lg hover:bg-navy-dark transform hover:-translate-y-0.5 transition-all duration-200 shadow-md hover:shadow-lg font-medium">
                  Get Expert Quote
                </button>
                <button className="w-full px-6 py-3 bg-white text-navy border-2 border-sky-500 rounded-lg hover:bg-sky-50 transition-colors font-medium">
                  Save Configuration
                </button>
                <button className="w-full px-6 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors font-medium">
                  Schedule Consultation
                </button>
              </div>
            </div>
            
            {/* Help Card */}
            <div className="help-card bg-sky-50 rounded-lg border border-sky-200 p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-sky-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-navy-700 mb-1">Need Help?</p>
                  <p className="text-xs text-gray-600 mb-2">
                    Our design experts are available Mon-Fri 9am-6pm EST
                  </p>
                  <a 
                    href="tel:1-800-PGDOORS" 
                    className="text-sky-600 text-sm font-medium hover:underline"
                  >
                    1-800-PG-DOORS
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}