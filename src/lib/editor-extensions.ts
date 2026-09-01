import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";

export function getContentExtensions() {
  return [
    StarterKit.configure({
      heading: {
        levels: [1, 2, 3],
      },
      link: false,
    }),
    Underline,
    TextStyle,
    Color,
    Highlight.configure({
      multicolor: true,
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
      alignments: ["left", "center", "right", "justify"],
    }),
    Link.configure({
      autolink: true,
      openOnClick: false,
      HTMLAttributes: {
        class: "text-primary underline underline-offset-4 hover:text-primary/80",
      },
    }),
  ];
}

export function getEditorExtensions() {
  return [
    ...getContentExtensions(),
    Placeholder.configure({
      placeholder: "Start writing your document…",
    }),
  ];
}
