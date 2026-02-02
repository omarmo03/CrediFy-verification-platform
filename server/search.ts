import { getDb } from './db';
import { profiles } from '../drizzle/schema';

// @ts-ignore - levenshtein doesn't have types
import Levenshtein from 'levenshtein';

/**
 * Calculate similarity between two strings (0-1)
 * 1 = identical, 0 = completely different
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1;
  
  const distance = new Levenshtein(s1, s2).distance;
  const maxLength = Math.max(s1.length, s2.length);
  
  return 1 - (distance / maxLength);
}

/**
 * Smart search with fuzzy matching
 * Returns exact match if found, otherwise returns suggestions
 */
export async function smartSearch(query: string) {
  if (!query || query.trim().length === 0) {
    return { exact: null, suggestions: [] };
  }

  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  // Fetch all profiles from database
  const allProfiles = await db.select().from(profiles);

  // Check for exact match (case-insensitive)
  const exactMatch = allProfiles.find(
    p => p.name.toLowerCase() === normalizedQuery || 
         p.profileLink.toLowerCase() === normalizedQuery
  );

  if (exactMatch) {
    return { exact: exactMatch, suggestions: [] };
  }

  // Calculate similarity for all profiles
  const similarities = allProfiles.map(profile => ({
    profile,
    nameSimilarity: calculateSimilarity(profile.name, query),
    linkSimilarity: calculateSimilarity(profile.profileLink, query),
  }));

  // Get best matches (similarity > 0.6)
  const suggestions = similarities
    .filter(s => s.nameSimilarity > 0.6 || s.linkSimilarity > 0.6)
    .sort((a, b) => {
      const maxA = Math.max(a.nameSimilarity, a.linkSimilarity);
      const maxB = Math.max(b.nameSimilarity, b.linkSimilarity);
      return maxB - maxA;
    })
    .slice(0, 5)
    .map(s => s.profile);

  return { exact: null, suggestions };
}

/**
 * Get real statistics from database
 */
export async function getStatistics() {
  const db = await getDb();
  if (!db) {
    throw new Error('Database not available');
  }

  const allProfiles = await db.select().from(profiles);

  return {
    totalProfiles: allProfiles.length,
    trustedCount: allProfiles.filter(p => p.status === 'trusted').length,
    scammerCount: allProfiles.filter(p => p.status === 'scammer').length,
    suspiciousCount: allProfiles.filter(p => p.status === 'suspicious').length,
    topSellersCount: allProfiles.filter(p => p.rank === 'top_seller').length,
    middlemenCount: allProfiles.filter(p => p.rank === 'middleman').length,
  };
}
