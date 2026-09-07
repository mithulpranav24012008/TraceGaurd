import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  ShieldAlert,
  ArrowRight,
  Sparkles,
  Info,
  Maximize2,
  Lock,
  Layers,
  Repeat,
  Building2,
  Crosshair,
  Wallet
} from 'lucide-react';
import { GraphNode, GraphEdge, NodeType, MockCase } from '../../types';
import { GraphControls, GraphFilterCategory } from './GraphControls';
import { NodeInspector } from './NodeInspector';
import { TransactionTimeline } from './TransactionTimeline';
import { truncateAddress } from '../../utils/formatters';
import { useSettings } from '../../context/SettingsContext';

interface TransactionGraphProps {
  caseData: MockCase;
  onAdvanceToNext?: () => void;
  showContinueButton?: boolean;
  selectedNodeId?: string | null;
  onSelectNode?: (node: GraphNode | null) => void;
}

export const TransactionGraph: React.FC<TransactionGraphProps> = ({
  caseData,
  onAdvanceToNext,
  showContinueButton = true,
  selectedNodeId,
  onSelectNode
}) => {
  const { settings } = useSettings();
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isAnimatingFlow, setIsAnimatingFlow] = useState<boolean>(true);
  const [flowDashOffset, setFlowDashOffset] = useState<number>(0);
  const [selectedFilter, setSelectedFilter] = useState<GraphFilterCategory>('All');

  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  const shouldAnimateFlow = isAnimatingFlow && settings.animateParticles && !settings.reducedMotion;

  // Derived transform string via useMemo to avoid state-in-effect double renders
  const transformString = useMemo(
    () => `translate(${pan.x}, ${pan.y}) scale(${zoom})`,
    [pan.x, pan.y, zoom]
  );

  // Implement handleSelect to update selection state and trigger parent callback if provided
  const handleSelect = (nodeId: string | null) => {
    if (!nodeId) {
      setSelectedNode(null);
      if (onSelectNode) onSelectNode(null);
      return;
    }
    const target = caseData.nodes?.find((n) => n.id === nodeId);
    if (target) {
      setSelectedNode(target);
      if (onSelectNode) onSelectNode(target);
    }
  };

  // Set default selected node on case change, guarded against re-rendering if selection is already valid
  useEffect(() => {
    if (caseData && caseData.nodes && caseData.nodes.length > 0) {
      const defaultNode = caseData.nodes[1] || caseData.nodes[0];
      setSelectedNode((prev) => {
        if (!prev || !caseData.nodes.some((n) => n.id === prev.id)) {
          return defaultNode;
        }
        return prev;
      });
    }
  }, [caseData?.id]);

  // Sync external selectedNodeId prop if provided
  useEffect(() => {
    if (selectedNodeId !== undefined) {
      if (selectedNodeId === null) {
        setSelectedNode(null);
      } else {
        const found = caseData.nodes?.find((n) => n.id === selectedNodeId);
        if (found && found.id !== selectedNode?.id) {
          setSelectedNode(found);
        }
      }
    }
  }, [selectedNodeId, caseData?.nodes]);

  // Clean animation loop using requestAnimationFrame with guaranteed cleanup
  useEffect(() => {
    if (!shouldAnimateFlow) {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    let lastTime = performance.now();
    const animate = (now: number) => {
      if (now - lastTime > 30) {
        setFlowDashOffset((prev) => (prev + 1) % 20);
        lastTime = now;
      }
      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
    };
  }, [shouldAnimateFlow]);

  // Pan Mouse Down
  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('input')) {
      return;
    }
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  // Pan Touch Start
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  // Global Drag Event Listeners (mouse + touch) with automatic release on release outside SVG
  useEffect(() => {
    if (!isDragging) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    };

    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        setPan({
          x: touch.clientX - dragStart.x,
          y: touch.clientY - dragStart.y
        });
      }
    };

    const handleGlobalEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalEnd);
    window.addEventListener('touchmove', handleGlobalTouchMove);
    window.addEventListener('touchend', handleGlobalEnd);
    window.addEventListener('touchcancel', handleGlobalEnd);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchmove', handleGlobalTouchMove);
      window.removeEventListener('touchend', handleGlobalEnd);
      window.removeEventListener('touchcancel', handleGlobalEnd);
    };
  }, [isDragging, dragStart]);

  // Cursor-Relative Zoom Math
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const cursorX = e.clientX - rect.left;
    const cursorY = e.clientY - rect.top;

    const zoomFactor = e.deltaY < 0 ? 1.12 : 0.88;

    setZoom((prevZoom) => {
      const newZoom = Math.min(Math.max(prevZoom * zoomFactor, 0.4), 3.0);
      const zoomRatio = newZoom / prevZoom;

      setPan((prevPan) => ({
        x: cursorX - (cursorX - prevPan.x) * zoomRatio,
        y: cursorY - (cursorY - prevPan.y) * zoomRatio
      }));

      return newZoom;
    });
  };

  // Zoom Control Helpers
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.15, 3.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.15, 0.4));
  const handleResetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Node filtering helper
  const isNodeVisible = (node: GraphNode): boolean => {
    if (selectedFilter === 'All') return true;
    if (selectedFilter === 'Wallets')
      return node.type === 'wallet' || node.type === 'clustered_wallet' || node.type === 'suspect' || node.type === 'victim';
    if (selectedFilter === 'Mixers') return node.type === 'mixer' || node.type === 'peel_chain';
    if (selectedFilter === 'Bridges') return node.type === 'bridge';
    if (selectedFilter === 'Exchanges') return node.type === 'exchange';
    if (selectedFilter === 'High Risk') return node.risk >= 70;
    return true;
  };

  // Edge filtering helper
  const isEdgeVisible = (edge: GraphEdge): boolean => {
    if (selectedFilter === 'All') return true;
    const sourceNode = caseData.nodes.find((n) => n.id === edge.source);
    const targetNode = caseData.nodes.find((n) => n.id === edge.target);
    if (!sourceNode || !targetNode) return false;
    return isNodeVisible(sourceNode) || isNodeVisible(targetNode);
  };

  // Visual styling mapping per node category
  const getNodeVisuals = (node: GraphNode) => {
    switch (node.type) {
      case 'victim':
        return {
          fill: '#10B981',
          bg: '#064E3B',
          stroke: '#34D399',
          badgeText: 'VICTIM',
          textColor: '#A7F3D0'
        };
      case 'suspect':
        return {
          fill: '#EF4444',
          bg: '#450A0A',
          stroke: '#F87171',
          badgeText: 'SEED',
          textColor: '#FECACA'
        };
      case 'mixer':
        return {
          fill: '#A855F7',
          bg: '#3B0764',
          stroke: '#C084FC',
          badgeText: 'MIXER',
          textColor: '#E9D5FF'
        };
      case 'bridge':
        return {
          fill: '#EC4899',
          bg: '#500724',
          stroke: '#F472B6',
          badgeText: 'BRIDGE',
          textColor: '#FBCFE8'
        };
      case 'peel_chain':
        return {
          fill: '#F97316',
          bg: '#431407',
          stroke: '#FB923C',
          badgeText: 'PEEL',
          textColor: '#FFEDD5'
        };
      case 'exchange':
        return {
          fill: '#38BDF8',
          bg: '#082F49',
          stroke: '#7DD3FC',
          badgeText: 'CEX',
          textColor: '#E0F2FE'
        };
      case 'high_risk':
        return {
          fill: '#DC2626',
          bg: '#450A0A',
          stroke: '#EF4444',
          badgeText: 'ALERT',
          textColor: '#FCA5A5'
        };
      default:
        return {
          fill: '#0284C7',
          bg: '#082F49',
          stroke: '#38BDF8',
          badgeText: 'WALLET',
          textColor: '#BAE6FD'
        };
    }
  };

  return (
    <div className="flex flex-col h-[700px] max-h-[85vh] bg-[#071018] border border-[#243443] rounded-xl overflow-hidden shadow-2xl relative select-none">
      {/* Top Header & Controls */}
      <GraphControls
        zoom={zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        isAnimatingFlow={isAnimatingFlow}
        onToggleAnimateFlow={() => setIsAnimatingFlow(!isAnimatingFlow)}
        selectedFilter={selectedFilter}
        onSelectFilter={setSelectedFilter}
      />

      {/* Main Graph Area with Slide-Over Inspector */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* SVG Canvas Area */}
        <div
          ref={containerRef}
          className="flex-1 h-full relative cursor-grab active:cursor-grabbing overflow-hidden"
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onWheel={handleWheel}
        >
          {/* Subtle SOC background grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(#243443 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          />

          {/* SVG Elements with hardware-accelerated inner <g> wrapper */}
          <svg className="w-full h-full" viewBox="0 0 1000 450">
            <defs>
              {/* Arrow markers for edges */}
              <marker
                id="arrowhead-normal"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#586C7E" />
              </marker>
              <marker
                id="arrowhead-active"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#38BDF8" />
              </marker>
              <marker
                id="arrowhead-suspicious"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#EF4444" />
              </marker>

              {/* Edge glow filter */}
              <filter id="glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Transform Container Group - preserves SVG coordinate space */}
            <g
              transform={transformString}
              style={{
                transformOrigin: '0 0',
                transition: isDragging ? 'none' : 'transform 0.08s ease-out'
              }}
            >
              {/* Render Edges */}
              <g className="edges-layer">
                {caseData.edges.map((edge) => {
                  const sourceNode = caseData.nodes.find((n) => n.id === edge.source);
                  const targetNode = caseData.nodes.find((n) => n.id === edge.target);

                  if (!sourceNode || !targetNode) return null;

                  const isEdgeActive = selectedEdgeId === edge.id;
                  const isConnectedToSelectedNode =
                    selectedNode &&
                    (selectedNode.id === edge.source || selectedNode.id === edge.target);
                  const edgeVisible = isEdgeVisible(edge);

                  // Calculate bezier control points for curved dynamic links
                  const dx = targetNode.x - sourceNode.x;
                  const dy = targetNode.y - sourceNode.y;
                  const cx1 = sourceNode.x + dx * 0.45;
                  const cy1 = sourceNode.y + (dy !== 0 ? dy * 0.1 : -20);
                  const cx2 = sourceNode.x + dx * 0.55;
                  const cy2 = targetNode.y + (dy !== 0 ? -dy * 0.1 : 20);

                  const pathData = `M ${sourceNode.x} ${sourceNode.y} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${targetNode.x} ${targetNode.y}`;

                  return (
                    <g
                      key={edge.id}
                      className={`cursor-pointer transition-opacity duration-200 ${
                        edgeVisible ? 'opacity-100 pointer-events-auto' : 'opacity-15 pointer-events-none'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEdgeId(edge.id);
                        handleSelect(targetNode.id);
                      }}
                    >
                      {/* Wider invisible 24px hit-area */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke="transparent"
                        strokeWidth="24"
                        className="cursor-pointer"
                      />

                      {/* Base Edge Path */}
                      <path
                        d={pathData}
                        fill="none"
                        stroke={
                          isEdgeActive || isConnectedToSelectedNode
                            ? '#38BDF8'
                            : edge.isSuspicious
                            ? '#F87171'
                            : '#243443'
                        }
                        strokeWidth={isEdgeActive ? 3 : 1.8}
                        strokeDasharray={edge.isSuspicious ? '6 4' : 'none'}
                        markerEnd={
                          isEdgeActive
                            ? 'url(#arrowhead-active)'
                            : edge.isSuspicious
                            ? 'url(#arrowhead-suspicious)'
                            : 'url(#arrowhead-normal)'
                        }
                        className="transition-all duration-200"
                      />

                      {/* Animated Flow Particles with dashoffset */}
                      {shouldAnimateFlow && edgeVisible && (
                        <path
                          d={pathData}
                          fill="none"
                          stroke="#38BDF8"
                          strokeWidth={isEdgeActive ? 3 : 2}
                          strokeDasharray="4 16"
                          strokeDashoffset={-flowDashOffset}
                          className="pointer-events-none"
                        />
                      )}

                      {/* Edge Value Tag / Label */}
                      <g transform={`translate(${(sourceNode.x + targetNode.x) / 2}, ${(sourceNode.y + targetNode.y) / 2 - 12})`}>
                        <rect
                          x="-38"
                          y="-8"
                          width="76"
                          height="16"
                          rx="4"
                          fill="#0D1721"
                          stroke={isEdgeActive ? '#38BDF8' : '#243443'}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="4"
                          fill={isEdgeActive ? '#38BDF8' : '#E7EEF5'}
                          fontSize="9"
                          fontWeight="bold"
                          fontFamily="ui-monospace, monospace"
                          textAnchor="middle"
                        >
                          {edge.amount}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>

              {/* Render Nodes */}
              <g className="nodes-layer">
                {caseData.nodes.map((node) => {
                  const isSelected = selectedNode?.id === node.id;
                  const isHovered = hoveredNode?.id === node.id;
                  const nodeVisible = isNodeVisible(node);
                  const visual = getNodeVisuals(node);

                  return (
                    <g
                      key={node.id}
                      transform={`translate(${node.x}, ${node.y})`}
                      className={`node-element cursor-pointer transition-opacity duration-200 ${
                        nodeVisible ? 'opacity-100 pointer-events-auto' : 'opacity-15 pointer-events-none'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(node.id);
                      }}
                      onMouseEnter={() => setHoveredNode(node)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      {/* Large invisible 84px hit target for generous click area */}
                      <circle cx="0" cy="0" r="42" fill="transparent" className="cursor-pointer" />

                      {/* Pulse halo if selected or critical */}
                      {(isSelected || node.risk >= 85) && (
                        <circle
                          cx="0"
                          cy="0"
                          r="34"
                          fill={visual.fill}
                          fillOpacity="0.15"
                          className="animate-pulse pointer-events-none"
                        />
                      )}

                      {/* Outer border ring */}
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 26 : 22}
                        fill="#0D1721"
                        stroke={isSelected ? '#38BDF8' : visual.stroke}
                        strokeWidth={isSelected ? 2.8 : 1.8}
                        className="transition-all duration-200 pointer-events-none"
                      />

                      {/* Category icon / core circle */}
                      <circle
                        cx="0"
                        cy="0"
                        r="14"
                        fill={visual.bg}
                        stroke={visual.fill}
                        strokeWidth="1"
                        className="pointer-events-none"
                      />

                      {/* Text initials or mini-icon inside node */}
                      <text
                        x="0"
                        y="4"
                        fill={visual.textColor}
                        fontSize="9"
                        fontFamily="ui-monospace, monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        {visual.badgeText}
                      </text>

                      {/* Node Name Label */}
                      <text
                        x="0"
                        y="36"
                        fill="#E7EEF5"
                        fontSize="11"
                        fontWeight="bold"
                        fontFamily="ui-monospace, monospace"
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        {node.name}
                      </text>

                      {/* Truncated Address */}
                      <text
                        x="0"
                        y="49"
                        fill="#8EA1B2"
                        fontSize="9"
                        fontFamily="ui-monospace, monospace"
                        textAnchor="middle"
                        className="pointer-events-none"
                      >
                        {truncateAddress(node.address, 4, 4)}
                      </text>

                      {/* Mini Risk Pill */}
                      <g transform="translate(18, -18)" className="pointer-events-none">
                        <rect
                          x="-14"
                          y="-7"
                          width="28"
                          height="14"
                          rx="4"
                          fill={node.risk > 70 ? '#450A0A' : node.risk > 40 ? '#451A03' : '#064E3B'}
                          stroke={node.risk > 70 ? '#EF4444' : node.risk > 40 ? '#F59E0B' : '#10B981'}
                          strokeWidth="1"
                        />
                        <text
                          x="0"
                          y="3"
                          fill={node.risk > 70 ? '#FCA5A5' : node.risk > 40 ? '#FDE68A' : '#A7F3D0'}
                          fontSize="8"
                          fontWeight="bold"
                          fontFamily="ui-monospace, monospace"
                          textAnchor="middle"
                        >
                          {node.risk}
                        </text>
                      </g>
                    </g>
                  );
                })}
              </g>
            </g>
          </svg>

          {/* Compact Hover Tooltip */}
          {hoveredNode && !selectedNode && (
            <div
              className="absolute pointer-events-none z-20 bg-[#0D1721] border border-[#38BDF8]/60 p-2.5 rounded-lg shadow-xl font-mono-code text-[11px] text-white"
              style={{
                left: `${hoveredNode.x * zoom + pan.x + 30}px`,
                top: `${hoveredNode.y * zoom + pan.y - 40}px`
              }}
            >
              <div className="font-bold text-[#38BDF8]">{hoveredNode.name}</div>
              <div className="text-[#8EA1B2] text-[10px]">{truncateAddress(hoveredNode.address, 6, 6)}</div>
              <div className="mt-1 text-emerald-400">Recv: {hoveredNode.received}</div>
              <div className="text-red-400">Risk: {hoveredNode.risk}/100</div>
            </div>
          )}

          {/* Quick instructions badge */}
          <div className="absolute top-3 left-3 pointer-events-none bg-[#0D1721]/90 border border-[#243443] px-2.5 py-1 rounded-md text-[10px] font-mono-code text-[#8EA1B2]">
            Drag to pan • Scroll to zoom • Click node to inspect
          </div>
        </div>

        {/* Right-Hand Node Inspector Drawer */}
        {selectedNode && (
          <NodeInspector
            key={selectedNode.id}
            node={selectedNode}
            onClose={() => handleSelect(null)}
          />
        )}
      </div>

      {/* Bottom Chronology Timeline */}
      <TransactionTimeline
        timeline={caseData.timeline}
        edges={caseData.edges}
        selectedEdgeId={selectedEdgeId}
        onSelectEdge={(edgeId) => {
          setSelectedEdgeId(edgeId);
          const targetEdge = caseData.edges.find((e) => e.id === edgeId);
          if (targetEdge) {
            handleSelect(targetEdge.target);
          }
        }}
      />

      {/* Bottom Continue Action Bar (if in investigation workflow) */}
      {showContinueButton && onAdvanceToNext && (
        <div className="bg-[#0D1721] border-t border-[#243443] px-4 py-2.5 flex items-center justify-between">
          <div className="text-xs text-[#8EA1B2]">
            Tracing <strong className="text-white">{caseData.nodes.length} nodes</strong> across{' '}
            <strong className="text-[#38BDF8]">{caseData.edges.length} suspicious hops</strong>.
          </div>
          <button
            onClick={onAdvanceToNext}
            className="bg-[#38BDF8] hover:bg-[#0284C7] text-slate-950 font-bold px-4 py-1.5 rounded-lg text-xs font-mono-code flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Proceed to Risk Analysis</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
