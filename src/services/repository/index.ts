/**
 * DATUM ATELIER // REPOSITORY GATEWAY
 * 
 * Central enterprise service bridge providing singleton repositories.
 * Fully compliant with ADR-0006 Event-Sourced Sovereign Ledger.
 */

import {
  LocalVehicleRepository,
  LocalFeedRepository,
  LocalWorkshopRepository,
  LocalAuthRepository
} from './LocalLedgerRepository';
import type {
  IVehicleRepository,
  IFeedRepository,
  IWorkshopRepository,
  IAuthRepository
} from './types';

// Export domain contracts
export * from './types';

// Default Singleton Providers (Hydrated with Local-First Event Store)
export const vehicleRepository: IVehicleRepository = new LocalVehicleRepository();
export const feedRepository: IFeedRepository = new LocalFeedRepository();
export const workshopRepository: IWorkshopRepository = new LocalWorkshopRepository();
export const authRepository: IAuthRepository = new LocalAuthRepository();
