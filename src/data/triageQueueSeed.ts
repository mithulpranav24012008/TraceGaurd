import { TriageComplaint } from '../types';

/**
 * ~25 synthetic pending complaints for station-level officer triage.
 * 
 * Includes addresses matching the National Registry seed so cross-case
 * pattern match counts (3-6 victims) immediately show up in the triage queue!
 */
export const TRIAGE_QUEUE_SEED: Omit<TriageComplaint, 'riskScore' | 'riskLevel' | 'patternMatchCount' | 'patternStates' | 'recommendedAction'>[] = [
  {
    id: 'CMP-2026-001',
    complainantName: 'Rajesh Sharma',
    walletAddress: '0x71c89f2a2810a993e827b508f7d8e0a2e399A42',
    chain: 'Ethereum',
    amount: 1450000,
    amountUsd: 17470,
    dateReported: '2026-09-06',
    stationDistrict: 'Cyber Crime PS Bengaluru Central (KA)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-002',
    complainantName: 'Priya Sundaram',
    walletAddress: '0xAA3f9028Dc74E2bF6f1C45e8c3219bbE54E81c99',
    chain: 'Ethereum',
    amount: 3200000,
    amountUsd: 38550,
    dateReported: '2026-09-05',
    stationDistrict: 'Cyber Cell South Mumbai (MH)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-003',
    complainantName: 'Vikram Malhotra',
    walletAddress: 'bc1qsuperoffender88291ab37cd9182ef0a78b450c',
    chain: 'Bitcoin',
    amount: 5800000,
    amountUsd: 69880,
    dateReported: '2026-09-04',
    stationDistrict: 'Special Cell New Delhi (DL)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-004',
    complainantName: 'Amit Patel',
    walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    chain: 'Bitcoin',
    amount: 2100000,
    amountUsd: 25300,
    dateReported: '2026-09-03',
    stationDistrict: 'Cyber Crime PS Ahmedabad (GJ)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-005',
    complainantName: 'Ananya Sen',
    walletAddress: '0xbb192a019284102938475910293847591029384a',
    chain: 'BNB Smart Chain',
    amount: 890000,
    amountUsd: 10720,
    dateReported: '2026-09-02',
    stationDistrict: 'Kolkata Cyber Cell (WB)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-006',
    complainantName: 'Suresh Kumar',
    walletAddress: '0x2a91029384710293847102938471029384710293',
    chain: 'Polygon',
    amount: 1750000,
    amountUsd: 21080,
    dateReported: '2026-09-01',
    stationDistrict: 'District Cyber Cell Jaipur (RJ)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-007',
    complainantName: 'Meenakshi Iyer',
    walletAddress: '0x71c89f2a2810a993e827b508f7d8e0a2e399A42',
    chain: 'Ethereum',
    amount: 2600000,
    amountUsd: 31320,
    dateReported: '2026-08-30',
    stationDistrict: 'Chennai Cyber Crime Wing (TN)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-008',
    complainantName: 'Rohan Deshmukh',
    walletAddress: '0xAA3f9028Dc74E2bF6f1C45e8c3219bbE54E81c99',
    chain: 'Ethereum',
    amount: 4100000,
    amountUsd: 49400,
    dateReported: '2026-08-28',
    stationDistrict: 'Pune City Cyber PS (MH)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-009',
    complainantName: 'Deepak Verma',
    walletAddress: '0x994817293b7610e7293b82109841239851029411',
    chain: 'Ethereum',
    amount: 350000,
    amountUsd: 4210,
    dateReported: '2026-08-27',
    stationDistrict: 'Lucknow Cyber Cell (UP)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-010',
    complainantName: 'Kavita Reddy',
    walletAddress: '0x33A917459A083d09e7c10b42f029e81b67f139E0',
    chain: 'Ethereum',
    amount: 1120000,
    amountUsd: 13490,
    dateReported: '2026-08-25',
    stationDistrict: 'Hyderabad Cyber Crime PS (TS)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-011',
    complainantName: 'Harish Nair',
    walletAddress: 'bc1qsuperoffender88291ab37cd9182ef0a78b450c',
    chain: 'Bitcoin',
    amount: 7200000,
    amountUsd: 86750,
    dateReported: '2026-08-24',
    stationDistrict: 'Kochi Cyber Cell (KL)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-012',
    complainantName: 'Tarun Bansal',
    walletAddress: '0x8F2e411b93da92982d63cc681a29381c8f41C921',
    chain: 'Ethereum',
    amount: 620000,
    amountUsd: 7470,
    dateReported: '2026-08-22',
    stationDistrict: 'Gurugram Cyber Crime PS (HR)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-013',
    complainantName: 'Sunita Ghosh',
    walletAddress: 'bc1qw91038472910ba7491823bc0192848192a0149',
    chain: 'Bitcoin',
    amount: 490000,
    amountUsd: 5900,
    dateReported: '2026-08-20',
    stationDistrict: 'Bhubaneswar Cyber Cell (OD)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-014',
    complainantName: 'Gaurav Joshi',
    walletAddress: '0x2a91029384710293847102938471029384710293',
    chain: 'Polygon',
    amount: 980000,
    amountUsd: 11800,
    dateReported: '2026-08-18',
    stationDistrict: 'Dehradun Cyber Crime PS (UK)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-015',
    complainantName: 'Divya Agarwal',
    walletAddress: '0x1A80812903fe209172836109e20192e84719AA12',
    chain: 'Ethereum',
    amount: 250000,
    amountUsd: 3010,
    dateReported: '2026-08-16',
    stationDistrict: 'Noida Sector 20 PS (UP)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-016',
    complainantName: 'Manish Chawla',
    walletAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    chain: 'Bitcoin',
    amount: 3400000,
    amountUsd: 40960,
    dateReported: '2026-08-15',
    stationDistrict: 'Chandigarh Cyber Cell (PB/HR)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-017',
    complainantName: 'Preeti Saxena',
    walletAddress: '0xbb192a019284102938475910293847591029384a',
    chain: 'BNB Smart Chain',
    amount: 780000,
    amountUsd: 9400,
    dateReported: '2026-08-12',
    stationDistrict: 'Bhopal Cyber Police Station (MP)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-018',
    complainantName: 'Arjun Das',
    walletAddress: '0x5C91207e3a891782e44f89901728362bca981044',
    chain: 'Ethereum',
    amount: 1800000,
    amountUsd: 21680,
    dateReported: '2026-08-10',
    stationDistrict: 'Guwahati Cyber Crime Cell (AS)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-019',
    complainantName: 'Shalini Tripathi',
    walletAddress: '0x71c89f2a2810a993e827b508f7d8e0a2e399A42',
    chain: 'Ethereum',
    amount: 5200000,
    amountUsd: 62650,
    dateReported: '2026-08-08',
    stationDistrict: 'Varanasi Cyber Cell (UP)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-020',
    complainantName: 'Nikhil Rane',
    walletAddress: '0x992B1c4083De8201a61c7793e8e19273b7194D88',
    chain: 'Ethereum',
    amount: 420000,
    amountUsd: 5060,
    dateReported: '2026-08-05',
    stationDistrict: 'Thane Cyber Crime Cell (MH)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-021',
    complainantName: 'Swati Mendon',
    walletAddress: 'bc1q84f74910283c79a83f1092e0192841b9921c81',
    chain: 'Bitcoin',
    amount: 1550000,
    amountUsd: 18670,
    dateReported: '2026-08-03',
    stationDistrict: 'Mangaluru Cyber Cell (KA)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-022',
    complainantName: 'Alok Mishra',
    walletAddress: '0xAA3f9028Dc74E2bF6f1C45e8c3219bbE54E81c99',
    chain: 'Ethereum',
    amount: 6800000,
    amountUsd: 81920,
    dateReported: '2026-08-01',
    stationDistrict: 'Patna Cyber Police Station (BR)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-023',
    complainantName: 'Nandini Shah',
    walletAddress: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
    chain: 'BNB Smart Chain',
    amount: 180000,
    amountUsd: 2170,
    dateReported: '2026-07-28',
    stationDistrict: 'Vadodara Cyber Cell (GJ)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-024',
    complainantName: 'Kishore Hegde',
    walletAddress: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
    chain: 'Polygon',
    amount: 1350000,
    amountUsd: 16260,
    dateReported: '2026-07-25',
    stationDistrict: 'Hubballi Cyber Cell (KA)',
    status: 'Pending Triage'
  },
  {
    id: 'CMP-2026-025',
    complainantName: 'Reena Bhatia',
    walletAddress: 'bc1qsuperoffender88291ab37cd9182ef0a78b450c',
    chain: 'Bitcoin',
    amount: 8900000,
    amountUsd: 107220,
    dateReported: '2026-07-20',
    stationDistrict: 'Faridabad Cyber Police (HR)',
    status: 'Pending Triage'
  }
];
