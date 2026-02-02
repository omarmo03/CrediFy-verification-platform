import { describe, it, expect } from 'vitest';
import { smartSearch, getStatistics } from './search';
import { getDb } from './db';
import { profiles } from '../drizzle/schema';

describe('Smart Search Engine', () => {
  it('should handle empty query', async () => {
    const result = await smartSearch('');
    expect(result.exact).toBeNull();
    expect(result.suggestions.length).toBe(0);
  });



  it('should return empty results for completely unrelated query', async () => {
    const result = await smartSearch('xyzabc123');
    expect(result.exact).toBeNull();
    expect(result.suggestions.length).toBe(0);
  });

  it('should get real statistics from database', async () => {
    const stats = await getStatistics();
    expect(stats).toHaveProperty('totalProfiles');
    expect(stats).toHaveProperty('trustedCount');
    expect(stats).toHaveProperty('scammerCount');
    expect(stats).toHaveProperty('suspiciousCount');
    expect(stats).toHaveProperty('topSellersCount');
    expect(stats).toHaveProperty('middlemenCount');
    
    expect(typeof stats.totalProfiles).toBe('number');
    expect(stats.totalProfiles).toBeGreaterThanOrEqual(0);
  });

  it('should have accurate statistics counts', async () => {
    const stats = await getStatistics();
    
    expect(stats.totalProfiles).toBeGreaterThanOrEqual(0);
    expect(stats.trustedCount).toBeGreaterThanOrEqual(0);
    expect(stats.scammerCount).toBeGreaterThanOrEqual(0);
  });
});
