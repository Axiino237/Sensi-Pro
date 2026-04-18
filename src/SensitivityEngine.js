/**
 * Perfected Sensitivity Calculation Engine (v3.0 - Pro Series)
 * Core Factors: RAM, DPI, devicePixelRatio (Screen Density), and Surface Friction.
 */

export const calculateSensitivity = ({ deviceType, dpi, playStyle, surfaceType }) => {
  // Base sensitivity mapping by device performance
  const baseSens = {
    low: { general: 98, redDot: 96, scope2x: 92, scope4x: 88, sniper: 72, freeLook: 85 },
    mid: { general: 95, redDot: 92, scope2x: 88, scope4x: 84, sniper: 64, freeLook: 78 },
    high: { general: 90, redDot: 86, scope2x: 82, scope4x: 78, sniper: 52, freeLook: 68 },
  };

  const sens = { ...baseSens[deviceType] };

  // 📐 ADVANCED: Resolution Scaling Factoring
  // High pixel density requires slightly more sensitivity for the same finger travel
  const screenScale = window.devicePixelRatio || 2;
  const resolutionBonus = Math.max(0, (screenScale - 1) * 2);
  
  Object.keys(sens).forEach(key => {
    sens[key] = Math.round(sens[key] + resolutionBonus);
  });

  // 🎯 DPI Adjustment (Optimized for 400-1200 range)
  const dpiNum = parseInt(dpi) || 440;
  const dpiFactor = Math.max(0, (dpiNum - 440) / 100); 
  
  Object.keys(sens).forEach(key => {
    sens[key] = Math.max(10, Math.min(100, Math.round(sens[key] - (dpiFactor * 3.5))));
  });

  // 🧤 Friction Compensation
  // Finger sleeves/Glove reduces friction significantly -> needs lower sens for control
  if (surfaceType === 'glove') {
    sens.general = Math.max(10, sens.general - 4);
    sens.redDot = Math.max(10, sens.redDot - 4);
  } else if (surfaceType === 'powder') {
    sens.general = Math.min(100, sens.general + 2);
  }

  // 🏆 Legendary Player Presets
  switch (playStyle) {
    case 'raistar':
      sens.general = 100;
      sens.redDot = 98;
      sens.scope2x = 94;
      break;
    case 'tsg_jash':
      sens.general = 94;
      sens.scope4x = Math.min(100, sens.scope4x + 12);
      break;
    case 'white444':
      sens.sniper = 88;
      sens.scope4x = 96;
      sens.general = 82; 
      break;
    case 'rush':
      sens.general = Math.min(100, sens.general + 7);
      sens.redDot = Math.min(100, sens.redDot + 10);
      break;
    case 'sniper_pro':
      sens.sniper = Math.min(100, sens.sniper + 25);
      sens.general = Math.max(40, sens.general - 15);
      break;
  }

  return sens;
};
