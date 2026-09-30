/**
 * DATUM CAN-Bus High-Frequency Telemetry Stream Decoder & Anomaly Detector
 * 
 * Protocol Support:
 * - ISO 11898-1 Standard 11-bit Identifiers & ISO 11898-2 High-Speed Physical Layer
 * - Extended 29-bit CAN 2.0B Motorsport Arbitration Frames
 * 
 * Standard Arbitration IDs:
 * - 0x0C0: [Engine RPM (2B uint16 * 0.25), Throttle Pos (1B uint8 * 0.392%), Engine Load (1B)]
 * - 0x0C4: [Wheel Speed FL/FR (2B uint16 * 0.0625 km/h), Gear Position (1B uint8)]
 * - 0x1A0: [Brake Line Pressure (2B uint16 * 0.1 bar), Brake Pedal Switch (1B)]
 * - 0x1B2: [Steering Angle (2B int16 * 0.1 deg), Steering Angular Velocity (2B)]
 * - 0x280: [Oil Temp (1B uint8 - 40°C), Coolant Temp (1B uint8 - 40°C), Oil Pressure (2B uint16 * 0.01 bar)]
 * - 0x2A4: [Lateral G (2B int16 * 0.001 g), Long G (2B int16 * 0.001 g), Yaw Rate (2B int16 * 0.01 deg/s)]
 */

export interface CanFrame {
  arbitrationId: number;
  isExtended: boolean;
  dlc: number; // Data Length Code (0-8 bytes)
  data: Uint8Array;
  timestampUs: number;
}

export interface DecodedTelemetryPacket {
  timestamp: number;
  engineRpm: number;
  throttlePct: number;
  speedKph: number;
  gear: number | 'N' | 'R';
  brakePressureBar: number;
  steeringAngleDeg: number;
  oilTempC: number;
  coolantTempC: number;
  oilPressureBar: number;
  lateralG: number;
  longitudinalG: number;
  yawRateDegS: number;
  anomalies: string[];
}

export class CanBusStreamDecoder {
  private latestPacket: DecodedTelemetryPacket = {
    timestamp: Date.now(),
    engineRpm: 800,
    throttlePct: 0,
    speedKph: 0,
    gear: 'N',
    brakePressureBar: 0,
    steeringAngleDeg: 0,
    oilTempC: 88,
    coolantTempC: 90,
    oilPressureBar: 4.8,
    lateralG: 0,
    longitudinalG: 0,
    yawRateDegS: 0,
    anomalies: [],
  };

  /**
   * Decodes a raw CAN-bus frame and merges the signal into the latest telemetry state.
   */
  public decodeFrame(frame: CanFrame): DecodedTelemetryPacket {
    const data = frame.data;
    const anomalies: string[] = [];

    switch (frame.arbitrationId) {
      case 0x0c0: {
        // Engine RPM (Bytes 0-1, 16-bit Big Endian * 0.25 RPM)
        if (data.length >= 2) {
          const rawRpm = (data[0] << 8) | data[1];
          this.latestPacket.engineRpm = Math.round(rawRpm * 0.25);
          if (this.latestPacket.engineRpm > 8400) {
            anomalies.push(`OVER_REV_WARNING: Engine speed ${this.latestPacket.engineRpm} RPM exceeds safe redline threshold.`);
          }
        }
        // Throttle (Byte 2, 0-255 -> 0-100%)
        if (data.length >= 3) {
          this.latestPacket.throttlePct = Number((data[2] * (100 / 255)).toFixed(1));
        }
        break;
      }

      case 0x0c4: {
        // Vehicle Speed (Bytes 0-1, 16-bit Big Endian * 0.0625 km/h)
        if (data.length >= 2) {
          const rawSpeed = (data[0] << 8) | data[1];
          this.latestPacket.speedKph = Number((rawSpeed * 0.0625).toFixed(1));
        }
        // Gear (Byte 2)
        if (data.length >= 3) {
          const rawGear = data[2];
          if (rawGear === 0) this.latestPacket.gear = 'N';
          else if (rawGear === 0xff) this.latestPacket.gear = 'R';
          else this.latestPacket.gear = rawGear;
        }
        break;
      }

      case 0x1a0: {
        // Brake Pressure (Bytes 0-1, 16-bit Big Endian * 0.1 bar)
        if (data.length >= 2) {
          const rawBrake = (data[0] << 8) | data[1];
          this.latestPacket.brakePressureBar = Number((rawBrake * 0.1).toFixed(1));
        }
        break;
      }

      case 0x1b2: {
        // Steering Angle (Bytes 0-1, signed 16-bit * 0.1 deg)
        if (data.length >= 2) {
          const rawAngle = (data[0] << 8) | data[1];
          const signedAngle = rawAngle > 0x7fff ? rawAngle - 0x10000 : rawAngle;
          this.latestPacket.steeringAngleDeg = Number((signedAngle * 0.1).toFixed(1));
        }
        break;
      }

      case 0x280: {
        // Oil Temp (Byte 0, -40 offset)
        if (data.length >= 1) {
          this.latestPacket.oilTempC = data[0] - 40;
        }
        // Coolant Temp (Byte 1, -40 offset)
        if (data.length >= 2) {
          this.latestPacket.coolantTempC = data[1] - 40;
        }
        // Oil Pressure (Bytes 2-3, 16-bit * 0.01 bar)
        if (data.length >= 4) {
          const rawOilPress = (data[2] << 8) | data[3];
          this.latestPacket.oilPressureBar = Number((rawOilPress * 0.01).toFixed(2));
          if (this.latestPacket.oilPressureBar < 1.2 && this.latestPacket.engineRpm > 2500) {
            anomalies.push(`CRITICAL_OIL_PRESSURE_LOW: ${this.latestPacket.oilPressureBar} bar at ${this.latestPacket.engineRpm} RPM`);
          }
        }
        break;
      }

      case 0x2a4: {
        // Lateral G (Bytes 0-1, signed 16-bit * 0.001 g)
        if (data.length >= 2) {
          const rawLatG = (data[0] << 8) | data[1];
          const signedLatG = rawLatG > 0x7fff ? rawLatG - 0x10000 : rawLatG;
          this.latestPacket.lateralG = Number((signedLatG * 0.001).toFixed(2));
        }
        // Longitudinal G (Bytes 2-3, signed 16-bit * 0.001 g)
        if (data.length >= 4) {
          const rawLongG = (data[2] << 8) | data[3];
          const signedLongG = rawLongG > 0x7fff ? rawLongG - 0x10000 : rawLongG;
          this.latestPacket.longitudinalG = Number((signedLongG * 0.001).toFixed(2));
        }
        // Yaw Rate (Bytes 4-5, signed 16-bit * 0.01 deg/s)
        if (data.length >= 6) {
          const rawYaw = (data[4] << 8) | data[5];
          const signedYaw = rawYaw > 0x7fff ? rawYaw - 0x10000 : rawYaw;
          this.latestPacket.yawRateDegS = Number((signedYaw * 0.01).toFixed(1));
        }
        break;
      }
    }

    this.latestPacket.timestamp = Date.now();
    this.latestPacket.anomalies = anomalies;
    return { ...this.latestPacket };
  }

