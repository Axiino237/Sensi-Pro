/**
 * FF Sensi Pro v1.1 Elite Engine
 * Dynamic Sensitivity & Fire Button Logic
 */

export const REFRESH_RATE_FACTORS = {
  '60': 1.0,
  '90': 1.06,
  '120': 1.12,
  '144': 1.18
};

export const SCREEN_SIZE_FACTORS = {
  'compact': 1.05, // Small screens need slightly higher general mobility
  'large': 1.0,
  'tablet': 0.88   // Tablets have massive drag space, lower general helps precision
};

export const calculateSensitivity = (data) => {
  const { deviceType, dpi, playStyle, surfaceType, refreshRate, screenSize } = data;
  
  // Base sensitivity per device tier
  const bases = {
    low: { gen: 95, red: 90, x2: 85, x4: 80, sniper: 50, freeLook: 70 },
    mid: { gen: 88, red: 82, x2: 78, x4: 72, sniper: 45, freeLook: 60 },
    high: { gen: 82, red: 75, x2: 70, x4: 65, sniper: 40, freeLook: 55 }
  };

  let sns = { ...bases[deviceType] };
  
  // 1. DPI Factor (Inverse relationship - higher DPI needs lower in-game sensi)
  const dpiNum = parseInt(dpi) || 440;
  const dpiMultiplier = 440 / dpiNum;
  
  // 2. Playstyle Factor
  const styleMultipliers = {
    balanced: 1.0,
    rush: 1.15,
    sniper_pro: 0.85,
    raistar: 1.25,
    tsg_jash: 1.1,
    white444: 1.2
  };
  const styleM = styleMultipliers[playStyle] || 1.0;

  // 3. Surface Friction Factor
  const surfaceM = surfaceType === 'glove' ? 0.95 : 1.05;

  // 4. ELITE v1.1 factors (Hz and Size)
  const hzM = REFRESH_RATE_FACTORS[refreshRate] || 1.0;
  const sizeM = SCREEN_SIZE_FACTORS[screenSize] || 1.0;

  // Apply all multipliers
  Object.keys(sns).forEach(key => {
    sns[key] = Math.round(sns[key] * dpiMultiplier * styleM * surfaceM * hzM * sizeM);
    sns[key] = Math.max(1, Math.min(100, sns[key])); // Clamp between 1-100
  });

  return sns;
};

export const calculateFireButton = (data) => {
  const { deviceType, screenSize } = data;
  
  // Base sizes
  let size = 48;
  if (deviceType === 'low') size = 42;
  if (deviceType === 'high') size = 52;
  
  // Adjust for screen size
  if (screenSize === 'tablet') size += 8;
  if (screenSize === 'compact') size -= 5;
  
  return {
    size: Math.round(size),
    position: "Lower Right Quadrant (3/4 from top, alignment with thumb tip)"
  };
};
