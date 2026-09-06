import { MockCase, ComplianceReferral } from '../types';

export const MOCK_CASES: MockCase[] = [
  {
    id: 'TG-2026-00147',
    title: 'DeFi Phishing Inflow with Tornado Obfuscation',
    scenario: 'Mixer → Bridge → Exchange',
    blockchain: 'Ethereum',
    severity: 'Critical',
    riskScore: 87,
    confidence: 94,
    exchange: 'ExampleX Exchange',
    suspiciousAmount: 73420,
    source: 'Victim Report',
    status: 'Alerted',
    seedDetails: {
      address: '0x71c89f2a2810a993e827b508f7d8e0a2e399A42',
      blockchain: 'Ethereum',
      firstSeen: '2026-08-28 09:14:02 UTC',
      lastSeen: '2026-09-05 18:41:20 UTC',
      transactions: 37,
      totalInflow: '$284,620',
      totalOutflow: '$279,410',
      currentBalance: '$5,210.00 (2.12 ETH)',
      reportedBy: 'Victim Report'
    },
    clusterData: {
      title: 'Address Clustering (Heuristic v3.4)',
      description: 'Identifying addresses potentially controlled by the same illicit entity.',
      heuristics: [
        'Common-input ownership on multi-tx sweeps',
        'Sub-second transaction timing correlation',
        'Shared destinations and recurring counterparty gas funders',
        'Repeated behavioral patterns & nonce increment cadence'
      ],
      relatedAddressesCount: 5,
      risk: 81,
      root: 'Seed Wallet (0x71c...9A42)',
      clusterEntities: [
        {
          address: '0x8F2e411b93da92982d63cc681a29381c8f41C921',
          alias: 'Intermediary Wallet B',
          correlationScore: 98,
          reason: 'Direct sweep recipient within 14 seconds of drain',
          balance: '$1,420',
          firstSeen: '2026-08-28'
        },
        {
          address: '0x33A917459A083d09e7c10b42f029e81b67f139E0',
          alias: 'Staging Wallet A',
          correlationScore: 94,
          reason: 'Funded by identical zero-confirmation gas distributor',
          balance: '$980',
          firstSeen: '2026-08-28'
        },
        {
          address: '0x992B1c4083De8201a61c7793e8e19273b7194D88',
          alias: 'Peel Chain Anchor 1',
          correlationScore: 91,
          reason: 'Iterative peel transaction distribution output',
          balance: '$4,120',
          firstSeen: '2026-08-29'
        },
        {
          address: '0x5C91207e3a891782e44f89901728362bca981044',
          alias: 'Relayer Gas Dispenser',
          correlationScore: 88,
          reason: 'Dispersed 0.05 ETH gas to 12 linked burner addresses',
          balance: '$12,450',
          firstSeen: '2026-08-27'
        },
        {
          address: '0x1A80812903fe209172836109e20192e84719AA12',
          alias: 'Ancillary Drop Wallet C',
          correlationScore: 82,
          reason: 'Shared downstream consolidation counterparty',
          balance: '$320',
          firstSeen: '2026-08-30'
        }
      ]
    },
    nodes: [
      {
        id: 'node-victim',
        name: 'Reported Victim',
        type: 'victim',
        address: '0x4981E29d01248F29e83018274B39129048189D22',
        transactions: 142,
        received: '$320,000',
        sent: '$284,620',
        risk: 12,
        flags: ['Exploited approval contract', 'ERC-20 Permit signature drain'],
        x: 60,
        y: 200,
        entityName: 'Victim Vault'
      },
      {
        id: 'node-seed',
        name: 'Suspect Seed',
        type: 'suspect',
        address: '0x71c89f2a2810a993e827b508f7d8e0a2e399A42',
        transactions: 37,
        received: '$284,620',
        sent: '$279,410',
        risk: 87,
        flags: ['Direct phishing recipient', 'Rapid automated fan-out', 'Zero-day entity'],
        x: 210,
        y: 200,
        entityName: 'Drainer Operator 0x71c'
      },
      {
        id: 'node-wallet-a',
        name: 'Wallet A (Staging)',
        type: 'clustered_wallet',
        address: '0x33A917459A083d09e7c10b42f029e81b67f139E0',
        transactions: 28,
        received: '$140,200',
        sent: '$139,220',
        risk: 78,
        flags: ['High velocity transit', 'Clustered entity member'],
        x: 350,
        y: 120,
        entityName: 'Staging Hub A'
      },
      {
        id: 'node-wallet-b',
        name: 'Wallet B (Fanout)',
        type: 'clustered_wallet',
        address: '0x8F2e411b93da92982d63cc681a29381c8f41C921',
        transactions: 19,
        received: '$91,420',
        sent: '$87,003',
        risk: 82,
        flags: ['Rapid fund movement', 'Connected to peel chain', 'Multiple destination wallets'],
        x: 350,
        y: 280,
        entityName: 'Fanout Hub B'
      },
      {
        id: 'node-peel',
        name: 'Peel Chain Dispersal',
        type: 'peel_chain',
        address: '0x992B1c4083De8201a61c7793e8e19273b7194D88',
        transactions: 54,
        received: '$87,003',
        sent: '$86,100',
        risk: 86,
        flags: ['Iterative micro-splitting', 'Peel chain behavior signature', 'Gas-normalized outputs'],
        x: 490,
        y: 280,
        entityName: 'Peel Splitting System'
      },
      {
        id: 'node-mixer',
        name: 'Mixer Pool (Tornado Sim)',
        type: 'mixer',
        address: '0xd90e2f925DA726b50C4Ed8D0Fb90Ad053324F31b',
        transactions: 12904,
        received: '$14,280,000',
        sent: '$13,910,000',
        risk: 96,
        flags: ['OFAC Sanctioned smart contract', 'Zero-knowledge obfuscator', 'High-volume mixing pool'],
        x: 490,
        y: 120,
        entityName: 'Tornado Cash Sim Pool'
      },
      {
        id: 'node-bridge',
        name: 'Cross-Chain Bridge Gateway',
        type: 'bridge',
        address: '0x40ec5B33f54e0E8A33A975908C5BA1c14e5BbbDf',
        transactions: 8412,
        received: '$8,410,000',
        sent: '$8,380,000',
        risk: 84,
        flags: ['Cross-chain asset swap', 'Polygon PoS bridge telemetry match', 'Egress to alternate L1'],
        x: 630,
        y: 120,
        entityName: 'Polygon Bridge Gateway'
      },
      {
        id: 'node-exchange-deposit',
        name: 'Deposit Account 881',
        type: 'exchange',
        address: '0x9A4817293b7610e7293b82109841239851029411',
        transactions: 4,
        received: '$73,420',
        sent: '$73,420',
        risk: 91,
        flags: ['Dedicated user deposit forwarder', 'Rapid exchange sweep', 'Identified exchange cluster'],
        x: 770,
        y: 200,
        entityName: 'Exchange Deposit Address'
      },
      {
        id: 'node-exchange-hot',
        name: 'ExampleX Hot Wallet 4',
        type: 'exchange',
        address: '0x28C6c06298d514Db089934071355E5743bf21d60',
        transactions: 49120,
        received: '$124,500,000',
        sent: '$121,800,000',
        risk: 42,
        flags: ['Centralized Exchange Cold/Hot Treasury', 'High confidence exchange attribution', 'Swept balance'],
        x: 910,
        y: 200,
        entityName: 'ExampleX Hot Wallet #04'
      }
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'node-victim',
        target: 'node-seed',
        amount: '89.4 ETH',
        usdValue: '$284,620',
        asset: 'ETH',
        timestamp: '2026-08-28 09:14:02 UTC',
        txHash: '0x8f192...c814',
        hop: 1,
        isSuspicious: true
      },
      {
        id: 'edge-2',
        source: 'node-seed',
        target: 'node-wallet-a',
        amount: '44.0 ETH',
        usdValue: '$140,200',
        asset: 'ETH',
        timestamp: '2026-08-28 09:14:48 UTC',
        txHash: '0x3a19b...881f',
        hop: 2,
        isSuspicious: true
      },
      {
        id: 'edge-3',
        source: 'node-seed',
        target: 'node-wallet-b',
        amount: '28.7 ETH',
        usdValue: '$91,420',
        asset: 'ETH',
        timestamp: '2026-08-28 09:15:12 UTC',
        txHash: '0x991bc...fa12',
        hop: 2,
        isSuspicious: true
      },
      {
        id: 'edge-4',
        source: 'node-wallet-a',
        target: 'node-mixer',
        amount: '40.0 ETH',
        usdValue: '$127,400',
        asset: 'ETH',
        timestamp: '2026-08-28 09:17:33 UTC',
        txHash: '0x44ab8...901e',
        hop: 3,
        isSuspicious: true
      },
      {
        id: 'edge-5',
        source: 'node-wallet-b',
        target: 'node-peel',
        amount: '27.3 ETH',
        usdValue: '$87,003',
        asset: 'ETH',
        timestamp: '2026-08-28 09:18:04 UTC',
        txHash: '0x7e810...330a',
        hop: 3,
        isSuspicious: true
      },
      {
        id: 'edge-6',
        source: 'node-mixer',
        target: 'node-bridge',
        amount: '38.5 ETH',
        usdValue: '$122,600',
        asset: 'ETH',
        timestamp: '2026-08-28 09:24:19 UTC',
        txHash: '0x12bb9...55cc',
        hop: 4,
        isSuspicious: true
      },
      {
        id: 'edge-7',
        source: 'node-bridge',
        target: 'node-exchange-deposit',
        amount: '23.0 ETH',
        usdValue: '$73,420',
        asset: 'WETH',
        timestamp: '2026-08-28 09:31:05 UTC',
        txHash: '0xbb821...3902',
        hop: 5,
        isSuspicious: true
      },
      {
        id: 'edge-8',
        source: 'node-peel',
        target: 'node-exchange-deposit',
        amount: '0.0 ETH',
        usdValue: '$0 (Swept to alternate)',
        asset: 'ETH',
        timestamp: '2026-08-28 09:32:41 UTC',
        txHash: '0x66f91...818a',
        hop: 4,
        isSuspicious: false
      },
      {
        id: 'edge-9',
        source: 'node-exchange-deposit',
        target: 'node-exchange-hot',
        amount: '23.0 ETH',
        usdValue: '$73,420',
        asset: 'ETH',
        timestamp: '2026-08-28 09:49:12 UTC',
        txHash: '0xfa018...771e',
        hop: 6,
        isSuspicious: true
      }
    ],
    riskComponents: {
      'Transaction Behavior': 78,
      'Mixer Exposure': 92,
      'Bridge Exposure': 84,
      'Address Clustering': 81,
      'Velocity': 76,
      'Exchange Proximity': 95
    },
    timeline: [
      { time: '09:14', event: 'Phishing drain from Victim Vault', risk: 38, hop: 1, detail: 'Victim signed rogue permit contract' },
      { time: '09:15', event: 'Seed wallet dispersion to Wallet A & B', risk: 52, hop: 2, detail: 'Rapid multi-destination transfer within 60s' },
      { time: '09:18', event: 'Peel chain micro-splitting initiated', risk: 69, hop: 3, detail: 'Splitting into 0.5-2.0 ETH increments' },
      { time: '09:24', event: 'Deposit into Tornado Cash privacy pool', risk: 85, hop: 4, detail: 'OFAC-flagged mixer interaction detected' },
      { time: '09:31', event: 'Cross-chain bridge withdrawal on Polygon', risk: 89, hop: 5, detail: 'Temporal-volume correlation with mixer egress' },
      { time: '09:49', event: 'Sweep into ExampleX Exchange Hot Wallet', risk: 95, hop: 6, detail: 'Terminal deposit attribution with 94% confidence' }
    ],
    attribution: {
      title: 'Potential Exchange Attribution Detected',
      exchange: 'ExampleX Exchange',
      walletType: 'Centralized Exchange Hot Wallet / User Deposit Forwarder',
      confidence: 94,
      potentialExchangeAmount: '$73,420',
      potentiallyTraceableAmount: '$68,190',
      evidence: [
        'Known exchange wallet cluster (ExampleX Omnibus Pool)',
        'Matching automated deposit sweep pattern (<18 min after inflow)',
        'Transaction destination matches documented KYC-gated deposit contract',
        'Historical address association verified against 1,400+ past exchange deposits'
      ],
      warning: 'Attribution is probabilistic and based on heuristic clustering. Requires formal verification via exchange compliance liaison.',
      jurisdiction: 'Seychelles / EU Serviced',
      depositCluster: 'CL-EX-9921-EU',
      identifiedAt: '2026-09-05 19:02 UTC'
    },
    highRiskReasons: [
      'Funds moved through an OFAC-sanctioned smart contract mixer (Tornado Cash Sim)',
      'Rapid automated multi-wallet fan-out within 48 seconds of initial drain',
      'Cross-chain bridge obfuscation across Ethereum and Polygon networks',
      'Direct sweep into centralized exchange infrastructure (ExampleX Hot Wallet #04)'
    ]
  },
  {
    id: 'TG-2026-00142',
    title: 'Ransomware Extortion UTXO Peel Chain',
    scenario: 'Peel Chain → Multiple Wallets → Exchange',
    blockchain: 'Bitcoin',
    severity: 'High',
    riskScore: 76,
    confidence: 89,
    exchange: 'ExampleY Exchange',
    suspiciousAmount: 48200,
    source: 'Bank Referral',
    status: 'Attributed',
    seedDetails: {
      address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
      blockchain: 'Bitcoin',
      firstSeen: '2026-08-20 14:22:11 UTC',
      lastSeen: '2026-09-02 11:05:00 UTC',
      transactions: 24,
      totalInflow: '$198,000',
      totalOutflow: '$194,500',
      currentBalance: '$3,500.00 (0.05 BTC)',
      reportedBy: 'Bank Referral'
    },
    clusterData: {
      title: 'UTXO Common-Input Clustering',
      description: 'Heuristic grouping using common-spend inputs and change-address detection.',
      heuristics: [
        'Common-input ownership on multi-input transactions',
        'One-time change output heuristics (Address reuse avoidance)',
        'Round-number payment extraction with remainder peel',
        'Direct UTXO consolidation into shared batch addresses'
      ],
      relatedAddressesCount: 4,
      risk: 74,
      root: 'Seed Bitcoin Address (bc1q...0wlh)',
      clusterEntities: [
        {
          address: 'bc1q84f74910283c79a83f1092e0192841b9921c81',
          alias: 'Peel Change Address 1',
          correlationScore: 96,
          reason: 'Calculated change output matching spender script type',
          balance: '$18,400',
          firstSeen: '2026-08-21'
        },
        {
          address: 'bc1qw91038472910ba7491823bc0192848192a0149',
          alias: 'Peel Change Address 2',
          correlationScore: 93,
          reason: 'Subsequent hop change address in peel chain',
          balance: '$9,200',
          firstSeen: '2026-08-22'
        },
        {
          address: 'bc1qq839174092174ba910283c81923049182b8192',
          alias: 'Consolidation Node Beta',
          correlationScore: 89,
          reason: 'Aggregated 3 change outputs into single transaction',
          balance: '$24,100',
          firstSeen: '2026-08-23'
        },
        {
          address: 'bc1qpp918274091827364501928374650192837465',
          alias: 'Intermediary UTXO Hop',
          correlationScore: 85,
          reason: 'Time-locked payout address matching syndicate timing',
          balance: '$1,200',
          firstSeen: '2026-08-24'
        }
      ]
    },
    nodes: [
      {
        id: 'node-victim',
        name: 'Corporate Escrow',
        type: 'victim',
        address: 'bc1qcorporate91827401928374650192837465019',
        transactions: 89,
        received: '$250,000',
        sent: '$198,000',
        risk: 15,
        flags: ['Extortion payment initiator', 'Verified victim business'],
        x: 60,
        y: 200,
        entityName: 'Victim Corp Treasury'
      },
      {
        id: 'node-seed',
        name: 'Ransomware Drop Wallet',
        type: 'suspect',
        address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
        transactions: 24,
        received: '$198,000',
        sent: '$194,500',
        risk: 84,
        flags: ['Extortion demand address', 'Immediate UTXO peel launch'],
        x: 230,
        y: 200,
        entityName: 'Ransomware Operator Seed'
      },
      {
        id: 'node-peel-1',
        name: 'Peel Hop 1 (0.8 BTC)',
        type: 'peel_chain',
        address: 'bc1q84f74910283c79a83f1092e0192841b9921c81',
        transactions: 12,
        received: '$98,000',
        sent: '$97,200',
        risk: 76,
        flags: ['UTXO peel pattern', 'Change deduction'],
        x: 410,
        y: 130,
        entityName: 'Peel Branch Alpha'
      },
      {
        id: 'node-peel-2',
        name: 'Peel Hop 2 (Change)',
        type: 'peel_chain',
        address: 'bc1qw91038472910ba7491823bc0192848192a0149',
        transactions: 16,
        received: '$96,500',
        sent: '$95,800',
        risk: 75,
        flags: ['UTXO peel continuation', 'Sub-clustering'],
        x: 410,
        y: 270,
        entityName: 'Peel Branch Beta'
      },
      {
        id: 'node-consolidation',
        name: 'Consolidation Staging',
        type: 'clustered_wallet',
        address: 'bc1qq839174092174ba910283c81923049182b8192',
        transactions: 31,
        received: '$78,400',
        sent: '$77,900',
        risk: 79,
        flags: ['Multi-input aggregator', 'Preparing exchange deposit'],
        x: 590,
        y: 200,
        entityName: 'Consolidator UTXO'
      },
      {
        id: 'node-exchange-dep',
        name: 'ExampleY Deposit bc1q',
        type: 'exchange',
        address: 'bc1qdep99182736450192837465019283746501928',
        transactions: 6,
        received: '$48,200',
        sent: '$48,200',
        risk: 88,
        flags: ['Designated user deposit address', 'Tagged ExampleY user'],
        x: 760,
        y: 200,
        entityName: 'ExampleY Deposit Node'
      },
      {
        id: 'node-exchange-cold',
        name: 'ExampleY Cold Storage',
        type: 'exchange',
        address: '34xp4vRoCGJym3xR7yCVPFHoCNxv4Twseo',
        transactions: 89120,
        received: '$890,000,000',
        sent: '$840,000,000',
        risk: 35,
        flags: ['Cold reserve vault', 'Institutional custodian'],
        x: 920,
        y: 200,
        entityName: 'ExampleY Cold Storage #02'
      }
    ],
    edges: [
      {
        id: 'edge-b1',
        source: 'node-victim',
        target: 'node-seed',
        amount: '3.12 BTC',
        usdValue: '$198,000',
        asset: 'BTC',
        timestamp: '2026-08-20 14:22:11 UTC',
        txHash: 'e5b7a...14f2',
        hop: 1,
        isSuspicious: true
      },
      {
        id: 'edge-b2',
        source: 'node-seed',
        target: 'node-peel-1',
        amount: '1.54 BTC',
        usdValue: '$98,000',
        asset: 'BTC',
        timestamp: '2026-08-20 15:02:40 UTC',
        txHash: 'c120a...3319',
        hop: 2,
        isSuspicious: true
      },
      {
        id: 'edge-b3',
        source: 'node-seed',
        target: 'node-peel-2',
        amount: '1.51 BTC',
        usdValue: '$96,500',
        asset: 'BTC',
        timestamp: '2026-08-20 15:02:40 UTC',
        txHash: 'c120a...3319',
        hop: 2,
        isSuspicious: true
      },
      {
        id: 'edge-b4',
        source: 'node-peel-1',
        target: 'node-consolidation',
        amount: '0.80 BTC',
        usdValue: '$51,000',
        asset: 'BTC',
        timestamp: '2026-08-21 02:11:09 UTC',
        txHash: '1a90f...882e',
        hop: 3,
        isSuspicious: true
      },
      {
        id: 'edge-b5',
        source: 'node-peel-2',
        target: 'node-consolidation',
        amount: '0.43 BTC',
        usdValue: '$27,400',
        asset: 'BTC',
        timestamp: '2026-08-21 04:45:30 UTC',
        txHash: '4399e...10ba',
        hop: 3,
        isSuspicious: true
      },
      {
        id: 'edge-b6',
        source: 'node-consolidation',
        target: 'node-exchange-dep',
        amount: '0.75 BTC',
        usdValue: '$48,200',
        asset: 'BTC',
        timestamp: '2026-08-22 18:20:15 UTC',
        txHash: '98bb1...0011',
        hop: 4,
        isSuspicious: true
      },
      {
        id: 'edge-b7',
        source: 'node-exchange-dep',
        target: 'node-exchange-cold',
        amount: '0.75 BTC',
        usdValue: '$48,200',
        asset: 'BTC',
        timestamp: '2026-08-22 21:00:00 UTC',
        txHash: '55cc1...44ff',
        hop: 5,
        isSuspicious: true
      }
    ],
    riskComponents: {
      'Transaction Behavior': 74,
      'Mixer Exposure': 18,
      'Bridge Exposure': 12,
      'Address Clustering': 88,
      'Velocity': 68,
      'Exchange Proximity': 89
    },
    timeline: [
      { time: '14:22', event: 'Extortion fee transferred from victim corporate vault', risk: 44, hop: 1, detail: 'Initial ransom demand payment' },
      { time: '15:02', event: 'UTXO splitting across dual peel addresses', risk: 62, hop: 2, detail: 'High correlation with known LockBit distributor' },
      { time: '+12h', event: 'Peel change aggregated into single consolidation input', risk: 71, hop: 3, detail: 'Common-input ownership confirmed' },
      { time: '+36h', event: 'Direct deposit into ExampleY Exchange designated address', risk: 76, hop: 4, detail: 'Known OTC/CEX cluster identified' }
    ],
    attribution: {
      title: 'Exchange Attribution Detected',
      exchange: 'ExampleY Exchange',
      walletType: 'Regulated Spot Exchange Deposit Cluster',
      confidence: 89,
      potentialExchangeAmount: '$48,200',
      potentiallyTraceableAmount: '$48,200',
      evidence: [
        'Deposit address verified under ExampleY custodial script format',
        'Consolidation pattern consistent with batch sweeper routines',
        'Historical deposit cluster matched across 4 past incident reports'
      ],
      warning: 'Attribution requires counterparty subpoena or FIU information request to verify individual KYC identity.',
      jurisdiction: 'United States / FinCEN MSB',
      depositCluster: 'US-EX-Y-8802',
      identifiedAt: '2026-09-02 12:15 UTC'
    },
    highRiskReasons: [
      'Extortion payment proceeds identified from verified victim corporate treasury',
      'Classical peel chain obfuscation attempting to disguise UTXO ancestry',
      'Direct liquidation attempt via regulated centralized exchange account'
    ]
  },
  {
    id: 'TG-2026-00138',
    title: 'Investment Scam Liquidation via BSC Swaps',
    scenario: 'Direct Wallet → Exchange',
    blockchain: 'BNB Smart Chain',
    severity: 'Medium',
    riskScore: 61,
    confidence: 78,
    exchange: 'ExampleZ Exchange',
    suspiciousAmount: 21900,
    source: 'Victim Report',
    status: 'Investigating',
    seedDetails: {
      address: '0xbb192a019284102938475910293847591029384a',
      blockchain: 'BNB Smart Chain',
      firstSeen: '2026-08-15 10:10:00 UTC',
      lastSeen: '2026-08-29 16:30:00 UTC',
      transactions: 18,
      totalInflow: '$45,000',
      totalOutflow: '$43,200',
      currentBalance: '$1,800.00 (3.2 BNB)',
      reportedBy: 'Victim Report'
    },
    clusterData: {
      title: 'Contract Call & Counterparty Clustering',
      description: 'Behavioral clustering tracking repetitive DEX swaps and immediate transfer to CEX.',
      heuristics: [
        'Direct automated DEX swap to stablecoin (USDT)',
        'Rapid hop to deposit contract (< 5 mins)',
        'Absence of smart contract mixing'
      ],
      relatedAddressesCount: 2,
      risk: 58,
      root: 'Seed BSC Wallet (0xbb1...384a)',
      clusterEntities: [
        {
          address: '0x1192837465019283746501928374650192837465',
          alias: 'PancakeSwap Router Sim',
          correlationScore: 92,
          reason: 'Automated BNB->USDT swap router',
          balance: '$420,000',
          firstSeen: '2026-08-15'
        },
        {
          address: '0x9920192837465019283746501928374650192837',
          alias: 'Scammer Stash Wallet',
          correlationScore: 84,
          reason: 'Residual token holder from prior investment scam victims',
          balance: '$8,400',
          firstSeen: '2026-08-12'
        }
      ]
    },
    nodes: [
      {
        id: 'node-victim',
        name: 'Elderly Investor',
        type: 'victim',
        address: '0x4481029384756102938475610293847561029384',
        transactions: 12,
        received: '$50,000',
        sent: '$21,900',
        risk: 10,
        flags: ['Reported "Pig Butchering" investment scam'],
        x: 80,
        y: 200,
        entityName: 'Victim Personal Wallet'
      },
      {
        id: 'node-seed',
        name: 'Scam Operator Wallet',
        type: 'suspect',
        address: '0xbb192a019284102938475910293847591029384a',
        transactions: 18,
        received: '$45,000',
        sent: '$43,200',
        risk: 68,
        flags: ['Fake trading portal deposit target', 'Direct liquidation'],
        x: 320,
        y: 200,
        entityName: 'Scam Collection Node'
      },
      {
        id: 'node-dex',
        name: 'DEX Swap Router',
        type: 'wallet',
        address: '0x10ED43C718714eb63d5aA57B78B54704E256024E',
        transactions: 40912,
        received: '$90,000,000',
        sent: '$90,000,000',
        risk: 25,
        flags: ['PancakeSwap Router contract'],
        x: 550,
        y: 200,
        entityName: 'DEX Liquidity Pool'
      },
      {
        id: 'node-exchange',
        name: 'ExampleZ User Deposit',
        type: 'exchange',
        address: '0x7182930495867182930495867182930495867182',
        transactions: 8,
        received: '$21,900',
        sent: '$21,900',
        risk: 61,
        flags: ['Single user deposit address', 'Direct off-ramp'],
        x: 780,
        y: 200,
        entityName: 'ExampleZ Deposit Hub'
      }
    ],
    edges: [
      {
        id: 'edge-c1',
        source: 'node-victim',
        target: 'node-seed',
        amount: '35.0 BNB',
        usdValue: '$21,900',
        asset: 'BNB',
        timestamp: '2026-08-25 10:14:00 UTC',
        txHash: '0xaa192...c018',
        hop: 1,
        isSuspicious: true
      },
      {
        id: 'edge-c2',
        source: 'node-seed',
        target: 'node-dex',
        amount: '35.0 BNB',
        usdValue: '$21,900',
        asset: 'BNB',
        timestamp: '2026-08-25 10:19:30 UTC',
        txHash: '0x55bc1...7710',
        hop: 2,
        isSuspicious: true
      },
      {
        id: 'edge-c3',
        source: 'node-dex',
        target: 'node-exchange',
        amount: '21,900 USDT',
        usdValue: '$21,900',
        asset: 'USDT',
        timestamp: '2026-08-25 10:24:12 UTC',
        txHash: '0x88ea9...0192',
        hop: 3,
        isSuspicious: true
      }
    ],
    riskComponents: {
      'Transaction Behavior': 65,
      'Mixer Exposure': 0,
      'Bridge Exposure': 0,
      'Address Clustering': 52,
      'Velocity': 82,
      'Exchange Proximity': 78
    },
    timeline: [
      { time: '10:14', event: 'Victim tricked into sending BNB to fake trading platform', risk: 35, hop: 1, detail: 'Initial scam transfer' },
      { time: '10:19', event: 'Instant swap from BNB to USDT via PancakeSwap', risk: 52, hop: 2, detail: 'Volatility elimination' },
      { time: '10:24', event: 'Direct deposit of 21,900 USDT to ExampleZ Exchange', risk: 61, hop: 3, detail: 'Off-ramp deposit within 10 minutes' }
    ],
    attribution: {
      title: 'Exchange Attribution Identified',
      exchange: 'ExampleZ Exchange',
      walletType: 'Direct Exchange Deposit',
      confidence: 78,
      potentialExchangeAmount: '$21,900',
      potentiallyTraceableAmount: '$21,900',
      evidence: [
        'Deposit address verified as part of ExampleZ omnibus pool',
        'Direct transfer without privacy-enhancing techniques',
        'KYC account hold recommended'
      ],
      warning: 'Rapid off-ramp; immediate freeze request recommended.',
      jurisdiction: 'Dubai (VARA Registered)',
      depositCluster: 'AE-EX-Z-4401',
      identifiedAt: '2026-08-26 09:00 UTC'
    },
    highRiskReasons: [
      'Reported romance / fraudulent investment scheme (Pig Butchering pattern)',
      'Immediate token liquidation via DEX within 5 minutes of receipt',
      'Fast transit to centralized exchange deposit endpoint'
    ]
  },
  {
    id: 'TG-2026-00131',
    title: 'Flash Loan Exploit with Cross-Chain Bridge Dispersal',
    scenario: 'Cross-chain Bridge → Unknown Wallet',
    blockchain: 'Polygon',
    severity: 'High',
    riskScore: 72,
    confidence: 0,
    exchange: 'No exchange identified',
    suspiciousAmount: 31500,
    source: 'Exchange Referral',
    status: 'Investigating',
    seedDetails: {
      address: '0x2a91029384710293847102938471029384710293',
      blockchain: 'Polygon',
      firstSeen: '2026-08-10 03:15:00 UTC',
      lastSeen: '2026-08-18 22:40:00 UTC',
      transactions: 42,
      totalInflow: '$150,000',
      totalOutflow: '$148,000',
      currentBalance: '$2,000.00 (2,100 MATIC)',
      reportedBy: 'Exchange Referral'
    },
    clusterData: {
      title: 'Smart Contract Attack Cluster',
      description: 'Exploiter contract interaction chain spanning Polygon and Avalanche.',
      heuristics: [
        'Smart contract bytecode similarity',
        'Cross-chain message relay verification',
        'Absence of KYC exchange endpoint'
      ],
      relatedAddressesCount: 3,
      risk: 75,
      root: 'Polygon Exploiter (0x2a9...0293)',
      clusterEntities: [
        {
          address: '0x9918273645019283746501928374650192837465',
          alias: 'Bridge Liquidity Pool',
          correlationScore: 91,
          reason: 'Relayed bridge message target',
          balance: '$2,400,000',
          firstSeen: '2026-08-10'
        },
        {
          address: '0x4410293847561029384756102938475610293847',
          alias: 'Secondary Burner',
          correlationScore: 86,
          reason: 'Burner recipient of unswapped bridged assets',
          balance: '$18,200',
          firstSeen: '2026-08-11'
        }
      ]
    },
    nodes: [
      {
        id: 'node-victim',
        name: 'Lending Protocol Vault',
        type: 'victim',
        address: '0x7710293847561029384756102938475610293847',
        transactions: 412,
        received: '$8,000,000',
        sent: '$31,500',
        risk: 20,
        flags: ['Flash loan reentrancy target'],
        x: 80,
        y: 200,
        entityName: 'DeFi Vault Protocol'
      },
      {
        id: 'node-seed',
        name: 'Attacker Contract',
        type: 'suspect',
        address: '0x2a91029384710293847102938471029384710293',
        transactions: 42,
        received: '$150,000',
        sent: '$148,000',
        risk: 86,
        flags: ['Custom bytecode exploit contract', 'Gas-primed deployment'],
        x: 320,
        y: 200,
        entityName: 'Exploit Contract'
      },
      {
        id: 'node-bridge',
        name: 'Hop Protocol Bridge',
        type: 'bridge',
        address: '0x9918273645019283746501928374650192837465',
        transactions: 1940,
        received: '$4,100,000',
        sent: '$4,100,000',
        risk: 80,
        flags: ['Cross-chain asset bridge to Arbitrum'],
        x: 560,
        y: 200,
        entityName: 'Hop Bridge Gateway'
      },
      {
        id: 'node-sink',
        name: 'Unknown Arbitrum Sink',
        type: 'high_risk',
        address: '0x8830192837465019283746501928374650192837',
        transactions: 7,
        received: '$31,500',
        sent: '$0',
        risk: 75,
        flags: ['Dormant wallet', 'No KYC footprint detected', 'Potential cold storage'],
        x: 800,
        y: 200,
        entityName: 'Unattributed Wallet Sink'
      }
    ],
    edges: [
      {
        id: 'edge-d1',
        source: 'node-victim',
        target: 'node-seed',
        amount: '35,000 USDC',
        usdValue: '$31,500 (Net)',
        asset: 'USDC',
        timestamp: '2026-08-10 03:15:20 UTC',
        txHash: '0xdd102...4419',
        hop: 1,
        isSuspicious: true
      },
      {
        id: 'edge-d2',
        source: 'node-seed',
        target: 'node-bridge',
        amount: '35,000 USDC',
        usdValue: '$31,500',
        asset: 'USDC',
        timestamp: '2026-08-10 03:17:40 UTC',
        txHash: '0xee910...1283',
        hop: 2,
        isSuspicious: true
      },
      {
        id: 'edge-d3',
        source: 'node-bridge',
        target: 'node-sink',
        amount: '34,850 USDC',
        usdValue: '$31,365',
        asset: 'USDC',
        timestamp: '2026-08-10 03:25:10 UTC',
        txHash: '0xff401...8811',
        hop: 3,
        isSuspicious: true
      }
    ],
    riskComponents: {
      'Transaction Behavior': 88,
      'Mixer Exposure': 0,
      'Bridge Exposure': 94,
      'Address Clustering': 68,
      'Velocity': 90,
      'Exchange Proximity': 10
    },
    timeline: [
      { time: '03:15', event: 'Reentrancy exploit executed on lending vault', risk: 65, hop: 1, detail: 'Drain of protocol reserves' },
      { time: '03:17', event: 'Bridge deposit via Hop Protocol gateway', risk: 78, hop: 2, detail: 'Evasion from Polygon freeze mechanisms' },
      { time: '03:25', event: 'Bridged tokens arrived at dormant Arbitrum address', risk: 72, hop: 3, detail: 'Funds currently stationary' }
    ],
    attribution: {
      title: 'No Exchange Attribution Identified',
      exchange: 'No exchange identified',
      walletType: 'Unattributed EOA (Externally Owned Account)',
      confidence: 0,
      potentialExchangeAmount: '$0',
      potentiallyTraceableAmount: '$31,500',
      evidence: [
        'Destination address has not interacted with any known centralized exchange',
        'Funds remain dormant in non-custodial wallet on Arbitrum One',
        'Cross-chain hop confirmed via LayerZero/Hop relay logs'
      ],
      warning: 'No KYC counterparty identified yet. Monitoring alert set on destination address.',
      jurisdiction: 'Decentralized / Non-custodial',
      identifiedAt: '2026-08-18 23:00 UTC'
    },
    highRiskReasons: [
      'DeFi reentrancy vulnerability attack vector',
      'Rapid cross-chain bridge transfer to evade token contract blacklisting',
      'Funds parked in unhosted private key wallet'
    ]
  }
];

