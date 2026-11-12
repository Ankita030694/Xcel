"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import { Table } from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Youtube from "@tiptap/extension-youtube";
import { common, createLowlight } from "lowlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Highlighter,
  Palette,
  Check,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  ListTodo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Code,
  Minus,
  Link2,
  Unlink,
  Table as TableIcon,
  Video,
  ImageIcon,
  Undo2,
  Redo2,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { uploadBlogImage } from "@/lib/seo-utils";
import {
  ColorOption,
  QUICK_COLORS,
  COLOR_GROUPS,
} from "../common/ColorConstants";

const lowlight = createLowlight(common);

interface TipTapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const [customColor, setCustomColor] = useState("#0a2766");
  const [hoveredColor, setHoveredColor] = useState<ColorOption | null>(null);

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

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
        codeBlock: false,
      }),
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          class: "text-[#3b5b95] underline font-medium hover:text-[#0a2766] transition-colors",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse table-auto w-full my-4 border border-gray-200",
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: "bg-[#0a2766] text-white font-bold p-3 border border-gray-300 text-left text-sm",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: "p-3 border border-gray-200 text-sm text-gray-700",
        },
      }),
      Subscript,
      Superscript,
      CodeBlockLowlight.configure({
        lowlight,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: "flex items-start gap-2.5 my-1 text-gray-700",
        },
      }),
      Youtube.configure({
        inline: false,
        width: 640,
        height: 380,
        HTMLAttributes: {
          class: "mx-auto my-6 rounded-xl overflow-hidden shadow-md max-w-full aspect-video",
        },
      }),
    ],
    content: content || "",
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "xcel-prose max-w-none p-6 min-h-[460px] focus:outline-none bg-white text-gray-800 leading-relaxed font-sans",
      },
    },
  });

  // Handle Image Upload with Canvas Compression
  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !editor) return;

      try {
        setIsUploading(true);
        const downloadUrl = await uploadBlogImage(file, "editor-images");
        editor.chain().focus().setImage({ src: downloadUrl, alt: file.name }).run();
      } catch (err) {
        console.error("Failed to upload editor image:", err);
        alert("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [editor]
  );

  // Link Handlers
  const handleSetLink = () => {
    if (!editor) return;
    if (linkUrl === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    } else {
      let formattedUrl = linkUrl.trim();
      if (!/^https?:\/\//i.test(formattedUrl) && !formattedUrl.startsWith("/") && !formattedUrl.startsWith("#")) {
        formattedUrl = `https://${formattedUrl}`;
      }
      editor.chain().focus().extendMarkRange("link").setLink({ href: formattedUrl }).run();
    }
    setShowLinkModal(false);
    setLinkUrl("");
  };

  // YouTube Handler
  const handleInsertYoutube = () => {
    if (!editor || !youtubeUrl) return;
    editor.commands.setYoutubeVideo({
      src: youtubeUrl.trim(),
    });
    setShowYoutubeModal(false);
    setYoutubeUrl("");
  };

  // Table Handler
  const handleInsertTable = () => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: Math.max(1, tableRows), cols: Math.max(1, tableCols), withHeaderRow: true })
      .run();
    setShowTableModal(false);
  };

  if (!editor) {
    return (
      <div className="border border-gray-200 rounded-2xl bg-white p-12 flex items-center justify-center text-gray-400 gap-3">
        <Loader2 className="w-5 h-5 animate-spin text-[#0a2766]" />
        <span className="font-medium text-sm text-[#0a2766]">Initializing Rich Text Editor...</span>
      </div>
    );
  }

  const btnStyle = (active: boolean) =>
    `p-2 rounded-lg text-xs font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center ${
      active
        ? "bg-[#0a2766] text-white shadow-xs"
        : "text-gray-600 hover:text-[#0a2766] hover:bg-gray-100"
    }`;

  const currentColor = editor.getAttributes("textStyle").color || "#1f2937";

  return (
    <div className="border border-gray-200 rounded-2xl bg-white shadow-xs overflow-hidden focus-within:ring-2 focus-within:ring-[#0a2766]/20 focus-within:border-[#0a2766] transition-all">
      {/* Hidden File Input for Image Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Top Sticky Toolbar */}
      <div className="bg-[#f8f9fa] border-b border-gray-200 p-2.5 flex flex-wrap items-center gap-1.5 select-none sticky top-0 z-20">
        {/* Undo / Redo */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            className="p-1.5 rounded-lg text-gray-500 hover:text-[#0a2766] hover:bg-gray-200/80 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            className="p-1.5 rounded-lg text-gray-500 hover:text-[#0a2766] hover:bg-gray-200/80 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={btnStyle(editor.isActive("heading", { level: 1 }))}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={btnStyle(editor.isActive("heading", { level: 2 }))}
            title="Heading 2 (Xcel Section Subhead)"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={btnStyle(editor.isActive("heading", { level: 3 }))}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Basic Text Formatting */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={btnStyle(editor.isActive("bold"))}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={btnStyle(editor.isActive("italic"))}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={btnStyle(editor.isActive("underline"))}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={btnStyle(editor.isActive("strike"))}
            title="Strikethrough"
          >
            <Strikethrough className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleHighlight().run()}
            className={btnStyle(editor.isActive("highlight"))}
            title="Highlight Text"
          >
            <Highlighter className="w-4 h-4" />
          </button>

          {/* Text Color Dropdown */}
          <div className="relative" ref={colorPickerRef}>
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs text-gray-700 hover:bg-gray-200/80 hover:text-gray-900 transition-colors border border-gray-200 bg-white"
              title="Text Color"
            >
              <Palette className="w-4 h-4" style={{ color: currentColor }} />
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

          <button
            type="button"
            onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
            className="p-2 rounded-lg text-xs text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors"
            title="Clear Formatting"
          >
            <Eraser className="w-4 h-4" />
          </button>
        </div>

        {/* Lists & Alignment */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={btnStyle(editor.isActive("bulletList"))}
            title="Bullet List (Xcel Bullet Style)"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={btnStyle(editor.isActive("orderedList"))}
            title="Numbered List"
          >
            <ListOrdered className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            className={btnStyle(editor.isActive("taskList"))}
            title="Task / Checklist"
          >
            <ListTodo className="w-4 h-4" />
          </button>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            className={btnStyle(editor.isActive({ textAlign: "left" }))}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            className={btnStyle(editor.isActive({ textAlign: "center" }))}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            className={btnStyle(editor.isActive({ textAlign: "right" }))}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            className={btnStyle(editor.isActive({ textAlign: "justify" }))}
            title="Align Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Media & Structures */}
        <div className="flex items-center gap-1 pr-2 border-r border-gray-200">
          {/* Quote */}
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={btnStyle(editor.isActive("blockquote"))}
            title="Pull Quote / Callout Box"
          >
            <Quote className="w-4 h-4" />
          </button>

          {/* Horizontal Rule */}
          <button
            type="button"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className="p-2 rounded-lg text-xs text-gray-600 hover:text-[#0a2766] hover:bg-gray-100 transition-colors"
            title="Divider Line"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Links */}
          <button
            type="button"
            onClick={() => {
              setLinkUrl(editor.getAttributes("link").href || "");
              setShowLinkModal(true);
            }}
            className={btnStyle(editor.isActive("link"))}
            title="Insert Link"
          >
            <Link2 className="w-4 h-4" />
          </button>

          {/* Image Upload */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="p-2 rounded-lg text-xs text-gray-600 hover:text-[#0a2766] hover:bg-gray-100 transition-colors flex items-center gap-1"
            title="Insert Inline Image (Auto-Compressed)"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#0a2766]" />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
          </button>

          {/* Table */}
          <button
            type="button"
            onClick={() => setShowTableModal(true)}
            className={btnStyle(editor.isActive("table"))}
            title="Insert High-Contrast Comparison Table"
          >
            <TableIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Table Controls (visible only when cursor inside a table) */}
        {editor.isActive("table") && (
          <div className="flex items-center gap-1 bg-[#3b5b95]/10 px-2 py-1 rounded-lg border border-[#3b5b95]/20 text-[11px] font-semibold text-[#0a2766]">
            <span>Table Tools:</span>
            <button
              type="button"
              onClick={() => editor.chain().focus().addRowAfter().run()}
              className="px-2 py-0.5 bg-white hover:bg-gray-50 border border-gray-200 rounded shadow-2xs"
            >
              + Row
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().addColumnAfter().run()}
              className="px-2 py-0.5 bg-white hover:bg-gray-50 border border-gray-200 rounded shadow-2xs"
            >
              + Col
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteRow().run()}
              className="px-2 py-0.5 bg-white hover:bg-red-50 text-red-600 border border-gray-200 rounded shadow-2xs"
            >
              Del Row
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteColumn().run()}
              className="px-2 py-0.5 bg-white hover:bg-red-50 text-red-600 border border-gray-200 rounded shadow-2xs"
            >
              Del Col
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().deleteTable().run()}
              className="px-2 py-0.5 bg-red-600 text-white rounded hover:bg-red-700 shadow-2xs"
            >
              Remove Table
            </button>
          </div>
        )}
      </div>

      {/* Editor Content Area */}
      <div className="p-2 sm:p-4">
        <EditorContent editor={editor} />
      </div>

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-200 space-y-4">
            <h4 className="font-bold text-lg text-[#0a2766]">Insert or Edit Link</h4>
            <input
              type="url"
              placeholder="https://example.com or /contact"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2766]"
              autoFocus
            />
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowLinkModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSetLink}
                className="px-5 py-2 text-sm font-semibold bg-[#0a2766] text-white rounded-xl hover:bg-[#3b5b95] transition-colors"
              >
                Apply Link
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Insertion Modal */}
      {showTableModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-gray-200 space-y-4">
            <h4 className="font-bold text-lg text-[#0a2766]">Insert Comparison Table</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Rows</label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2766]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-600 mb-1">Columns</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#0a2766]"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowTableModal(false)}
                className="px-4 py-2 text-sm font-semibold text-gray-500 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertTable}
                className="px-5 py-2 text-sm font-semibold bg-[#0a2766] text-white rounded-xl hover:bg-[#3b5b95] transition-colors"
              >
                Insert Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
