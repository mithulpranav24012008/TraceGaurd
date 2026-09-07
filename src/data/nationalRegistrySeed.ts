import { NationalRegistryEntry } from '../types';

/**
 * Synthetic seed data for the National Pattern Match registry.
 * 
 * These entries simulate prior complaints filed across Indian states,
 * ensuring every preloaded mock case triggers a pattern match hit.
 * 
 * Addresses deliberately reuse the 4 mock case seed addresses plus
 * 2 additional "super repeat offender" addresses.
 */
export const NATIONAL_REGISTRY_SEED: NationalRegistryEntry[] = [
  // ─── Case 1 address: 0x71c89f2a2810a993e827b508f7d8e0a2e399A42 (Ethereum Phishing) ───
  {
    walletAddress: '0x71c89f2a2810a993e827b508f7d8e0a2e399A42',
    chain: 'Ethereum',
    dateReported: '2025-11-14',
    reportingState: 'Maharashtra',
    reportingCity: 'Mumbai',
    caseId: 'MH-CYB-2025-4412',
    complaintAmount: 485000
  },
  {
    walletAddress: '0x71c89f2a2810a993e827b508f7d8e0a2e399A42',
    chain: 'Ethereum',
    dateReported: '2026-02-08',
    reportingState: 'Karnataka',
    reportingCity: 'Bengaluru',
    caseId: 'KA-CYB-2026-1187',
    complaintAmount: 320000
  },
  {
    walletAddress: '0x71c89f2a2810a993e827b508f7d8e0a2e399A42',
    chain: 'Ethereum',
    dateReported: '2026-06-22',
    reportingState: 'Tamil Nadu',
    reportingCity: 'Chennai',
    caseId: 'TN-CYB-2026-3301',
    complaintAmount: 610000
  },

  // ─── Case 2 address: bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh (Bitcoin Ransomware) ───
  {
    walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    chain: 'Bitcoin',
    dateReported: '2025-09-03',
    reportingState: 'Delhi',
    reportingCity: 'New Delhi',
    caseId: 'DL-CYB-2025-2208',
    complaintAmount: 750000
  },
  {
    walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    chain: 'Bitcoin',
    dateReported: '2026-01-17',
    reportingState: 'Uttar Pradesh',
    reportingCity: 'Lucknow',
    caseId: 'UP-CYB-2026-0819',
    complaintAmount: 420000
  },
  {
    walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    chain: 'Bitcoin',
    dateReported: '2026-05-11',
    reportingState: 'Gujarat',
    reportingCity: 'Ahmedabad',
    caseId: 'GJ-CYB-2026-2765',
    complaintAmount: 290000
  },

  // ─── Case 3 address: 0xbb192a019284102938475910293847591029384a (BSC Investment Scam) ───
  {
    walletAddress: '0xbb192a019284102938475910293847591029384a',
    chain: 'BNB Smart Chain',
    dateReported: '2026-03-10',
    reportingState: 'Telangana',
    reportingCity: 'Hyderabad',
    caseId: 'TS-CYB-2026-1590',
    complaintAmount: 185000
  },
  {
    walletAddress: '0xbb192a019284102938475910293847591029384a',
    chain: 'BNB Smart Chain',
    dateReported: '2026-07-28',
    reportingState: 'West Bengal',
    reportingCity: 'Kolkata',
    caseId: 'WB-CYB-2026-4102',
    complaintAmount: 245000
  },

  // ─── Case 4 address: 0x2a91029384710293847102938471029384710293 (Polygon Flash Loan) ───
  {
    walletAddress: '0x2a91029384710293847102938471029384710293',
    chain: 'Polygon',
    dateReported: '2026-04-05',
    reportingState: 'Rajasthan',
    reportingCity: 'Jaipur',
    caseId: 'RJ-CYB-2026-1980',
    complaintAmount: 520000
  },
  {
    walletAddress: '0x2a91029384710293847102938471029384710293',
    chain: 'Polygon',
    dateReported: '2026-07-14',
    reportingState: 'Kerala',
    reportingCity: 'Kochi',
    caseId: 'KL-CYB-2026-3578',
    complaintAmount: 340000
  },

  // ─── Super repeat offender #1: 0xAA3f9028Dc74E2bF6f1C45e8c3219bbE54E81c99 ───
  {
    walletAddress: '0xAA3f9028Dc74E2bF6f1C45e8c3219bbE54E81c99',
    chain: 'Ethereum',
    dateReported: '2025-06-18',
    reportingState: 'Maharashtra',
    reportingCity: 'Pune',
    caseId: 'MH-CYB-2025-1102',
    complaintAmount: 890000
  },
  {
    walletAddress: '0xAA3f9028Dc74E2bF6f1C45e8c3219bbE54E81c99',
    chain: 'Ethereum',
    dateReported: '2025-10-04',
    reportingState: 'Delhi',
    reportingCity: 'New Delhi',
    caseId: 'DL-CYB-2025-3340',
    complaintAmount: 1250000
  },
  {
    walletAddress: '0xAA3f9028Dc74E2bF6f1C45e8c3219bbE54E81c99',
    chain: 'Ethereum',
    dateReported: '2026-01-22',
    reportingState: 'Karnataka',
    reportingCity: 'Bengaluru',
    caseId: 'KA-CYB-2026-0451',
    complaintAmount: 720000
  },
  {
    walletAddress: '0xAA3f9028Dc74E2bF6f1C45e8c3219bbE54E81c99',
    chain: 'Ethereum',
    dateReported: '2026-04-30',
    reportingState: 'Tamil Nadu',
    reportingCity: 'Coimbatore',
    caseId: 'TN-CYB-2026-2214',
    complaintAmount: 560000
  },
  {
    walletAddress: '0xAA3f9028Dc74E2bF6f1C45e8c3219bbE54E81c99',
    chain: 'Ethereum',
    dateReported: '2026-08-01',
    reportingState: 'Gujarat',
    reportingCity: 'Surat',
    caseId: 'GJ-CYB-2026-3910',
    complaintAmount: 410000
  },

  // ─── Super repeat offender #2: bc1qsuperoffender88291ab37cd9182ef0a78b450c ───
  {
    walletAddress: 'bc1qsuperoffender88291ab37cd9182ef0a78b450c',
    chain: 'Bitcoin',
    dateReported: '2025-08-22',
    reportingState: 'Uttar Pradesh',
    reportingCity: 'Noida',
    caseId: 'UP-CYB-2025-5501',
    complaintAmount: 1100000
  },
  {
    walletAddress: 'bc1qsuperoffender88291ab37cd9182ef0a78b450c',
    chain: 'Bitcoin',
    dateReported: '2025-12-15',
    reportingState: 'West Bengal',
    reportingCity: 'Kolkata',
    caseId: 'WB-CYB-2025-7014',
    complaintAmount: 680000
  },
  {
    walletAddress: 'bc1qsuperoffender88291ab37cd9182ef0a78b450c',
    chain: 'Bitcoin',
    dateReported: '2026-03-28',
    reportingState: 'Telangana',
    reportingCity: 'Hyderabad',
    caseId: 'TS-CYB-2026-1812',
    complaintAmount: 950000
  },
  {
    walletAddress: 'bc1qsuperoffender88291ab37cd9182ef0a78b450c',
    chain: 'Bitcoin',
    dateReported: '2026-06-10',
    reportingState: 'Rajasthan',
    reportingCity: 'Jaipur',
    caseId: 'RJ-CYB-2026-2990',
    complaintAmount: 520000
  },
  {
    walletAddress: 'bc1qsuperoffender88291ab37cd9182ef0a78b450c',
    chain: 'Bitcoin',
    dateReported: '2026-08-19',
    reportingState: 'Kerala',
    reportingCity: 'Thiruvananthapuram',
    caseId: 'KL-CYB-2026-4201',
    complaintAmount: 340000
  },
  {
    walletAddress: 'bc1qsuperoffender88291ab37cd9182ef0a78b450c',
    chain: 'Bitcoin',
    dateReported: '2026-09-01',
    reportingState: 'Maharashtra',
    reportingCity: 'Mumbai',
    caseId: 'MH-CYB-2026-5580',
    complaintAmount: 760000
  }
];