export const INITIAL_COMPLIANCE_REFERRALS: ComplianceReferral[] = [
  {
    id: 'REF-00147',
    caseId: 'TG-2026-00147',
    referenceNumber: 'FIU-DEMO-2026-9814',
    suspectAddress: '0x71c89f2a2810a993e827b508f7d8e0a2e399A42',
    blockchain: 'Ethereum',
    riskScore: 87,
    riskLevel: 'Critical',
    exchange: 'ExampleX Exchange',
    confidence: 94,
    suspiciousAmount: '$73,420',
    summary: 'DeFi phishing drainer laundering illicit funds through Tornado Cash and Polygon Bridge into ExampleX Exchange omnibus hot wallet #04.',
    recipient: 'FIU-IND / ExampleX Compliance Desk',
    status: 'SIMULATION ONLY',
    timestamp: '2026-09-06 14:32 UTC',
    notes: 'Simulated alert for demonstration. Direct notification dispatched to demo queue.'
  },
  {
    id: 'REF-00142',
    caseId: 'TG-2026-00142',
    referenceNumber: 'FIU-DEMO-2026-8802',
    suspectAddress: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    blockchain: 'Bitcoin',
    riskScore: 76,
    riskLevel: 'High',
    exchange: 'ExampleY Exchange',
    confidence: 89,
    suspiciousAmount: '$48,200',
    summary: 'Ransomware extortion proceeds dispersed via 4-hop UTXO peel chain into ExampleY designated user deposit account.',
    recipient: 'FinCEN Demo / ExampleY BSA Officer',
    status: 'ESCALATED',
    timestamp: '2026-09-04 11:15 UTC',
    notes: 'Preservation request simulation logged.'
  }
];

