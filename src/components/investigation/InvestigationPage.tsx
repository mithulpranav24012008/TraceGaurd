import React, { useState, useEffect, useRef } from 'react';
import { InvestigationStepper } from './InvestigationStepper';
import { SeedStage } from './SeedStage';
import { ClusterStage } from './ClusterStage';
import { TransactionGraph } from './TransactionGraph';
import { RiskStage } from './RiskStage';
import { AttributionStage } from './AttributionStage';
import { SummaryStage } from './SummaryStage';
import { ReferralStage } from './ReferralStage';
import { MockCase, Blockchain, InvestigationSource, RiskLevel, ComplianceReferral } from '../../types';
import { generateSimulatedCaseForAddress } from '../../data/mockCases';
import { addReport } from '../../data/nationalRegistryStore';
import { fetchLiveBlockchainCase } from '../../services/blockchainService';

interface InvestigationPageProps {
  currentCase: MockCase;
  onUpdateCase: (updatedCase: MockCase) => void;
  onSelectCase: (caseItem: MockCase) => void;
  onAlertGenerated: (referral: ComplianceReferral) => void;
}

export const InvestigationPage: React.FC<InvestigationPageProps> = ({
  currentCase,
  onUpdateCase,
  onSelectCase,
  onAlertGenerated
}) => {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [maxReachedStage, setMaxReachedStage] = useState<number>(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | undefined>(undefined);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stages = [
    { id: 1, name: 'Seed', label: 'Seed Address' },
    { id: 2, name: 'Cluster', label: 'Cluster Related Wallets' },
    { id: 3, name: 'Trace', label: 'Trace Fund Flow' },
    { id: 4, name: 'Detect', label: 'Risk Intelligence' },
    { id: 5, name: 'Attribute', label: 'Exchange Attribution' },
    { id: 6, name: 'Assess', label: 'Risk Assessment' },
    { id: 7, name: 'Alert', label: 'Compliance Referral' }
  ];

  // Stage delay & message mapping for auto-simulation
  const loadingSequence: Record<number, { message: string; duration: number }> = {
    1: { message: 'Collecting transaction data...', duration: 900 },
    2: { message: 'Building address cluster...', duration: 1100 },
    3: { message: 'Tracing transaction hops...', duration: 1300 },
    4: { message: 'Analyzing risk signals...', duration: 900 },
    5: { message: 'Resolving exchange attribution...', duration: 1100 },
    6: { message: 'Finalizing investigation dossier...', duration: 900 }
  };

  const advanceStage = (targetStage?: number) => {
    const next = targetStage !== undefined ? targetStage : currentStage + 1;
    if (next <= 7) {
      setCurrentStage(next);
      setMaxReachedStage((prev) => Math.max(prev, next));
    }
  };

  // Auto-play progression effect
  useEffect(() => {
    if (!isAutoPlaying) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setLoadingMessage(undefined);
      return;
    }

    if (currentStage >= 7) {
      setIsAutoPlaying(false);
      setLoadingMessage(undefined);
      return;
    }

    const config = loadingSequence[currentStage] || { message: 'Processing...', duration: 1000 };
    setLoadingMessage(config.message);

    timerRef.current = setTimeout(() => {
      advanceStage(currentStage + 1);
    }, config.duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isAutoPlaying, currentStage]);

  const handleStartCustomInvestigation = async (
    address: string,
    blockchain: Blockchain,
    source: InvestigationSource,
    severity: RiskLevel,
    evidenceScreenshot?: string,
    extractedOcrText?: string
  ) => {
    // Fetch live on-chain data for the real wallet address
    const newCase = await fetchLiveBlockchainCase(address, blockchain, source, severity);
    if (evidenceScreenshot) {
      newCase.evidenceScreenshot = evidenceScreenshot;
      newCase.seedDetails.evidenceScreenshot = evidenceScreenshot;
    }
    if (extractedOcrText) {
      newCase.extractedOcrText = extractedOcrText;
      newCase.seedDetails.extractedOcrText = extractedOcrText;
    }
    onUpdateCase(newCase);

    // Register this address in the national pattern match registry
    const sampleStates = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Uttar Pradesh', 'Gujarat', 'Telangana'];
    const sampleCities = ['Mumbai', 'New Delhi', 'Bengaluru', 'Chennai', 'Lucknow', 'Ahmedabad', 'Hyderabad'];
    const idx = Math.floor(Math.random() * sampleStates.length);
    addReport({
      walletAddress: address,
      chain: blockchain,
      dateReported: new Date().toISOString().split('T')[0],
      reportingState: sampleStates[idx],
      reportingCity: sampleCities[idx],
      caseId: newCase.id,
      complaintAmount: newCase.suspiciousAmount * 83 // rough USD to INR
    });

    setCurrentStage(2);
    setMaxReachedStage(2);
  };

  const handleResetInvestigation = () => {
    setIsAutoPlaying(false);
    setCurrentStage(1);
    setMaxReachedStage(1);
  };

  return (
    <div className="flex flex-col flex-1 pb-12">
      {/* 7-Stage Pipeline Stepper */}
      <InvestigationStepper
        stages={stages}
        currentStage={currentStage}
        maxReachedStage={maxReachedStage}
        onSelectStage={(stageId) => setCurrentStage(stageId)}
        isAutoPlaying={isAutoPlaying}
        onToggleAutoPlay={() => setIsAutoPlaying(!isAutoPlaying)}
        loadingMessage={loadingMessage}
      />

      {/* Main Content Area Based on Active Stage */}
      <main className="p-4 sm:p-6 flex-1">
        {currentStage === 1 && (
          <SeedStage
            currentCase={currentCase}
            onStartInvestigation={handleStartCustomInvestigation}
            onSelectPreloadedCase={(c) => {
              onSelectCase(c);
              setCurrentStage(1);
              setMaxReachedStage(1);
            }}
            onAdvanceToNext={() => advanceStage(2)}
          />
        )}

        {currentStage === 2 && (
          <ClusterStage
            currentCase={currentCase}
            onAdvanceToNext={() => advanceStage(3)}
          />
        )}

        {currentStage === 3 && (
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="p-4 rounded-xl bg-[#0D1721] border border-[#243443] flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white tracking-tight">Stage 3: Interactive Fund Flow Graph</h2>
                <p className="text-xs text-[#8EA1B2] mt-0.5">
                  Visual forensic link analysis tracing hops from seed through privacy infrastructure to exchange deposit endpoints.
                </p>
              </div>
            </div>

            <TransactionGraph
              caseData={currentCase}
              onAdvanceToNext={() => advanceStage(4)}
              showContinueButton={true}
            />
          </div>
        )}

        {currentStage === 4 && (
          <RiskStage
            currentCase={currentCase}
            onAdvanceToNext={() => advanceStage(5)}
          />
        )}

        {currentStage === 5 && (
          <AttributionStage
            currentCase={currentCase}
            onAdvanceToNext={() => advanceStage(6)}
          />
        )}

        {currentStage === 6 && (
          <SummaryStage
            currentCase={currentCase}
            onAdvanceToNext={() => advanceStage(7)}
          />
        )}

        {currentStage === 7 && (
          <ReferralStage
            currentCase={currentCase}
            onNewInvestigation={handleResetInvestigation}
            onAlertGenerated={onAlertGenerated}
          />
        )}
      </main>
    </div>
  );
};
