export type Blockchain = 'Ethereum' | 'Bitcoin' | 'BNB Smart Chain' | 'Polygon';

export type InvestigationSource = 
  | 'Victim Report' 
  | 'Bank Referral' 
  | 'Exchange Referral' 
  | 'Law Enforcement';

export type RiskLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type NodeType = 
  | 'victim' 
  | 'wallet' 
  | 'suspect' 
  | 'clustered_wallet' 
  | 'peel_chain' 
  | 'mixer' 
  | 'bridge' 
  | 'exchange' 
  | 'high_risk';

export interface GraphNode {
  id: string;
  name: string;
  type: NodeType;
  address: string;
  transactions: number;
  received: string;
  sent: string;
  risk: number;
  flags: string[];
  x: number;
  y: number;
  clusterGroup?: string;
  label?: string;
  entityName?: string;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  amount: string;
  usdValue: string;
  asset: string;
  timestamp: string;
  txHash: string;
  hop: number;
  isSuspicious?: boolean;
}

export interface RiskTimelineEvent {
  time: string;
  event: string;
  risk: number;
  hop: number;
  detail?: string;
}

export interface RiskComponents {
  'Transaction Behavior': number;
  'Mixer Exposure': number;
  'Bridge Exposure': number;
  'Address Clustering': number;
  'Velocity': number;
  'Exchange Proximity': number;
  'National Pattern Match': number;
}

export interface ExchangeAttribution {
  title: string;
  exchange: string;
  walletType: string;
  confidence: number;
  potentialExchangeAmount: string;
  potentiallyTraceableAmount: string;
  evidence: string[];
  warning: string;
  jurisdiction?: string;
  depositCluster?: string;
  identifiedAt?: string;
}

export interface SeedAddressDetails {
  address: string;
  blockchain: Blockchain;
  firstSeen: string;
  lastSeen: string;
  transactions: number;
  totalInflow: string;
  totalOutflow: string;
  currentBalance: string;
  reportedBy: InvestigationSource;
}

export interface AddressClusterData {
  title: string;
  description: string;
  heuristics: string[];
  relatedAddressesCount: number;
  risk: number;
  root: string;
  clusterEntities: {
    address: string;
    alias: string;
    correlationScore: number;
    reason: string;
    balance: string;
    firstSeen: string;
  }[];
}

export interface ComplianceReferral {
  id: string;
  caseId: string;
  referenceNumber: string;
  suspectAddress: string;
  blockchain: Blockchain;
  riskScore: number;
  riskLevel: RiskLevel;
  exchange: string;
  confidence: number;
  suspiciousAmount: string;
  summary: string;
  recipient: string;
  status: 'SIMULATION ONLY' | 'QUEUED' | 'ESCALATED' | 'ACKNOWLEDGED';
  timestamp: string;
  notes?: string;
}

/** A single report entry in the national wallet address registry */
export interface NationalRegistryEntry {
  walletAddress: string;
  chain: Blockchain;
  dateReported: string;
  reportingState: string;
  reportingCity: string;
  caseId: string;
  complaintAmount: number;
}

/** Aggregated result from looking up an address in the national registry */
export interface PatternMatchResult {
  walletAddress: string;
  victimCount: number;
  states: string[];
  cities: string[];
  earliestDate: string;
  latestDate: string;
  totalAmount: number;
  matchingReports: NationalRegistryEntry[];
}

export interface MockCase {
  id: string;
  title: string;
  scenario: string;
  blockchain: Blockchain;
  severity: RiskLevel;
  riskScore: number;
  confidence: number;
  exchange: string;
  suspiciousAmount: number;
  source: InvestigationSource;
  seedDetails: SeedAddressDetails;
  clusterData: AddressClusterData;
  nodes: GraphNode[];
  edges: GraphEdge[];
  riskComponents: RiskComponents;
  timeline: RiskTimelineEvent[];
  attribution: ExchangeAttribution;
  highRiskReasons: string[];
  status: 'Investigating' | 'Attributed' | 'Alerted';
}

export type TriageAction = 'Escalate to Cyber Cell' | 'Monitor' | 'Low Priority';

export interface TriageComplaint {
  id: string;
  complainantName: string;
  walletAddress: string;
  chain: Blockchain;
  amount: number;
  amountUsd: number;
  dateReported: string;
  stationDistrict: string;
  riskScore: number;
  riskLevel: RiskLevel;
  patternMatchCount: number;
  patternStates: string[];
  recommendedAction: TriageAction;
  status: 'Pending Triage' | 'Escalated' | 'Dismissed';
}

export type NavigationTab = 
  | 'track'
  | 'triage'
  | 'investigation' 
  | 'cases' 
  | 'graph' 
  | 'risk' 
  | 'pattern'
  | 'attribution' 
  | 'alerts' 
  | 'reports' 
  | 'settings';

export interface SystemGateways {
  realBlockchainAccess: boolean;
  externalExchangeApi: boolean;
  realFiuTransmission: boolean;
  rpcEndpoint?: string;
  exchangeApiEndpoint?: string;
  fiuProtocol?: string;
}

