import React, { useState } from 'react';
import { Search, ArrowRight, Sparkles, Copy, Check, Database, Zap, RefreshCw, Upload, Image as ImageIcon, FileSearch, ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { Blockchain, InvestigationSource, RiskLevel, MockCase } from '../../types';
import { MOCK_CASES } from '../../data/mockCases';
import { RiskBadge } from '../common/RiskBadge';
import { useLanguage } from '../../context/useLanguage';
import { processScreenshotOcr, SAMPLE_SCAM_SCREENSHOTS, ExtractedAddressResult } from '../../utils/ocrAddressExtractor';

interface SeedStageProps {
  currentCase: MockCase;
  onStartInvestigation: (
    address: string,
    blockchain: Blockchain,
    source: InvestigationSource,
    severity: RiskLevel,
    evidenceScreenshot?: string,
    extractedOcrText?: string
  ) => Promise<void> | void;
  onSelectPreloadedCase: (caseItem: MockCase) => void;
  onAdvanceToNext: () => void;
}

export const SeedStage: React.FC<SeedStageProps> = ({
  currentCase,
  onStartInvestigation,
  onSelectPreloadedCase,
  onAdvanceToNext
}) => {
  const { t } = useLanguage();
  const [addressInput, setAddressInput] = useState(currentCase.seedDetails.address);
  const [blockchain, setBlockchain] = useState<Blockchain>(currentCase.blockchain);
  const [source, setSource] = useState<InvestigationSource>(currentCase.source);
  const [severity, setSeverity] = useState<RiskLevel>(currentCase.severity);
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<'live' | 'demo'>('live');

  // OCR Screenshot State
  const [evidenceScreenshot, setEvidenceScreenshot] = useState<string | undefined>(
    currentCase.seedDetails.evidenceScreenshot
  );
  const [extractedOcrText, setExtractedOcrText] = useState<string | undefined>(
    currentCase.seedDetails.extractedOcrText
  );
  const [detectedAddresses, setDetectedAddresses] = useState<ExtractedAddressResult[]>([]);
  const [isScanningOcr, setIsScanningOcr] = useState(false);
  const [hasScannedOcr, setHasScannedOcr] = useState(false);
  const [showRawText, setShowRawText] = useState(false);

  const blockchains: Blockchain[] = ['Ethereum', 'Bitcoin', 'BNB Smart Chain', 'Polygon'];
  const sources: InvestigationSource[] = ['Victim Report', 'Bank Referral', 'Exchange Referral', 'Law Enforcement'];
  const severities: RiskLevel[] = ['Low', 'Medium', 'High', 'Critical'];

  const handleOcrFileSelect = async (fileOrUrl: File | string) => {
    setIsScanningOcr(true);
    setHasScannedOcr(true);
    try {
      const res = await processScreenshotOcr(fileOrUrl);
      setEvidenceScreenshot(res.imagePreviewUrl);
      setExtractedOcrText(res.extractedText);
      setDetectedAddresses(res.detectedAddresses);

      if (res.detectedAddresses.length > 0) {
        const top = res.detectedAddresses[0];
        setAddressInput(top.address);
        setBlockchain(top.chain);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsScanningOcr(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressInput.trim()) return;
    setIsLoading(true);
    try {
      await onStartInvestigation(
        addressInput.trim(),
        blockchain,
        source,
        severity,
        evidenceScreenshot,
        extractedOcrText
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-mono p-2">
      {/* Top Banner */}
      <div className="neo-card-yellow p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-mono font-bold text-black uppercase tracking-tight">Stage 1: Seed Address Ingestion & Live On-Chain Analysis</h2>
            <span className="px-2 py-0.5 rounded bg-black text-white font-mono text-[10px] font-bold flex items-center gap-1.5 border border-black shadow-[1px_1px_0px_0px_#000]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
              LIVE GATEWAYS ACTIVE
            </span>
          </div>
          <p className="text-xs text-black/80 font-mono mt-1">
            Analyze any real-world wallet address across Ethereum, Bitcoin, Polygon, or BNB Smart Chain using direct blockchain RPC and telemetry nodes.
          </p>
        </div>

        {/* Mode & Preset incident buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-white p-1 rounded-lg border-2 border-black font-mono text-xs shadow-[2px_2px_0px_0px_#000]">
            <button
              onClick={() => setMode('live')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                mode === 'live'
                  ? 'bg-black text-white shadow-[1px_1px_0px_0px_#000]'
                  : 'text-black hover:bg-black/10'
              }`}
            >
              🟢 Live Address Mode
            </button>
            <button
              onClick={() => setMode('demo')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-colors cursor-pointer ${
                mode === 'demo'
                  ? 'bg-black text-white shadow-[1px_1px_0px_0px_#000]'
                  : 'text-black hover:bg-black/10'
              }`}
            >
              🎭 Demo Presets
            </button>
          </div>

          {mode === 'demo' && (
            <div className="flex items-center gap-1.5 flex-wrap animate-in fade-in">
              <span className="text-[11px] font-mono font-bold text-black flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-black" /> Presets:
              </span>
              {MOCK_CASES.map(c => (
                <button
                  key={c.id}
                  onClick={() => {
                    setAddressInput(c.seedDetails.address);
                    setBlockchain(c.blockchain);
                    setSource(c.source);
                    setSeverity(c.severity);
                    onSelectPreloadedCase(c);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-colors cursor-pointer border-2 border-black ${
                    currentCase.id === c.id
                      ? 'bg-black text-white shadow-[2px_2px_0px_0px_#000]'
                      : 'bg-white text-black hover:bg-[#FEF9EF] shadow-[1px_1px_0px_0px_#000]'
                  }`}
                >
                  {c.blockchain.split(' ')[0]} ({c.scenario.split(' ')[0]})
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Input Form & Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-6 neo-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-black pb-3">
            <h3 className="text-sm font-mono font-bold text-black uppercase flex items-center gap-2">
              <Search className="w-4 h-4 text-black" />
              <span>Target Wallet Address Parameters</span>
            </h3>
            <span className="text-[10px] font-mono font-bold text-black bg-[#94D3AC] px-2 py-0.5 rounded border border-black shadow-[1px_1px_0px_0px_#000]">
              LIVE MAINNET QUERY
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* OCR Screenshot Upload Section */}
            <div className="p-3.5 rounded-xl bg-[#FDFBF7] border-2 border-black shadow-[3px_3px_0px_0px_#000] space-y-3 font-mono">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-bold text-black flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-black" />
                  <span>{t('ocr.uploadTitle')}</span>
                </label>
                <span className="text-[10px] text-black bg-[#FBBF24] px-2 py-0.5 rounded border border-black font-bold shadow-[1px_1px_0px_0px_#000]">
                  AUTO-REGEX DETECT
                </span>
              </div>

              {/* Upload Dropzone / File Selector */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <label className="flex-1 w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border-2 border-dashed border-black hover:bg-black/5 text-xs text-black font-bold cursor-pointer transition-all shadow-[2px_2px_0px_0px_#000] bg-white">
                  <Upload className="w-4 h-4 text-black" />
                  <span>{t('ocr.dragDrop')}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleOcrFileSelect(e.target.files[0]);
                      }
                    }}
                  />
                </label>
              </div>

              {/* Demo Sample Chat Screenshots for Instant Testing */}
              <div className="space-y-1.5 pt-1 border-t-2 border-black">
                <div className="text-[10px] text-black/80 font-bold">{t('ocr.demoPresetPrompt')}</div>
                <div className="flex flex-wrap gap-2">
                  {SAMPLE_SCAM_SCREENSHOTS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => handleOcrFileSelect(sample.dataUrl)}
                      className="px-2.5 py-1 rounded-md text-[11px] bg-white hover:bg-[#FEF9EF] text-black font-mono font-bold border-2 border-black shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <FileSearch className="w-3 h-3 text-black" />
                      <span>Try a sample: {sample.title.split(' ')[0]} ({sample.title.split('(')[1]?.replace(')', '') || 'Sample'})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Scanning Spinner */}
              {isScanningOcr && (
                <div className="flex items-center gap-2 text-xs text-black font-bold py-1 animate-pulse">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-black" />
                  <span>{t('ocr.processing')}</span>
                </div>
              )}

              {/* No Addresses Extracted Feedback Banner */}
              {hasScannedOcr && !isScanningOcr && detectedAddresses.length === 0 && (
                <div className="p-2.5 rounded-lg bg-amber-100 border-2 border-black text-amber-900 shadow-[2px_2px_0px_0px_#000] text-xs font-mono font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>No wallet address could be extracted from this image — please enter the address manually below.</span>
                </div>
              )}

              {/* Detected Addresses Suggestion Chips */}
              {detectedAddresses.length > 0 && (
                <div className="p-2.5 rounded-lg bg-[#94D3AC] border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-2">
                  <div className="text-[11px] font-bold text-black flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-black" />
                    <span>{t('ocr.detectedTitle')}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {detectedAddresses.map((res, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setAddressInput(res.address);
                          setBlockchain(res.chain);
                        }}
                        className={`px-2.5 py-1 rounded text-xs font-mono font-bold border-2 border-black transition-all cursor-pointer shadow-[1px_1px_0px_0px_#000] ${
                          addressInput === res.address
                            ? 'bg-black text-white'
                            : 'bg-white text-black hover:bg-[#FEF9EF]'
                        }`}
                      >
                        <span>{res.address}</span>
                        <span className="ml-1 text-[10px] opacity-80">({res.chain})</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Collapsible Raw OCR Text Inspector */}
              {extractedOcrText && (
                <div className="border-t-2 border-black pt-2 space-y-1">
                  <button
                    type="button"
                    onClick={() => setShowRawText(!showRawText)}
                    className="flex items-center justify-between w-full text-[11px] text-black font-mono font-bold hover:underline cursor-pointer"
                  >
                    <span>{t('ocr.rawTextTitle')}</span>
                    {showRawText ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {showRawText && (
                    <pre className="p-2.5 rounded bg-white border-2 border-black text-[10px] text-black overflow-x-auto whitespace-pre-wrap font-mono max-h-32 shadow-[1px_1px_0px_0px_#000]">
                      {extractedOcrText}
                    </pre>
                  )}
                </div>
              )}
            </div>

            <div>
              <label htmlFor="suspect-wallet-input" className="block text-xs font-mono font-bold text-black mb-1.5">
                Suspect Wallet Address (EVM / BTC / Solana)
              </label>
              <div className="relative">
                <input
                  id="suspect-wallet-input"
                  type="text"
                  value={addressInput}
                  onChange={(e) => setAddressInput(e.target.value)}
                  placeholder="Enter real wallet address (e.g., 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045 or bc1q...)"
                  className="w-full neo-input"
                  required
                />
                {addressInput && (
                  <button
                    type="button"
                    onClick={() => handleCopy(addressInput)}
                    className="absolute right-2.5 top-2 text-black hover:opacity-75 cursor-pointer"
                    title="Copy address"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-700 font-bold" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                )}
              </div>
              <p className="text-[11px] text-black/80 mt-1.5 font-mono font-bold flex items-center gap-1.5">
                <span>{t('ocr.confirmNotice')}</span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label htmlFor="blockchain-select" className="block text-xs font-mono font-bold text-black mb-1">
                  Blockchain Network
                </label>
                <select
                  id="blockchain-select"
                  value={blockchain}
                  onChange={(e) => setBlockchain(e.target.value as Blockchain)}
                  className="w-full neo-input cursor-pointer"
                >
                  {blockchains.map(b => (
                    <option key={b} value={b} className="bg-white text-black">
                      {b}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="source-select" className="block text-xs font-mono font-bold text-black mb-1">
                  Investigation Source
                </label>
                <select
                  id="source-select"
                  value={source}
                  onChange={(e) => setSource(e.target.value as InvestigationSource)}
                  className="w-full neo-input cursor-pointer"
                >
                  {sources.map(s => (
                    <option key={s} value={s} className="bg-white text-black">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="severity-select" className="block text-xs font-mono font-bold text-black mb-1">
                Case Severity Override
              </label>
              <select
                id="severity-select"
                value={severity}
                onChange={(e) => setSeverity(e.target.value as RiskLevel)}
                className="w-full neo-input cursor-pointer"
              >
                {severities.map(sev => (
                  <option key={sev} value={sev} className="bg-white text-black">
                    {sev} Severity
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full neo-btn py-2.5 px-4 text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>FETCHING LIVE ON-CHAIN TELEMETRY...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current text-white" />
                  <span>RUN LIVE ON-CHAIN FORENSIC TRACE</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Current Seed Address Profile Card */}
        <div className="lg:col-span-6 neo-card p-5 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <h3 className="text-sm font-mono font-bold text-black uppercase flex items-center gap-2">
                <Database className="w-4 h-4 text-black" />
                <span>Seed Address Telemetry Profile</span>
              </h3>
              <RiskBadge level={currentCase.severity} score={currentCase.riskScore} size="sm" />
            </div>

            <div className="mt-4 space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-1">
                <div className="flex items-center justify-between text-[10px] text-black/70 font-bold uppercase">
                  <span>Target Address</span>
                  <span className="text-black bg-[#94D3AC] px-1.5 py-0.5 rounded border border-black">VERIFIED MAINNET</span>
                </div>
                <div className="text-black text-xs font-bold break-all">
                  {currentCase.seedDetails.address}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-2.5 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  <div className="text-[10px] text-black/70 font-bold">BLOCKCHAIN</div>
                  <div className="text-black font-bold mt-0.5">{currentCase.seedDetails.blockchain}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  <div className="text-[10px] text-black/70 font-bold">TRANSACTIONS</div>
                  <div className="text-black font-bold mt-0.5">{currentCase.seedDetails.transactions} txns</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  <div className="text-[10px] text-black/70 font-bold">FIRST SEEN</div>
                  <div className="text-black font-bold mt-0.5 truncate">{currentCase.seedDetails.firstSeen.split(' ')[0]}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  <div className="text-[10px] text-black/70 font-bold">CURRENT BALANCE</div>
                  <div className="text-black font-bold mt-0.5 truncate">{currentCase.seedDetails.currentBalance}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  <div className="text-[10px] text-black/70 font-bold">TOTAL INFLOW</div>
                  <div className="text-green-700 font-bold mt-0.5">{currentCase.seedDetails.totalInflow}</div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000]">
                  <div className="text-[10px] text-black/70 font-bold">TOTAL OUTFLOW</div>
                  <div className="text-orange-700 font-bold mt-0.5">{currentCase.seedDetails.totalOutflow}</div>
                </div>
              </div>

              {/* Evidence Attachment Thumbnail */}
              {evidenceScreenshot && (
                <div className="p-3 rounded-lg bg-[#FBCFE8] border-2 border-black shadow-[2px_2px_0px_0px_#000] space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-black font-bold uppercase">
                    <span>{t('ocr.evidenceAttached')}</span>
                    <span>JPEG/SVG</span>
                  </div>
                  <div className="rounded-lg overflow-hidden border-2 border-black max-h-32 bg-white flex items-center justify-center p-1">
                    <img
                      src={evidenceScreenshot}
                      alt="Scam Evidence Attachment"
                      className="max-h-32 object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="pt-3 border-t-2 border-black flex items-center justify-between font-mono">
            <span className="text-[11px] text-black/80 font-bold">Status: Live Synchronized</span>
            <button
              onClick={onAdvanceToNext}
              className="neo-btn-sec px-4 py-2 text-xs flex items-center gap-2"
            >
              <span>Analyze Address Hops</span>
              <ArrowRight className="w-3.5 h-3.5 text-black" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
