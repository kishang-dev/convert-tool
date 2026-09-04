import React, { useEffect, useRef, useState } from "react";
import SEO from "@/components/SEO";

// Aspect Ratio Configurations
const ASPECTS: Record<string, [number, number]> = {
  "1080x1920": [1080, 1920],
  "1080x1080": [1080, 1080],
  "1920x1080": [1920, 1080],
  "1080x1350": [1080, 1350],
};

const ANIMATIONS = [
  { id: "none", label: "Fade only" },
  { id: "slideLeft", label: "Slide · left" },
  { id: "slideRight", label: "Slide · right" },
  { id: "slideTop", label: "Slide · top" },
  { id: "slideBottom", label: "Slide · bottom" },
  { id: "zoomIn", label: "Zoom in" },
  { id: "zoomOut", label: "Zoom out" },
  { id: "bounce", label: "Bounce" },
  { id: "elasticIn", label: "Elastic" },
  { id: "rotateIn", label: "Rotate in" },
  { id: "flipX", label: "Flip X" },
  { id: "flipY", label: "Flip Y" },
  { id: "pop", label: "Pop" },
  { id: "drop", label: "Drop in" },
  { id: "roll", label: "Roll in" },
  { id: "swing", label: "Swing" },
  { id: "shake", label: "Shake" },
  { id: "wobble", label: "Wobble" },
  { id: "spin", label: "Spin loop" },
  { id: "float", label: "Float loop" },
  { id: "pulse", label: "Pulse loop" },
  { id: "heartbeat", label: "Heartbeat" },
  { id: "flash", label: "Flash" },
  { id: "blurIn", label: "Blur in" },
  { id: "glitch", label: "Glitch" },
  { id: "typewriter", label: "Typewriter (text)" },
];

const EMOJIS = ["✨", "🔥", "❤️", "🎉", "⭐", "👍", "💥", "🚀", "😍", "🌈", "🎬", "💬"];
const QUICK_THEMES = ["#1b2430", "#38bdf8", "#818cf8", "#f43f5e", "#fb923c", "#334155", "#059669", "#7c3aed"];
const COLOR_GRADES = ["None", "Warm Vintage", "Cool Sci-Fi", "Cyberpunk", "Cinematic Teal & Orange", "High Contrast B&W", "Dramatic Noir", "Pastel Dream"];
const BLEND_MODES = ["Normal", "Multiply", "Screen", "Overlay", "Darken", "Lighten", "Color Dodge", "Color Burn", "Hard Light", "Soft Light", "Difference", "Exclusion"];
const FONTS = ["Inter", "Space Grotesk", "Bebas Neue", "Poppins", "Playfair Display", "JetBrains Mono", "Anton", "Caveat", "Oswald", "Pacifico", "Roboto Mono"];

const formatTimeMs = (sec: number) => {
  if (isNaN(sec) || !isFinite(sec)) return "0:00.0";
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toFixed(1);
  const sStr = (sec % 60) < 10 ? "0" + s : s;
  return `${m}:${sStr}`;
};

