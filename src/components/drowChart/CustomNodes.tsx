import React, { memo, useState, useEffect, useRef } from "react";
import { Handle, Position, NodeProps, useReactFlow } from "@xyflow/react";

const BaseNode = ({ children, selected, style, id, data, ...props }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label || "");
  const { setNodes } = useReactFlow();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLabel(data.label);
  }, [data.label]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return { ...node, data: { ...node.data, label } };
        }
        return node;
      }),
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nds) => nds.filter((node) => node.id !== id));
  };

  const handleStyle = {
    width: "10px",
    height: "10px",
    background: "#3b82f6",
    border: "2px solid #ffffff",
    boxShadow: "0 0 4px rgba(0,0,0,0.2)",
    zIndex: 10,
  };

  const targetHandleStyle = {
    ...handleStyle,
    width: "24px",
    height: "24px",
    background: "transparent",
    border: "none",
    boxShadow: "none",
    zIndex: 5,
  };

  return (
    <div
      className={`relative group transition-all duration-200 ${selected ? "ring-2 ring-blue-500 ring-offset-2" : ""
        }`}
      style={{
        background: data.backgroundColor || "#ffffff",
        border: `2px solid ${data.borderColor || "#333333"}`,
        color: data.textColor || "#000000",
        fontSize: `${data.fontSize || 14}px`,
        borderRadius: data.borderRadius || style?.borderRadius || "4px",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: "120px",
        minHeight: "50px",
        ...style,
      }}
      onDoubleClick={handleDoubleClick}
    >
      {/* 4-way Handles - both Source and Target */}
      {/* Top */}
      <Handle type="target" position={Position.Top} style={targetHandleStyle} id={`${id}-t`} />
      <Handle type="source" position={Position.Top} style={handleStyle} id={`${id}-ts`} />

      {/* Bottom */}
      <Handle type="target" position={Position.Bottom} style={targetHandleStyle} id={`${id}-b`} />
      <Handle type="source" position={Position.Bottom} style={handleStyle} id={`${id}-bs`} />

      {/* Left */}
      <Handle type="target" position={Position.Left} style={targetHandleStyle} id={`${id}-l`} />
      <Handle type="source" position={Position.Left} style={handleStyle} id={`${id}-ls`} />

      {/* Right */}
      <Handle type="target" position={Position.Right} style={targetHandleStyle} id={`${id}-r`} />
      <Handle type="source" position={Position.Right} style={handleStyle} id={`${id}-rs`} />

      {selected && (
        <button
          onClick={handleDelete}
          className="delete-handle absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md hover:bg-red-600 transition-colors z-50 text-[10px]"
        >
          ✕
        </button>
      )}

      <div className="px-4 py-2 text-center w-full break-words pointer-events-none">
        {isEditing ? (
          <input
            ref={inputRef}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent border-none outline-none text-center font-inherit pointer-events-auto"
          />
        ) : (
          children || label
        )}
      </div>
    </div>
  );
};

// Generic SVG Shape Node
const ShapeNode = memo(
  ({ data, selected, id, type, path, viewBox = "0 0 100 100" }: any) => {
    const [isEditing, setIsEditing] = useState(false);
    const [label, setLabel] = useState(data.label || "");
    const { setNodes } = useReactFlow();
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setLabel(data.label);
    }, [data.label]);
    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }, [isEditing]);

    const handleBlur = () => {
      setIsEditing(false);
      setNodes((nds) =>
        nds.map((node) =>
          node.id === id ? { ...node, data: { ...node.data, label } } : node,
        ),
      );
    };

    const handleStyle = {
      width: "10px",
      height: "10px",
      background: "#3b82f6",
      border: "2px solid #ffffff",
      zIndex: 10,
    };

    const targetHandleStyle = {
      ...handleStyle,
      width: "24px",
      height: "24px",
      background: "transparent",
      border: "none",
      boxShadow: "none",
      zIndex: 5,
    };

    return (
      <div
        className={`relative w-24 h-24 flex items-center justify-center transition-all duration-200 ${selected ? "filter drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" : ""}`}
        onDoubleClick={() => setIsEditing(true)}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={viewBox}
          preserveAspectRatio="none"
        >
          <path
            d={path}
            fill={data.backgroundColor || "#ffffff"}
            stroke={data.borderColor || "#333333"}
            strokeWidth="2"
          />
        </svg>

        {/* Top */}
        <Handle type="target" position={Position.Top} style={targetHandleStyle} id={`${id}-t`} />
        <Handle type="source" position={Position.Top} style={handleStyle} id={`${id}-ts`} />

        {/* Bottom */}
        <Handle type="target" position={Position.Bottom} style={targetHandleStyle} id={`${id}-b`} />
        <Handle type="source" position={Position.Bottom} style={handleStyle} id={`${id}-bs`} />

        {/* Left */}
        <Handle type="target" position={Position.Left} style={targetHandleStyle} id={`${id}-l`} />
        <Handle type="source" position={Position.Left} style={handleStyle} id={`${id}-ls`} />

        {/* Right */}
        <Handle type="target" position={Position.Right} style={targetHandleStyle} id={`${id}-r`} />
        <Handle type="source" position={Position.Right} style={handleStyle} id={`${id}-rs`} />

        {selected && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setNodes((nds) => nds.filter((n) => n.id !== id));
            }}
            className="delete-handle absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center shadow-md z-50 text-[10px]"
          >
            ✕
          </button>
        )}

        <div className="relative z-10 px-2 text-center text-xs font-medium w-full break-words pointer-events-none">
          {isEditing ? (
            <input
              ref={inputRef}
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => e.key === "Enter" && handleBlur()}
              className="w-full bg-transparent border-none outline-none text-center pointer-events-auto"
            />
          ) : (
            label
          )}
        </div>
      </div>
    );
  },
);

