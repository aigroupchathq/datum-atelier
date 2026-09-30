/**
 * DATUM Dynamic Pass Grip Physics & Thermodynamic Friction Engine
 * 
 * Mathematical Formulation:
 * 1. Effective Friction Coefficient (μ_effective):
 *    μ = μ_base · (1 - δ_moisture - δ_surface_contam) + κ_thermal · (T_tyre - T_opt) - γ_hydro · H_film
 * 
 * 2. Simplified Pacejka Magic Formula for Lateral Cornering Force:
 *    F_y(α) = D · sin(C · arctan(B·α - E·(B·α - arctan(B·α))))
 *    where:
 *      α = Slip angle (rad)
 *      D = Peak force = μ · F_z (Normal Load)
 *      C = Shape factor (1.30 for asphalt)
 *      B = Stiffness factor
 *      E = Curvature factor
 * 
 * 3. Thermodynamic Heat Dissipation Model:
 *    dT_tyre/dt = (Q_friction + Q_braking - Q_convection - Q_radiation) / C_tyre
 * 
 * 4. Pass Safety Index (0-100%):
 *    PSI = clamp( (μ_effective / μ_target) · 70 + (1 - H_film/5.0) · 20 + Thermal_Score · 10, 0, 100 )
 */

export interface EnvironmentalConditions {
  ambientTempC: number;
  roadSurfaceTempC: number;
  precipitationMmH: number;
  surfaceWaterFilmDepthMm: number;
  relativeHumidityPct: number;
  elevationMeters: number;
  roadMaterial: 'ASPHALT_HIGH_FRICTION' | 'ASPHALT_WEATHERED' | 'CONCRETE' | 'COBBLESTONE' | 'GRAVEL';
}

export interface TyreProfile {
  compound: 'SEMI_SLICK_CUP2' | 'ULTRA_HIGH_PERFORMANCE_PS4S' | 'TOURING_SUMMER' | 'WINTER_PERFORMANCE';
  tyrePressureBar: number;
  tyreTempC: number;
  treadDepthMm: number;
  widthMm: number;
  wheelLoadKg: number;
}

export interface GripAnalysisResult {
  muEffective: number;
  muBase: number;
  hydroplaningRiskScore: number; // 0 (dry) to 1.0 (imminent hydroplane)
  lateralGripLimitG: number;
  corneringStiffnessNmPerDeg: number;
  passSafetyIndex: number; // 0 to 100
  passStatus: 'OPTIMAL' | 'RECEPTIVE' | 'CAUTION_DAMP' | 'HAZARDOUS_ICE' | 'CRITICAL_STANDING_WATER';
  recommendations: string[];
  thermodynamicState: {
    optimalTempC: number;
    deltaFromOptC: number;
    thermalGripFactor: number;
  };
}

export class GripPhysicsEngine {
  private static readonly COMPOUND_BASE_MU: Record<TyreProfile['compound'], number> = {
    SEMI_SLICK_CUP2: 1.25,
    ULTRA_HIGH_PERFORMANCE_PS4S: 1.12,
    TOURING_SUMMER: 0.95,
    WINTER_PERFORMANCE: 0.88,
  };

  private static readonly OPTIMAL_TYRE_TEMPS: Record<TyreProfile['compound'], number> = {
    SEMI_SLICK_CUP2: 75,
    ULTRA_HIGH_PERFORMANCE_PS4S: 55,
    TOURING_SUMMER: 45,
    WINTER_PERFORMANCE: 25,
  };

