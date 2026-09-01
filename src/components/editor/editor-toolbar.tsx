"use client";

import { useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  Code,
  Code2,
  Heading1,
  Heading2,
  Heading3,
  Highlighter,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Palette,
  Quote,
  Redo2,
  Strikethrough,
  Underline,
  Undo2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LinkDialog } from "@/components/editor/link-dialog";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";

type EditorToolbarProps = {
  editor: Editor | null;
  disabled?: boolean;
  onImport?: () => void;
  className?: string;
};

function ToolbarButton({
  onClick,
  disabled,
  active,
  label,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="sm"
      className="h-8 min-w-8 px-2"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
    >
      {children}
    </Button>
  );
}

const TEXT_COLORS = [
  { label: "Default text", value: "", swatch: "bg-foreground" },
  { label: "Teal", value: "#0D9488", swatch: "bg-teal-600" },
  { label: "Red", value: "#DC2626", swatch: "bg-red-600" },
  { label: "Blue", value: "#2563EB", swatch: "bg-blue-600" },
] as const;

export function EditorToolbar({
  editor,
  disabled = false,
  onImport,
  className,
}: EditorToolbarProps) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  if (!editor) {
    return null;
  }

  return (
    <>
      <div
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-border/60 bg-card p-2 shadow-sm",
        disabled && "pointer-events-none opacity-60",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-1">
        <ToolbarButton
          label="Undo"
          disabled={!editor.can().chain().focus().undo().run()}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 />
        </ToolbarButton>
        <ToolbarButton
          label="Redo"
          disabled={!editor.can().chain().focus().redo().run()}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Toggle
          size="sm"
          pressed={editor.isActive("bold")}
          onPressedChange={() => editor.chain().focus().toggleBold().run()}
          aria-label="Bold"
        >
          <Bold />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("italic")}
          onPressedChange={() => editor.chain().focus().toggleItalic().run()}
          aria-label="Italic"
        >
          <Italic />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("underline")}
          onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
          aria-label="Underline"
        >
          <Underline />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("strike")}
          onPressedChange={() => editor.chain().focus().toggleStrike().run()}
          aria-label="Strikethrough"
        >
          <Strikethrough />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("highlight")}
          onPressedChange={() => editor.chain().focus().toggleHighlight().run()}
          aria-label="Highlight"
        >
          <Highlighter />
        </Toggle>
        <ToolbarButton
          label="Insert link"
          active={editor.isActive("link")}
          onClick={() => setLinkDialogOpen(true)}
        >
          <Link2 />
        </ToolbarButton>
        <Toggle
          size="sm"
          pressed={editor.isActive("code")}
          onPressedChange={() => editor.chain().focus().toggleCode().run()}
          aria-label="Inline code"
        >
          <Code />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 1 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          aria-label="Heading 1"
        >
          <Heading1 />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 2 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          aria-label="Heading 2"
        >
          <Heading2 />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("heading", { level: 3 })}
          onPressedChange={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          aria-label="Heading 3"
        >
          <Heading3 />
        </Toggle>
      </div>

      <div className="flex flex-wrap items-center gap-1">
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "left" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("left").run()
          }
          aria-label="Align left"
        >
          <AlignLeft />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "center" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("center").run()
          }
          aria-label="Align center"
        >
          <AlignCenter />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "right" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("right").run()
          }
          aria-label="Align right"
        >
          <AlignRight />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive({ textAlign: "justify" })}
          onPressedChange={() =>
            editor.chain().focus().setTextAlign("justify").run()
          }
          aria-label="Justify"
        >
          <AlignJustify />
        </Toggle>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <Toggle
          size="sm"
          pressed={editor.isActive("bulletList")}
          onPressedChange={() => editor.chain().focus().toggleBulletList().run()}
          aria-label="Bullet list"
        >
          <List />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("orderedList")}
          onPressedChange={() => editor.chain().focus().toggleOrderedList().run()}
          aria-label="Numbered list"
        >
          <ListOrdered />
        </Toggle>
        <Toggle
          size="sm"
          pressed={editor.isActive("blockquote")}
          onPressedChange={() => editor.chain().focus().toggleBlockquote().run()}
          aria-label="Blockquote"
        >
          <Quote />
        </Toggle>
        <ToolbarButton
          label="Code block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 />
        </ToolbarButton>
        <ToolbarButton
          label="Horizontal rule"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          <Minus />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        {onImport ? (
          <>
            <ToolbarButton label="Import file" onClick={onImport}>
              <Upload />
            </ToolbarButton>
            <Separator orientation="vertical" className="mx-1 h-6" />
          </>
        ) : null}

        <div className="flex items-center gap-1">
          <Palette className="size-3.5 text-muted-foreground" aria-hidden />
          {TEXT_COLORS.map((color) => (
            <button
              key={color.label}
              type="button"
              title={color.label}
              aria-label={color.label}
              className={cn(
                "size-6 rounded-full border border-border/80 transition-transform hover:scale-110",
                color.swatch,
                color.value === "" && "ring-1 ring-border",
              )}
              onClick={() => {
                if (color.value === "") {
                  editor.chain().focus().unsetColor().run();
                  return;
                }
                editor.chain().focus().setColor(color.value).run();
              }}
            />
          ))}
        </div>
      </div>
      </div>

      <LinkDialog
        editor={editor}
        open={linkDialogOpen}
        onOpenChange={setLinkDialogOpen}
      />
    </>
  );
}
