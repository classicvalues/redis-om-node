import { saveHash } from './redis-helper';

import Client from "../../lib/client";
import { Entity, RedisId } from "../../lib/entity";
import { Schema } from '../../lib/schema';

export interface Bigfoot {
  title?: string | null;
  county?: string | null;
  state?: string | null;
  eyewitness?: boolean | null;
  temperature?: number | null;
}

export class Bigfoot extends Entity {}

export function createSchema(): Schema<Bigfoot> {
  return new Schema<Bigfoot>(
    Bigfoot, {
      title: { type: 'string', textSearch: true },
      county: { type: 'string' },
      state: { type: 'string' },
      eyewitness: { type: 'boolean' },
      temperature: { type: 'number' }
    });
}

export function expectMatchesSighting(actualEntity: Bigfoot, expectedId: RedisId, expectedSighting: BigfootSightingData) {
  expect(actualEntity.redisId).toBe(expectedId);
  expect(actualEntity.title).toBe(expectedSighting.title ?? null);
  expect(actualEntity.county).toBe(expectedSighting.county ?? null);
  expect(actualEntity.state).toBe(expectedSighting.state ?? null);
  expect(actualEntity.eyewitness).toBe(expectedSighting.eyewitness ?? null);
  expect(actualEntity.temperature).toBe(expectedSighting.temperature ?? null);
}

export type BigfootSightingData = {
  title?: string;
  county?: string;
  state?: string;
  eyewitness?: boolean;
  temperature?: number;
};

export async function addBigfootSighting(client: Client, key: string, sighting: BigfootSightingData) {
  let command: string[] = [];
  if (sighting.title !== undefined) command.push('title', sighting.title);
  if (sighting.county !== undefined) command.push('county', sighting.county);
  if (sighting.state !== undefined) command.push('state', sighting.state);
  if (sighting.eyewitness !== undefined) command.push('eyewitness', sighting.eyewitness ? '1' : '0');
  if (sighting.temperature !== undefined) command.push('temperature', sighting.temperature.toString());
  await saveHash(client, key, command);
};

export const A_REDIS_ID: RedisId = '1';
export const A_REDIS_KEY: string = `Bigfoot:${A_REDIS_ID}`;
export const A_BIGFOOT_SIGHTING: BigfootSightingData = {
  title: "Bigfoot was seen out by the Walmart",
  county: "Athens",
  state: "OH",
  eyewitness: true,
  temperature: 75
};

export const ANOTHER_REDIS_ID: RedisId = '2';
export const ANOTHER_REDIS_KEY = `Bigfoot:${ANOTHER_REDIS_ID}`;
export const ANOTHER_BIGFOOT_SIGHTING : BigfootSightingData= {
  title: "Bigfoot was seen out by the Piggly Wiggly",
  county: "Ashland",
  state: "OH",
  eyewitness: false,
  temperature: 87
};

export const A_THIRD_REDIS_ID: RedisId = '3';
export const A_THIRD_REDIS_KEY = `Bigfoot:${A_THIRD_REDIS_ID}`;
export const A_THIRD_BIGFOOT_SIGHTING: BigfootSightingData = {
  title: "Bigfoot was seen swimming in the river",
  county: "Ashland",
  state: "KY",
  eyewitness: true,
  temperature: 93
};

export const A_PARTIAL_REDIS_ID: RedisId = '4';
export const A_PARTIAL_REDIS_KEY: string = `Bigfoot:${A_PARTIAL_REDIS_ID}`;
export const A_PARTIAL_BIGFOOT_SIGHTING: BigfootSightingData = {
  title: "Bigfoot was seen lounging in the pond"
};

export const AN_EMPTY_REDIS_ID: RedisId = '5';
export const AN_EMPTY_REDIS_KEY: string = `Bigfoot:${AN_EMPTY_REDIS_ID}`;
export const AN_EMPTY_BIGFOOT_SIGHTING: BigfootSightingData = {};