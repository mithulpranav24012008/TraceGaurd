import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Play, Pause, Filter } from 'lucide-react';

export type GraphFilterCategory = 'All' | 'Wallets' | 'Mixers' | 'Bridges' | 'Exchanges' | 'High Risk';

interface GraphControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  isAnimatingFlow: boolean;
  onToggleAnimateFlow: () => void;
  selectedFilter: GraphFilterCategory;
  onSelectFilter: (filter: GraphFilterCategory) => void;
}

export const GraphControls: React.FC<GraphControlsProps> = ({
  zoom,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  isAnimatingFlow,
  onToggleAnimateFlow,
  selectedFilter,
  onSelectFilter
}) => {
  const filters: GraphFilterCategory[] = [
    'All',
    'Wallets',
    'Mixers',
    'Bridges',
    'Exchanges',
    'High Risk'
  ];

  return (
    <div className="bg-[#0D1721] border-b border-[#243443] px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 select-none">
      {/* Category Filter Pills */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[11px] font-mono-code text-[#8EA1B2] mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3 text-[#38BDF8]" /> Filters:
        </span>
        {filters.map((category) => (
          <button
            key={category}
            onClick={() => onSelectFilter(category)}
            className={`px-2.5 py-1 rounded text-xs font-mono-code focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none transition-all cursor-pointer ${
              selectedFilter === category
                ? 'bg-[#38BDF8] text-slate-950 font-bold shadow-sm'
                : 'bg-[#071018] text-[#8EA1B2] hover:text-white border border-[#243443] hover:border-[#8EA1B2]/60'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Zoom and Animation Controls */}
      <div className="flex items-center gap-2">
        {/* Flow Animation Toggle */}
        <button
          onClick={onToggleAnimateFlow}
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-mono-code focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none transition-colors border cursor-pointer ${
            isAnimatingFlow
              ? 'bg-[#38BDF8]/15 border-[#38BDF8] text-[#38BDF8]'
              : 'bg-[#071018] border-[#243443] text-[#8EA1B2] hover:text-white'
          }`}
          title="Toggle Animated Particle Fund Flow"
        >
          {isAnimatingFlow ? (
            <>
              <Pause className="w-3.5 h-3.5 fill-current" />
              <span>Flow Active</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current text-[#38BDF8]" />
              <span>Animate Flow</span>
            </>
          )}
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center rounded-lg bg-[#071018] border border-[#243443] p-0.5">
          <button
            onClick={onZoomOut}
            className="p-1 text-[#8EA1B2] hover:text-white hover:bg-[#111F2C] focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none rounded transition-colors cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="px-2 text-[11px] font-mono-code text-white min-w-[42px] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={onZoomIn}
            className="p-1 text-[#8EA1B2] hover:text-white hover:bg-[#111F2C] focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none rounded transition-colors cursor-pointer"
            title="Zoom In"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Reset View */}
        <button
          onClick={onResetZoom}
          className="p-1.5 text-[#8EA1B2] hover:text-white bg-[#071018] border border-[#243443] hover:border-[#8EA1B2] focus-visible:ring-2 focus-visible:ring-[#38BDF8] focus-visible:outline-none rounded-lg transition-colors cursor-pointer"
          title="Reset Graph Position & Zoom"
          aria-label="Reset zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