  /**
   * Generates a raw synthetic CAN frame simulating a real vehicle on an alpine B-road pass.
   */
  public generateSimulatedFrame(simTimeSec: number): CanFrame {
    const frameTypes = [0x0c0, 0x0c4, 0x1a0, 0x1b2, 0x280, 0x2a4];
    const frameIndex = Math.floor((simTimeSec * 20) % frameTypes.length);
    const arbId = frameTypes[frameIndex];
    const data = new Uint8Array(8);

    // Naturalistic driving curve
    const cycle = Math.sin(simTimeSec * 0.4);
    const cornerCycle = Math.cos(simTimeSec * 0.6);

    switch (arbId) {
      case 0x0c0: {
        // RPM oscillates between 2800 and 7200 RPM
        const rpm = Math.round(4500 + cycle * 2200 + (Math.random() - 0.5) * 150);
        const rawRpm = Math.round(rpm / 0.25);
        data[0] = (rawRpm >> 8) & 0xff;
        data[1] = rawRpm & 0xff;
        const throttle = Math.max(0, Math.min(255, Math.round(140 + cycle * 100)));
        data[2] = throttle;
        break;
      }
      case 0x0c4: {
        // Speed oscillates between 55 and 130 km/h
        const speed = Math.max(0, 85 + cycle * 35 + (Math.random() - 0.5) * 2);
        const rawSpeed = Math.round(speed / 0.0625);
        data[0] = (rawSpeed >> 8) & 0xff;
        data[1] = rawSpeed & 0xff;
        data[2] = cycle > 0.4 ? 4 : cycle > -0.1 ? 3 : 2; // Gear 2..4
        break;
      }
      case 0x1a0: {
        const brakePress = cycle < -0.4 ? Math.round((Math.abs(cycle) - 0.4) * 120 * 10) : 0;
        data[0] = (brakePress >> 8) & 0xff;
        data[1] = brakePress & 0xff;
        break;
      }
      case 0x1b2: {
        const steerAngle = Math.round(cornerCycle * 45 * 10);
        const uint16Angle = steerAngle < 0 ? 0x10000 + steerAngle : steerAngle;
        data[0] = (uint16Angle >> 8) & 0xff;
        data[1] = uint16Angle & 0xff;
        break;
      }
      case 0x280: {
        data[0] = 95 + 40; // Oil 95°C
        data[1] = 90 + 40; // Coolant 90°C
        const oilPress = Math.round(4.6 * 100);
        data[2] = (oilPress >> 8) & 0xff;
        data[3] = oilPress & 0xff;
        break;
      }
      case 0x2a4: {
        const latG = Math.round(cornerCycle * 0.92 * 1000);
        const uint16Lat = latG < 0 ? 0x10000 + latG : latG;
        data[0] = (uint16Lat >> 8) & 0xff;
        data[1] = uint16Lat & 0xff;
        const longG = Math.round(cycle * 0.45 * 1000);
        const uint16Long = longG < 0 ? 0x10000 + longG : longG;
        data[2] = (uint16Long >> 8) & 0xff;
        data[3] = uint16Long & 0xff;
        break;
      }
    }

    return {
      arbitrationId: arbId,
      isExtended: false,
      dlc: 8,
      data,
      timestampUs: Math.round(simTimeSec * 1000000),
    };
  }

  /**
   * Formats a CAN frame as an industry-standard Candump / Wireshark ASC hex line.
   * e.g., "(1727732948.102) can0 0C0#45A08C0000000000"
   */
  public formatCanDump(frame: CanFrame): string {
    const timeSec = (frame.timestampUs / 1000000).toFixed(4);
    const idHex = frame.arbitrationId.toString(16).toUpperCase().padStart(3, '0');
    const dataHex = Array.from(frame.data)
      .map((b) => b.toString(16).toUpperCase().padStart(2, '0'))
      .join('');
    return `(${timeSec}) can0 ${idHex}#${dataHex}`;
  }
}

export const defaultCanDecoder = new CanBusStreamDecoder();
