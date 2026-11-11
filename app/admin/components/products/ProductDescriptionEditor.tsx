"use client";

import React, { useEffect, useState, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Palette,
  Eraser,
  List,
  ListOrdered,
  Undo2,
  Redo2,
  Check,
} from "lucide-react";

interface ProductDescriptionEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

interface ColorOption {
  name: string;
  color: string;
}

interface ColorGroup {
  group: string;
  colors: ColorOption[];
}

const QUICK_COLORS: ColorOption[] = [
  { name: "Default Charcoal", color: "#1f2937" },
  { name: "Brand Navy", color: "#0a2766" },
  { name: "Primary Blue", color: "#32589c" },
  { name: "Vibrant Blue", color: "#2563eb" },
  { name: "Emerald Green", color: "#059669" },
  { name: "Amber Orange", color: "#d97706" },
  { name: "Crimson Red", color: "#dc2626" },
  { name: "Purple", color: "#7c3aed" },
];

const COLOR_GROUPS: ColorGroup[] = [
  {
    group: "Brand & Blues",
    colors: [
      { name: "Brand Navy", color: "#0a2766" },
      { name: "Deep Navy", color: "#1e3a8a" },
      { name: "Classic Navy", color: "#1d4ed8" },
      { name: "Steel Blue", color: "#32589c" },
      { name: "Vibrant Blue", color: "#2563eb" },
      { name: "Sky Blue", color: "#0284c7" },
      { name: "Ocean Cyan", color: "#0891b2" },
      { name: "Bright Cyan", color: "#06b6d4" },
    ],
  },
  {
    group: "Greens & Teals",
    colors: [
      { name: "Dark Forest", color: "#14532d" },
      { name: "Hunter Green", color: "#15803d" },
      { name: "Emerald Green", color: "#059669" },
      { name: "Jade Mint", color: "#10b981" },
      { name: "Deep Teal", color: "#115e59" },
      { name: "Teal", color: "#0d9488" },
      { name: "Olive Green", color: "#4d7c0f" },
      { name: "Lime Green", color: "#65a30d" },
    ],
  },
  {
    group: "Warm & Oranges",
    colors: [
      { name: "Bronze Gold", color: "#b45309" },
      { name: "Amber Orange", color: "#d97706" },
      { name: "Warm Tangerine", color: "#ea580c" },
      { name: "Bright Orange", color: "#f97316" },
      { name: "Goldenrod", color: "#ca8a04" },
      { name: "Warm Yellow", color: "#eab308" },
    ],
  },
  {
    group: "Reds & Pinks",
    colors: [
      { name: "Dark Burgundy", color: "#881337" },
      { name: "Wine Red", color: "#991b1b" },
      { name: "Deep Crimson", color: "#b91c1c" },
      { name: "Crimson Red", color: "#dc2626" },
      { name: "Coral Red", color: "#ef4444" },
      { name: "Rose Pink", color: "#e11d48" },
      { name: "Hot Pink", color: "#ec4899" },
      { name: "Magenta", color: "#db2777" },
    ],
  },
  {
    group: "Purples & Indigos",
    colors: [
      { name: "Midnight Indigo", color: "#312e81" },
      { name: "Deep Indigo", color: "#3730a3" },
      { name: "Royal Indigo", color: "#4338ca" },
      { name: "Indigo", color: "#4f46e5" },
      { name: "Violet", color: "#7c3aed" },
      { name: "Royal Purple", color: "#9333ea" },
      { name: "Lilac Purple", color: "#a855f7" },
      { name: "Deep Plum", color: "#701a75" },
    ],
  },
  {
    group: "Neutrals & Grayscale",
    colors: [
      { name: "Solid Black", color: "#000000" },
      { name: "Charcoal (Default)", color: "#1f2937" },
      { name: "Dark Slate", color: "#374151" },
      { name: "Cool Gray", color: "#4b5563" },
      { name: "Steel Muted", color: "#6b7280" },
      { name: "Medium Gray", color: "#9ca3af" },
      { name: "Silver", color: "#cbd5e1" },
      { name: "Warm Taupe", color: "#78716c" },
    ],
  },
];

