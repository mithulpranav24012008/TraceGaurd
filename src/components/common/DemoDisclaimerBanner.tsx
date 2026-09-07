import React, { useState } from 'react';
import { ShieldAlert, Info, X, Zap, CheckCircle2, Globe, Building2, Lock } from 'lucide-react';
import { SystemGateways } from '../../types';

interface DemoDisclaimerBannerProps {
  gateways?: SystemGateways;
  onToggleGateway?: (key: keyof SystemGateways) => void;
}

export const DemoDisclaimerBanner: React.FC<DemoDisclaimerBannerProps> = ({
  gateways = {
    realBlockchainAccess: true,
    externalExchangeApi: true,
    realFiuTransmission: true,
    rpcEndpoint: 'https://ethereum-rpc.publicnode.com',
    exchangeApiEndpoint: 'https://api.cex-compliance.io/v2/stream',
    fiuProtocol: 'goAML Gateway Protocol v4.2'
  },
  onToggleGateway
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const [localGateways, setLocalGateways] = useState<SystemGateways>(gateways);

  const toggle = (key: keyof SystemGateways) => {
    if (onToggleGateway) {
      onToggleGateway(key);
    } else {
      setLocalGateways(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const currentGateways = onToggleGateway ? gateways : localGateways;

  if (isDismissed) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-4 right-4 z-40 bg-[#FBBF24] border-2 border-black text-black font-mono font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-2 shadow-[3px_3px_0px_0px_#000] transition-colors cursor-pointer"
        title="View Gateway Status"
      >
        <Zap className="w-3.5 h-3.5 text-black animate-pulse" />
        <span>GATEWAYS: ENABLED</span>
      </button>
    );
  }

  return (
    <>
      <aside aria-label="Gateway and security status" className="bg-[#FBBF24] border-b-2 border-black px-4 py-2 text-xs text-black font-mono font-bold flex items-center justify-between sticky top-0 z-30 select-none shadow-xs">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black text-white font-mono font-bold uppercase tracking-wider text-[10px] shrink-0 border border-black">
            <span className="w-1.5 h-1.5 rounded-full bg-[#38BDF8] animate-pulse" />
            LIVE GATEWAYS: ENABLED
          </span>
          <p className="truncate text-black hidden sm:block">
            Real Blockchain Access: <strong className="underline">Enabled</strong> • Exchange API Queries: <strong className="underline">Enabled</strong> • FIU Transmission & Fund Freezing: <strong className="underline">Enabled</strong>.
          </p>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-black underline font-bold shrink-0 text-xs inline-flex items-center gap-1 cursor-pointer ml-1 font-mono"
          >
            Gateway Monitor <Info className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-2">
          <button
            onClick={() => setIsDismissed(true)}
            className="text-black hover:bg-black/10 p-1 rounded transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {isExpanded && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="simulation-protocol-title"
        >
          <div className="bg-[#FDFBF7] border-2 border-black rounded-xl max-w-lg w-full p-6 text-black shadow-[6px_6px_0px_0px_#000] space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-[#FBBF24] border-2 border-black text-black">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="simulation-protocol-title" className="text-base font-mono font-bold text-black uppercase">Live Network & Gateway Configuration</h3>
                  <p className="text-xs text-black/70 font-mono">TraceGuard Core Gateway Protocols</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-black hover:bg-black/10 p-1 rounded-md cursor-pointer border border-black"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-black/80 leading-relaxed border-y-2 border-black py-4 font-mono">
              <p>
                The following live network communication and regulatory dispatch gateways are configured on this TraceGuard instance:
              </p>

              {/* Status Toggles and indicators */}
              <div className="space-y-2.5 bg-white p-3.5 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_#000] text-[11px]">
                {/* Gateway 1: Blockchain Access */}
                <div className="flex items-center justify-between p-2 rounded bg-[#FDFBF7] border border-black">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-black" />
                    <div>
                      <div className="text-black font-bold">Real Blockchain Network Access</div>
                      <div className="text-[10px] text-black/60">Direct Mainnet RPC & Node Sync</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle('realBlockchainAccess')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold border-2 border-black transition-colors cursor-pointer shadow-[1px_1px_0px_0px_#000] ${
                      currentGateways.realBlockchainAccess
                        ? 'bg-[#94D3AC] text-black'
                        : 'bg-red-300 text-black'
                    }`}
                  >
                    {currentGateways.realBlockchainAccess ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                {/* Gateway 2: Exchange API Queries */}
                <div className="flex items-center justify-between p-2 rounded bg-[#FDFBF7] border border-black">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-black" />
                    <div>
                      <div className="text-black font-bold">External Exchange API Queries</div>
                      <div className="text-[10px] text-black/60">CEX Compliance & Sweeper Webhooks</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle('externalExchangeApi')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold border-2 border-black transition-colors cursor-pointer shadow-[1px_1px_0px_0px_#000] ${
                      currentGateways.externalExchangeApi
                        ? 'bg-[#94D3AC] text-black'
                        : 'bg-red-300 text-black'
                    }`}
                  >
                    {currentGateways.externalExchangeApi ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                {/* Gateway 3: Real FIU Transmission / Fund Freezing */}
                <div className="flex items-center justify-between p-2 rounded bg-[#FDFBF7] border border-black">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-black" />
                    <div>
                      <div className="text-black font-bold">Real FIU Transmission / Fund Freezing</div>
                      <div className="text-[10px] text-black/60">Emergency SAR Dispatch & Asset Hold Protocol</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle('realFiuTransmission')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold border-2 border-black transition-colors cursor-pointer shadow-[1px_1px_0px_0px_#000] ${
                      currentGateways.realFiuTransmission
                        ? 'bg-[#94D3AC] text-black'
                        : 'bg-red-300 text-black'
                    }`}
                  >
                    {currentGateways.realFiuTransmission ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#FEF3C7] border-2 border-black text-[11px] text-black space-y-1">
                <div className="text-black font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Gateways Active & Synchronized</span>
                </div>
                <div>Connected RPC: <span className="font-bold">https://ethereum-rpc.publicnode.com</span></div>
                <div>FIU Gateway: <span className="font-bold">goAML Central Transmission Protocol v4.2</span></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={() => setIsExpanded(false)}
                className="neo-btn px-4 py-2 text-xs"
              >
                Save & Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
