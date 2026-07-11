import React, { useState } from "react";
import { LuSquare as Square, LuCircle as Circle, LuDiamond as Diamond, LuTriangle as Triangle, LuStickyNote as StickyNote, LuType as Type, LuMousePointer2 as MousePointer2, LuChevronDown as ChevronDown, LuChevronRight as ChevronRight, LuShapes as Shapes, LuHexagon as Hexagon, LuFileText as FileText, LuFolder as Folder, LuMessageSquare as MessageSquare, LuZap as Zap, LuStar as Star, LuHeart as Heart, LuCloud as Cloud, LuArrowRight as ArrowRight, LuArrowLeft as ArrowLeft, LuArrowUp as ArrowUp, LuArrowDown as ArrowDown, LuShield as Shield, LuTag as Tag, LuMinus as Minus, LuEye as Eye, LuLink as Link, LuSun as Sun, LuMoon as Moon, LuBookmark as Bookmark, LuDatabase as Database, LuCircleHelp as HelpCircle, LuMessageCircle as MessageCircle, LuActivity as Activity, LuMaximize as Maximize, LuLayoutDashboard as Layout, LuSquareMinus as MinusSquare, LuChevronLeft as ChevronLeft, LuPlus as Plus } from "react-icons/lu";

const SHAPE_CATEGORIES = [
  {
    name: "Basic",
    shapes: [
      { type: "square", icon: Square, label: "Rectangle" },
      { type: "circle", icon: Circle, label: "Circle" },
      { type: "textbox", icon: Type, label: "Text Box" },
      { type: "note", icon: StickyNote, label: "Note" },
      { type: "ellipse", icon: Circle, label: "Ellipse" },
      { type: "pill", icon: Minus, label: "Pill" },
      { type: "roundedRect", icon: Square, label: "Rounded" },
    ],
  },
  {
    name: "Polygons",
    shapes: [
      { type: "diamond", icon: Diamond, label: "Diamond" },
      { type: "triangle", icon: Triangle, label: "Triangle" },
      { type: "hexagon", icon: Hexagon, label: "Hexagon" },
      { type: "pentagon", icon: Shapes, label: "Pentagon" },
      { type: "octagon", icon: Shapes, label: "Octagon" },
      { type: "decagon", icon: Shapes, label: "Decagon" },
      { type: "star", icon: Star, label: "Star" },
      { type: "crossOutline", icon: Plus, label: "Cross" },
      { type: "burst", icon: Zap, label: "Burst" },
    ],
  },
  {
    name: "Flowchart",
    shapes: [
      { type: "document", icon: FileText, label: "Document" },
      { type: "folder", icon: Folder, label: "Folder" },
      { type: "message", icon: MessageSquare, label: "Message" },
      { type: "cylinder", icon: Database, label: "Database" },
      { type: "parallelogram", icon: Shapes, label: "Data" },
      { type: "trapezoid", icon: Shapes, label: "Process" },
      { type: "trapezoidInv", icon: Shapes, label: "Input" },
      { type: "step", icon: Activity, label: "Step" },
      { type: "bookmark", icon: Bookmark, label: "Bookmark" },
      { type: "ribbon", icon: Bookmark, label: "Ribbon" },
    ],
  },
  {
    name: "Arrows",
    shapes: [
      { type: "arrowRight", icon: ArrowRight, label: "Arrow R" },
      { type: "arrowLeft", icon: ArrowLeft, label: "Arrow L" },
      { type: "arrowUp", icon: ArrowUp, label: "Arrow U" },
      { type: "arrowDown", icon: ArrowDown, label: "Arrow D" },
      { type: "chevronRight", icon: ChevronRight, label: "Chev R" },
      { type: "chevronLeft", icon: ChevronLeft, label: "Chev L" },
      { type: "minus", icon: Minus, label: "Minus" },
      { type: "cross", icon: Plus, label: "Plus" },
    ],
  },
  {
    name: "BPMN",
    shapes: [
      { type: "circle", icon: Circle, label: "Start Event" },
      { type: "circle", icon: Circle, label: "End Event" },
      { type: "roundedRect", icon: Square, label: "Activity" },
      { type: "diamond", icon: Diamond, label: "Gateway" },
      { type: "parallelogram", icon: Shapes, label: "Data Object" },
      { type: "document", icon: FileText, label: "Message" },
      { type: "cylinder", icon: Database, label: "Data Store" },
    ],
  },
  {
    name: "DFD",
    shapes: [
      { type: "circle", icon: Circle, label: "Process" },
      { type: "cylinder", icon: Database, label: "Data Store" },
      { type: "square", icon: Square, label: "External Ent." },
      { type: "parallelogram", icon: Shapes, label: "Data Flow" },
    ],
  },
  {
    name: "Extras",
    shapes: [
      { type: "heart", icon: Heart, label: "Heart" },
      { type: "shield", icon: Shield, label: "Shield" },
      { type: "cloud", icon: Cloud, label: "Cloud" },
      { type: "sun", icon: Sun, label: "Sun" },
      { type: "moon", icon: Moon, label: "Moon" },
      { type: "bolt", icon: Zap, label: "Bolt" },
      { type: "leaf", icon: HelpCircle, label: "Leaf" },
      { type: "waterDrop", icon: HelpCircle, label: "Drop" },
      { type: "eye", icon: Eye, label: "Eye" },
      { type: "link", icon: Link, label: "Link" },
      { type: "tag", icon: Tag, label: "Tag" },
      { type: "keyhole", icon: HelpCircle, label: "Keyhole" },
      { type: "speechBubble", icon: MessageCircle, label: "Bubble" },
      { type: "cone", icon: Triangle, label: "Cone" },
      { type: "halfCircle", icon: Circle, label: "Half Cir" },
      { type: "frame", icon: Layout, label: "Frame" },
    ],
  },
];