  /**
   * Computes comprehensive real-time grip dynamics and thermodynamic safety index.
   */
  public evaluateGrip(env: EnvironmentalConditions, tyre: TyreProfile, vehicleSpeedKph: number = 70): GripAnalysisResult {
    const baseMu = GripPhysicsEngine.COMPOUND_BASE_MU[tyre.compound];
    const optimalTemp = GripPhysicsEngine.OPTIMAL_TYRE_TEMPS[tyre.compound];

    // 1. Surface Degradation Calculation
    let surfaceDegradation = 0;
    if (env.roadMaterial === 'ASPHALT_WEATHERED') surfaceDegradation += 0.08;
    if (env.roadMaterial === 'CONCRETE') surfaceDegradation += 0.05;
    if (env.roadMaterial === 'COBBLESTONE') surfaceDegradation += 0.25;
    if (env.roadMaterial === 'GRAVEL') surfaceDegradation += 0.45;

    // 2. Moisture / Water Film Degradation
    let moistureDegradation = 0;
    if (env.surfaceWaterFilmDepthMm > 0.1) {
      moistureDegradation = Math.min(0.45, 0.15 + env.surfaceWaterFilmDepthMm * 0.12);
    } else if (env.precipitationMmH > 0) {
      moistureDegradation = Math.min(0.35, 0.10 + env.precipitationMmH * 0.04);
    }

    // 3. Ice & Frost detection (Road Temp <= 1°C and high humidity or water)
    let frostDegradation = 0;
    const isFreezing = env.roadSurfaceTempC <= 1.0;
    if (isFreezing && (env.surfaceWaterFilmDepthMm > 0 || env.relativeHumidityPct > 85)) {
      frostDegradation = 0.65; // Black ice or packed frost
    }

    // 4. Thermodynamic Temperature Factor
    const deltaTemp = tyre.tyreTempC - optimalTemp;
    // Parabolic thermal penalty if cold or overheated
    let thermalGripFactor = 1.0 - Math.pow(deltaTemp / 50, 2) * 0.18;
    thermalGripFactor = Math.max(0.65, Math.min(1.05, thermalGripFactor));

    // 5. Hydroplaning Dynamic Calculation (NASA formula approx: V_crit = 6.36 * sqrt(P_psi))
    const tyrePressurePsi = tyre.tyrePressureBar * 14.5038;
    const criticalHydroplaningSpeedKph = 6.36 * Math.sqrt(tyrePressurePsi) * 1.60934;
    
    // Tread depth safety scaling factor (legal min 1.6mm, optimal 7mm)
    const treadEfficiency = Math.max(0.2, Math.min(1.0, (tyre.treadDepthMm - 1.0) / 6.0));
    const effectiveCritSpeed = criticalHydroplaningSpeedKph * (0.6 + 0.4 * treadEfficiency);

    let hydroplaningRiskScore = 0;
    if (env.surfaceWaterFilmDepthMm > 1.5 && vehicleSpeedKph > 50) {
      hydroplaningRiskScore = Math.min(1.0, (vehicleSpeedKph / effectiveCritSpeed) * (env.surfaceWaterFilmDepthMm / 3.0));
    }

    // 6. Net Effective Friction Coefficient
    let muEffective = baseMu * (1 - surfaceDegradation - moistureDegradation - frostDegradation) * thermalGripFactor;
    muEffective = Math.max(0.15, Number((muEffective * (1 - hydroplaningRiskScore * 0.6)).toFixed(3)));

    // 7. Maximum Lateral Grip G-Force limit (g = μ · (1 - aero_penalty))
    const lateralGripLimitG = Number((muEffective * 0.96).toFixed(2));

    // 8. Cornering stiffness (approx 1200 N/deg base scaled by mu and pressure)
    const corneringStiffnessNmPerDeg = Math.round(1250 * (muEffective / baseMu) * (tyre.tyrePressureBar / 2.3));

    // 9. Pass Safety Index (0 to 100)
    let rawPsi = (muEffective / 1.1) * 65 + (1 - hydroplaningRiskScore) * 20 + (1 - Math.abs(deltaTemp) / 60) * 15;
    if (frostDegradation > 0.5) rawPsi = Math.min(rawPsi, 28);
    const passSafetyIndex = Math.max(5, Math.min(100, Math.round(rawPsi)));

    // 10. Status and Recommendations
    let passStatus: GripAnalysisResult['passStatus'] = 'OPTIMAL';
    const recommendations: string[] = [];

    if (frostDegradation > 0.5) {
      passStatus = 'HAZARDOUS_ICE';
      recommendations.push('BLACK ICE ADVISORY: Sub-zero road surface detected. High-slip hazard at apex transitions.');
      recommendations.push('Engage Atelier Cold-Weather Map / Soft throttle modulation required.');
    } else if (hydroplaningRiskScore > 0.6) {
      passStatus = 'CRITICAL_STANDING_WATER';
      recommendations.push('HYDROPLANING THREAT: Standing water film exceeds compound displacement capacity.');
      recommendations.push(`Reduce velocity below ${Math.round(effectiveCritSpeed * 0.75)} km/h on straights.`);
    } else if (moistureDegradation > 0.2) {
      passStatus = 'CAUTION_DAMP';
      recommendations.push('Surface dampness: Braking distance extended by ~32%. Cornering limits modulated.');
    } else if (passSafetyIndex >= 85) {
      passStatus = 'OPTIMAL';
      recommendations.push('Optimum tarmac adhesion: Full dynamic telemetry envelope available.');
    } else {
      passStatus = 'RECEPTIVE';
      recommendations.push('Good pass conditions: Standard high-performance driving parameters valid.');
    }

    if (deltaTemp < -20) {
      recommendations.push(`Tire compound below target window (${tyre.tyreTempC}°C vs ${optimalTemp}°C target). Warm-up cycle advised.`);
    }

    return {
      muEffective,
      muBase: baseMu,
      hydroplaningRiskScore: Number(hydroplaningRiskScore.toFixed(2)),
      lateralGripLimitG,
      corneringStiffnessNmPerDeg,
      passSafetyIndex,
      passStatus,
      recommendations,
      thermodynamicState: {
        optimalTempC: optimalTemp,
        deltaFromOptC: Number(deltaTemp.toFixed(1)),
        thermalGripFactor: Number(thermalGripFactor.toFixed(3)),
      },
    };
  }

  /**
   * Computes dynamic Pacejka lateral force curve over slip angles [0° to 12°].
   */
  public computeLateralForceCurve(muEffective: number, normalLoadN: number = 4000): { slipAngleDeg: number; lateralForceN: number }[] {
    const points: { slipAngleDeg: number; lateralForceN: number }[] = [];
    const B = 10.0;
    const C = 1.30;
    const D = muEffective * normalLoadN;
    const E = -0.20;

    for (let deg = 0; deg <= 12; deg += 0.5) {
      const alphaRad = (deg * Math.PI) / 180;
      const bAlpha = B * alphaRad;
      const phi = bAlpha - E * (bAlpha - Math.atan(bAlpha));
      const force = D * Math.sin(C * Math.atan(phi));
      points.push({
        slipAngleDeg: deg,
        lateralForceN: Math.round(force),
      });
    }
    return points;
  }
}

export const defaultGripEngine = new GripPhysicsEngine();