export function getCaseById(id: string): MockCase {
  const found = MOCK_CASES.find(c => c.id === id);
  return found || MOCK_CASES[0];
}

export function generateSimulatedCaseForAddress(address: string, blockchain: 'Ethereum' | 'Bitcoin' | 'BNB Smart Chain' | 'Polygon', source: any, severity: any): MockCase {
  const shortAddr = address.length > 12 ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : address;
  const newId = `TG-2026-${Math.floor(10000 + Math.random() * 90000)}`;

  return {
    id: newId,
    title: `Simulated Investigation: ${shortAddr}`,
    scenario: 'Automated Forensic Heuristics Trace',
    blockchain,
    severity,
    riskScore: severity === 'Critical' ? 88 : severity === 'High' ? 74 : severity === 'Medium' ? 58 : 34,
    confidence: 91,
    exchange: 'ExampleX Exchange',
    suspiciousAmount: 64200,
    source,
    status: 'Investigating',
    seedDetails: {
      address,
      blockchain,
      firstSeen: '2026-08-30 08:00 UTC',
      lastSeen: '2026-09-06 18:00 UTC',
      transactions: 29,
      totalInflow: '$210,000',
      totalOutflow: '$204,800',
      currentBalance: '$5,200.00',
      reportedBy: source
    },
    clusterData: {
      title: 'Real-Time Heuristic Clustering',
      description: 'Cluster dynamically formed using behavioral fingerprinting and shared funding signals.',
      heuristics: [
        'Shared counterparty gas dispersal',
        'Sub-second batch movement timing',
        'Common-input ownership analysis'
      ],
      relatedAddressesCount: 4,
      risk: 76,
      root: `Seed Address (${shortAddr})`,
      clusterEntities: [
        {
          address: `${address.substring(0, 8)}...fe12`,
          alias: 'Aggregator Node Alpha',
          correlationScore: 95,
          reason: 'Direct sweep recipient within 30s',
          balance: '$2,400',
          firstSeen: '2026-08-30'
        },
        {
          address: `${address.substring(0, 8)}...88ba`,
          alias: 'Peel Intermediary',
          correlationScore: 89,
          reason: 'Identical nonce increment pattern',
          balance: '$890',
          firstSeen: '2026-08-31'
        }
      ]
    },
    nodes: [
      {
        id: 'node-victim',
        name: 'Reported Source/Victim',
        type: 'victim',
        address: '0x9991827364501928374650192837465019283746',
        transactions: 54,
        received: '$250,000',
        sent: '$210,000',
        risk: 12,
        flags: ['Source of reported fraud'],
        x: 80,
        y: 200,
        entityName: 'Reporting Entity'
      },
      {
        id: 'node-seed',
        name: 'Suspect Target',
        type: 'suspect',
        address,
        transactions: 29,
        received: '$210,000',
        sent: '$204,800',
        risk: 85,
        flags: ['Reported suspect wallet', 'High outbound velocity'],
        x: 320,
        y: 200,
        entityName: `Target (${shortAddr})`
      },
      {
        id: 'node-peel',
        name: 'Intermediary Peel Hop',
        type: 'peel_chain',
        address: `${address.substring(0, 10)}...peel`,
        transactions: 14,
        received: '$140,000',
        sent: '$138,500',
        risk: 78,
        flags: ['Iterative peeling transaction pattern'],
        x: 560,
        y: 200,
        entityName: 'Peel Dispersal Node'
      },
      {
        id: 'node-exchange',
        name: 'Exchange Hot Wallet',
        type: 'exchange',
        address: '0x28C6c06298d514Db089934071355E5743bf21d60',
        transactions: 38100,
        received: '$84,000,000',
        sent: '$82,000,000',
        risk: 42,
        flags: ['ExampleX Hot Wallet Pool', 'Identified exchange cluster'],
        x: 800,
        y: 200,
        entityName: 'ExampleX Hot Wallet'
      }
    ],
    edges: [
      {
        id: 'edge-sim-1',
        source: 'node-victim',
        target: 'node-seed',
        amount: '65.5 ETH',
        usdValue: '$210,000',
        asset: blockchain === 'Bitcoin' ? 'BTC' : 'ETH',
        timestamp: '2026-08-30 08:02:11 UTC',
        txHash: '0x77aa1...0011',
        hop: 1,
        isSuspicious: true
      },
      {
        id: 'edge-sim-2',
        source: 'node-seed',
        target: 'node-peel',
        amount: '43.2 ETH',
        usdValue: '$140,000',
        asset: blockchain === 'Bitcoin' ? 'BTC' : 'ETH',
        timestamp: '2026-08-30 08:05:30 UTC',
        txHash: '0x88bb2...1122',
        hop: 2,
        isSuspicious: true
      },
      {
        id: 'edge-sim-3',
        source: 'node-peel',
        target: 'node-exchange',
        amount: '19.8 ETH',
        usdValue: '$64,200',
        asset: blockchain === 'Bitcoin' ? 'BTC' : 'ETH',
        timestamp: '2026-08-30 08:24:45 UTC',
        txHash: '0x99cc3...2233',
        hop: 3,
        isSuspicious: true
      }
    ],
    riskComponents: {
      'Transaction Behavior': 75,
      'Mixer Exposure': 45,
      'Bridge Exposure': 60,
      'Address Clustering': 78,
      'Velocity': 84,
      'Exchange Proximity': 88
    },
    timeline: [
      { time: '08:02', event: 'Initial fraudulent transfer received', risk: 42, hop: 1, detail: 'Drain from reporting victim' },
      { time: '08:05', event: 'Secondary dispersion to intermediary peel wallet', risk: 68, hop: 2, detail: 'Rapid hops within 3 minutes' },
      { time: '08:24', event: 'Direct deposit into ExampleX Hot Wallet', risk: 85, hop: 3, detail: 'Attributed exchange endpoint' }
    ],
    attribution: {
      title: 'Potential Exchange Attribution Detected',
      exchange: 'ExampleX Exchange',
      walletType: 'Exchange User Deposit Forwarder',
      confidence: 91,
      potentialExchangeAmount: '$64,200',
      potentiallyTraceableAmount: '$64,200',
      evidence: [
        'Known exchange wallet cluster match',
        'Deposit cadence matches automated sweeper rules',
        'Historical exchange interaction confirmed'
      ],
      warning: 'Attribution is probabilistic and based on heuristic clustering.',
      jurisdiction: 'Seychelles / EU Serviced',
      depositCluster: 'CL-EX-SIM-01',
      identifiedAt: '2026-09-06 18:30 UTC'
    },
    highRiskReasons: [
      'Rapid transfer of illicit proceeds across multiple intermediate wallets',
      'High velocity fund movement (< 25 minutes from origin to off-ramp)',
      'Identified centralized exchange deposit target'
    ]
  };
}