export const Sidebar = () => {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([
    "Basic",
    "Flowchart",
  ]);

  const toggleCategory = (category: string) => {
    setExpandedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((item) => item !== category)
        : [...prev, category],
    );
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";

    // Create custom drag image
    const dragIcon = document.createElement("div");
    dragIcon.className =
      "px-3 py-1 bg-[var(--accent)] text-[var(--text)] dark:text-[var(--text)] rounded shadow-lg text-xs font-bold pointer-events-none";
    dragIcon.innerText = nodeType.toUpperCase();
    document.body.appendChild(dragIcon);
    event.dataTransfer.setDragImage(dragIcon, 0, 0);
    setTimeout(() => document.body.removeChild(dragIcon), 0);
  };

  return (
    <aside className="w-72 bg-[var(--bg)] dark:bg-[#0F172A] border-r border-[var(--border)] dark:border-[var(--border)] flex flex-col h-full overflow-hidden transition-all duration-300 shadow-xl">

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
        {SHAPE_CATEGORIES.map((category) => (
          <div key={category.name} className="space-y-2">
            <button
              onClick={() => toggleCategory(category.name)}
              className="flex items-center justify-between w-full p-3 rounded hover:bg-[var(--surface)] dark:hover:bg-[var(--surface)] dark:bg-[var(--accent-soft)] hover:shadow-md transition-all group border border-transparent hover:border-[var(--border)] dark:hover:border-[var(--border)] dark:border-[var(--border)]"
            >
              <span className="text-[11px] font-black text-[var(--text-muted)] dark:text-[var(--text-muted)] dark:text-[var(--text-faint)] dark:text-[var(--text-faint)] uppercase tracking-widest group-hover:text-blue-500 transition-colors">
                {category.name}
              </span>
              {expandedCategories.includes(category.name) ? (
                <ChevronDown className="w-4 h-4 text-[var(--text-muted)] dark:text-[var(--text-muted)] group-hover:text-blue-500 transition-colors" />
              ) : (
                <ChevronRight className="w-4 h-4 text-[var(--text-muted)] dark:text-[var(--text-muted)] group-hover:text-blue-500 transition-colors" />
              )}
            </button>

            {expandedCategories.includes(category.name) && (
              <div className="grid grid-cols-2 gap-3 px-1 animate-in slide-in-from-top-2 duration-300">
                {category.shapes.map((shape) => (
                  <div
                    key={shape.type}
                    className="flex flex-col items-center justify-center p-4 rounded bg-[var(--surface)] dark:bg-[#1E293B]/40 border border-[var(--border)] dark:border-[var(--border)] hover:border-blue-500/50 hover:bg-blue-50 dark:hover:bg-[var(--accent)]/20 hover:shadow-2xl hover:shadow-blue-500/10 transition-all cursor-grab active:cursor-grabbing group relative overflow-hidden h-28"
                    onDragStart={(event) => onDragStart(event, shape.type)}
                    draggable
                  >
                    <div className="p-3 bg-[var(--bg)] dark:bg-[var(--accent-soft)] rounded group-hover:bg-[var(--surface)] dark:group-hover:bg-[var(--accent)] group-hover:shadow-lg transition-all mb-2 transform group-hover:rotate-6 group-hover:scale-110">
                      <shape.icon className="w-6 h-6 text-[var(--text-muted)] dark:text-[var(--text-muted)] group-hover:text-blue-600 dark:group-hover:text-[var(--text)] dark:text-[var(--text)] transition-colors" />
                    </div>
                    <span className="text-[9px] font-black text-[var(--text-faint)] dark:text-[var(--text-faint)] dark:text-[var(--text-muted)] uppercase tracking-wider group-hover:text-blue-600 dark:group-hover:text-blue-300 transition-colors text-center truncate w-full">
                      {shape.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}


      </div>


    </aside>
  );
};