export default function ProductDescriptionEditor({
  content,
  onChange,
  placeholder = "Enter product description with bold, italic, and custom colors...",
}: ProductDescriptionEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [customColor, setCustomColor] = useState("#0a2766");
  const [hoveredColor, setHoveredColor] = useState<ColorOption | null>(null);

  // Format initial content if it is legacy plain text
  const formatInitialContent = (raw: string) => {
    if (!raw) return "";
    const trimmed = raw.trim();
    if (trimmed.startsWith("<") && trimmed.endsWith(">")) {
      return trimmed;
    }
    // Convert newlines to paragraphs
    return trimmed
      .split("\n")
      .filter(Boolean)
      .map((p) => `<p>${p}</p>`)
      .join("");
  };

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        blockquote: false,
      }),
      Underline,
      TextStyle,
      Color,
    ],
    content: formatInitialContent(content),
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      onChange(html === "<p></p>" ? "" : html);
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none p-3.5 min-h-[140px] max-h-[360px] overflow-y-auto focus:outline-none bg-white text-gray-900 leading-relaxed font-sans text-sm",
      },
    },
  });

  // Sync editor if external content changes (e.g. editing a different product or resetting form)
  useEffect(() => {
    if (editor) {
      const currentHtml = editor.getHTML();
      const formatted = formatInitialContent(content);
      if (content !== currentHtml && formatted !== currentHtml) {
        editor.commands.setContent(formatted || "");
      }
    }
  }, [content, editor]);

  // Click outside listener for color palette
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
      }
    };
    if (showColorPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showColorPicker]);

  if (!editor) {
    return (
      <div className="w-full h-36 border border-gray-300 rounded-md bg-gray-50 animate-pulse flex items-center justify-center text-gray-400 text-xs">
        Loading editor...
      </div>
    );
  }

  const currentColor = editor.getAttributes("textStyle").color || "#1f2937";

  return (
    <div className="w-full border border-gray-300 rounded-md overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-[#32589c]/20 focus-within:border-[#32589c] transition-all">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200 select-none">
        {/* Bold */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-colors text-xs flex items-center justify-center ${
            editor.isActive("bold")
              ? "bg-[#0a2766] text-white font-bold"
              : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
          }`}
          title="Bold (Ctrl+B)"
        >
          <Bold size={15} strokeWidth={2.5} />
        </button>

        {/* Italic */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-colors text-xs flex items-center justify-center ${
            editor.isActive("italic")
              ? "bg-[#0a2766] text-white font-bold"
              : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
          }`}
          title="Italic (Ctrl+I)"
        >
          <Italic size={15} strokeWidth={2.5} />
        </button>

        {/* Underline */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded transition-colors text-xs flex items-center justify-center ${
            editor.isActive("underline")
              ? "bg-[#0a2766] text-white font-bold"
              : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
          }`}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon size={15} strokeWidth={2.5} />
        </button>

        <div className="w-[1px] h-5 bg-gray-300 mx-1" />

        {/* Color Picker Dropdown */}
        <div className="relative" ref={colorPickerRef}>
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-1.5 px-2 py-1 rounded text-xs text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors border border-gray-200 bg-white"
            title="Text Color"
          >
            <Palette size={14} style={{ color: currentColor }} />
            <span
              className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs"
              style={{ backgroundColor: currentColor }}
            />
          </button>

          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1.5 z-50 bg-white border border-gray-200 rounded-xl shadow-2xl p-3.5 w-80 space-y-3">
              {/* Quick Popular Swatches */}
              <div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">
                  Quick Select
                </div>
                <div className="grid grid-cols-8 gap-1.5">
                  {QUICK_COLORS.map((item) => {
                    const isSelected = currentColor.toLowerCase() === item.color.toLowerCase();
                    return (
                      <button
                        key={item.color}
                        type="button"
                        onClick={() => {
                          editor.chain().focus().setColor(item.color).run();
                          setShowColorPicker(false);
                        }}
                        onMouseEnter={() => setHoveredColor(item)}
                        onMouseLeave={() => setHoveredColor(null)}
                        className="w-7 h-7 rounded-md border border-gray-200 shadow-2xs flex items-center justify-center transition-all hover:scale-115 hover:z-10 cursor-pointer"
                        style={{ backgroundColor: item.color }}
                        title={`${item.name} (${item.color})`}
                      >
                        {isSelected && (
                          <Check size={14} className="text-white drop-shadow stroke-[3]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Categorized Palette */}
              <div className="pt-2 border-t border-gray-100 max-h-[200px] overflow-y-auto pr-1 space-y-2.5">
                {COLOR_GROUPS.map((grp) => (
                  <div key={grp.group}>
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {grp.group}
                    </div>
                    <div className="grid grid-cols-8 gap-1.5">
                      {grp.colors.map((item) => {
                        const isSelected = currentColor.toLowerCase() === item.color.toLowerCase();
                        return (
                          <button
                            key={item.color}
                            type="button"
                            onClick={() => {
                              editor.chain().focus().setColor(item.color).run();
                              setShowColorPicker(false);
                            }}
                            onMouseEnter={() => setHoveredColor(item)}
                            onMouseLeave={() => setHoveredColor(null)}
                            className="w-7 h-7 rounded-md border border-gray-200 shadow-2xs flex items-center justify-center transition-all hover:scale-115 hover:z-10 cursor-pointer"
                            style={{ backgroundColor: item.color }}
                            title={`${item.name} (${item.color})`}
                          >
                            {isSelected && (
                              <Check size={14} className="text-white drop-shadow stroke-[3]" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Hover / Active Color Indicator */}
              <div className="px-2.5 py-1.5 bg-gray-50 rounded-md border border-gray-150 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs shrink-0"
                    style={{ backgroundColor: hoveredColor?.color || currentColor }}
                  />
                  <span className="font-medium text-gray-800 truncate text-[11px]">
                    {hoveredColor ? hoveredColor.name : "Current Color"}
                  </span>
                </div>
                <span className="font-mono text-gray-500 text-[11px] shrink-0">
                  {hoveredColor ? hoveredColor.color : currentColor}
                </span>
              </div>

              {/* Custom Color Input */}
              <div className="pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Custom Hex Color
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      editor.chain().focus().setColor(e.target.value).run();
                    }}
                    className="w-8 h-8 rounded-md border border-gray-300 p-0.5 cursor-pointer bg-white"
                    title="Open native color palette"
                  />
                  <input
                    type="text"
                    value={customColor}
                    onChange={(e) => {
                      setCustomColor(e.target.value);
                      if (/^#[0-9A-F]{6}$/i.test(e.target.value)) {
                        editor.chain().focus().setColor(e.target.value).run();
                      }
                    }}
                    placeholder="#0a2766"
                    className="flex-1 px-2.5 py-1 text-xs font-mono border border-gray-300 rounded-md focus:outline-none focus:border-[#32589c]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (/^#[0-9A-F]{3,6}$/i.test(customColor)) {
                        editor.chain().focus().setColor(customColor).run();
                        setShowColorPicker(false);
                      }
                    }}
                    className="px-2.5 py-1 bg-[#0a2766] text-white text-xs font-medium rounded-md hover:bg-[#071b4a] transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Reset to Default Color */}
              <div className="pt-1 border-t border-gray-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().focus().unsetColor().run();
                    setShowColorPicker(false);
                  }}
                  className="flex-1 py-1 text-center text-xs text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                >
                  Reset to Default
                </button>
                <button
                  type="button"
                  onClick={() => setShowColorPicker(false)}
                  className="px-3 py-1 text-xs text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Clear All Marks / Formatting */}
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="p-1.5 rounded text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors text-xs"
          title="Clear Formatting (Remove bold, italic, colors)"
        >
          <Eraser size={15} />
        </button>

        <div className="w-[1px] h-5 bg-gray-300 mx-1" />

        {/* Bullet List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded transition-colors text-xs flex items-center justify-center ${
            editor.isActive("bulletList")
              ? "bg-[#0a2766] text-white font-bold"
              : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
          }`}
          title="Bullet List"
        >
          <List size={15} />
        </button>

        {/* Ordered List */}
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded transition-colors text-xs flex items-center justify-center ${
            editor.isActive("orderedList")
              ? "bg-[#0a2766] text-white font-bold"
              : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
          }`}
          title="Numbered List"
        >
          <ListOrdered size={15} />
        </button>

        <div className="w-[1px] h-5 bg-gray-300 mx-1 ml-auto" />

        {/* Undo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded text-gray-700 hover:bg-gray-200 hover:text-gray-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Undo (Ctrl+Z)"
        >
          <Undo2 size={15} />
        </button>

        {/* Redo */}
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded text-gray-700 hover:bg-gray-200 hover:text-gray-900 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          title="Redo (Ctrl+Y)"
        >
          <Redo2 size={15} />
        </button>
      </div>

      {/* Editor Content Area */}
      <EditorContent editor={editor} />
    </div>
  );
}