export default function ReelRigStudioPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Scroll Container Refs for Prev/Next Arrows
  const headerNavRef = useRef<HTMLDivElement | null>(null);
  const stageToolbarRef = useRef<HTMLDivElement | null>(null);
  const gridLayoutRef = useRef<HTMLDivElement | null>(null);
  const loadFileInputRef = useRef<HTMLInputElement | null>(null);

  const [aspect, setAspect] = useState<string>("1080x1920");
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(10);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [layers, setLayers] = useState<any[]>([]);
  const [audioTracks, setAudioTracks] = useState<any[]>([]);

  // Studio Display Controls
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showSafeZone, setShowSafeZone] = useState<boolean>(false);
  const [showShortsUi, setShowShortsUi] = useState<boolean>(false);
  const [snap, setSnap] = useState<boolean>(true);
  const [draftMode, setDraftMode] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(100);
  const [vGuides, setVGuides] = useState<number[]>([]);
  const [hGuides, setHGuides] = useState<number[]>([]);

  // Layer Search Filter
  const [layerSearch, setLayerSearch] = useState<string>("");

  // Toast Notification State
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Undo / Redo History Stacks
  const historyStackRef = useRef<any[][]>([]);
  const redoStackRef = useRef<any[][]>([]);

  const pushHistory = (currentLayers: any[]) => {
    historyStackRef.current.push(JSON.parse(JSON.stringify(currentLayers)));
    redoStackRef.current = [];
  };

  const handleUndo = () => {
    if (historyStackRef.current.length === 0) {
      showToast("Nothing to undo");
      return;
    }
    const prev = historyStackRef.current.pop()!;
    redoStackRef.current.push(JSON.parse(JSON.stringify(layers)));
    setLayers(prev);
    showToast("Undo action");
  };

  const handleRedo = () => {
    if (redoStackRef.current.length === 0) {
      showToast("Nothing to redo");
      return;
    }
    const next = redoStackRef.current.pop()!;
    historyStackRef.current.push(JSON.parse(JSON.stringify(layers)));
    setLayers(next);
    showToast("Redo action");
  };

  // Selected Layer Inspector State
  const [selectedLayerName, setSelectedLayerName] = useState<string>("");
  const [selectedLayerX, setSelectedLayerX] = useState<number>(540);
  const [selectedLayerY, setSelectedLayerY] = useState<number>(960);
  const [selectedLayerScale, setSelectedLayerScale] = useState<number>(1.0);
  const [selectedLayerRotation, setSelectedLayerRotation] = useState<number>(0);
  const [selectedLayerOpacity, setSelectedLayerOpacity] = useState<number>(1.0);
  const [selectedLayerAnim, setSelectedLayerAnim] = useState<string>("none");
  const [selectedLayerEasing, setSelectedLayerEasing] = useState<string>("easeOut");
  const [selectedLayerStart, setSelectedLayerStart] = useState<number>(0);
  const [selectedLayerDuration, setSelectedLayerDuration] = useState<number>(10);

  // Text specific inspector state
  const [selectedLayerText, setSelectedLayerText] = useState<string>("");
  const [selectedLayerFont, setSelectedLayerFont] = useState<string>("Inter");
  const [selectedLayerFontSize, setSelectedLayerFontSize] = useState<number>(60);
  const [selectedLayerColor, setSelectedLayerColor] = useState<string>("#FFFFFF");
  const [selectedLayerBold, setSelectedLayerBold] = useState<boolean>(false);
  const [selectedLayerItalic, setSelectedLayerItalic] = useState<boolean>(false);
  const [selectedLayerAlign, setSelectedLayerAlign] = useState<string>("center");
  const [selectedLayerStrokeColor, setSelectedLayerStrokeColor] = useState<string>("#000000");
  const [selectedLayerStrokeWidth, setSelectedLayerStrokeWidth] = useState<number>(0);

  // Image Tools State
  const [kenBurnsOn, setKenBurnsOn] = useState<boolean>(false);
  const [kenBurnsDir, setKenBurnsDir] = useState<string>("inCenter");

  // Filter Sliders State
  const [filterBrightness, setFilterBrightness] = useState<number>(100);
  const [filterContrast, setFilterContrast] = useState<number>(100);
  const [filterSaturation, setFilterSaturation] = useState<number>(100);
  const [filterGrayscale, setFilterGrayscale] = useState<number>(0);
  const [filterSepia, setFilterSepia] = useState<number>(0);
  const [filterInvert, setFilterInvert] = useState<number>(0);
  const [filterHueRotate, setFilterHueRotate] = useState<number>(0);
  const [filterBlur, setFilterBlur] = useState<number>(0);

  // Shadow, Border & Blend State
  const [dropShadowOn, setDropShadowOn] = useState<boolean>(false);
  const [shadowColor, setShadowColor] = useState<string>("#000000");
  const [shadowBlur, setShadowBlur] = useState<number>(20);
  const [shadowOffsetX, setShadowOffsetX] = useState<number>(0);
  const [shadowOffsetY, setShadowOffsetY] = useState<number>(8);
  const [borderOn, setBorderOn] = useState<boolean>(false);
  const [borderColor, setBorderColor] = useState<string>("#ffffff");
  const [borderWidth, setBorderWidth] = useState<number>(4);
  const [imgRadius, setImgRadius] = useState<number>(0);
  const [blendMode, setBlendMode] = useState<string>("Normal");
  const [copiedStyle, setCopiedStyle] = useState<any | null>(null);

  // Background Options State
  const [bgType, setBgType] = useState<"solid" | "linear" | "radial" | "image">("solid");
  const [bgColor1, setBgColor1] = useState<string>("#0C0E11");
  const [bgColor2, setBgColor2] = useState<string>("#2C5364");

  // Scene Effects State
  const [vignette, setVignette] = useState<boolean>(false);
  const [grain, setGrain] = useState<boolean>(false);
  const [watermark, setWatermark] = useState<boolean>(false);
  const [progressBar, setProgressBar] = useState<boolean>(false);
  const [colorGrade, setColorGrade] = useState<string>("None");

  // Export Settings State
  const [exportFps, setExportFps] = useState<number>(30);
  const [exportQuality, setExportQuality] = useState<number>(8000000);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<number>(0);
  const [exportFormat, setExportFormat] = useState<string>("MP4");

  // YouTube Shorts Publishing State
  const [ytTitle, setYtTitle] = useState<string>("");
  const [ytDescription, setYtDescription] = useState<string>("");
  const [ytTags, setYtTags] = useState<string>("");
  const [coverFrameTime, setCoverFrameTime] = useState<number>(0);

  // Inspector Dropdown Section Selection State
  const [inspectorSection, setInspectorSection] = useState<string>("all");

  // Templates Modal State
  const [showTemplatesModal, setShowTemplatesModal] = useState<boolean>(false);

  // Initialize Fonts
  useEffect(() => {
    const fontLink = document.createElement("link");
    fontLink.rel = "stylesheet";
    fontLink.href =
      "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Poppins:wght@600;700&family=Playfair+Display:ital,wght@0,700;1,600&family=Bebas+Neue&family=Anton&family=Caveat:wght@600&family=Oswald:wght@500;700&family=Pacifico&family=Roboto+Mono:wght@500&display=swap";
    document.head.appendChild(fontLink);
  }, []);

  // Update selected layer local state when layer selection changes
  useEffect(() => {
    const selected = layers.find((l) => l.id === selectedLayerId);
    if (selected) {
      setSelectedLayerName(selected.name || "");
      setSelectedLayerX(selected.x || 540);
      setSelectedLayerY(selected.y || 960);
      setSelectedLayerScale(selected.scale || 1.0);
      setSelectedLayerRotation(selected.rotation || 0);
      setSelectedLayerOpacity(selected.opacity !== undefined ? selected.opacity : 1.0);
      setSelectedLayerAnim(selected.anim || "none");
      setSelectedLayerEasing(selected.easing || "easeOut");
      setSelectedLayerStart(selected.start || 0);
      setSelectedLayerDuration(selected.duration || totalDuration);

      if (selected.type === "text" || selected.type === "caption") {
        setSelectedLayerText(selected.text || "");
        setSelectedLayerFont(selected.font || "Inter");
        setSelectedLayerFontSize(selected.fontSize || 60);
        setSelectedLayerColor(selected.color || "#FFFFFF");
        setSelectedLayerBold(!!selected.bold);
        setSelectedLayerItalic(!!selected.italic);
        setSelectedLayerAlign(selected.align || "center");
        setSelectedLayerStrokeColor(selected.strokeColor || "#000000");
        setSelectedLayerStrokeWidth(selected.strokeWidth || 0);
      }
    }
  }, [selectedLayerId, layers, totalDuration]);

  const updateSelectedLayerProps = (updated: any) => {
    if (!selectedLayerId) return;
    setLayers((prev) =>
      prev.map((l) => (l.id === selectedLayerId ? { ...l, ...updated } : l))
    );
  };

  // Preset Template Loader
  const loadTemplatePreset = (presetName: string) => {
    const [w, h] = ASPECTS[aspect];
    pushHistory(layers);

    if (presetName === "quote") {
      setBgType("linear");
      setBgColor1("#0f172a");
      setBgColor2("#1e1b4b");
      setColorGrade("Cinematic Teal & Orange");

      const quoteLayer = {
        id: "txt_" + Date.now() + "_1",
        type: "text",
        name: "Quote Headline",
        text: "“Design is not just what it looks like. Design is how it works.”",
        font: "Playfair Display",
        fontSize: 64,
        color: "#F8FAFC",
        bold: true,
        italic: true,
        x: w / 2,
        y: h * 0.42,
        scale: 1,
        rotation: 0,
        opacity: 1,
        visible: true,
        anim: "slideTop",
        start: 0,
        duration: totalDuration,
      };

      const authorLayer = {
        id: "txt_" + Date.now() + "_2",
        type: "caption",
        name: "Author Tag",
        text: "— STEVE JOBS",
        font: "Space Grotesk",
        fontSize: 36,
        color: "#FF5A36",
        bgColor: "rgba(15, 23, 42, 0.85)",
        x: w / 2,
        y: h * 0.65,
        scale: 1,
        rotation: 0,
        opacity: 1,
        visible: true,
        anim: "zoomIn",
        start: 0.5,
        duration: totalDuration - 0.5,
      };

      setLayers([quoteLayer, authorLayer]);
      setSelectedLayerId(quoteLayer.id);
    } else if (presetName === "product") {
      setBgType("radial");
      setBgColor1("#312e81");
      setBgColor2("#090d16");
      setDropShadowOn(true);

      const titleLayer = {
        id: "txt_" + Date.now() + "_p1",
        type: "text",
        name: "Product Title",
        text: "NEXT-GEN SOUND RIG",
        font: "Bebas Neue",
        fontSize: 90,
        color: "#38BDF8",
        x: w / 2,
        y: h * 0.25,
        scale: 1,
        rotation: 0,
        opacity: 1,
        visible: true,
        anim: "drop",
        start: 0,
        duration: totalDuration,
      };

      const shapeLayer = {
        id: "shp_" + Date.now() + "_p2",
        type: "shape",
        name: "Accent Badge",
        shapeType: "pill",
        fill: "#FF5A36",
        baseW: 360,
        baseH: 90,
        x: w / 2,
        y: h * 0.78,
        scale: 1,
        rotation: 0,
        opacity: 1,
        visible: true,
        anim: "bounce",
        start: 0.3,
        duration: totalDuration - 0.3,
      };

      const ctaLayer = {
        id: "txt_" + Date.now() + "_p3",
        type: "text",
        name: "CTA Text",
        text: "AVAILABLE NOW",
        font: "Space Grotesk",
        fontSize: 34,
        color: "#160702",
        bold: true,
        x: w / 2,
        y: h * 0.78,
        scale: 1,
        rotation: 0,
        opacity: 1,
        visible: true,
        anim: "pulse",
        start: 0.4,
        duration: totalDuration - 0.4,
      };

      setLayers([shapeLayer, titleLayer, ctaLayer]);
      setSelectedLayerId(titleLayer.id);
    } else if (presetName === "kinetic") {
      setBgType("solid");
      setBgColor1("#090A0C");

      const k1 = {
        id: "txt_" + Date.now() + "_k1",
        type: "text",
        name: "Kinetic Word 1",
        text: "CREATE",
        font: "Anton",
        fontSize: 140,
        color: "#FF5A36",
        x: w / 2,
        y: h * 0.35,
        scale: 1,
        rotation: -4,
        opacity: 1,
        visible: true,
        anim: "pop",
        start: 0,
        duration: totalDuration,
      };

      const k2 = {
        id: "txt_" + Date.now() + "_k2",
        type: "text",
        name: "Kinetic Word 2",
        text: "VIRAL SHORTS",
        font: "Bebas Neue",
        fontSize: 110,
        color: "#FFFFFF",
        strokeColor: "#FF5A36",
        strokeWidth: 4,
        x: w / 2,
        y: h * 0.52,
        scale: 1,
        rotation: 3,
        opacity: 1,
        visible: true,
        anim: "slideRight",
        start: 0.2,
        duration: totalDuration - 0.2,
      };

      setLayers([k1, k2]);
      setSelectedLayerId(k1.id);
    }

    setShowTemplatesModal(false);
    showToast(`Loaded ${presetName.toUpperCase()} template`);
  };

  // Add Layer Helper Handlers
  const addTextLayer = (initialText = "Your Headline Here") => {
    pushHistory(layers);
    const [w, h] = ASPECTS[aspect];
    const newLayer = {
      id: "txt_" + Date.now() + "_" + Math.random(),
      type: "text",
      name: `Text (${initialText.slice(0, 12)})`,
      text: initialText,
      font: "Inter",
      fontSize: initialText.length <= 4 ? 120 : 64,
      color: "#FFFFFF",
      x: w / 2,
      y: h / 2,
      scale: 1,
      rotation: 0,
      opacity: 1,
      visible: true,
      anim: "none",
      start: 0,
      duration: totalDuration,
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    showToast("Text layer added");
  };

  const addShapeLayer = (shapeType = "rectangle") => {
    pushHistory(layers);
    const [w, h] = ASPECTS[aspect];
    const newLayer = {
      id: "shp_" + Date.now() + "_" + Math.random(),
      type: "shape",
      name: `Shape (${shapeType})`,
      shapeType: shapeType,
      fill: "#FF5A36",
      baseW: 240,
      baseH: 240,
      x: w / 2,
      y: h / 2,
      scale: 1,
      rotation: 0,
      opacity: 1,
      visible: true,
      anim: "none",
      start: 0,
      duration: totalDuration,
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    showToast("Shape layer added");
  };

  const addCaptionLayer = () => {
    pushHistory(layers);
    const [w, h] = ASPECTS[aspect];
    const newLayer = {
      id: "cap_" + Date.now() + "_" + Math.random(),
      type: "caption",
      name: "Caption Highlight",
      text: "⚡ Auto Subtitle Highlight",
      font: "Space Grotesk",
      fontSize: 44,
      color: "#FF5A36",
      bgColor: "rgba(0, 0, 0, 0.8)",
      x: w / 2,
      y: h * 0.82,
      scale: 1,
      rotation: 0,
      opacity: 1,
      visible: true,
      anim: "slideBottom",
      start: 0,
      duration: totalDuration,
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    showToast("Caption layer added");
  };

  const addKineticTextLayer = () => {
    pushHistory(layers);
    const [w, h] = ASPECTS[aspect];
    const newLayer = {
      id: "ktxt_" + Date.now() + "_" + Math.random(),
      type: "text",
      name: "Kinetic Text",
      text: "IMPACT!",
      font: "Anton",
      fontSize: 120,
      color: "#38BDF8",
      strokeColor: "#000000",
      strokeWidth: 6,
      x: w / 2,
      y: h / 2,
      scale: 1,
      rotation: -3,
      opacity: 1,
      visible: true,
      anim: "pop",
      start: 0,
      duration: totalDuration,
    };
    setLayers((prev) => [...prev, newLayer]);
    setSelectedLayerId(newLayer.id);
    showToast("Kinetic text layer added");
  };

  // Image Frame Tool Handlers
  const fillFrame = () => {
    let target = selectedLayerId
      ? layers.find((l) => l.id === selectedLayerId && l.type === "image")
      : layers.find((l) => l.type === "image");

    if (!target || !target.imgEl) {
      showToast("Add or select an image layer first");
      return;
    }
    pushHistory(layers);
    const [cw, ch] = ASPECTS[aspect];
    const img = target.imgEl;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    setLayers((prev) =>
      prev.map((l) =>
        l.id === target.id
          ? {
            ...l,
            x: Math.round(cw / 2),
            y: Math.round(ch / 2),
            baseW: Math.round(img.naturalWidth * scale),
            baseH: Math.round(img.naturalHeight * scale),
            scale: 1.0,
            rotation: 0,
          }
          : l
      )
    );
    setSelectedLayerX(Math.round(cw / 2));
    setSelectedLayerY(Math.round(ch / 2));
    setSelectedLayerScale(1.0);
    setSelectedLayerRotation(0);
    showToast("Filled canvas full-screen (WhatsApp Status 9:16)");
  };

  const fitFrame = () => {
    let target = selectedLayerId
      ? layers.find((l) => l.id === selectedLayerId && l.type === "image")
      : layers.find((l) => l.type === "image");

    if (!target || !target.imgEl) return;
    pushHistory(layers);
    const [cw, ch] = ASPECTS[aspect];
    const img = target.imgEl;
    const scale = Math.min(cw / img.naturalWidth, ch / img.naturalHeight);
    setLayers((prev) =>
      prev.map((l) =>
        l.id === target.id
          ? {
            ...l,
            x: Math.round(cw / 2),
            y: Math.round(ch / 2),
            baseW: Math.round(img.naturalWidth * scale),
            baseH: Math.round(img.naturalHeight * scale),
            scale: 1.0,
            rotation: 0,
          }
          : l
      )
    );
    showToast("Fitted inside frame");
  };

  const extractColorPalette = () => {
    const selected = layers.find((l) => l.id === selectedLayerId);
    if (!selected || selected.type !== "image" || !selected.imgEl) {
      showToast("Select an image layer to sample color palette");
      return;
    }
    try {
      const cv = document.createElement("canvas");
      cv.width = 50; cv.height = 50;
      const cx = cv.getContext("2d");
      if (!cx) return;
      cx.drawImage(selected.imgEl, 0, 0, 50, 50);
      const data = cx.getImageData(0, 0, 50, 50).data;
      let r = 0, g = 0, b = 0, count = 0;
      for (let i = 0; i < data.length; i += 16) {
        r += data[i]; g += data[i + 1]; b += data[i + 2]; count++;
      }
      r = Math.round(r / count); g = Math.round(g / count); b = Math.round(b / count);
      const hex = "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
      setBgColor1(hex);
      showToast(`Set background theme color: ${hex}`);
    } catch (e) {
      showToast("Color palette updated from image");
    }
  };

  // Pure JS helper to fix EBML Duration metadata in WebM blobs for media player playback
  const fixWebmDuration = (blob: Blob, durationMs: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(buffer);

        let infoPos = -1;
        for (let i = 0; i < bytes.length - 4; i++) {
          if (bytes[i] === 0x15 && bytes[i + 1] === 0x49 && bytes[i + 2] === 0xa9 && bytes[i + 3] === 0x66) {
            infoPos = i;
            break;
          }
        }

        if (infoPos === -1) {
          resolve(blob);
          return;
        }

        let durationPos = -1;
        for (let i = infoPos; i < Math.min(bytes.length - 8, infoPos + 300); i++) {
          if (bytes[i] === 0x44 && bytes[i + 1] === 0x89) {
            durationPos = i;
            break;
          }
        }

        const durFloat64 = new DataView(new ArrayBuffer(8));
        durFloat64.setFloat64(0, durationMs, false);
        const durBytes = new Uint8Array(durFloat64.buffer);

        if (durationPos !== -1) {
          const len = bytes[durationPos + 2];
          if (len === 0x88 || len === 8) {
            bytes.set(durBytes, durationPos + 3);
            resolve(new Blob([bytes], { type: blob.type }));
            return;
          }
        }

        const injectTag = new Uint8Array(11);
        injectTag[0] = 0x44;
        injectTag[1] = 0x89;
        injectTag[2] = 0x88;
        injectTag.set(durBytes, 3);

        const pos = infoPos + 10;
        const newBytes = new Uint8Array(bytes.length + injectTag.length);
        newBytes.set(bytes.subarray(0, pos), 0);
        newBytes.set(injectTag, pos);
        newBytes.set(bytes.subarray(pos), pos + injectTag.length);

        resolve(new Blob([newBytes], { type: blob.type }));
      };
      reader.onerror = () => resolve(blob);
      reader.readAsArrayBuffer(blob);
    });
  };

  // Pure JS helper to fix MP4 mvhd duration metadata for Windows Media Player playback
  const fixMp4Duration = (blob: Blob, durationSec: number): Promise<Blob> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const buffer = reader.result as ArrayBuffer;
        const bytes = new Uint8Array(buffer);
        const view = new DataView(buffer);

        for (let i = 0; i < bytes.length - 30; i++) {
          if (
            bytes[i] === 0x6d &&
            bytes[i + 1] === 0x76 &&
            bytes[i + 2] === 0x68 &&
            bytes[i + 3] === 0x64
          ) {
            const version = bytes[i + 4];
            if (version === 0) {
              const timeScalePos = i + 4 + 1 + 3 + 4 + 4;
              const timeScale = view.getUint32(timeScalePos, false) || 1000;
              const targetDuration = Math.round(durationSec * timeScale);
              view.setUint32(timeScalePos + 4, targetDuration, false);
            } else if (version === 1) {
              const timeScalePos = i + 4 + 1 + 3 + 8 + 8;
              const timeScale = view.getUint32(timeScalePos, false) || 1000;
              const targetDuration = BigInt(Math.round(durationSec * timeScale));
              view.setBigUint64(timeScalePos + 4, targetDuration, false);
            }
            break;
          }
        }

        resolve(new Blob([bytes], { type: blob.type }));
      };
      reader.onerror = () => resolve(blob);
      reader.readAsArrayBuffer(blob);
    });
  };

  // Synchronous Canvas Scene Renderer (reused for live preview and video export frames)
  const drawScene = (time: number, isForExport = false) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const [w, h] = ASPECTS[aspect] || [1080, 1920];
    ctx.clearRect(0, 0, w, h);

    // Canvas Background
    if (bgType === "solid") {
      ctx.fillStyle = bgColor1;
      ctx.fillRect(0, 0, w, h);
    } else if (bgType === "linear") {
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, bgColor1);
      grad.addColorStop(1, bgColor2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else if (bgType === "radial") {
      const grad = ctx.createRadialGradient(w / 2, h / 2, w * 0.05, w / 2, h / 2, w * 0.8);
      grad.addColorStop(0, bgColor1);
      grad.addColorStop(1, bgColor2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    }

    // Blend mode settings
    ctx.globalCompositeOperation = (blendMode.toLowerCase() === "normal" ? "source-over" : blendMode.toLowerCase()) as GlobalCompositeOperation;

    // Render Canvas Layers
    layers.forEach((layer) => {
      if (!layer.visible) return;

      let ox = 0;
      let oy = 0;
      let sMul = 1;
      let rotOff = 0;

      const rel = time - (layer.start || 0);
      const dur = layer.duration || totalDuration;

      const allImageLayers = layers.filter((l) => l.type === "image");
      const isOnlyImage = layer.type === "image" && allImageLayers.length === 1;
      const isLastImageInSeq = layer.type === "image" && allImageLayers.length > 1 && allImageLayers[allImageLayers.length - 1].id === layer.id;

      const active = isOnlyImage
        ? true
        : isLastImageInSeq
          ? (time >= (layer.start || 0) && time <= totalDuration)
          : (rel >= 0 && rel <= dur);
      if (!active) return;

      const progress = dur > 0 ? Math.min(1, Math.max(0, rel / dur)) : 1;

      let kbX = 0;
      let kbY = 0;
      let kbScale = 1;
      if (layer.type === "image" && kenBurnsOn && dur > 0) {
        const range = 0.16;
        const driftAmt = w * 0.05;
        switch (kenBurnsDir) {
          case "inTL":
            kbScale = 1 + range * progress;
            kbX = driftAmt * progress;
            kbY = driftAmt * progress * 0.6;
            break;
          case "inBR":
            kbScale = 1 + range * progress;
            kbX = -driftAmt * progress;
            kbY = -driftAmt * progress * 0.6;
            break;
          case "out":
            kbScale = 1 + range * (1 - progress);
            break;
          case "inCenter":
          default:
            kbScale = 1 + range * progress;
            break;
        }
      }

      const anim = layer.anim || "none";
      if (anim === "slideLeft") ox = -w * (1 - progress);
      else if (anim === "slideRight") ox = w * (1 - progress);
      else if (anim === "slideTop") oy = -h * (1 - progress);
      else if (anim === "slideBottom") oy = h * (1 - progress);
      else if (anim === "zoomIn") sMul = 0.2 + 0.8 * progress;
      else if (anim === "zoomOut") sMul = 2.0 - 1.0 * progress;
      else if (anim === "rotateIn") {
        rotOff = (1 - progress) * -180;
        sMul = 0.5 + 0.5 * progress;
      } else if (anim === "bounce") {
        sMul = 1 + Math.sin(progress * Math.PI * 3) * 0.1 * (1 - progress);
      } else if (anim === "pulse") {
        sMul = 1 + Math.sin(time * 4) * 0.05;
      } else if (anim === "float") {
        oy = Math.sin(time * 3) * 15;
      } else if (anim === "spin") {
        rotOff = (time * 120) % 360;
      } else if (anim === "pop") {
        sMul = progress < 0.3 ? progress / 0.3 * 1.2 : 1 + Math.sin(progress * 10) * 0.05 * (1 - progress);
      } else if (anim === "drop") {
        oy = progress < 0.4 ? -h * 0.5 * (1 - progress / 0.4) : Math.sin(progress * 12) * 8 * (1 - progress);
      }

      ctx.save();
      ctx.globalAlpha = layer.opacity !== undefined ? layer.opacity : 1;

      // Filter Styles
      ctx.filter = `brightness(${filterBrightness}%) contrast(${filterContrast}%) saturate(${filterSaturation}%) grayscale(${filterGrayscale}%) sepia(${filterSepia}%) invert(${filterInvert}%) hue-rotate(${filterHueRotate}deg) blur(${filterBlur}px)`;

      // Canvas Drop Shadow
      if (dropShadowOn) {
        ctx.shadowColor = shadowColor;
        ctx.shadowBlur = shadowBlur;
        ctx.shadowOffsetX = shadowOffsetX;
        ctx.shadowOffsetY = shadowOffsetY;
      }

      ctx.translate((layer.x || w / 2) + ox + kbX, (layer.y || h / 2) + oy + kbY);
      ctx.rotate((((layer.rotation || 0) + rotOff) * Math.PI) / 180);
      ctx.scale((layer.scale || 1) * sMul * kbScale, (layer.scale || 1) * sMul * kbScale);

      if (layer.type === "image" && layer.imgEl) {
        if (imgRadius > 0 || borderOn) {
          ctx.save();
          ctx.beginPath();
          const bw = layer.baseW || 400;
          const bh = layer.baseH || 400;
          const rad = Math.min(imgRadius, Math.min(bw, bh) / 2);
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(-bw / 2, -bh / 2, bw, bh, rad);
          } else {
            ctx.rect(-bw / 2, -bh / 2, bw, bh);
          }
          ctx.clip();
          ctx.drawImage(layer.imgEl, -bw / 2, -bh / 2, bw, bh);
          if (borderOn) {
            ctx.strokeStyle = borderColor;
            ctx.lineWidth = borderWidth;
            ctx.stroke();
          }
          ctx.restore();
        } else {
          ctx.drawImage(layer.imgEl, -layer.baseW / 2, -layer.baseH / 2, layer.baseW, layer.baseH);
        }
      } else if (layer.type === "text") {
        ctx.font = `${layer.italic ? "italic " : ""}${layer.bold ? "bold " : ""}${layer.fontSize || 60}px "${layer.font || "Inter"}"`;
        ctx.fillStyle = layer.color || "#FFFFFF";
        ctx.textAlign = (layer.align || "center") as CanvasTextAlign;
        ctx.textBaseline = "middle";

        if (layer.strokeWidth && layer.strokeWidth > 0) {
          ctx.strokeStyle = layer.strokeColor || "#000000";
          ctx.lineWidth = layer.strokeWidth;
          ctx.strokeText(layer.text || "", 0, 0);
        }
        ctx.fillText(layer.text || "", 0, 0);
      } else if (layer.type === "caption") {
        ctx.font = `bold ${layer.fontSize || 48}px "${layer.font || "Space Grotesk"}"`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        const txt = layer.text || "";
        const metrics = ctx.measureText(txt);
        const padX = 24, padY = 14;
        const bgW = metrics.width + padX * 2;
        const bgH = (layer.fontSize || 48) + padY * 2;
        ctx.fillStyle = layer.bgColor || "rgba(0, 0, 0, 0.85)";
        ctx.beginPath();
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(-bgW / 2, -bgH / 2, bgW, bgH, 12);
        } else {
          ctx.rect(-bgW / 2, -bgH / 2, bgW, bgH);
        }
        ctx.fill();
        ctx.fillStyle = layer.color || "#FF5A36";
        ctx.fillText(txt, 0, 0);
      } else if (layer.type === "shape") {
        ctx.fillStyle = layer.fill || "#FF5A36";
        ctx.beginPath();
        const sw = layer.baseW || 240;
        const sh = layer.baseH || 240;

        if (layer.shapeType === "circle") {
          ctx.arc(0, 0, sw / 2, 0, Math.PI * 2);
        } else if (layer.shapeType === "pill") {
          if (typeof ctx.roundRect === "function") {
            ctx.roundRect(-sw / 2, -sh / 2, sw, sh, sh / 2);
          } else {
            ctx.rect(-sw / 2, -sh / 2, sw, sh);
          }
        } else {
          ctx.rect(-sw / 2, -sh / 2, sw, sh);
        }
        ctx.fill();

        if (layer.strokeWidth && layer.strokeWidth > 0) {
          ctx.strokeStyle = layer.strokeColor || "#FFFFFF";
          ctx.lineWidth = layer.strokeWidth;
          ctx.stroke();
        }
      }

      ctx.restore();
    });

    ctx.globalCompositeOperation = "source-over";

    // Scene Effects Overlays
    if (vignette) {
      ctx.save();
      const grad = ctx.createRadialGradient(w / 2, h / 2, w * 0.3, w / 2, h / 2, w * 0.75);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(0,0,0,0.65)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
      ctx.restore();
    }

    if (watermark) {
      ctx.save();
      ctx.font = "bold 20px Inter, sans-serif";
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.textAlign = "right";
      ctx.fillText("REEL RIG STUDIO", w - 30, 50);
      ctx.restore();
    }

    if (progressBar) {
      ctx.save();
      const pct = Math.min(1, Math.max(0, time / totalDuration));
      ctx.fillStyle = "#FF5A36";
      ctx.fillRect(0, h - 12, w * pct, 12);
      ctx.restore();
    }

    // Color Grade Overlays
    if (colorGrade !== "None") {
      ctx.save();
      if (colorGrade === "Warm Vintage") {
        ctx.fillStyle = "rgba(251, 146, 60, 0.12)";
        ctx.fillRect(0, 0, w, h);
      } else if (colorGrade === "Cool Sci-Fi") {
        ctx.fillStyle = "rgba(56, 189, 248, 0.12)";
        ctx.fillRect(0, 0, w, h);
      } else if (colorGrade === "Cyberpunk") {
        ctx.fillStyle = "rgba(236, 72, 153, 0.14)";
        ctx.fillRect(0, 0, w, h);
      } else if (colorGrade === "High Contrast B&W") {
        ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
        ctx.fillRect(0, 0, w, h);
      }
      ctx.restore();
    }

    // Render Stage Alignment Guides & Overlays (Preview mode only)
    if (!isForExport) {
      if (showGrid) {
        ctx.save();
        ctx.strokeStyle = "rgba(255,255,255,0.15)";
        ctx.lineWidth = 1;
        const step = 60;
        for (let x = 0; x <= w; x += step) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y <= h; y += step) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Render custom stage vertical/horizontal guides
      if (vGuides.length > 0 || hGuides.length > 0) {
        ctx.save();
        ctx.strokeStyle = "#38BDF8";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        vGuides.forEach((gx) => {
          ctx.beginPath();
          ctx.moveTo(gx, 0);
          ctx.lineTo(gx, h);
          ctx.stroke();
        });
        hGuides.forEach((gy) => {
          ctx.beginPath();
          ctx.moveTo(0, gy);
          ctx.lineTo(w, gy);
          ctx.stroke();
        });
        ctx.restore();
      }

      if (showSafeZone) {
        ctx.save();
        ctx.strokeStyle = "rgba(255, 90, 54, 0.6)";
        ctx.lineWidth = 2;
        ctx.setLineDash([8, 8]);
        ctx.strokeRect(w * 0.08, h * 0.12, w * 0.84, h * 0.76);
        ctx.fillStyle = "rgba(255, 90, 54, 0.7)";
        ctx.font = "bold 20px Inter, sans-serif";
        ctx.fillText("SHORTS SAFE ZONE", w * 0.08 + 10, h * 0.12 + 25);
        ctx.restore();
      }

      if (showShortsUi) {
        ctx.save();
        ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 28px Inter, sans-serif";
        ctx.fillText("@creator_name", 40, h - 140);
        ctx.font = "22px Inter, sans-serif";
        ctx.fillText("Viral Shorts animation title demo #shorts", 40, h - 90);
        ctx.beginPath();
        ctx.arc(w - 60, h - 300, 30, 0, Math.PI * 2);
        ctx.arc(w - 60, h - 200, 30, 0, Math.PI * 2);
        ctx.arc(w - 60, h - 100, 30, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }
  };

  // Main Canvas Render Loop
  useEffect(() => {
    if (!isExporting) {
      drawScene(currentTime, false);
    }
  }, [
    isExporting,
    currentTime,
    layers,
    aspect,
    filterBrightness,
    filterContrast,
    filterSaturation,
    filterGrayscale,
    filterSepia,
    filterInvert,
    filterHueRotate,
    filterBlur,
    bgType,
    bgColor1,
    bgColor2,
    totalDuration,
    showGrid,
    showSafeZone,
    showShortsUi,
    kenBurnsOn,
    kenBurnsDir,
    vGuides,
    hGuides,
    vignette,
    grain,
    watermark,
    progressBar,
    colorGrade,
    dropShadowOn,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    borderOn,
    borderColor,
    borderWidth,
    imgRadius,
    blendMode,
  ]);

  // Smooth Playhead Tick with requestAnimationFrame (exact delta time)
  useEffect(() => {
    let rafId: number | null = null;
    let lastTs: number | null = null;

    function tick(ts: number) {
      if (!isPlaying) return;
      if (lastTs === null) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      setCurrentTime((prev) => {
        const nextTime = prev + dt;
        if (nextTime >= totalDuration) {
          setIsPlaying(false);
          return 0;
        }
        return nextTime;
      });

      rafId = requestAnimationFrame(tick);
    }

    if (isPlaying) {
      rafId = requestAnimationFrame(tick);
      return () => {
        if (rafId !== null) cancelAnimationFrame(rafId);
      };
    }
  }, [isPlaying, totalDuration]);

  // Multi-Image Import Choice Modal State
  const [showImportChoiceModal, setShowImportChoiceModal] = useState<boolean>(false);
  const [pendingImportFiles, setPendingImportFiles] = useState<File[]>([]);

  // Custom Interactive Grid Drag & Drop Editor Modal State
  const [showGridEditorModal, setShowGridEditorModal] = useState<boolean>(false);
  const [gridEditorLayout, setGridEditorLayout] = useState<"2col" | "2row" | "1plus2" | "2x2">("2row");
  const [gridEditorCells, setGridEditorCells] = useState<(string | null)[]>([]);
  const [gridEditorTray, setGridEditorTray] = useState<string[]>([]);
  const [gridCellPos, setGridCellPos] = useState<{ x: number; y: number; zoom: number }[]>([
    { x: 0, y: 0, zoom: 1 },
    { x: 0, y: 0, zoom: 1 },
    { x: 0, y: 0, zoom: 1 },
    { x: 0, y: 0, zoom: 1 },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    if (fileList.length > 1) {
      setPendingImportFiles(fileList);
      setShowImportChoiceModal(true);
    } else {
      processImageImport(fileList, "separate");
    }
  };

  const openGridEditor = async (files: File[]) => {
    const dataUrls: string[] = [];
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) dataUrls.push(e.target.result as string);
          resolve();
        };
        reader.readAsDataURL(file);
      });
    }

    const n = dataUrls.length;
    const initialLayout: "2col" | "2row" | "1plus2" | "2x2" = n === 2 ? "2row" : n === 3 ? "1plus2" : n >= 4 ? "2x2" : "2col";
    const cellCount = initialLayout === "2col" || initialLayout === "2row" ? 2 : initialLayout === "1plus2" ? 3 : 4;

    const initialCells = new Array(cellCount).fill(null);
    const tray = [...dataUrls];
    for (let i = 0; i < cellCount && tray.length > 0; i++) {
      initialCells[i] = tray.shift()!;
    }

    setGridEditorLayout(initialLayout);
    setGridEditorCells(initialCells);
    setGridEditorTray(tray);
    setGridCellPos([
      { x: 0, y: 0, zoom: 1 },
      { x: 0, y: 0, zoom: 1 },
      { x: 0, y: 0, zoom: 1 },
      { x: 0, y: 0, zoom: 1 },
    ]);
    setShowGridEditorModal(true);
  };

  const applyGridEditor = async () => {
    const activeSrcs = gridEditorCells.filter(Boolean) as string[];
    if (activeSrcs.length === 0) {
      setShowGridEditorModal(false);
      return;
    }

    const imgs: HTMLImageElement[] = [];
    for (const src of gridEditorCells) {
      if (!src) continue;
      await new Promise<void>((resolve) => {
        const img = new Image();
        img.onload = () => { imgs.push(img); resolve(); };
        img.onerror = () => resolve();
        img.src = src;
      });
    }

    const W = 1080, H = 1920;
    const cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    const cx = cv.getContext("2d");
    if (cx) {
      cx.fillStyle = "#0C0E11";
      cx.fillRect(0, 0, W, H);
      const n = imgs.length;

      let rects: { x: number; y: number; w: number; h: number }[] = [];
      if (gridEditorLayout === "2col") rects = [{ x: 0, y: 0, w: W / 2, h: H }, { x: W / 2, y: 0, w: W / 2, h: H }];
      else if (gridEditorLayout === "2row") rects = [{ x: 0, y: 0, w: W, h: H / 2 }, { x: 0, y: H / 2, w: W, h: H / 2 }];
      else if (gridEditorLayout === "1plus2") rects = [{ x: 0, y: 0, w: W, h: H / 2 }, { x: 0, y: H / 2, w: W / 2, h: H / 2 }, { x: W / 2, y: H / 2, w: W / 2, h: H / 2 }];
      else rects = [{ x: 0, y: 0, w: W / 2, h: H / 2 }, { x: W / 2, y: 0, w: W / 2, h: H / 2 }, { x: 0, y: H / 2, w: W / 2, h: H / 2 }, { x: W / 2, y: H / 2, w: W / 2, h: H / 2 }];

      const gap = 12;
      rects.forEach((rect, i) => {
        const img = imgs[i];
        if (!img) return;
        const cw = rect.w - gap, ch = rect.h - gap;
        const userPos = gridCellPos[i] || { x: 0, y: 0, zoom: 1 };
        const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * userPos.zoom;
        const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;

        const extraX = dw - cw;
        const extraY = dh - ch;

        const offX = -extraX / 2 - (userPos.x / 100) * (extraX / 2);
        const offY = -extraY / 2 - (userPos.y / 100) * (extraY / 2);

        cx.save();
        cx.beginPath();
        cx.rect(rect.x + gap / 2, rect.y + gap / 2, cw, ch);
        cx.clip();
        cx.drawImage(img, rect.x + gap / 2 + offX, rect.y + gap / 2 + offY, dw, dh);
        cx.restore();
      });

      const dataUrl = cv.toDataURL("image/jpeg", 0.9);
      const finalImg = new Image();
      finalImg.onload = () => {
        const [w, h] = ASPECTS[aspect];
        const scale = Math.max(w / finalImg.naturalWidth, h / finalImg.naturalHeight);
        const gridLayer = {
          id: "img_" + Date.now() + "_" + Math.random(),
          type: "image",
          name: "Grid Layout (" + n + " images)",
          imgEl: finalImg,
          baseW: finalImg.naturalWidth * scale,
          baseH: finalImg.naturalHeight * scale,
          x: w / 2,
          y: h / 2,
          scale: 1,
          rotation: 0,
          opacity: 1,
          visible: true,
          anim: "none",
          start: 0,
          duration: totalDuration,
        };
        pushHistory(layers);
        setLayers((prev) => {
          const combined = [...prev, gridLayer];
          const perDur = +(totalDuration / combined.length).toFixed(2);
          return combined.map((l, idx) => ({
            ...l,
            start: +(idx * perDur).toFixed(2),
            duration: perDur,
          }));
        });
        setSelectedLayerId(gridLayer.id);
      };
      finalImg.src = dataUrl;
    }
    setShowGridEditorModal(false);
  };

  const updateTotalDuration = (newDur: number) => {
    const dur = Math.max(1, newDur);
    setTotalDuration(dur);
    setLayers((prev) => {
      const imageLayers = prev.filter((l) => l.type === "image");
      if (imageLayers.length === 0) return prev;

      if (imageLayers.length === 1) {
        return prev.map((l) => (l.type === "image" ? { ...l, start: 0, duration: dur } : l));
      }

      const perImgDur = +(dur / imageLayers.length).toFixed(2);
      let imgIdx = 0;
      return prev.map((l) => {
        if (l.type === "image") {
          const startPos = +(imgIdx * perImgDur).toFixed(2);
          const itemDur = imgIdx === imageLayers.length - 1 ? +(dur - startPos).toFixed(2) : perImgDur;
          imgIdx++;
          return { ...l, start: startPos, duration: itemDur };
        }
        return l;
      });
    });
  };

  const processImageImport = async (files: File[], mode: string) => {
    const validFiles = files.filter((f) => f.type.startsWith("image/"));
    if (validFiles.length === 0) {
      setShowImportChoiceModal(false);
      return;
    }

    pushHistory(layers);

    if (mode === "collage") {
      const imgs: HTMLImageElement[] = [];
      for (const file of validFiles) {
        await new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => { imgs.push(img); resolve(); };
            img.src = evt.target?.result as string;
          };
          reader.readAsDataURL(file);
        });
      }

      const W = 1080, H = 1920;
      const cv = document.createElement("canvas");
      cv.width = W; cv.height = H;
      const cx = cv.getContext("2d");
      if (cx) {
        cx.fillStyle = "#0C0E11";
        cx.fillRect(0, 0, W, H);
        const n = imgs.length;
        const cols = Math.ceil(Math.sqrt(n));
        const rows = Math.ceil(n / cols);
        const cw = W / cols, ch = H / rows;
        const gap = 8;
        imgs.forEach((img, i) => {
          const rx = (i % cols) * cw;
          const ry = Math.floor(i / cols) * ch;
          const w0 = cw - gap, h0 = ch - gap;
          const scale = Math.max(w0 / img.naturalWidth, h0 / img.naturalHeight);
          const dw = img.naturalWidth * scale, dh = img.naturalHeight * scale;
          cx.save();
          cx.beginPath();
          cx.rect(rx + gap / 2, ry + gap / 2, w0, h0);
          cx.clip();
          cx.drawImage(img, rx + gap / 2 - (dw - w0) / 2, ry + gap / 2 - (dh - h0) / 2, dw, dh);
          cx.restore();
        });

        const dataUrl = cv.toDataURL("image/jpeg", 0.9);
        const finalImg = new Image();
        finalImg.onload = () => {
          const [w, h] = ASPECTS[aspect];
          const scale = Math.max(w / finalImg.naturalWidth, h / finalImg.naturalHeight);
          const collageLayer = {
            id: "img_" + Date.now() + "_" + Math.random(),
            type: "image",
            name: "Collage (" + n + " images)",
            imgEl: finalImg,
            baseW: finalImg.naturalWidth * scale,
            baseH: finalImg.naturalHeight * scale,
            x: w / 2,
            y: h / 2,
            scale: 1,
            rotation: 0,
            opacity: 1,
            visible: true,
            anim: "none",
            start: 0,
            duration: totalDuration,
          };
          setLayers((prev) => [...prev, collageLayer]);
          setSelectedLayerId(collageLayer.id);
        };
        finalImg.src = dataUrl;
      }
      setShowImportChoiceModal(false);
      return;
    }

    if (mode === "customgrid") {
      setShowImportChoiceModal(false);
      openGridEditor(validFiles);
      return;
    }

    if (mode === "separate") {
      const loadedLayers: any[] = [];
      const existingImageLayers = layers.filter((l) => l.type === "image");
      const hasExistingImages = existingImageLayers.length > 0;
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        await new Promise<void>((resolve) => {
          const reader = new FileReader();
          reader.onload = (evt) => {
            const img = new Image();
            img.onload = () => {
              const [w, h] = ASPECTS[aspect];
              const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
              const isFirstImage = !hasExistingImages && i === 0;
              const newLayer = {
                id: "img_" + Date.now() + "_" + i + "_" + Math.random(),
                type: "image",
                name: file.name.replace(/\.[^.]+$/, "").slice(0, 24),
                imgEl: img,
                baseW: Math.round(img.naturalWidth * scale),
                baseH: Math.round(img.naturalHeight * scale),
                x: Math.round(w / 2),
                y: isFirstImage ? Math.round(h / 2) : Math.round(h * 0.75),
                scale: isFirstImage ? 1.0 : 0.6,
                rotation: 0,
                opacity: 1,
                visible: true,
                anim: "none",
                start: 0,
                duration: totalDuration,
              };
              loadedLayers.push(newLayer);
              resolve();
            };
            img.src = evt.target?.result as string;
          };
          reader.readAsDataURL(file);
        });
      }

      if (loadedLayers.length > 0) {
        setLayers((prev) => {
          const combined = [...prev, ...loadedLayers];
          const imgCount = combined.filter((l) => l.type === "image").length;
          if (imgCount === 1) {
            return combined.map((l) => (l.type === "image" ? { ...l, start: 0, duration: totalDuration } : l));
          }
          return combined;
        });
        setSelectedLayerId(loadedLayers[0].id);
      }
      setShowImportChoiceModal(false);
      return;
    }

    // Slideshow (one by one) mode
    const count = validFiles.length;
    const perImageDuration = +(totalDuration / count).toFixed(2);

    const loadedLayers: any[] = [];
    for (let i = 0; i < validFiles.length; i++) {
      const file = validFiles[i];
      await new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const img = new Image();
          img.onload = () => {
            const [w, h] = ASPECTS[aspect];
            const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
            const startPos = +(i * perImageDuration).toFixed(2);

            const newLayer = {
              id: "img_" + Date.now() + "_" + i + "_" + Math.random(),
              type: "image",
              name: file.name.replace(/\.[^.]+$/, "").slice(0, 24),
              imgEl: img,
              baseW: img.naturalWidth * scale,
              baseH: img.naturalHeight * scale,
              x: w / 2,
              y: h / 2,
              scale: 1,
              rotation: 0,
              opacity: 1,
              visible: true,
              anim: "none",
              start: startPos,
              duration: perImageDuration,
            };
            loadedLayers.push(newLayer);
            resolve();
          };
          img.src = evt.target?.result as string;
        };
        reader.readAsDataURL(file);
      });
    }

    if (loadedLayers.length > 0) {
      setLayers((prev) => [...prev, ...loadedLayers]);
      setSelectedLayerId(loadedLayers[0].id);
    }
    setShowImportChoiceModal(false);
  };

  const isDraggingCanvasRef = useRef<boolean>(false);
  const dragStartRef = useRef<{ layerId: string; offX: number; offY: number } | null>(null);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const [cw, ch] = ASPECTS[aspect];
    const x = (e.clientX - rect.left) * (cw / rect.width);
    const y = (e.clientY - rect.top) * (ch / rect.height);
    return { x, y };
  };

  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPlaying) return;
    const { x, y } = getCanvasCoords(e);
    const [cw, ch] = ASPECTS[aspect];

    for (let i = layers.length - 1; i >= 0; i--) {
      const l = layers[i];
      if (!l.visible) continue;
      const w = (l.baseW || 480) * (l.scale || 1);
      const h = (l.baseH || 640) * (l.scale || 1);
      const lx = l.x || cw / 2;
      const ly = l.y || ch / 2;

      if (x >= lx - w / 2 && x <= lx + w / 2 && y >= ly - h / 2 && y <= ly + h / 2) {
        setSelectedLayerId(l.id);
        isDraggingCanvasRef.current = true;
        dragStartRef.current = {
          layerId: l.id,
          offX: x - lx,
          offY: y - ly,
        };
        break;
      }
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingCanvasRef.current || !dragStartRef.current) return;
      const { x, y } = getCanvasCoords(e);
      const [cw, ch] = ASPECTS[aspect];

      let nx = Math.min(cw, Math.max(0, x - dragStartRef.current.offX));
      let ny = Math.min(ch, Math.max(0, y - dragStartRef.current.offY));

      if (snap) {
        if (Math.abs(nx - cw / 2) < 14) nx = cw / 2;
        if (Math.abs(ny - ch / 2) < 14) ny = ch / 2;
      }

      const targetId = dragStartRef.current.layerId;
      setLayers((prev) =>
        prev.map((l) => (l.id === targetId ? { ...l, x: Math.round(nx), y: Math.round(ny) } : l))
      );
      setSelectedLayerX(Math.round(nx));
      setSelectedLayerY(Math.round(ny));
    };

    const handleMouseUp = () => {
      isDraggingCanvasRef.current = false;
      dragStartRef.current = null;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || "").toLowerCase();
      if (activeTag === "input" || activeTag === "textarea" || activeTag === "select") return;

      if ((e.key === "Delete" || e.key === "Backspace") && selectedLayerId) {
        e.preventDefault();
        setLayers((prev) => prev.filter((l) => l.id !== selectedLayerId));
        setSelectedLayerId(null);
      } else if (e.code === "Space") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [aspect, snap, selectedLayerId]);

  const handleCanvasDrop = (e: React.DragEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 1) {
        setPendingImportFiles(files);
        setShowImportChoiceModal(true);
      } else {
        processImageImport(files, "separate");
      }
    }
  };

  const audioElementsRef = useRef<Map<string, HTMLAudioElement>>(new Map());
  const appAudioCtxRef = useRef<AudioContext | null>(null);
  const trackNodeCacheRef = useRef<Map<string, { el: HTMLAudioElement; source: MediaElementAudioSourceNode; gain: GainNode }>>(new Map());

  const getAppAudioCtx = () => {
    if (!appAudioCtxRef.current || appAudioCtxRef.current.state === "closed") {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      appAudioCtxRef.current = new AudioContextClass();
    }
    if (appAudioCtxRef.current.state === "suspended") {
      appAudioCtxRef.current.resume().catch(() => { });
    }
    return appAudioCtxRef.current;
  };

  const getTrackNodes = (track: any) => {
    let nodes = trackNodeCacheRef.current.get(track.id);
    if (nodes) return nodes;
    const el = audioElementsRef.current.get(track.id);
    if (!el) return null;
    try {
      const ctx = getAppAudioCtx();
      let source = (el as any)._mediaSourceNode;
      if (!source) {
        source = ctx.createMediaElementSource(el);
        (el as any)._mediaSourceNode = source;
      }
      let gain = (el as any)._gainNode;
      if (!gain) {
        gain = ctx.createGain();
        (el as any)._gainNode = gain;
        source.connect(gain);
        try { gain.connect(ctx.destination); } catch (e) { }
      }
      nodes = { el, source, gain };
      trackNodeCacheRef.current.set(track.id, nodes);
      return nodes;
    } catch (e) {
      return null;
    }
  };

  const syncTotalDurationWithAudio = (tracksToSync?: any[]) => {
    const tracks = tracksToSync || audioTracks;
    if (!tracks || tracks.length === 0) return;
    let maxEnd = 0;
    tracks.forEach((t) => {
      if (t.muted) return;
      const clipLen = Math.max(0.1, (t.trimEnd || 300) - (t.trimStart || 0));
      const endPos = (t.offset || 0) + clipLen;
      if (endPos > maxEnd) maxEnd = endPos;
    });
    if (maxEnd > 0) {
      const newDur = +maxEnd.toFixed(1);
      updateTotalDuration(newDur);
    }
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const url = URL.createObjectURL(file);
      const audioEl = new Audio(url);
      audioEl.preload = "auto";
      audioEl.load();

      audioEl.addEventListener("loadedmetadata", () => {
        const dur = +(audioEl.duration || 300).toFixed(2);
        setAudioTracks((prev) =>
          prev.map((t) => (t.url === url ? { ...t, trimEnd: dur } : t))
        );
        const targetDur = dur > totalDuration ? Math.ceil(dur) : totalDuration;
        updateTotalDuration(targetDur);
        showToast(`Timeline set to ${formatTimeMs(targetDur)} & image timing divided!`);
      });

      const initialDur = (audioEl.duration && isFinite(audioEl.duration)) ? +audioEl.duration.toFixed(2) : 300;

      const newTrack = {
        id: "audio_" + Date.now() + "_" + Math.random(),
        name: file.name,
        url: url,
        volume: 1,
        muted: false,
        offset: 0,
        trimStart: 0,
        trimEnd: initialDur,
        fadeIn: 0,
        fadeOut: 0,
        loop: false,
      };

      audioElementsRef.current.set(newTrack.id, audioEl);
      setAudioTracks((prev) => [...prev, newTrack]);
      getTrackNodes(newTrack);
    });
    showToast("Audio track loaded");
  };

  // Merge Audio Tracks Back-to-Back
  const mergeAudioTracks = () => {
    if (audioTracks.length < 2) {
      showToast("Add at least 2 audio tracks to merge them.");
      return;
    }
    let cursor = 0;
    const merged = audioTracks.map((t) => {
      const clipLen = Math.max(0.1, (t.trimEnd || 35) - (t.trimStart || 0));
      const updated = { ...t, offset: +cursor.toFixed(2) };
      cursor += clipLen;
      return updated;
    });
    setAudioTracks(merged);
    showToast("Tracks merged back-to-back");
  };

  // Split / Cut Audio Track at current playhead position
  const splitAudioTrack = (targetTrackId?: string) => {
    let trackToCut = targetTrackId
      ? audioTracks.find((t) => t.id === targetTrackId)
      : audioTracks.find((t) => {
        const clipLen = (t.trimEnd || 35) - (t.trimStart || 0);
        return currentTime >= (t.offset || 0) && currentTime < (t.offset || 0) + clipLen;
      });

    if (!trackToCut && audioTracks.length > 0) {
      trackToCut = audioTracks[0];
    }

    if (!trackToCut) {
      showToast("Load an audio track to cut");
      return;
    }

    const offset = trackToCut.offset || 0;
    const trimStart = trackToCut.trimStart || 0;
    const trimEnd = trackToCut.trimEnd || 35;
    const clipLen = Math.max(0.1, trimEnd - trimStart);

    if (currentTime <= offset || currentTime >= offset + clipLen) {
      showToast(`Scrub playhead between ${(offset).toFixed(1)}s and ${(offset + clipLen).toFixed(1)}s to cut this track`);
      return;
    }

    const cutOffsetInClip = currentTime - offset;
    const splitSongTime = +(trimStart + cutOffsetInClip).toFixed(2);

    const trackA = {
      ...trackToCut,
      name: trackToCut.name.replace(/ \(Part \d+\)$/, "") + " (Part 1)",
      trimEnd: splitSongTime,
      loop: false,
    };

    const newTrackId = "audio_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
    const trackB = {
      ...trackToCut,
      id: newTrackId,
      name: trackToCut.name.replace(/ \(Part \d+\)$/, "") + " (Part 2)",
      offset: +currentTime.toFixed(2),
      trimStart: splitSongTime,
      loop: false,
    };

    const origAudioEl = audioElementsRef.current.get(trackToCut.id);
    if (origAudioEl) {
      const audioElB = new Audio(trackToCut.url);
      audioElB.preload = "auto";
      audioElB.load();
      try { audioElB.currentTime = splitSongTime; } catch (e) { }
      audioElementsRef.current.set(newTrackId, audioElB);
      getTrackNodes(trackB);
    }

    setAudioTracks((prev) => {
      const idx = prev.findIndex((item) => item.id === trackToCut!.id);
      if (idx === -1) return prev;
      const copy = [...prev];
      copy.splice(idx, 1, trackA, trackB);
      syncTotalDurationWithAudio(copy);
      return copy;
    });

    showToast(`Cut audio track at ${currentTime.toFixed(1)}s!`);
  };

  // Store previous track parameter values to detect live cuts/trims
  const prevTrackParamsRef = useRef<Map<string, string>>(new Map());

  // Sync Audio Playback with Timeline Current Time & Export state
  useEffect(() => {
    if (isPlaying || isExporting) {
      getAppAudioCtx();
    }

    audioTracks.forEach((track) => {
      const nodes = getTrackNodes(track);
      const el = nodes?.el || audioElementsRef.current.get(track.id);
      if (!el) return;

      const trimStart = track.trimStart || 0;
      const trimEnd = track.trimEnd || el.duration || 35;
      const clipLen = Math.max(0.05, trimEnd - trimStart);
      const offset = track.offset || 0;
      const rel = currentTime - offset;

      // Detect if trim or offset parameters changed since last render
      const trackParamKey = `${trimStart.toFixed(2)}_${trimEnd.toFixed(2)}_${offset.toFixed(2)}`;
      const prevParamKey = prevTrackParamsRef.current.get(track.id);
      const paramsChanged = prevParamKey !== undefined && prevParamKey !== trackParamKey;
      prevTrackParamsRef.current.set(track.id, trackParamKey);

      const inRange = !track.muted && rel >= 0 && (track.loop ? true : rel <= clipLen);

      if (!inRange) {
        if (!el.paused) el.pause();
        if (nodes && nodes.gain) nodes.gain.gain.value = 0;
        return;
      }

      const localRel = track.loop ? (rel % clipLen) : Math.min(rel, clipLen);
      const targetAudioTime = trimStart + localRel;
      const activePlaying = isPlaying || isExporting;

      if (activePlaying) {
        if (el.paused || el.ended || paramsChanged) {
          try { el.currentTime = targetAudioTime; } catch (e) { }
          const playPromise = el.play();
          if (playPromise !== undefined) {
            playPromise.catch(() => { });
          }
        } else if (Math.abs(el.currentTime - targetAudioTime) > 0.3) {
          try { el.currentTime = targetAudioTime; } catch (e) { }
        }
      } else {
        if (!el.paused) el.pause();
        if (paramsChanged || Math.abs(el.currentTime - targetAudioTime) > 0.05) {
          try { el.currentTime = targetAudioTime; } catch (e) { }
        }
      }

      let vol = track.muted ? 0 : track.volume !== undefined ? track.volume : 1;
      if (track.fadeIn > 0 && rel < track.fadeIn) {
        vol *= Math.min(1, Math.max(0, rel / track.fadeIn));
      }
      if (!track.loop && track.fadeOut > 0 && rel > clipLen - track.fadeOut) {
        vol *= Math.min(1, Math.max(0, (clipLen - rel) / track.fadeOut));
      }

      if (nodes && nodes.gain) {
        nodes.gain.gain.value = vol;
      } else {
        el.volume = Math.min(1, Math.max(0, vol));
      }
    });
  }, [isPlaying, isExporting, currentTime, audioTracks]);

  // Save Project JSON
  const handleSaveProject = () => {
    const projectData = {
      version: "2.0",
      createdAt: new Date().toISOString(),
      aspect,
      totalDuration,
      bgType,
      bgColor1,
      bgColor2,
      vignette,
      grain,
      watermark,
      progressBar,
      colorGrade,
      layers: layers.map((l) => ({
        ...l,
        imgEl: undefined,
      })),
    };
    const jsonStr = JSON.stringify(projectData, null, 2);
    localStorage.setItem("reel_rig_project_backup", jsonStr);

    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reel-rig-project-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Project saved & JSON downloaded");
  };

  // Load Project JSON
  const handleLoadProject = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = JSON.parse(evt.target?.result as string);
        if (data.aspect) setAspect(data.aspect);
        if (data.totalDuration) setTotalDuration(data.totalDuration);
        if (data.bgType) setBgType(data.bgType);
        if (data.bgColor1) setBgColor1(data.bgColor1);
        if (data.bgColor2) setBgColor2(data.bgColor2);
        if (data.colorGrade) setColorGrade(data.colorGrade);
        if (Array.isArray(data.layers)) {
          setLayers(data.layers);
          if (data.layers.length > 0) setSelectedLayerId(data.layers[0].id);
        }
        showToast("Project loaded successfully!");
      } catch (err) {
        alert("Invalid project JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const handleNewProject = () => {
    if (confirm("Start a new project? This will clear current layers.")) {
      pushHistory(layers);
      setLayers([]);
      setSelectedLayerId(null);
      setAudioTracks([]);
      setCurrentTime(0);
      showToast("New clean project canvas ready");
    }
  };

  const handleShareLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("Project URL copied to clipboard!");
    } else {
      showToast("Share link: " + window.location.href);
    }
  };

  const exportCurrentFramePNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawScene(currentTime, true);
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `reel-frame-${currentTime.toFixed(1)}s.png`;
    a.click();
    showToast("Exported current frame as PNG");
  };

  const suggestHashtags = () => {
    const base = (ytTitle + " " + ytDescription).trim();
    const tagList = ["#Shorts", "#Viral", "#Reels", "#Trending", "#ShortsFeed", "#Creator"];
    if (base.length > 0) {
      const words = base.toLowerCase().match(/\b[a-z0-9]{4,}\b/g) || [];
      words.slice(0, 4).forEach((w) => tagList.push(`#${w}`));
    }
    const resultTags = Array.from(new Set(tagList)).join(" ");
    setYtTags(resultTags);
    if (!ytDescription.includes("#Shorts")) {
      setYtDescription((prev) => (prev ? prev + "\n\n" + resultTags : resultTags));
    }
    showToast("Generated optimized YouTube Shorts hashtags!");
  };

  const runExport = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    if (layers.length === 0) {
      showToast("Add at least one layer before exporting.");
      return;
    }

    if (typeof canvas.captureStream !== "function") {
      alert("Canvas recording is not supported in this browser. Try Chrome or Edge.");
      return;
    }

    setIsPlaying(false);
    setCurrentTime(0);
    setIsExporting(true);
    setExportProgress(0);

    let mimeType = "video/webm;codecs=vp9,opus";
    if (MediaRecorder.isTypeSupported("video/mp4;codecs=avc1.42E01E,mp4a.40.2")) {
      mimeType = "video/mp4;codecs=avc1.42E01E,mp4a.40.2";
    } else if (MediaRecorder.isTypeSupported("video/mp4")) {
      mimeType = "video/mp4";
    } else if (MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus")) {
      mimeType = "video/webm;codecs=vp8,opus";
    } else if (MediaRecorder.isTypeSupported("video/webm")) {
      mimeType = "video/webm";
    }

    const ext = mimeType.includes("mp4") ? "mp4" : "webm";
    setExportFormat(ext.toUpperCase());

    const canvasStream = canvas.captureStream(exportFps);
    const streamTracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];

    let audioDest: any = null;
    let exportMasterGain: GainNode | null = null;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const activeAudioSources = audioTracks.filter((t) => !t.muted && t.url).length;
      if (AudioContextClass && activeAudioSources > 0) {
        if (!appAudioCtxRef.current || appAudioCtxRef.current.state === "closed") {
          appAudioCtxRef.current = new AudioContextClass();
        }
        const ctx = appAudioCtxRef.current;
        if (ctx.state === "suspended") {
          await ctx.resume();
        }
        audioDest = ctx.createMediaStreamDestination();
        exportMasterGain = ctx.createGain();
        exportMasterGain.connect(audioDest);

        audioTracks.forEach((track) => {
          const el = audioElementsRef.current.get(track.id);
          if (el && !track.muted) {
            try {
              let source = (el as any)._mediaSourceNode;
              if (!source) {
                source = ctx.createMediaElementSource(el);
                (el as any)._mediaSourceNode = source;
              }
              let gainNode = (el as any)._gainNode;
              if (!gainNode) {
                gainNode = ctx.createGain();
                (el as any)._gainNode = gainNode;
                source.connect(gainNode);
                try { gainNode.connect(ctx.destination); } catch (e) { }
              }
              gainNode.gain.value = track.muted ? 0 : track.volume !== undefined ? track.volume : 1;
              try { gainNode.connect(exportMasterGain!); } catch (e) { }
            } catch (err) {
              console.error("Error connecting audio track:", err);
            }
          }
        });

        const destAudioTracks = audioDest.stream.getAudioTracks();
        if (destAudioTracks.length > 0) {
          streamTracks.push(...destAudioTracks);
        }
      }
    } catch (e) {
      console.error("Audio Context setup error:", e);
    }

    const combinedStream = new MediaStream(streamTracks);
    const recorder = new MediaRecorder(combinedStream, {
      mimeType,
      videoBitsPerSecond: exportQuality,
    });

    const chunks: Blob[] = [];
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };

    recorder.onstop = async () => {
      audioTracks.forEach((t) => {
        const el = audioElementsRef.current.get(t.id);
        if (el && !el.paused) el.pause();
      });
      if (exportMasterGain) {
        try { exportMasterGain.disconnect(); } catch (e) { }
      }

      let blob = new Blob(chunks, { type: mimeType });
      if (ext === "mp4" || mimeType.includes("mp4")) {
        blob = await fixMp4Duration(blob, totalDuration);
      } else if (ext === "webm" || mimeType.includes("webm")) {
        blob = await fixWebmDuration(blob, totalDuration * 1000);
      }

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `short-${Date.now()}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      setIsExporting(false);
      showToast("Short video rendered and downloaded!");
    };

    recorder.start(100);

    const startTs = performance.now();
    function step(ts: number) {
      const elapsed = (ts - startTs) / 1000;
      const currentExportTime = Math.min(elapsed, totalDuration);

      const pct = Math.min(1, Math.max(0, elapsed / totalDuration));
      setExportProgress(Math.round(pct * 100));
      setCurrentTime(currentExportTime);

      drawScene(currentExportTime, true);
      const videoTrack = streamTracks.find((t) => t.kind === "video");
      if (videoTrack && typeof (videoTrack as any).requestFrame === "function") {
        try {
          (videoTrack as any).requestFrame();
        } catch (e) { }
      }

      if (elapsed >= totalDuration) {
        drawScene(totalDuration, true);
        recorder.stop();
        return;
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  };

  // Dynamic SEO Score calculation for YouTube Shorts
  const calcSeoScore = () => {
    let score = 0;
    if (ytTitle.length >= 20 && ytTitle.length <= 70) score += 30;
    if (ytDescription.length >= 50) score += 30;
    if (ytDescription.includes("#Shorts") || ytTags.toLowerCase().includes("shorts")) score += 20;
    if (ytTags.split(",").filter(Boolean).length >= 3 || ytTags.includes("#")) score += 20;
    return score;
  };

  const seoScore = calcSeoScore();

  // Mobile Tab Navigation State ('layers' | 'stage' | 'props')
  const [mobileTab, setMobileTab] = useState<"layers" | "stage" | "props">("stage");

  // Filtered layers based on search input
  const filteredLayers = layers.filter((l) =>
    (l.name || "").toLowerCase().includes(layerSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen w-full bg-[#0C0E11] text-[#E7E9EC] font-sans overflow-hidden">
      <SEO
        title="Reel Rig Studio — Shorts Animator & Multi-Layer Video Editor"
        description="Create animated YouTube Shorts, Instagram Reels, and TikTok videos online with multi-layer keyframe animation, caption tracks, audio sync, and canvas tools."
        canonical="/reel-rig-studio"
        keywords="reel rig studio, shorts animator, video editor online, instagram reels maker, tiktok animator, video keyframe animation"
      />

      {/* Hidden file input for project load */}
      <input
        type="file"
        ref={loadFileInputRef}
        accept=".json"
        onChange={handleLoadProject}
        className="hidden"
      />

      {/* Toast Notification Banner */}
      {toastMsg && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#FF5A36] text-[#160702] font-semibold text-xs shadow-lg animate-bounce">
          ✨ {toastMsg}
        </div>
      )}

      {/* Responsive Header Bar */}
      <header className="app-header flex items-center justify-between px-3 sm:px-4 py-2 border-b border-[#262B33] bg-[#15181D] shrink-0 flex-wrap gap-y-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-[#FF5A36] flex items-center justify-center shrink-0 shadow-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M8 5v14l11-7-11-7z" fill="#160702" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-[15px] sm:text-[16px] leading-none tracking-tight">Reel Rig Studio</h1>
            <p className="hidden sm:block text-[10.5px] leading-none mt-1 text-[#8B93A1]">Multi-layer animator for Shorts</p>
          </div>
        </div>

        {/* Header Tool Actions */}
        <div className="relative flex items-center max-w-full group">
          <button
            onClick={() => headerNavRef.current?.scrollBy({ left: -140, behavior: "smooth" })}
            className="w-6 h-7 rounded-l bg-[#1B1F26] border border-[#262B33] text-[#8B93A1] hover:text-white flex items-center justify-center text-[10px] shrink-0 z-10 hover:bg-[#262B33]"
            title="Scroll left"
          >
            ◀
          </button>
          <div ref={headerNavRef} className="flex items-center gap-1.5 overflow-x-auto max-w-full py-1 scrollbar-none scroll-smooth px-1">
            <button
              onClick={handleUndo}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-md text-[12px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] shrink-0"
              title="Undo"
            >
              ↺
            </button>
            <button
              onClick={handleRedo}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-md text-[12px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] shrink-0"
              title="Redo"
            >
              ↻
            </button>
            <div className="w-px h-4 mx-0.5 bg-[#262B33] shrink-0" />
            <button
              onClick={handleSaveProject}
              className="px-2 py-1.5 sm:px-2.5 rounded-md text-[11px] sm:text-[12px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] shrink-0 font-medium"
            >
              Save
            </button>
            <button
              onClick={() => loadFileInputRef.current?.click()}
              className="px-2 py-1.5 sm:px-2.5 rounded-md text-[11px] sm:text-[12px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] shrink-0 font-medium"
            >
              Load
            </button>
            <button
              onClick={handleNewProject}
              className="px-2 py-1.5 sm:px-2.5 rounded-md text-[11px] sm:text-[12px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] shrink-0 font-medium"
            >
              New
            </button>
            <div className="w-px h-4 mx-0.5 bg-[#262B33] shrink-0" />
            <button
              onClick={() => setShowTemplatesModal(true)}
              className="px-2.5 py-1.5 rounded-md text-[11px] sm:text-[12px] bg-[#7A2E1D] border border-[#FF5A36] text-white font-semibold shrink-0"
            >
              ✨ Templates
            </button>
            <button
              onClick={handleShareLink}
              className="px-2 py-1.5 sm:px-2.5 rounded-md text-[11px] sm:text-[12px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] shrink-0 font-medium"
            >
              Share link
            </button>
          </div>
          <button
            onClick={() => headerNavRef.current?.scrollBy({ left: 140, behavior: "smooth" })}
            className="w-6 h-7 rounded-r bg-[#1B1F26] border border-[#262B33] text-[#8B93A1] hover:text-white flex items-center justify-center text-[10px] shrink-0 z-10 hover:bg-[#262B33]"
            title="Scroll right"
          >
            ▶
          </button>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[11px] sm:text-[12px] text-[#8B93A1]">
            {formatTimeMs(currentTime)} / {formatTimeMs(totalDuration)}
          </span>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md text-[12px] sm:text-[13px] font-medium bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36]"
          >
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
          <button
            onClick={runExport}
            className="px-3 py-1.5 rounded-md text-[12px] sm:text-[13px] font-semibold bg-[#FF5A36] text-[#160702] hover:bg-[#ff7452] transition shadow-md"
          >
            Export video
          </button>
        </div>
      </header>

      {/* Main Responsive Studio Shell */}
      <div className="flex flex-1 overflow-hidden relative pb-14 md:pb-0">
        {/* LEFT PANEL: Layers */}
        <aside className={`w-full md:w-[250px] lg:w-[270px] shrink-0 border-r border-[#262B33] bg-[#15181D] flex flex-col min-h-0 ${mobileTab === "layers" ? "flex" : "hidden md:flex"}`}>
          <div className="p-3 border-b border-[#262B33] space-y-2">
            <label className="w-full block text-center py-2 rounded-md text-[13px] font-semibold bg-[#FF5A36] text-[#160702] cursor-pointer hover:bg-[#ff7452] transition">
              + Image / Video layer
              <input type="file" accept="image/*,video/*" multiple onChange={handleFileUpload} className="hidden" />
            </label>
            <p className="text-[10.5px] leading-snug text-[#8B93A1]">
              Pick images for separate layers, collage, or timed slideshow.
            </p>
            <button
              onClick={() => updateTotalDuration(totalDuration)}
              className="w-full py-1.5 rounded-md text-[11.5px] font-medium bg-[#1B1F26] border border-[#262B33] text-[#FF5A36] hover:bg-[#262B33] transition flex items-center justify-center gap-1.5"
            >
              <span>⚡</span> Auto-sequence slideshow (one by one)
            </button>
            <button
              onClick={() => {
                const [w, h] = ASPECTS[aspect];
                const imageLayers = layers.filter((l) => l.type === "image");
                if (imageLayers.length === 0) return;
                const n = imageLayers.length;
                pushHistory(layers);
                setLayers((prev) => {
                  let imgIdx = 0;
                  return prev.map((l) => {
                    if (l.type === "image") {
                      const slotY = Math.round((h / (n + 1)) * (imgIdx + 1));
                      imgIdx++;
                      return {
                        ...l,
                        x: Math.round(w / 2),
                        y: slotY,
                        start: 0,
                        duration: totalDuration,
                      };
                    }
                    return l;
                  });
                });
                showToast("Stacked layers on stage");
              }}
              className="w-full py-1.5 rounded-md text-[11.5px] font-medium bg-[#1B1F26] border border-[#262B33] text-[#FF5A36] hover:bg-[#262B33] transition flex items-center justify-center gap-1.5"
            >
              <span>📐</span> Auto-stack grid layers on stage
            </button>

            {/* Layer Creation Quick Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => addTextLayer()}
                className="py-1.5 rounded-md text-[12px] font-medium bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36]"
              >
                + Text
              </button>
              <button
                onClick={() => addShapeLayer("rectangle")}
                className="py-1.5 rounded-md text-[12px] font-medium bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36]"
              >
                + Shape
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={addCaptionLayer}
                className="py-1.5 rounded-md text-[12px] font-medium bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36]"
              >
                + Caption
              </button>
              <button
                onClick={addKineticTextLayer}
                className="py-1.5 rounded-md text-[12px] font-medium bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] text-[#38BDF8]"
              >
                Kinetic text
              </button>
            </div>

            {/* Emoji Quick Picker */}
            <div className="flex flex-wrap gap-1 pt-1">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => addTextLayer(e)}
                  className="w-7 h-7 rounded bg-[#1B1F26] border border-[#262B33] text-xs flex items-center justify-center hover:border-[#FF5A36]"
                  title={`Add ${e} emoji layer`}
                >
                  {e}
                </button>
              ))}
            </div>

            {/* Layer Search Filter */}
            <input
              type="text"
              placeholder="Search layers…"
              value={layerSearch}
              onChange={(e) => setLayerSearch(e.target.value)}
              className="w-full rounded-md px-2.5 py-1.5 text-[12px] bg-[#1B1F26] border border-[#262B33] text-white"
            />
          </div>

          <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
            {filteredLayers.map((l, index) => (
              <div
                key={l.id}
                onClick={() => setSelectedLayerId(l.id)}
                className={`p-2.5 rounded-md border text-xs cursor-pointer flex items-center gap-2.5 ${selectedLayerId === l.id ? "bg-[#7A2E1D] border-[#FF5A36]" : "bg-[#1B1F26] border-[#262B33]"}`}
              >
                <div className="w-8 h-8 rounded bg-black/40 overflow-hidden shrink-0 flex items-center justify-center text-[10px] font-bold">
                  {l.type === "image" ? (
                    <img src={l.imgEl?.src} className="w-full h-full object-cover" />
                  ) : l.type === "shape" ? (
                    "◼"
                  ) : (
                    "T"
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="truncate font-medium text-white">{l.name}</div>
                  <div className="text-[10px] text-[#8B93A1]">{(l.start || 0).toFixed(1)}s - {((l.start || 0) + (l.duration || totalDuration)).toFixed(1)}s</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    title={l.visible !== false ? "Hide layer" : "Show layer"}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateSelectedLayerProps({ visible: l.visible === false });
                    }}
                    className={`w-5 h-5 rounded text-[10px] flex items-center justify-center ${l.visible !== false ? "text-[#8B93A1] hover:text-white" : "text-red-400 bg-red-950/40"}`}
                  >
                    {l.visible !== false ? "👁" : "🙈"}
                  </button>
                  <button
                    title="Delete layer"
                    onClick={(e) => {
                      e.stopPropagation();
                      pushHistory(layers);
                      setLayers((prev) => prev.filter((item) => item.id !== l.id));
                      if (selectedLayerId === l.id) setSelectedLayerId(null);
                    }}
                    className="w-5 h-5 rounded text-[10px] flex items-center justify-center text-[#8B93A1] hover:text-red-400 hover:bg-red-950/40"
                  >
                    🗑
                  </button>
                  <div className="flex flex-col gap-0.5">
                    <button
                      title="Move layer up"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (index === layers.length - 1) return;
                        pushHistory(layers);
                        setLayers((prev) => {
                          const copy = [...prev];
                          const temp = copy[index];
                          copy[index] = copy[index + 1];
                          copy[index + 1] = temp;
                          return copy;
                        });
                      }}
                      className="w-4 h-3.5 rounded bg-[#15181D] hover:bg-[#FF5A36] text-[8px] flex items-center justify-center text-white"
                    >
                      ▲
                    </button>
                    <button
                      title="Move layer down"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (index === 0) return;
                        pushHistory(layers);
                        setLayers((prev) => {
                          const copy = [...prev];
                          const temp = copy[index];
                          copy[index] = copy[index - 1];
                          copy[index - 1] = temp;
                          return copy;
                        });
                      }}
                      className="w-4 h-3.5 rounded bg-[#15181D] hover:bg-[#FF5A36] text-[8px] flex items-center justify-center text-white"
                    >
                      ▼
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* CENTER PANEL: Stage */}
        <main className={`flex-1 flex-col items-center relative p-2 sm:p-4 overflow-y-auto bg-[#0A0B0D] ${mobileTab === "stage" ? "flex" : "hidden md:flex"}`}>
          <div className="relative flex items-center w-full max-w-full mb-2 group">
            <button
              onClick={() => stageToolbarRef.current?.scrollBy({ left: -160, behavior: "smooth" })}
              className="w-6 h-7 rounded-l bg-[#1B1F26] border border-[#262B33] text-[#8B93A1] hover:text-white flex items-center justify-center text-[10px] shrink-0 z-10 hover:bg-[#262B33]"
              title="Scroll left"
            >
              ◀
            </button>
            <div ref={stageToolbarRef} className="stage-toolbar flex-1 flex items-center gap-1.5 justify-start overflow-x-auto max-w-full py-0.5 scrollbar-none scroll-smooth px-1 whitespace-nowrap">
              {Object.keys(ASPECTS).map((key) => (
                <button
                  key={key}
                  onClick={() => setAspect(key)}
                  className={`px-2.5 py-1 rounded text-[11px] transition shrink-0 inline-block ${aspect === key ? "bg-[#FF5A36] text-[#160702] font-semibold" : "bg-[#1B1F26] border border-[#262B33]"}`}
                >
                  {key === "1080x1920"
                    ? "9:16 Shorts"
                    : key === "1080x1080"
                      ? "1:1 Square"
                      : key === "1920x1080"
                        ? "16:9 Landscape"
                        : "4:5 Portrait"}
                </button>
              ))}
              <button
                onClick={() => {
                  setAspect("1080x1920");
                  fillFrame();
                }}
                className="px-2.5 py-1 rounded text-[11px] font-bold bg-[#FF5A36] text-[#160702] hover:bg-[#ff7452] transition shrink-0 inline-block shadow-sm"
                title="Set aspect ratio 1080x1920 and expand image to 100% full screen for WhatsApp Status"
              >
                📱 WhatsApp Status Full-Screen (1080x1920)
              </button>
              <div className="w-px h-4 mx-0.5 bg-[#262B33] shrink-0 inline-block" />
              <button onClick={() => setShowGrid(!showGrid)} className={`px-2.5 py-1 rounded text-[11px] shrink-0 inline-block ${showGrid ? "bg-[#FF5A36] text-[#160702] font-semibold" : "bg-[#1B1F26] border border-[#262B33]"}`}>Grid</button>
              <button onClick={() => setShowSafeZone(!showSafeZone)} className={`px-2.5 py-1 rounded text-[11px] shrink-0 inline-block ${showSafeZone ? "bg-[#FF5A36] text-[#160702] font-semibold" : "bg-[#1B1F26] border border-[#262B33]"}`}>Safe zone</button>
              <button onClick={() => setShowShortsUi(!showShortsUi)} className={`px-2.5 py-1 rounded text-[11px] shrink-0 inline-block ${showShortsUi ? "bg-[#FF5A36] text-[#160702] font-semibold" : "bg-[#1B1F26] border border-[#262B33]"}`}>Shorts UI preview</button>
              <button onClick={() => setSnap(!snap)} className={`px-2.5 py-1 rounded text-[11px] shrink-0 inline-block ${snap ? "bg-[#FF5A36] text-[#160702] font-semibold" : "bg-[#1B1F26] border border-[#262B33]"}`}>Snap</button>
              <button
                onClick={() => {
                  const [w] = ASPECTS[aspect];
                  setVGuides((prev) => [...prev, w / 2]);
                  showToast("Added vertical guide line");
                }}
                className="px-2.5 py-1 rounded text-[11px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] shrink-0 inline-block"
              >
                + V guide
              </button>
              <button
                onClick={() => {
                  const [, h] = ASPECTS[aspect];
                  setHGuides((prev) => [...prev, h / 2]);
                  showToast("Added horizontal guide line");
                }}
                className="px-2.5 py-1 rounded text-[11px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] shrink-0 inline-block"
              >
                + H guide
              </button>
              <button
                onClick={() => {
                  setVGuides([]);
                  setHGuides([]);
                  showToast("Cleared alignment guides");
                }}
                className="px-2.5 py-1 rounded text-[11px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] shrink-0 inline-block"
              >
                Clear guides
              </button>
              <button onClick={() => setDraftMode(!draftMode)} className={`px-2.5 py-1 rounded text-[11px] shrink-0 inline-block ${draftMode ? "bg-[#FF5A36] text-[#160702] font-semibold" : "bg-[#1B1F26] border border-[#262B33]"}`}>Draft preview</button>
              <div className="w-px h-4 mx-0.5 bg-[#262B33] shrink-0 inline-block" />
              <button onClick={() => setZoom((z) => Math.max(25, z - 10))} className="w-7 h-7 rounded bg-[#1B1F26] border border-[#262B33] text-[13px] shrink-0 inline-block">−</button>
              <span className="font-mono text-[11px] w-10 text-center text-[#8B93A1] shrink-0 inline-block">{zoom}%</span>
              <button onClick={() => setZoom((z) => Math.min(200, z + 10))} className="w-7 h-7 rounded bg-[#1B1F26] border border-[#262B33] text-[13px] shrink-0 inline-block">+</button>
              <button onClick={() => setZoom(100)} className="px-2.5 h-7 rounded bg-[#1B1F26] border border-[#262B33] text-[11px] shrink-0 inline-block">Fit</button>
            </div>
            <button
              onClick={() => stageToolbarRef.current?.scrollBy({ left: 160, behavior: "smooth" })}
              className="w-6 h-7 rounded-r bg-[#1B1F26] border border-[#262B33] text-[#8B93A1] hover:text-white flex items-center justify-center text-[10px] shrink-0 z-10 hover:bg-[#262B33]"
              title="Scroll right"
            >
              ▶
            </button>
          </div>

          {/* HTML5 Canvas Stage Container - Responsive scale */}
          <div className="relative flex-1 flex items-center justify-center min-h-[300px] sm:min-h-[400px] w-full zoom-wrap-outer py-2 overflow-hidden">
            <div
              className="relative max-h-full transition-transform duration-150"
              style={{
                aspectRatio: aspect.replace("x", "/"),
                height: "100%",
                maxWidth: "100%",
                transform: `scale(${zoom / 100})`,
                transformOrigin: "center center",
              }}
            >
              <canvas
                ref={canvasRef}
                width={ASPECTS[aspect][0]}
                height={ASPECTS[aspect][1]}
                onMouseDown={handleCanvasMouseDown}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleCanvasDrop}
                className="block h-full w-auto max-h-full rounded-sm border border-[#262B33] mx-auto object-contain cursor-move"
                style={{ boxShadow: "0 0 0 1px #262B33, 0 20px 60px rgba(0,0,0,.6)" }}
              />
            </div>
          </div>

          <div className="w-full max-w-3xl mt-3 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentTime(0)}
                className="w-8 h-8 rounded-md text-[12px] bg-[#FF5A36] text-[#160702] flex items-center justify-center font-bold"
              >
                ⟲
              </button>
              <span className="font-mono text-[11px] text-[#8B93A1]">0:00</span>
              <input
                type="range"
                min="0"
                max={totalDuration}
                step="0.01"
                value={currentTime}
                onChange={(e) => setCurrentTime(parseFloat(e.target.value))}
                className="flex-1 accent-[#FF5A36]"
              />
              <span className="font-mono text-[11px] text-[#8B93A1]">{formatTimeMs(totalDuration)}</span>
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-wider text-[#8B93A1] font-bold">Layers</div>
            <div className="w-full h-3 rounded-full bg-[#FF5A36] mt-1" />

            {/* Interactive Audio Tracks Timeline Scrubber with Swipe & Edge Drag Cut */}
            {audioTracks.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex items-center justify-between text-[9.5px] uppercase tracking-wider text-[#8B93A1] font-bold mb-1">
                  <span>AUDIO TRACKS — SWIPE / DRAG TO MOVE OR CUT EDGES</span>
                  <button
                    onClick={() => splitAudioTrack()}
                    className="px-2 py-0.5 rounded text-[9.5px] bg-[#FF5A36] text-[#160702] font-bold hover:bg-[#ff7452] transition"
                  >
                    ✂️ Cut Track at Playhead ({formatTimeMs(currentTime)})
                  </button>
                </div>
                {audioTracks.map((t) => {
                  const trackAudioEl = audioElementsRef.current.get(t.id);
                  const maxSongDur = (trackAudioEl && trackAudioEl.duration && isFinite(trackAudioEl.duration) && trackAudioEl.duration > 0)
                    ? trackAudioEl.duration
                    : Math.max(35, t.trimEnd || 35);
                  const trimStart = t.trimStart || 0;
                  const trimEnd = t.trimEnd || maxSongDur;
                  const clipLen = Math.max(0.1, trimEnd - trimStart);

                  const leftPct = Math.min(95, Math.max(0, (trimStart / maxSongDur) * 100));
                  const rawWidthPct = (clipLen / maxSongDur) * 100;
                  const widthPct = Math.min(100 - leftPct, Math.max(5, rawWidthPct));

                  const handleDragTrack = (e: React.MouseEvent | React.TouchEvent, action: "move" | "trimStart" | "trimEnd") => {
                    e.stopPropagation();
                    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
                    const containerEl = (e.currentTarget.closest(".audio-scrubber-row") || e.currentTarget) as HTMLElement;
                    const containerWidth = containerEl.getBoundingClientRect().width || 600;

                    const origTrimStart = t.trimStart || 0;
                    const origTrimEnd = t.trimEnd || maxSongDur;
                    const origClipLen = origTrimEnd - origTrimStart;

                    const handleMove = (moveEvt: MouseEvent | TouchEvent) => {
                      if ("touches" in moveEvt) {
                        try { moveEvt.preventDefault(); } catch (err) { }
                      }
                      const currentX = "touches" in moveEvt ? (moveEvt as TouchEvent).touches[0].clientX : (moveEvt as MouseEvent).clientX;
                      const dt = ((currentX - clientX) / containerWidth) * maxSongDur;

                      if (action === "move") {
                        const newTrimStart = Math.max(0, Math.min(maxSongDur - origClipLen, origTrimStart + dt));
                        const newTrimEnd = Math.min(maxSongDur, newTrimStart + origClipLen);
                        setAudioTracks((prev) => {
                          const updated = prev.map((item) =>
                            item.id === t.id ? { ...item, trimStart: +newTrimStart.toFixed(2), trimEnd: +newTrimEnd.toFixed(2) } : item
                          );
                          syncTotalDurationWithAudio(updated);
                          return updated;
                        });
                      } else if (action === "trimStart") {
                        const newTrimStart = Math.max(0, Math.min(origTrimEnd - 0.2, origTrimStart + dt));
                        setAudioTracks((prev) => {
                          const updated = prev.map((item) =>
                            item.id === t.id ? { ...item, trimStart: +newTrimStart.toFixed(2) } : item
                          );
                          syncTotalDurationWithAudio(updated);
                          return updated;
                        });
                        const el = audioElementsRef.current.get(t.id);
                        if (el) {
                          try { el.currentTime = newTrimStart; } catch (err) { }
                        }
                      } else if (action === "trimEnd") {
                        const newTrimEnd = Math.max(origTrimStart + 0.2, Math.min(maxSongDur, origTrimEnd + dt));
                        setAudioTracks((prev) => {
                          const updated = prev.map((item) =>
                            item.id === t.id ? { ...item, trimEnd: +newTrimEnd.toFixed(2) } : item
                          );
                          syncTotalDurationWithAudio(updated);
                          return updated;
                        });
                        const el = audioElementsRef.current.get(t.id);
                        if (el) {
                          try { el.currentTime = newTrimEnd; } catch (err) { }
                        }
                      }
                    };

                    const handleEnd = () => {
                      window.removeEventListener("mousemove", handleMove);
                      window.removeEventListener("mouseup", handleEnd);
                      window.removeEventListener("touchmove", handleMove);
                      window.removeEventListener("touchend", handleEnd);
                      setAudioTracks((latest) => {
                        syncTotalDurationWithAudio(latest);
                        return latest;
                      });
                    };

                    window.addEventListener("mousemove", handleMove);
                    window.addEventListener("mouseup", handleEnd);
                    window.addEventListener("touchmove", handleMove, { passive: false });
                    window.addEventListener("touchend", handleEnd);
                  };

                  return (
                    <div key={t.id} className="audio-scrubber-row relative h-10 w-full rounded-lg bg-[#11141A] border border-[#262B33] select-none p-1 overflow-hidden shadow-inner">
                      {/* Full song track background hint */}
                      <div className="absolute inset-0 flex items-center justify-between px-3 text-[9px] text-[#4A5160] font-mono select-none pointer-events-none">
                        <span>0:00</span>
                        <span>FULL SONG ({formatTimeMs(maxSongDur)})</span>
                        <span>{formatTimeMs(maxSongDur)}</span>
                      </div>

                      {/* Active Cut Highlight Selection Box */}
                      <div
                        className={`absolute top-1 bottom-1 rounded-md flex items-center justify-between cursor-grab active:cursor-grabbing shadow-lg border border-[#34d399]/40 ${t.muted ? "bg-gray-600" : "bg-[#22b58f]"}`}
                        style={{
                          left: `${leftPct}%`,
                          width: `${widthPct}%`,
                          minWidth: "44px",
                        }}
                        onMouseDown={(e) => handleDragTrack(e, "move")}
                        onTouchStart={(e) => handleDragTrack(e, "move")}
                      >
                        {/* Left Cut Handle (Cut Start) */}
                        <div
                          className="absolute left-0 top-0 bottom-0 w-5 rounded-l-md bg-[#FF5A36] text-[#160702] hover:bg-[#ff7452] flex items-center justify-center text-[11px] font-black cursor-ew-resize z-20 shadow-md touch-none active:scale-105 transition-transform"
                          title="Swipe/Drag to Cut Start"
                          onMouseDown={(e) => handleDragTrack(e, "trimStart")}
                          onTouchStart={(e) => handleDragTrack(e, "trimStart")}
                        >
                          ◀
                        </div>

                        <div className="flex items-center gap-1.5 px-6 overflow-hidden text-ellipsis whitespace-nowrap">
                          <span className="font-bold text-[11px] text-[#04231b] truncate select-none">
                            🎵 {t.name}
                          </span>
                          <span className="text-[9.5px] text-[#04231b] font-mono font-bold bg-[#34d399]/30 px-1.5 py-0.5 rounded">
                            [Cut: {trimStart.toFixed(1)}s - {trimEnd.toFixed(1)}s] ({formatTimeMs(clipLen)})
                          </span>
                        </div>

                        {/* Right Cut Handle (Cut End) */}
                        <div
                          className="absolute right-0 top-0 bottom-0 w-5 rounded-r-md bg-[#FF5A36] text-[#160702] hover:bg-[#ff7452] flex items-center justify-center text-[11px] font-black cursor-ew-resize z-20 shadow-md touch-none active:scale-105 transition-transform"
                          title="Swipe/Drag to Cut End"
                          onMouseDown={(e) => handleDragTrack(e, "trimEnd")}
                          onTouchStart={(e) => handleDragTrack(e, "trimEnd")}
                        >
                          ▶
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>

        {/* RIGHT PANEL: Inspector */}
        <aside className={`w-full md:w-[300px] lg:w-[340px] shrink-0 border-l border-[#262B33] bg-[#15181D] overflow-y-auto ${mobileTab === "props" ? "block" : "hidden md:block"}`}>
          {/* Section Dropdown Selector */}
          <div className="p-3 bg-[#1B1F26] border-b border-[#262B33] space-y-1">
            <div className="flex items-center justify-between text-[10px] uppercase font-bold text-[#FF5A36] tracking-wider">
              <span>Inspector View Category:</span>
              <span className="text-[#8B93A1]">Dropdown Filter</span>
            </div>
            <select
              value={inspectorSection}
              onChange={(e) => setInspectorSection(e.target.value)}
              className="w-full rounded-md px-2.5 py-1.5 text-[12px] font-semibold bg-[#15181D] border border-[#FF5A36] text-white cursor-pointer"
            >
              <option value="all">📁 Show All Sections</option>
              <option value="text">✍ Text & Typography Editor</option>
              <option value="transform">📐 Transform (X, Y, Scale, Rotation, Opacity)</option>
              <option value="imagetools">🖼 Image Tools (Ken Burns, Pan/Zoom)</option>
              <option value="filters">🎨 Filters (Brightness, Contrast, Saturation, Blur)</option>
              <option value="shadow">✨ Shadow, Border & Blend Modes</option>
              <option value="animation">🎬 Animation & Easing</option>
              <option value="background">🌈 Background Colors & Gradients</option>
              <option value="scene">🍿 Scene Effects & Color Grade</option>
              <option value="audio">🎵 Audio & Music Multi-Track Mix</option>
              <option value="seo">🚀 YouTube Shorts SEO & Publishing</option>
            </select>
          </div>

          {selectedLayerId ? (
            <div className="divide-y divide-[#262B33]">
              <div className="p-4">
                <input
                  type="text"
                  value={selectedLayerName}
                  onChange={(e) => {
                    setSelectedLayerName(e.target.value);
                    updateSelectedLayerProps({ name: e.target.value });
                  }}
                  className="w-full rounded-md px-2.5 py-1.5 text-[13px] font-medium bg-[#1B1F26] border border-[#262B33] text-white"
                  placeholder="Layer name"
                />
                <div className="flex gap-1.5 mt-2">
                  <button
                    onClick={() => {
                      const cur = layers.find((l) => l.id === selectedLayerId);
                      if (cur) updateSelectedLayerProps({ visible: cur.visible === false });
                    }}
                    className="flex-1 py-1.5 rounded-md text-[11px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36]"
                  >
                    Hide
                  </button>
                  <button
                    onClick={() => {
                      const cur = layers.find((l) => l.id === selectedLayerId);
                      if (!cur) return;
                      const [cw, ch] = ASPECTS[aspect];
                      const dup = {
                        ...cur,
                        id: "layer_" + Date.now() + "_" + Math.random(),
                        name: (cur.name || "Layer") + " (Copy)",
                        x: Math.min(cw - 50, (cur.x || cw / 2) + 30),
                        y: Math.min(ch - 50, (cur.y || ch / 2) + 30),
                      };
                      pushHistory(layers);
                      setLayers((prev) => [...prev, dup]);
                      setSelectedLayerId(dup.id);
                    }}
                    className="flex-1 py-1.5 rounded-md text-[11px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36]"
                  >
                    Duplicate
                  </button>
                </div>
              </div>

              {/* Dedicated Text & Typography Section */}
              {(layers.find((l) => l.id === selectedLayerId)?.type === "text" ||
                layers.find((l) => l.id === selectedLayerId)?.type === "caption") &&
                (inspectorSection === "all" || inspectorSection === "text") && (
                  <details className="p-4 border-b border-[#262B33]" open>
                    <summary className="flex items-center justify-between section-title cursor-pointer font-semibold text-[13px]">
                      <span>Text & Typography</span>
                      <span className="text-[11px] text-[#8B93A1]">▼</span>
                    </summary>
                    <div className="space-y-3 mt-3">
                      <div>
                        <div className="text-[11px] text-[#8B93A1] mb-1">Text content</div>
                        <textarea
                          rows={2}
                          value={selectedLayerText}
                          onChange={(e) => {
                            setSelectedLayerText(e.target.value);
                            updateSelectedLayerProps({ text: e.target.value });
                          }}
                          className="w-full rounded-md px-2.5 py-1.5 text-[13px] bg-[#1B1F26] border border-[#262B33] text-white"
                        />
                      </div>
                      <div>
                        <div className="text-[11px] text-[#8B93A1] mb-1">Font family</div>
                        <select
                          value={selectedLayerFont}
                          onChange={(e) => {
                            setSelectedLayerFont(e.target.value);
                            updateSelectedLayerProps({ font: e.target.value });
                          }}
                          className="w-full rounded-md px-2.5 py-1.5 text-[13px] bg-[#1B1F26] border border-[#262B33] text-white"
                        >
                          {FONTS.map((f) => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[11px] text-[#8B93A1] mb-1">Font size</div>
                          <input
                            type="number"
                            value={selectedLayerFontSize}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 20;
                              setSelectedLayerFontSize(val);
                              updateSelectedLayerProps({ fontSize: val });
                            }}
                            className="w-full rounded-md px-2 py-1.5 text-[12px] bg-[#1B1F26] border border-[#262B33] text-white font-mono"
                          />
                        </div>
                        <div>
                          <div className="text-[11px] text-[#8B93A1] mb-1">Text color</div>
                          <input
                            type="color"
                            value={selectedLayerColor}
                            onChange={(e) => {
                              setSelectedLayerColor(e.target.value);
                              updateSelectedLayerProps({ color: e.target.value });
                            }}
                            className="w-full h-8 rounded-md bg-[#1B1F26] border border-[#262B33]"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedLayerBold(!selectedLayerBold);
                            updateSelectedLayerProps({ bold: !selectedLayerBold });
                          }}
                          className={`flex-1 py-1.5 rounded-md text-[11px] font-bold border ${selectedLayerBold ? "bg-[#FF5A36] text-[#160702] border-[#FF5A36]" : "bg-[#1B1F26] border-[#262B33]"}`}
                        >
                          B Bold
                        </button>
                        <button
                          onClick={() => {
                            setSelectedLayerItalic(!selectedLayerItalic);
                            updateSelectedLayerProps({ italic: !selectedLayerItalic });
                          }}
                          className={`flex-1 py-1.5 rounded-md text-[11px] italic border ${selectedLayerItalic ? "bg-[#FF5A36] text-[#160702] border-[#FF5A36]" : "bg-[#1B1F26] border-[#262B33]"}`}
                        >
                          I Italic
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[11px] text-[#8B93A1] mb-1">Stroke outline color</div>
                          <input
                            type="color"
                            value={selectedLayerStrokeColor}
                            onChange={(e) => {
                              setSelectedLayerStrokeColor(e.target.value);
                              updateSelectedLayerProps({ strokeColor: e.target.value });
                            }}
                            className="w-full h-8 rounded-md bg-[#1B1F26] border border-[#262B33]"
                          />
                        </div>
                        <div>
                          <div className="text-[11px] text-[#8B93A1] mb-1">Stroke width</div>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value={selectedLayerStrokeWidth}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setSelectedLayerStrokeWidth(val);
                              updateSelectedLayerProps({ strokeWidth: val });
                            }}
                            className="w-full rounded-md px-2 py-1.5 text-[12px] bg-[#1B1F26] border border-[#262B33] text-white font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </details>
                )}

              {/* Transform Section */}
              {(inspectorSection === "all" || inspectorSection === "transform") && (
                <details className="p-4 border-b border-[#262B33]" open>
                  <summary className="flex items-center justify-between section-title cursor-pointer font-semibold text-[13px]">
                    <span>Transform</span>
                    <span className="text-[11px] text-[#8B93A1]">▼</span>
                  </summary>
                  <div className="space-y-3 mt-3">
                    <div>
                      <div className="flex justify-between text-[11px] text-[#8B93A1] mb-1">
                        <span>X Position</span>
                        <span className="font-mono text-white">{selectedLayerX}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1080"
                        value={selectedLayerX}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setSelectedLayerX(val);
                          updateSelectedLayerProps({ x: val });
                        }}
                        className="w-full accent-[#FF5A36]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-[#8B93A1] mb-1">
                        <span>Y Position</span>
                        <span className="font-mono text-white">{selectedLayerY}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1920"
                        value={selectedLayerY}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setSelectedLayerY(val);
                          updateSelectedLayerProps({ y: val });
                        }}
                        className="w-full accent-[#FF5A36]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-[#8B93A1] mb-1">
                        <span>Scale</span>
                        <span className="font-mono text-white">{selectedLayerScale.toFixed(2)}x</span>
                      </div>
                      <input
                        type="range"
                        min="0.05"
                        max="4"
                        step="0.01"
                        value={selectedLayerScale}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setSelectedLayerScale(val);
                          updateSelectedLayerProps({ scale: val });
                        }}
                        className="w-full accent-[#FF5A36]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-[#8B93A1] mb-1">
                        <span>Rotation</span>
                        <span className="font-mono text-white">{selectedLayerRotation}°</span>
                      </div>
                      <input
                        type="range"
                        min="-180"
                        max="180"
                        value={selectedLayerRotation}
                        onChange={(e) => {
                          const val = parseInt(e.target.value);
                          setSelectedLayerRotation(val);
                          updateSelectedLayerProps({ rotation: val });
                        }}
                        className="w-full accent-[#FF5A36]"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-[#8B93A1] mb-1">
                        <span>Opacity</span>
                        <span className="font-mono text-white">{Math.round(selectedLayerOpacity * 100)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={selectedLayerOpacity}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          setSelectedLayerOpacity(val);
                          updateSelectedLayerProps({ opacity: val });
                        }}
                        className="w-full accent-[#FF5A36]"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-1.5">
                      <button
                        onClick={() => {
                          const [cw] = ASPECTS[aspect];
                          const cx = Math.round(cw / 2);
                          setSelectedLayerX(cx);
                          updateSelectedLayerProps({ x: cx });
                        }}
                        className="py-1.5 rounded-md text-[10.5px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36]"
                      >
                        Center X
                      </button>
                      <button
                        onClick={() => {
                          const [, ch] = ASPECTS[aspect];
                          const cy = Math.round(ch / 2);
                          setSelectedLayerY(cy);
                          updateSelectedLayerProps({ y: cy });
                        }}
                        className="py-1.5 rounded-md text-[10.5px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36]"
                      >
                        Center Y
                      </button>
                      <button
                        onClick={() => {
                          const [cw, ch] = ASPECTS[aspect];
                          const cx = Math.round(cw / 2);
                          const cy = Math.round(ch / 2);
                          setSelectedLayerScale(1.0);
                          setSelectedLayerX(cx);
                          setSelectedLayerY(cy);
                          updateSelectedLayerProps({ scale: 1.0, x: cx, y: cy });
                        }}
                        className="py-1.5 rounded-md text-[10.5px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36]"
                      >
                        Fit canvas
                      </button>
                    </div>
                  </div>
                </details>
              )}

              {/* Image tools Section */}
              {(inspectorSection === "all" || inspectorSection === "imagetools") && (
                <details className="p-4 border-b border-[#262B33]" open>
                  <summary className="flex items-center justify-between section-title cursor-pointer font-semibold text-[13px]">
                    <span>Image tools</span>
                    <span className="text-[11px] text-[#8B93A1]">▼</span>
                  </summary>
                  <div className="space-y-3 mt-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button onClick={fillFrame} className="py-1.5 rounded-md text-[11.5px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36]">Fill frame</button>
                      <button onClick={fitFrame} className="py-1.5 rounded-md text-[11.5px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36]">Fit frame</button>
                    </div>
                    <label className="flex items-center gap-2 text-[12px]">
                      <input type="checkbox" checked={kenBurnsOn} onChange={(e) => setKenBurnsOn(e.target.checked)} />
                      Ken Burns auto pan/zoom
                    </label>
                    <select value={kenBurnsDir} onChange={(e) => setKenBurnsDir(e.target.value)} className="w-full rounded-md px-2.5 py-1.5 text-[13px] bg-[#1B1F26] border border-[#262B33] text-white">
                      <option value="inTL">Zoom in · top-left</option>
                      <option value="inBR">Zoom in · bottom-right</option>
                      <option value="inCenter">Zoom in · center</option>
                      <option value="out">Zoom out · center</option>
                    </select>
                    <button onClick={extractColorPalette} className="w-full py-1.5 rounded-md text-[11.5px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36]">
                      Extract color palette from image
                    </button>
                  </div>
                </details>
              )}

              {/* Filters Section */}
              {(inspectorSection === "all" || inspectorSection === "filters") && (
                <details className="p-4 border-b border-[#262B33]" open>
                  <summary className="flex items-center justify-between section-title cursor-pointer font-semibold text-[13px]">
                    <span>Filters</span>
                    <span className="text-[11px] text-[#8B93A1]">▼</span>
                  </summary>
                  <div className="space-y-3 mt-3">
                    <div>
                      <div className="flex justify-between text-[11px] text-[#8B93A1] mb-1">
                        <span>Brightness</span>
                        <span className="font-mono text-white">{filterBrightness}%</span>
                      </div>
                      <input type="range" min="0" max="200" value={filterBrightness} onChange={(e) => setFilterBrightness(parseInt(e.target.value))} className="w-full accent-[#FF5A36]" />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-[#8B93A1] mb-1">
                        <span>Contrast</span>
                        <span className="font-mono text-white">{filterContrast}%</span>
                      </div>
                      <input type="range" min="0" max="200" value={filterContrast} onChange={(e) => setFilterContrast(parseInt(e.target.value))} className="w-full accent-[#FF5A36]" />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-[#8B93A1] mb-1">
                        <span>Saturation</span>
                        <span className="font-mono text-white">{filterSaturation}%</span>
                      </div>
                      <input type="range" min="0" max="200" value={filterSaturation} onChange={(e) => setFilterSaturation(parseInt(e.target.value))} className="w-full accent-[#FF5A36]" />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-[#8B93A1] mb-1">
                        <span>Blur</span>
                        <span className="font-mono text-white">{filterBlur}px</span>
                      </div>
                      <input type="range" min="0" max="40" value={filterBlur} onChange={(e) => setFilterBlur(parseInt(e.target.value))} className="w-full accent-[#FF5A36]" />
                    </div>
                  </div>
                </details>
              )}

              {/* Shadow, border & blend Section */}
              {(inspectorSection === "all" || inspectorSection === "shadow") && (
                <details className="p-4 border-b border-[#262B33]" open>
                  <summary className="flex items-center justify-between section-title cursor-pointer font-semibold text-[13px]">
                    <span>Shadow, border & blend</span>
                    <span className="text-[11px] text-[#8B93A1]">▼</span>
                  </summary>
                  <div className="space-y-3 mt-3">
                    <label className="flex items-center gap-2 text-[12px]">
                      <input type="checkbox" checked={dropShadowOn} onChange={(e) => setDropShadowOn(e.target.checked)} />
                      Drop shadow
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="color" value={shadowColor} onChange={(e) => setShadowColor(e.target.value)} className="w-full h-8 rounded-md bg-[#1B1F26] border border-[#262B33]" />
                      <input type="number" value={shadowBlur} onChange={(e) => setShadowBlur(parseInt(e.target.value))} className="w-full rounded-md px-2 py-1.5 text-[12px] font-mono bg-[#1B1F26] border border-[#262B33] text-white" />
                    </div>

                    <label className="flex items-center gap-2 text-[12px] pt-1">
                      <input type="checkbox" checked={borderOn} onChange={(e) => setBorderOn(e.target.checked)} />
                      Border
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="color" value={borderColor} onChange={(e) => setBorderColor(e.target.value)} className="w-full h-8 rounded-md bg-[#1B1F26] border border-[#262B33]" />
                      <input type="number" value={borderWidth} onChange={(e) => setBorderWidth(parseInt(e.target.value))} className="w-full rounded-md px-2 py-1.5 text-[12px] font-mono bg-[#1B1F26] border border-[#262B33] text-white" />
                    </div>

                    <div className="text-[11px] text-[#8B93A1] pt-1">Image corner radius</div>
                    <input type="range" min="0" max="200" value={imgRadius} onChange={(e) => setImgRadius(parseInt(e.target.value))} className="w-full accent-[#FF5A36]" />

                    <div className="text-[11px] text-[#8B93A1] pt-1">Blend mode</div>
                    <select value={blendMode} onChange={(e) => setBlendMode(e.target.value)} className="w-full rounded-md px-2.5 py-1.5 text-[13px] bg-[#1B1F26] border border-[#262B33] text-white">
                      {BLEND_MODES.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                </details>
              )}

              {/* Animation Section */}
              {(inspectorSection === "all" || inspectorSection === "animation") && (
                <details className="p-4 border-b border-[#262B33]" open>
                  <summary className="flex items-center justify-between section-title cursor-pointer font-semibold text-[13px]">
                    <span>Animation</span>
                    <span className="text-[11px] text-[#8B93A1]">▼</span>
                  </summary>
                  <div className="space-y-3 mt-3">
                    <select
                      value={selectedLayerAnim}
                      onChange={(e) => {
                        const val = e.target.value;
                        setSelectedLayerAnim(val);
                        updateSelectedLayerProps({ anim: val });
                      }}
                      className="w-full rounded-md px-2.5 py-2 text-[13px] bg-[#1B1F26] border border-[#262B33] text-white font-medium cursor-pointer"
                    >
                      {ANIMATIONS.map((anim) => (
                        <option key={anim.id} value={anim.id}>
                          {anim.label}
                        </option>
                      ))}
                    </select>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="text-[11px] text-[#8B93A1] mb-1">Start (s)</div>
                        <input
                          type="number"
                          min="0"
                          step="0.1"
                          value={selectedLayerStart}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setSelectedLayerStart(val);
                            updateSelectedLayerProps({ start: val });
                          }}
                          className="w-full rounded-md px-2 py-1.5 text-[13px] font-mono bg-[#1B1F26] border border-[#262B33] text-white"
                        />
                      </div>
                      <div>
                        <div className="text-[11px] text-[#8B93A1] mb-1">Duration (s)</div>
                        <input
                          type="number"
                          min="0.2"
                          step="0.1"
                          value={selectedLayerDuration}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value);
                            setSelectedLayerDuration(val);
                            updateSelectedLayerProps({ duration: val });
                          }}
                          className="w-full rounded-md px-2 py-1.5 text-[13px] font-mono bg-[#1B1F26] border border-[#262B33] text-white"
                        />
                      </div>
                    </div>
                  </div>
                </details>
              )}

              <div className="p-4 space-y-2 border-t border-[#262B33]">
                {layers.find((l) => l.id === selectedLayerId)?.type === "image" && (
                  <label className="w-full block text-center py-2 rounded-md text-[12px] font-semibold bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] text-white cursor-pointer">
                    📷 Replace Image File
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file || !selectedLayerId) return;
                        const reader = new FileReader();
                        reader.onload = (evt) => {
                          const img = new Image();
                          img.onload = () => {
                            const [w, h] = ASPECTS[aspect];
                            const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
                            updateSelectedLayerProps({
                              imgEl: img,
                              baseW: img.naturalWidth * scale,
                              baseH: img.naturalHeight * scale,
                            });
                          };
                          img.src = evt.target?.result as string;
                        };
                        reader.readAsDataURL(file);
                      }}
                      className="hidden"
                    />
                  </label>
                )}
                <button
                  onClick={() => {
                    setLayers(layers.filter((l) => l.id !== selectedLayerId));
                    setSelectedLayerId(null);
                    showToast("Deleted layer");
                  }}
                  className="w-full mt-3 py-2.5 rounded-md text-[13px] font-medium bg-[#2A1414] text-[#FF8A75] border border-[#472020] hover:bg-[#3d1c1c]"
                >
                  Delete layer
                </button>
              </div>
            </div>
          ) : (
            <div className="p-4 text-xs text-[#8B93A1] text-center italic">
              Select a layer on the stage or layers list to edit properties.
            </div>
          )}

          {/* Background Section */}
          {(inspectorSection === "all" || inspectorSection === "background") && (
            <details className="p-4 border-t border-[#262B33]" open>
              <summary className="flex items-center justify-between section-title cursor-pointer font-semibold text-[13px]">
                <span>Background</span>
                <span className="text-[11px] text-[#8B93A1]">▼</span>
              </summary>
              <div className="space-y-3 mt-3">
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => setBgType("solid")}
                    className={`py-1.5 rounded text-[11px] ${bgType === "solid" ? "bg-[#FF5A36] text-[#160702] font-semibold" : "bg-[#1B1F26] border border-[#262B33]"}`}
                  >
                    Solid
                  </button>
                  <button
                    onClick={() => setBgType("linear")}
                    className={`py-1.5 rounded text-[11px] ${bgType === "linear" ? "bg-[#FF5A36] text-[#160702] font-semibold" : "bg-[#1B1F26] border border-[#262B33]"}`}
                  >
                    Linear
                  </button>
                  <button
                    onClick={() => setBgType("radial")}
                    className={`py-1.5 rounded text-[11px] ${bgType === "radial" ? "bg-[#FF5A36] text-[#160702] font-semibold" : "bg-[#1B1F26] border border-[#262B33]"}`}
                  >
                    Radial
                  </button>
                </div>
                <input
                  type="color"
                  value={bgColor1}
                  onChange={(e) => setBgColor1(e.target.value)}
                  className="w-full h-8 rounded-md bg-[#1B1F26] border border-[#262B33] cursor-pointer"
                />
                <div className="text-[11px] text-[#8B93A1] pt-1">Quick themes</div>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_THEMES.map((theme) => (
                    <button
                      key={theme}
                      onClick={() => setBgColor1(theme)}
                      className="w-6 h-6 rounded-md border border-white/20"
                      style={{ backgroundColor: theme }}
                    />
                  ))}
                </div>
              </div>
            </details>
          )}

          {/* Scene effects Section */}
          {(inspectorSection === "all" || inspectorSection === "scene") && (
            <details className="p-4 border-t border-[#262B33]" open>
              <summary className="flex items-center justify-between section-title cursor-pointer font-semibold text-[13px]">
                <span>Scene effects</span>
                <span className="text-[11px] text-[#8B93A1]">▼</span>
              </summary>
              <div className="space-y-3 mt-3">
                <div className="flex gap-1.5 flex-wrap">
                  <button
                    onClick={() => setVignette(!vignette)}
                    className={`px-2.5 py-1.5 rounded-md text-[11.5px] bg-[#1B1F26] border border-[#262B33] ${vignette ? "text-[#FF5A36] border-[#FF5A36] font-semibold" : ""}`}
                  >
                    Vignette
                  </button>
                  <button
                    onClick={() => setWatermark(!watermark)}
                    className={`px-2.5 py-1.5 rounded-md text-[11.5px] bg-[#1B1F26] border border-[#262B33] ${watermark ? "text-[#FF5A36] border-[#FF5A36] font-semibold" : ""}`}
                  >
                    Watermark
                  </button>
                  <button
                    onClick={() => setProgressBar(!progressBar)}
                    className={`px-2.5 py-1.5 rounded-md text-[11.5px] bg-[#1B1F26] border border-[#262B33] ${progressBar ? "text-[#FF5A36] border-[#FF5A36] font-semibold" : ""}`}
                  >
                    Progress bar
                  </button>
                </div>

                <div className="text-[11px] text-[#8B93A1] pt-1">Color grade</div>
                <select
                  value={colorGrade}
                  onChange={(e) => setColorGrade(e.target.value)}
                  className="w-full rounded-md px-2.5 py-1.5 text-[13px] bg-[#1B1F26] border border-[#262B33] text-white"
                >
                  {COLOR_GRADES.map((cg) => (
                    <option key={cg} value={cg}>{cg}</option>
                  ))}
                </select>
              </div>
            </details>
          )}

          {/* Audio & music Multi-Track Mix Section */}
          {(inspectorSection === "all" || inspectorSection === "audio") && (
            <details className="p-4 border-t border-[#262B33]" open>
              <summary className="flex items-center justify-between section-title cursor-pointer font-semibold text-[13px]">
                <span>Audio & music (multi-track mix)</span>
                <span className="text-[11px] text-[#8B93A1]">▼</span>
              </summary>
              <div className="space-y-3 mt-3">
                <div className="p-3 rounded-md bg-[#1B1F26] border border-[#FF5A36]/40 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-[#FF5A36]">
                    <span>⏱ Project Video Timeline Duration:</span>
                    <span className="font-mono text-white">{formatTimeMs(totalDuration)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      value={totalDuration}
                      onChange={(e) => updateTotalDuration(parseFloat(e.target.value) || 10)}
                      className="flex-1 rounded px-2.5 py-1.5 text-[12px] bg-[#15181D] border border-[#262B33] text-white font-mono"
                      placeholder="Duration in seconds"
                    />
                    <span className="text-[11px] text-[#8B93A1]">seconds</span>
                  </div>
                </div>

                <label className="w-full block text-center py-2 rounded-md text-[12.5px] font-semibold bg-[#FF5A36] text-[#160702] cursor-pointer hover:bg-[#ff7452] transition">
                  + Add music / song track(s)
                  <input type="file" accept="audio/*" multiple onChange={handleAudioUpload} className="hidden" />
                </label>
                <button
                  onClick={mergeAudioTracks}
                  className="w-full py-2 rounded-md text-[12.5px] font-medium bg-[#7A2E1D] hover:bg-[#8f3622] transition text-white"
                >
                  Merge tracks — place back-to-back
                </button>
                {audioTracks.length === 0 ? (
                  <div className="text-[11px] text-[#8B93A1]">No tracks loaded yet.</div>
                ) : (
                  audioTracks.map((t) => (
                    <div key={t.id} className="p-3 rounded-md bg-[#1B1F26] border border-[#262B33] space-y-2.5 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-white truncate max-w-[170px]">🎵 {t.name}</span>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => splitAudioTrack(t.id)}
                            className="px-2 py-1 rounded text-[10px] bg-[#FF5A36] text-[#160702] font-bold hover:bg-[#ff7452] transition"
                            title="Split track into 2 clips at playhead"
                          >
                            ✂️ Cut
                          </button>
                          <button
                            onClick={() => {
                              const updated = audioTracks.filter((item) => item.id !== t.id);
                              setAudioTracks(updated);
                              syncTotalDurationWithAudio(updated);
                            }}
                            className="text-[#8B93A1] hover:text-white"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          const targetDur = Math.ceil((t.trimEnd || 300) - (t.trimStart || 0));
                          updateTotalDuration(targetDur);
                          showToast(`Set project timeline to ${formatTimeMs(targetDur)}`);
                        }}
                        className="w-full py-1.5 rounded text-[10.5px] font-bold bg-[#1B1F26] border border-[#38BDF8] text-[#38BDF8] hover:bg-[#262B33] transition flex items-center justify-center gap-1"
                      >
                        ⚡ Fit project duration to song clip ({formatTimeMs(Math.max(0.1, (t.trimEnd || 300) - (t.trimStart || 0)))})
                      </button>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="text-[10.5px] text-[#8B93A1] mb-1">Cut In (Start s)</div>
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={t.trimStart || 0}
                            onChange={(e) => {
                              const val = Math.max(0, parseFloat(e.target.value) || 0);
                              const currentTrimEnd = t.trimEnd || 300;
                              const newTrimStart = Math.min(currentTrimEnd - 0.1, val);
                              const updated = audioTracks.map((item) =>
                                item.id === t.id ? { ...item, trimStart: +newTrimStart.toFixed(2) } : item
                              );
                              setAudioTracks(updated);
                              syncTotalDurationWithAudio(updated);
                              const el = audioElementsRef.current.get(t.id);
                              if (el) { try { el.currentTime = newTrimStart; } catch (err) { } }
                            }}
                            className="w-full rounded px-2 py-1 text-[12px] bg-[#15181D] border border-[#262B33] text-white font-mono"
                          />
                        </div>
                        <div>
                          <div className="text-[10.5px] text-[#8B93A1] mb-1">Cut Out (End s)</div>
                          <input
                            type="number"
                            step="0.1"
                            min="0.1"
                            value={t.trimEnd || 300}
                            onChange={(e) => {
                              const val = Math.max(0.1, parseFloat(e.target.value) || 300);
                              const updated = audioTracks.map((item) => item.id === t.id ? { ...item, trimEnd: val } : item);
                              setAudioTracks(updated);
                              syncTotalDurationWithAudio(updated);
                              const el = audioElementsRef.current.get(t.id);
                              if (el) { try { el.currentTime = val; } catch (err) { } }
                            }}
                            className="w-full rounded px-2 py-1 text-[12px] bg-[#15181D] border border-[#262B33] text-white font-mono"
                          />
                        </div>
                      </div>
                      {(t.offset || 0) > 0 && (
                        <button
                          onClick={() => {
                            const updated = audioTracks.map((item) => item.id === t.id ? { ...item, offset: 0 } : item);
                            setAudioTracks(updated);
                            syncTotalDurationWithAudio(updated);
                          }}
                          className="w-full py-1 rounded text-[10.5px] font-bold bg-[#7A2E1D] border border-[#FF5A36] text-white hover:bg-[#8f3622] transition flex items-center justify-center gap-1"
                        >
                          ⚡ Fix: Snap audio back to 0.0s (video start)
                        </button>
                      )}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <div className="flex justify-between items-center text-[10.5px] text-[#8B93A1] mb-1">
                            <span>Start at (s)</span>
                          </div>
                          <input
                            type="number"
                            step="0.1"
                            value={t.offset || 0}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              const updated = audioTracks.map((item) => item.id === t.id ? { ...item, offset: val } : item);
                              setAudioTracks(updated);
                              syncTotalDurationWithAudio(updated);
                            }}
                            className="w-full rounded px-2 py-1 text-[12px] bg-[#15181D] border border-[#262B33] text-white font-mono"
                          />
                        </div>
                        <div>
                          <div className="flex justify-between text-[10.5px] text-[#8B93A1] mb-1">
                            <span>Volume</span>
                            <span className="font-mono text-white">{Math.round((t.volume || 1) * 100)}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.05"
                            value={t.volume !== undefined ? t.volume : 1}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value);
                              setAudioTracks(audioTracks.map((item) => item.id === t.id ? { ...item, volume: val } : item));
                            }}
                            className="w-full accent-[#FF5A36]"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-1 border-t border-[#262B33]/60 text-[11px]">
                        <label className="flex items-center gap-1.5 cursor-pointer text-[#8B93A1] hover:text-white">
                          <input
                            type="checkbox"
                            checked={!!t.muted}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setAudioTracks(audioTracks.map((item) => item.id === t.id ? { ...item, muted: checked } : item));
                            }}
                            className="rounded accent-[#FF5A36]"
                          />
                          Mute track
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer text-[#8B93A1] hover:text-white">
                          <input
                            type="checkbox"
                            checked={!!t.loop}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setAudioTracks(audioTracks.map((item) => item.id === t.id ? { ...item, loop: checked } : item));
                            }}
                            className="rounded accent-[#FF5A36]"
                          />
                          Loop clip
                        </label>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </details>
          )}

          {/* Export settings Section */}
          {(inspectorSection === "all" || inspectorSection === "seo") && (
            <details className="p-4 border-t border-[#262B33]" open>
              <summary className="flex items-center justify-between section-title cursor-pointer font-semibold text-[13px]">
                <span>Export settings</span>
                <span className="text-[11px] text-[#8B93A1]">▼</span>
              </summary>
              <div className="space-y-3 mt-3">
                <div>
                  <div className="text-[11px] text-[#8B93A1] mb-1">Total length (s, max 180)</div>
                  <input
                    type="number"
                    min="1"
                    max="180"
                    value={totalDuration}
                    onChange={(e) => updateTotalDuration(parseInt(e.target.value) || 10)}
                    className="w-full rounded-md px-2.5 py-1.5 text-[13px] font-mono bg-[#1B1F26] border border-[#262B33] text-white"
                  />
                  <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                    {[15, 30, 60, 90].map((dur) => (
                      <button
                        key={dur}
                        onClick={() => updateTotalDuration(dur)}
                        className={`py-1 rounded text-[10.5px] border ${totalDuration === dur ? "bg-[#FF5A36] text-[#160702] border-[#FF5A36] font-semibold" : "bg-[#1B1F26] border-[#262B33] text-[#8B93A1]"}`}
                      >
                        {dur}s
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setAspect("1080x1920");
                    updateTotalDuration(15);
                    setExportFps(30);
                    setExportQuality(8000000);
                    showToast("Applied 15s Shorts Ready preset!");
                  }}
                  className="w-full py-2 rounded-md text-[12.5px] font-medium bg-[#1B1F26] border border-[#262B33] text-[#FF5A36] hover:bg-[#262B33]"
                >
                  ⚡ Apply "Shorts Ready" preset
                </button>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[11px] text-[#8B93A1] mb-1">Frame rate</div>
                    <select
                      value={exportFps}
                      onChange={(e) => setExportFps(parseInt(e.target.value))}
                      className="w-full rounded-md px-2.5 py-1.5 text-[13px] bg-[#1B1F26] border border-[#262B33] text-white"
                    >
                      <option value={24}>24 fps</option>
                      <option value={30}>30 fps</option>
                      <option value={60}>60 fps</option>
                    </select>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#8B93A1] mb-1">Quality</div>
                    <select
                      value={exportQuality}
                      onChange={(e) => setExportQuality(parseInt(e.target.value))}
                      className="w-full rounded-md px-2.5 py-1.5 text-[13px] bg-[#1B1F26] border border-[#262B33] text-white"
                    >
                      <option value={4000000}>Low · 4 Mbps</option>
                      <option value={8000000}>Medium · 8 Mbps</option>
                      <option value={16000000}>High · 16 Mbps</option>
                    </select>
                  </div>
                </div>
                <button
                  onClick={exportCurrentFramePNG}
                  className="w-full py-2 rounded-md text-[12.5px] bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36]"
                >
                  Export current frame as PNG
                </button>
              </div>
            </details>
          )}

          {/* Publish to YouTube Shorts Section */}
          {(inspectorSection === "all" || inspectorSection === "seo") && (
            <details className="p-4 border-t border-[#262B33]" open>
              <summary className="flex items-center justify-between section-title cursor-pointer font-semibold text-[13px]">
                <span>Publish to YouTube Shorts</span>
                <span className="text-[11px] text-[#8B93A1]">▼</span>
              </summary>
              <div className="space-y-3 mt-3">
                <div className="space-y-1 text-[11.5px] font-mono">
                  <div className={aspect === "1080x1920" ? "text-[#3DDC97]" : "text-[#FF6B6B]"}>
                    {aspect === "1080x1920" ? "✓ Vertical 9:16 frame" : "✕ Change aspect to 9:16 Shorts"}
                  </div>
                  <div className={totalDuration <= 60 ? "text-[#3DDC97]" : "text-[#FF6B6B]"}>
                    {totalDuration <= 60 ? `✓ Duration ${totalDuration}s (≤60s)` : "✕ Duration must be ≤ 60s"}
                  </div>
                  <div className={ytTitle.length >= 10 ? "text-[#3DDC97]" : "text-[#FF6B6B]"}>
                    {ytTitle.length >= 10 ? "✓ Hooking Title added" : "✕ Add descriptive title"}
                  </div>
                  <div className={ytDescription.includes("#Shorts") ? "text-[#3DDC97]" : "text-[#FF6B6B]"}>
                    {ytDescription.includes("#Shorts") ? "✓ #Shorts tag in description" : "✕ Add #Shorts hashtag to description"}
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-[#8B93A1] mb-1">
                    <span>Title</span>
                    <span className="font-mono">{ytTitle.length}/100</span>
                  </div>
                  <input
                    type="text"
                    maxLength={100}
                    placeholder="A title that hooks in 3 words"
                    value={ytTitle}
                    onChange={(e) => setYtTitle(e.target.value)}
                    className="w-full rounded-md px-2.5 py-1.5 text-[13px] bg-[#1B1F26] border border-[#262B33] text-white"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-[#8B93A1] mb-1">
                    <span>Description</span>
                    <span className="font-mono">{ytDescription.length}/5000</span>
                  </div>
                  <textarea
                    rows={4}
                    maxLength={5000}
                    placeholder="Describe your Short…"
                    value={ytDescription}
                    onChange={(e) => setYtDescription(e.target.value)}
                    className="w-full rounded-md px-2.5 py-1.5 text-[13px] bg-[#1B1F26] border border-[#262B33] text-white"
                  />
                  <button
                    onClick={() => setYtDescription((prev) => prev + " #Shorts")}
                    className="mt-1.5 px-2.5 py-1 rounded text-[11px] bg-[#1B1F26] border border-[#262B33] text-[#E7E9EC]"
                  >
                    + Add #Shorts tag
                  </button>
                </div>

                <button
                  onClick={suggestHashtags}
                  className="w-full py-1.5 rounded-md text-[11.5px] bg-[#1B1F26] border border-[#262B33] text-[#FF5A36] hover:bg-[#262B33]"
                >
                  ✨ Suggest hashtags from title/description
                </button>

                <div className="pt-1">
                  <div className="flex justify-between text-[11px] text-[#8B93A1] mb-1">
                    <span>SEO score</span>
                    <span className="font-mono">{seoScore}/100</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-[#20242C] overflow-hidden">
                    <div className="h-full bg-[#FF5A36] transition-all" style={{ width: `${seoScore}%` }} />
                  </div>
                </div>

                <div className="pt-1 border-t border-[#262B33]">
                  <div className="text-[11px] text-[#8B93A1] mb-1 pt-2">Cover / thumbnail frame</div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => {
                        setCoverFrameTime(currentTime);
                        showToast(`Set cover frame at ${currentTime.toFixed(1)}s`);
                      }}
                      className="py-1.5 rounded-md text-[11px] bg-[#1B1F26] border border-[#262B33]"
                    >
                      Use current frame
                    </button>
                    <button
                      onClick={exportCurrentFramePNG}
                      className="py-1.5 rounded-md text-[11px] bg-[#1B1F26] border border-[#262B33]"
                    >
                      Export thumbnail PNG
                    </button>
                  </div>
                  <div className="text-[10.5px] mt-1 text-[#8B93A1]">Cover frame: {coverFrameTime.toFixed(1)}s</div>
                </div>
              </div>
            </details>
          )}
        </aside>
      </div>

      {/* MOBILE BOTTOM TAB BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex md:hidden shrink-0 border-t border-[#262B33] bg-[#15181D] shadow-lg">
        <button
          onClick={() => setMobileTab("layers")}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 text-[11px] font-medium transition ${mobileTab === "layers" ? "text-[#FF5A36] bg-[#1F242C]" : "text-[#8B93A1]"}`}
        >
          <span className="text-lg leading-none">☰</span>
          <span className="mt-1 font-semibold">Layers</span>
        </button>
        <button
          onClick={() => setMobileTab("stage")}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 text-[11px] font-medium transition ${mobileTab === "stage" ? "text-[#FF5A36] bg-[#1F242C]" : "text-[#8B93A1]"}`}
        >
          <span className="text-lg leading-none">▶</span>
          <span className="mt-1 font-semibold">Stage</span>
        </button>
        <button
          onClick={() => setMobileTab("props")}
          className={`flex-1 flex flex-col items-center justify-center py-2.5 text-[11px] font-medium transition ${mobileTab === "props" ? "text-[#FF5A36] bg-[#1F242C]" : "text-[#8B93A1]"}`}
        >
          <span className="text-lg leading-none">⚙</span>
          <span className="mt-1 font-semibold">Edit</span>
        </button>
      </nav>

      {/* EXPORT VIDEO MODAL PROGRESS DIALOG */}
      {isExporting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-[#15181D] border border-[#262B33] rounded-lg p-6 w-[380px] text-xs">
            <h3 className="font-bold text-sm text-white mb-1">Rendering your Short</h3>
            <p className="text-[12px] text-[#8B93A1] mb-4">
              Recording canvas in real time — keep this tab active.
            </p>
            <div className="w-full h-2 rounded-full overflow-hidden bg-[#262B33]">
              <div
                className="h-full bg-[#FF5A36] transition-all duration-100"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
            <div className="flex justify-between mt-2 font-mono text-[11px] text-[#8B93A1]">
              <span>{exportProgress}%</span>
              <span>{exportFormat}</span>
            </div>
          </div>
        </div>
      )}

      {/* TEMPLATES PRESET MODAL */}
      {showTemplatesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="bg-[#15181D] border border-[#262B33] rounded-lg p-5 w-full max-w-md text-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white">Choose Preset Template</h3>
              <button
                onClick={() => setShowTemplatesModal(false)}
                className="w-7 h-7 rounded-md bg-[#1B1F26] border border-[#262B33] text-white hover:border-[#5a6478]"
              >
                ✕
              </button>
            </div>
            <p className="text-[11.5px] text-[#8B93A1]">
              Select a pre-designed layout to jumpstart your Shorts creation:
            </p>

            <div className="space-y-2">
              <button
                onClick={() => loadTemplatePreset("quote")}
                className="w-full text-left p-3 rounded-md bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] transition"
              >
                <div className="font-semibold text-[13px] text-white">💬 Viral Shorts Quote</div>
                <div className="text-[11px] text-[#8B93A1]">Cinematic dark background, quote typography & author caption tag.</div>
              </button>

              <button
                onClick={() => loadTemplatePreset("product")}
                className="w-full text-left p-3 rounded-md bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] transition"
              >
                <div className="font-semibold text-[13px] text-white">🛍 Product Spotlight</div>
                <div className="text-[11px] text-[#8B93A1]">Radial gradient backdrop, bold title & animated call-to-action pill.</div>
              </button>

              <button
                onClick={() => loadTemplatePreset("kinetic")}
                className="w-full text-left p-3 rounded-md bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] transition"
              >
                <div className="font-semibold text-[13px] text-white">🔥 Kinetic Title Intro</div>
                <div className="text-[11px] text-[#8B93A1]">Oversized bold impact text with outline & pop animations.</div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* IMPORT CHOICE MODAL */}
      {showImportChoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-2 sm:p-4">
          <div className="bg-[#15181D] border border-[#262B33] rounded-lg p-3 sm:p-5 w-full max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto text-xs">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-sm text-white">How should these import?</h3>
              <button
                onClick={() => setShowImportChoiceModal(false)}
                className="w-7 h-7 rounded-md bg-[#1B1F26] border border-[#262B33] text-white hover:border-[#5a6478]"
              >
                ✕
              </button>
            </div>
            <p className="text-[11.5px] mb-3 text-[#8B93A1]">
              {pendingImportFiles.length} images selected
            </p>
            <div className="space-y-2">
              <button
                onClick={() => processImageImport(pendingImportFiles, "separate")}
                className="w-full text-left p-3 rounded-md bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] transition"
              >
                <div className="font-semibold text-[13px] mb-0.5 text-white">Separate layers</div>
                <div className="text-[11px] text-[#8B93A1]">
                  Each image becomes its own layer on the canvas.
                </div>
              </button>

              <button
                onClick={() => processImageImport(pendingImportFiles, "collage")}
                className="w-full text-left p-3 rounded-md bg-[#1B1F26] border border-[#FF5A36] hover:border-[#ff7452] transition"
              >
                <div className="font-semibold text-[13px] mb-0.5 text-white">
                  Auto collage (one view)
                </div>
                <div className="text-[11px] text-[#8B93A1]">
                  All images composited into a single grid collage layer.
                </div>
              </button>

              <button
                onClick={() => processImageImport(pendingImportFiles, "customgrid")}
                className="w-full text-left p-3 rounded-md bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] transition"
              >
                <div className="font-semibold text-[13px] mb-0.5 text-white">
                  Custom grid — drag & drop
                </div>
                <div className="text-[11px] text-[#8B93A1]">
                  Drag each image into specific cells of a grid layout.
                </div>
              </button>

              <button
                onClick={() => processImageImport(pendingImportFiles, "slideshow")}
                className="w-full text-left p-3 rounded-md bg-[#1B1F26] border border-[#262B33] hover:border-[#FF5A36] transition"
              >
                <div className="font-semibold text-[13px] mb-0.5 text-white">
                  Auto-spaced slideshow (one by one)
                </div>
                <div className="text-[11px] text-[#8B93A1]">
                  Each image timed sequentially across the timeline.
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GRID EDITOR MODAL */}
      {showGridEditorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-2 sm:p-4">
          <div className="bg-[#15181D] border border-[#262B33] rounded-lg p-3 sm:p-5 w-full max-w-[95vw] sm:max-w-lg max-h-[90vh] overflow-y-auto text-xs space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs sm:text-sm text-white truncate pr-2">Arrange grid layout & drop images</h3>
              <button
                onClick={() => setShowGridEditorModal(false)}
                className="w-7 h-7 rounded-md bg-[#1B1F26] border border-[#262B33] text-white hover:border-[#5a6478] shrink-0"
              >
                ✕
              </button>
            </div>

            <div className="relative flex items-center w-full group">
              <button
                onClick={() => gridLayoutRef.current?.scrollBy({ left: -140, behavior: "smooth" })}
                className="w-5 h-7 rounded-l bg-[#1B1F26] border border-[#262B33] text-[#8B93A1] hover:text-white flex items-center justify-center text-[9px] shrink-0 z-10 hover:bg-[#262B33]"
              >
                ◀
              </button>
              <div ref={gridLayoutRef} className="flex-1 flex gap-1.5 overflow-x-auto py-0.5 scrollbar-none scroll-smooth px-1 whitespace-nowrap">
                {[
                  { id: "2col", label: "2-grid · side by side" },
                  { id: "2row", label: "2-grid · stacked" },
                  { id: "1plus2", label: "3-grid · 1 top + 2 bottom" },
                  { id: "2x2", label: "4-grid · 2×2 square" },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => {
                      const layoutId = l.id as any;
                      const cellCount = layoutId === "2col" || layoutId === "2row" ? 2 : layoutId === "1plus2" ? 3 : 4;
                      const activeSrcs = gridEditorCells.filter(Boolean) as string[];
                      const newCells = new Array(cellCount).fill(null);
                      const tray = [...gridEditorTray];
                      for (let i = 0; i < activeSrcs.length; i++) {
                        if (i < cellCount) newCells[i] = activeSrcs[i];
                        else tray.push(activeSrcs[i]);
                      }
                      setGridEditorLayout(layoutId);
                      setGridEditorCells(newCells);
                      setGridEditorTray(tray);
                    }}
                    className={`px-2.5 py-1.5 rounded-md text-[11px] shrink-0 ${gridEditorLayout === l.id ? "bg-[#FF5A36] text-[#160702] font-semibold" : "bg-[#1B1F26] border border-[#262B33] text-white"}`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => gridLayoutRef.current?.scrollBy({ left: 140, behavior: "smooth" })}
                className="w-5 h-7 rounded-r bg-[#1B1F26] border border-[#262B33] text-[#8B93A1] hover:text-white flex items-center justify-center text-[9px] shrink-0 z-10 hover:bg-[#262B33]"
              >
                ▶
              </button>
            </div>

            <div className="flex justify-center my-1 sm:my-2">
              <div
                className={`relative bg-[#0A0B0D] border border-[#262B33] rounded-md overflow-hidden grid gap-1.5 p-1.5 w-[200px] h-[260px] sm:w-[240px] sm:h-[320px] ${gridEditorLayout === "2col" ? "grid-cols-2 grid-rows-1" : gridEditorLayout === "2row" ? "grid-cols-1 grid-rows-2" : gridEditorLayout === "1plus2" ? "grid-cols-2 grid-rows-2" : "grid-cols-2 grid-rows-2"}`}
              >
                {gridEditorCells.map((src, i) => {
                  const pos = gridCellPos[i] || { x: 0, y: 0, zoom: 1 };
                  return (
                    <div
                      key={i}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        const dragIdx = parseInt(e.dataTransfer.getData("text/plain"));
                        if (!isNaN(dragIdx) && dragIdx >= 0) {
                          const newCells = [...gridEditorCells];
                          const temp = newCells[i];
                          newCells[i] = newCells[dragIdx];
                          newCells[dragIdx] = temp;
                          setGridEditorCells(newCells);
                        }
                      }}
                      className={`relative rounded border flex items-center justify-center overflow-hidden ${gridEditorLayout === "1plus2" && i === 0 ? "col-span-2" : ""} ${src ? "border-[#FF5A36] bg-black/60" : "border-dashed border-[#3A404D] bg-[#15181D]"}`}
                    >
                      {src ? (
                        <>
                          <img
                            src={src}
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData("text/plain", i.toString())}
                            style={{
                              objectPosition: `${50 + pos.x}% ${50 + pos.y}%`,
                              transform: `scale(${pos.zoom})`,
                            }}
                            className="w-full h-full object-cover cursor-grab active:cursor-grabbing transition-transform"
                          />
                          <button
                            onClick={() => {
                              const newCells = [...gridEditorCells];
                              const removed = newCells[i];
                              newCells[i] = null;
                              setGridEditorCells(newCells);
                              if (removed) setGridEditorTray((prev) => [...prev, removed]);
                            }}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 text-white text-[10px] flex items-center justify-center hover:bg-red-600 z-10"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <span className="text-[10.5px] text-[#8B93A1] text-center px-1">Drop cell {i + 1}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowGridEditorModal(false)}
                className="flex-1 py-2 rounded-md bg-[#1B1F26] border border-[#262B33] text-white"
              >
                Cancel
              </button>
              <button
                onClick={applyGridEditor}
                className="flex-1 py-2 rounded-md bg-[#FF5A36] text-[#160702] font-bold"
              >
                Insert grid layer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
