"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  ReactFlow,
  addEdge,
  Background,
  Controls,
  Connection,
  Edge,
  applyEdgeChanges,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  BackgroundVariant,
  ConnectionMode
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useChartStore } from "@/store/useChartStore";
import { Save, Trash2, Maximize, MousePointer, Info } from "lucide-react";

import { nodeTypes } from "./CustomNodes";

const FlowContent = ({ id }: { id?: string }) => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes] = useState<any[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { setNodes: rfSetNodes, setEdges: rfSetEdges, fitView } = useReactFlow();
  const screenToFlowPosition = useReactFlow().screenToFlowPosition;

  // Use Zustand store
  const { currentChart, fetchChartById, updateChart } = useChartStore();

  useEffect(() => {
    if (id) {
      fetchChartById(id);
    }
  }, [id]);

  useEffect(() => {
    if (currentChart) {
      setNodes(currentChart.nodes || []);
      setEdges(currentChart.edges || []);
    }
  }, [currentChart]);

  const onNodesChange: OnNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );

  const onConnect: OnConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData("application/reactflow");

      if (typeof type === "undefined" || !type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = {
        id: `node_${Math.random().toString(36).substring(2, 11)}`,
        type,
        position,
        data: {
          label: `${type.charAt(0).toUpperCase() + type.slice(1)} Node`,
          backgroundColor: "#ffffff",
          borderColor: "#3b82f6",
          fontSize: 14,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition],
  );

  const [isUpdating, setIsUpdating] = useState(false);

  const handleSave = async () => {
    if (!id) return;

    setIsUpdating(true);
    try {
      await updateChart(id, {
        nodes,
        edges
      });
    } catch (error) {
      console.error("Failed to save flowchart:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex-1 h-full" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        fitView
        snapToGrid={true}
        snapGrid={[15, 15]}
        connectionMode={ConnectionMode.Loose}
        defaultEdgeOptions={{
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#3b82f6', strokeWidth: 2 },
        }}
      >
        <Background
          color="#94a3b8"
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          className="dark:opacity-20"
        />
        <Controls
          className="bg-white dark:bg-gray-800 border-none shadow-xl rounded-xl overflow-hidden p-1 m-4 [&_button]:bg-white dark:[&_button]:bg-gray-800 [&_button]:border-gray-100 dark:[&_button]:border-gray-200 dark:border-gray-700 [&_svg]:fill-gray-600 dark:[&_svg]:fill-gray-300"
        />

        {/* Floating Control Panel */}
        <Panel
          position="top-right"
          className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-2 rounded-2xl border border-gray-100 dark:border-white/5 shadow-2xl flex gap-1 m-4"
        >
          <button
            onClick={() => fitView({ duration: 800 })}
            title="Focus Canvas"
            className="p-2.5 text-gray-500 dark:text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-600/10 rounded-xl transition-all"
          >
            <Maximize size={18} />
          </button>

          <div className="w-px h-6 bg-gray-200 dark:bg-white/5 self-center mx-1" />

          <button
            onClick={() => {
              if (confirm("Clear all elements? This cannot be undone.")) {
                setNodes([]);
                setEdges([]);
              }
            }}
            title="Clear Canvas"
            className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>

          <button
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-gray-900 dark:text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-blue-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save size={16} strokeWidth={3} />
            )}
            <span>{isUpdating ? "SAVING..." : "SAVE PROGRESS"}</span>
          </button>
        </Panel>

        {/* Helpful Hint Panel */}
        <Panel position="bottom-center" className="mb-4">
          <div className="bg-gray-900/80 dark:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-gray-200 dark:border-white/10 flex items-center gap-3 shadow-2xl">
            <Info size={14} className="text-blue-400" />
            <p className="text-[10px] font-bold text-gray-900 dark:text-white uppercase tracking-widest opacity-80">
              Drag from handles to connect components &bull; Right-click to edit labels
            </p>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export const Flow = ({ id }: { id?: string }) => (
  <ReactFlowProvider>
    <FlowContent id={id} />
  </ReactFlowProvider>
);
