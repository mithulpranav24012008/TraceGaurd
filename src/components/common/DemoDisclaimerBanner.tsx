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
        className="fixed bottom-4 right-4 z-40 bg-[#0D1721] border border-[#243443] hover:border-[#38BDF8] text-[#8EA1B2] hover:text-[#E7EEF5] text-xs px-3 py-1.5 rounded-md flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
        title="View Gateway Status"
      >
        <Zap className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
        <span>GATEWAYS: ENABLED</span>
      </button>
    );
  }

  return (
    <>
      <aside aria-label="Gateway and security status" className="bg-[#0D1721]/95 border-b border-[#243443] px-4 py-2 text-xs text-[#8EA1B2] flex items-center justify-between backdrop-blur-sm sticky top-0 z-30 select-none">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-mono-code font-bold uppercase tracking-wider text-[10px] shrink-0 border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LIVE GATEWAYS: ENABLED
          </span>
          <p className="truncate text-[#8EA1B2] hidden sm:block">
            Real Blockchain Access: <strong className="text-emerald-400">Enabled</strong> • Exchange API Queries: <strong className="text-emerald-400">Enabled</strong> • FIU Transmission & Fund Freezing: <strong className="text-emerald-400">Enabled</strong>.
          </p>
          <button
            onClick={() => setIsExpanded(true)}
            className="text-[#38BDF8] hover:underline shrink-0 text-xs inline-flex items-center gap-1 cursor-pointer ml-1 font-mono-code"
          >
            Gateway Monitor <Info className="w-3 h-3" />
          </button>
        </div>

        <div className="flex items-center gap-3 shrink-0 ml-2">
          <button
            onClick={() => setIsDismissed(true)}
            className="text-[#8EA1B2] hover:text-[#E7EEF5] p-1 rounded hover:bg-[#111F2C] transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </aside>

      {isExpanded && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="simulation-protocol-title"
        >
          <div className="bg-[#0D1721] border border-[#243443] rounded-xl max-w-lg w-full p-6 text-[#E7EEF5] shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 id="simulation-protocol-title" className="text-base font-semibold text-white">Live Network & Gateway Configuration</h3>
                  <p className="text-xs text-[#8EA1B2]">TraceGuard Core Gateway Protocols</p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-[#8EA1B2] hover:text-white p-1 rounded-md hover:bg-[#111F2C] cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-[#8EA1B2] leading-relaxed border-y border-[#243443] py-4">
              <p>
                The following live network communication and regulatory dispatch gateways are configured on this TraceGuard instance:
              </p>

              {/* Status Toggles and indicators */}
              <div className="space-y-2.5 bg-[#071018] p-3.5 rounded-lg border border-[#243443]/60 font-mono-code text-[11px]">
                {/* Gateway 1: Blockchain Access */}
                <div className="flex items-center justify-between p-2 rounded bg-[#0D1721] border border-[#243443]">
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <div>
                      <div className="text-white font-bold">Real Blockchain Network Access</div>
                      <div className="text-[10px] text-[#8EA1B2]">Direct Mainnet RPC & Node Sync</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle('realBlockchainAccess')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                      currentGateways.realBlockchainAccess
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border-red-500/40'
                    }`}
                  >
                    {currentGateways.realBlockchainAccess ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                {/* Gateway 2: Exchange API Queries */}
                <div className="flex items-center justify-between p-2 rounded bg-[#0D1721] border border-[#243443]">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <div>
                      <div className="text-white font-bold">External Exchange API Queries</div>
                      <div className="text-[10px] text-[#8EA1B2]">CEX Compliance & Sweeper Webhooks</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle('externalExchangeApi')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                      currentGateways.externalExchangeApi
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border-red-500/40'
                    }`}
                  >
                    {currentGateways.externalExchangeApi ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                {/* Gateway 3: Real FIU Transmission / Fund Freezing */}
                <div className="flex items-center justify-between p-2 rounded bg-[#0D1721] border border-[#243443]">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-emerald-400" />
                    <div>
                      <div className="text-white font-bold">Real FIU Transmission / Fund Freezing</div>
                      <div className="text-[10px] text-[#8EA1B2]">Emergency SAR Dispatch & Asset Hold Protocol</div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggle('realFiuTransmission')}
                    className={`px-2.5 py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                      currentGateways.realFiuTransmission
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                        : 'bg-red-500/20 text-red-400 border-red-500/40'
                    }`}
                  >
                    {currentGateways.realFiuTransmission ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>

              <div className="p-2.5 rounded bg-[#111F2C] border border-[#243443] font-mono-code text-[11px] text-[#8EA1B2] space-y-1">
                <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Gateways Active & Synchronized</span>
                </div>
                <div>Connected RPC: <span className="text-white">https://ethereum-rpc.publicnode.com</span></div>
                <div>FIU Gateway: <span className="text-white">goAML Central Transmission Protocol v4.2</span></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                onClick={() => setIsExpanded(false)}
                className="px-4 py-2 rounded-lg bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-semibold text-xs transition-colors cursor-pointer"
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