export const SquareNode = memo((props: NodeProps) => <BaseNode {...props} />);

export const CircleNode = memo((props: NodeProps) => (
  <BaseNode
    {...props}
    style={{
      borderRadius: "50%",
      aspectRatio: "1/1",
      minWidth: "80px",
      minHeight: "80px",
    }}
  />
));

export const TextBoxNode = memo((props: NodeProps) => (
  <BaseNode
    {...props}
    style={{
      background: "transparent",
      border: props.selected ? "1px dashed #3b82f6" : "1px dashed transparent",
      boxShadow: "none",
      minWidth: "120px",
      minHeight: "40px",
    }}
  />
));

// Shape definitions Path data
const SHAPES_DATA: Record<string, { path: string; viewBox?: string }> = {
  diamond: { path: "M 50 0 L 100 50 L 50 100 L 0 50 Z" },
  triangle: { path: "M 50 0 L 100 100 L 0 100 Z" },
  hexagon: { path: "M 25 0 L 75 0 L 100 50 L 75 100 L 25 100 L 0 50 Z" },
  pentagon: { path: "M 50 0 L 100 38 L 81 100 L 19 100 L 0 38 Z" },
  octagon: {
    path: "M 30 0 L 70 0 L 100 30 L 100 70 L 70 100 L 30 100 L 0 70 L 0 30 Z",
  },
  star: {
    path: "M 50 0 L 61 35 L 98 35 L 68 57 L 79 91 L 50 70 L 21 91 L 32 57 L 2 35 L 39 35 Z",
  },
  cloud: {
    path: "M 25 40 A 20 20 0 0 1 65 40 A 25 25 0 0 1 85 65 A 20 20 0 0 1 65 85 L 25 85 A 20 20 0 0 1 5 65 A 25 25 0 0 1 25 40 Z",
  },
  cylinder: {
    path: "M 0 20 A 50 10 0 0 1 100 20 L 100 80 A 50 10 0 0 1 0 80 Z M 0 20 A 50 10 0 0 0 100 20",
    viewBox: "0 0 100 100",
  },
  document: { path: "M 0 0 L 70 0 L 100 30 L 100 100 L 0 100 Z" },
  folder: { path: "M 0 10 L 40 10 L 50 25 L 100 25 L 100 90 L 0 90 Z" },
  message: { path: "M 0 0 L 100 0 L 100 75 L 30 75 L 0 100 Z" },
  parallelogram: { path: "M 25 0 L 100 0 L 75 100 L 0 100 Z" },
  trapezoid: { path: "M 20 0 L 80 0 L 100 100 L 0 100 Z" },
  cross: {
    path: "M 35 0 L 65 0 L 65 35 L 100 35 L 100 65 L 65 65 L 65 100 L 35 100 L 35 65 L 0 65 L 0 35 L 35 35 Z",
  },
  minus: { path: "M 0 40 L 100 40 L 100 60 L 0 60 Z" },
  arrowRight: {
    path: "M 0 30 L 60 30 L 60 0 L 100 50 L 60 100 L 60 70 L 0 70 Z",
  },
  arrowLeft: {
    path: "M 100 30 L 40 30 L 40 0 L 0 50 L 40 100 L 40 70 L 100 70 Z",
  },
  heart: {
    path: "M 50 90 C 20 70 0 50 0 30 A 25 25 0 0 1 50 30 A 25 25 0 0 1 100 30 C 100 50 80 70 50 90 Z",
  },
  shield: {
    path: "M 50 0 L 100 20 L 100 50 C 100 80 50 100 50 100 C 50 100 0 80 0 50 L 0 20 Z",
  },
  tag: {
    path: "M 0 50 L 40 0 L 100 0 L 100 100 L 40 100 Z M 60 30 A 10 10 0 1 1 60 50 A 10 10 0 0 1 60 30",
  },
  // 25 NEW SHAPES
  ellipse: { path: "M 0 50 A 50 30 0 1 1 100 50 A 50 30 0 1 1 0 50" },
  roundedRect: {
    path: "M 10 0 H 90 Q 100 0 100 10 V 90 Q 100 100 90 100 H 10 Q 0 100 0 90 V 10 Q 0 0 10 0",
  },
  trapezoidInv: { path: "M 0 0 L 100 0 L 80 100 L 20 100 Z" },
  chevronRight: { path: "M 0 0 L 70 50 L 0 100 L 30 100 L 100 50 L 30 0 Z" },
  chevronLeft: { path: "M 100 0 L 30 50 L 100 100 L 70 100 L 0 50 L 70 0 Z" },
  pill: { path: "M 25 0 H 75 A 25 25 0 0 1 75 100 H 25 A 25 25 0 0 1 25 0" },
  crossOutline: {
    path: "M 30 0 H 70 V 30 H 100 V 70 H 70 V 100 H 30 V 70 H 0 V 30 H 30 Z",
  },
  frame: { path: "M 0 0 H 100 V 100 H 0 Z M 10 10 V 90 H 90 V 10 Z" },
  step: { path: "M 0 100 V 50 H 50 V 0 H 100 V 100 Z" },
  arrowDown: { path: "M 30 0 H 70 V 60 H 100 L 50 100 L 0 60 H 30 Z" },
  arrowUp: { path: "M 30 100 H 70 V 40 H 100 L 50 0 L 0 40 H 30 Z" },
  bookmark: { path: "M 0 0 H 100 V 100 L 50 70 L 0 100 Z" },
  burst: {
    path: "M 50 0 L 60 40 L 100 50 L 60 60 L 50 100 L 40 60 L 0 50 L 40 40 Z",
  },
  cone: { path: "M 50 0 L 100 100 A 50 10 0 0 1 0 100 Z" },
  halfCircle: { path: "M 0 100 A 50 50 0 0 1 100 100 Z" },
  decagon: {
    path: "M 50 0 L 80 10 L 100 35 L 100 65 L 80 90 L 50 100 L 20 90 L 0 65 L 0 35 L 20 10 Z",
  },
  speechBubble: { path: "M 0 0 H 100 V 70 H 40 L 10 100 V 70 H 0 Z" },
  keyhole: { path: "M 50 0 A 30 30 0 1 0 50 60 L 70 100 H 30 L 50 60" },
  ribbon: { path: "M 0 0 L 100 0 L 100 100 L 50 80 L 0 100 Z" },
  moon: { path: "M 50 100 A 50 50 0 1 1 50 0 A 35 35 0 1 0 50 100" },
  sun: {
    path: "M 50 20 A 30 30 0 1 1 50 80 A 30 30 0 1 1 50 20 M 50 0 V 15 M 50 85 V 100 M 0 50 H 15 M 85 50 H 100 M 15 15 L 25 25 M 75 75 L 85 85 M 85 15 L 75 25 M 25 75 L 15 85",
  },
  bolt: { path: "M 60 0 L 10 60 H 45 L 35 100 L 90 40 H 55 Z" },
  leaf: {
    path: "M 10 100 C 10 60 40 0 100 0 C 100 40 60 100 10 100 M 10 100 L 60 50",
  },
  waterDrop: {
    path: "M 50 0 C 10 40 10 70 10 80 A 40 40 0 0 0 90 80 C 90 70 90 40 50 0",
  },
  eye: {
    path: "M 0 50 C 20 10 80 10 100 50 C 80 90 20 90 0 50 M 50 30 A 20 20 0 1 1 50 70 A 20 20 0 0 1 50 30",
  },
  link: {
    path: "M 30 30 H 50 V 40 H 30 A 10 10 0 0 0 30 60 H 50 V 70 H 30 A 20 20 0 0 1 30 30 M 70 30 H 50 V 40 H 70 A 10 10 0 0 1 70 60 H 50 V 70 H 70 A 20 20 0 0 0 70 30 M 40 45 H 60 V 55 H 40 Z",
  },
};

// Map additional shapes to node types
const additionalNodeTypes: any = {};
Object.entries(SHAPES_DATA).forEach(([key, shape]) => {
  additionalNodeTypes[key] = (props: NodeProps) => (
    <ShapeNode {...props} {...shape} type={key} />
  );
});

export const nodeTypes = {
  square: SquareNode,
  circle: CircleNode,
  textbox: TextBoxNode,
  note: (props: NodeProps) => (
    <div
      className="relative p-4 bg-yellow-100 border-2 border-yellow-300 shadow-sm min-w-[150px] min-h-[100px] transition-all"
      style={{
        clipPath: "polygon(0% 0%, 100% 0%, 100% 85%, 85% 100%, 0% 100%)",
      }}
    >
      <BaseNode
        {...props}
        style={{
          background: "transparent",
          border: "none",
          boxShadow: "none",
          minWidth: "auto",
          minHeight: "auto",
        }}
      />
    </div>
  ),
  ...additionalNodeTypes,
};
