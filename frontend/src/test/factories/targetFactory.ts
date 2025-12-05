/**
 * Target Factory - Generate random test data using Faker.
 *
 * This factory creates random but valid Target objects for testing.
 * All generated values respect the validation constraints.
 * Types are imported from generated OpenAPI code.
 *
 * Used by:
 * - Unit tests (Vitest)
 * - E2E tests (Cypress)
 * - MSW mock handlers
 */

import { faker } from "@faker-js/faker";
import type { TargetDTO, TargetCreateDTO, TargetUpdateDTO } from "../../generated/api";

// Re-export types for convenience
export type { TargetDTO, TargetCreateDTO, TargetUpdateDTO };

// Common frequency values for realistic data
const COMMON_FREQUENCIES = [433, 915, 2.4, 5.2, 5.8];

/**
 * Generate a random latitude between -90 and 90
 */
function randomLatitude(): number {
  return parseFloat(faker.location.latitude().toFixed(6));
}

/**
 * Generate a random longitude between -180 and 180
 */
function randomLongitude(): number {
  return parseFloat(faker.location.longitude().toFixed(6));
}

/**
 * Generate a random altitude
 */
function randomAltitude(): number {
  return parseFloat(faker.number.float({ min: -500, max: 50000 }).toFixed(2));
}

/**
 * Generate a random frequency (positive number)
 */
function randomFrequency(): number {
  // 70% chance of common frequency, 30% chance of random
  if (Math.random() < 0.7) {
    return faker.helpers.arrayElement(COMMON_FREQUENCIES);
  }
  return parseFloat(faker.number.float({ min: 0.1, max: 100 }).toFixed(2));
}

/**
 * Generate a random speed (non-negative)
 */
function randomSpeed(): number {
  return parseFloat(faker.number.float({ min: 0, max: 1000 }).toFixed(2));
}

/**
 * Generate a random bearing between 0 and 360
 */
function randomBearing(): number {
  return parseFloat(faker.number.float({ min: 0, max: 360 }).toFixed(2));
}

/**
 * Generate a random valid IPv4 address
 */
function randomIpAddress(): string {
  return faker.internet.ipv4();
}

/**
 * Create a random TargetDTO
 */
export function createRandomTarget(id?: string): TargetDTO {
  return {
    id: id ?? faker.string.uuid(),
    latitude: randomLatitude(),
    longitude: randomLongitude(),
    altitude: randomAltitude(),
    frequency: randomFrequency(),
    speed: randomSpeed(),
    bearing: randomBearing(),
    ip_address: randomIpAddress(),
  };
}

/**
 * Create a random TargetCreateDTO (no ID)
 */
export function createRandomTargetCreate(): TargetCreateDTO {
  return {
    latitude: randomLatitude(),
    longitude: randomLongitude(),
    altitude: randomAltitude(),
    frequency: randomFrequency(),
    speed: randomSpeed(),
    bearing: randomBearing(),
    ip_address: randomIpAddress(),
  };
}

/**
 * Create a random TargetUpdateDTO
 * @param partial If true, only some fields are set
 */
export function createRandomTargetUpdate(partial = true): TargetUpdateDTO {
  if (!partial) {
    return {
      latitude: randomLatitude(),
      longitude: randomLongitude(),
      altitude: randomAltitude(),
      frequency: randomFrequency(),
      speed: randomSpeed(),
      bearing: randomBearing(),
      ip_address: randomIpAddress(),
    };
  }

  const update: TargetUpdateDTO = {};

  if (Math.random() < 0.5) update.latitude = randomLatitude();
  if (Math.random() < 0.5) update.longitude = randomLongitude();
  if (Math.random() < 0.5) update.altitude = randomAltitude();
  if (Math.random() < 0.5) update.frequency = randomFrequency();
  if (Math.random() < 0.5) update.speed = randomSpeed();
  if (Math.random() < 0.5) update.bearing = randomBearing();
  if (Math.random() < 0.5) update.ip_address = randomIpAddress();

  // Ensure at least one field is set
  if (Object.keys(update).length === 0) {
    update.speed = randomSpeed();
  }

  return update;
}

/**
 * Create a list of random TargetDTOs
 */
export function createRandomTargets(count = 5): TargetDTO[] {
  return Array.from({ length: count }, () => createRandomTarget());
}
