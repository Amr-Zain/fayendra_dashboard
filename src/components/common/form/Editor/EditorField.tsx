"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Superscript from "@tiptap/extension-superscript";
import Subscript from "@tiptap/extension-subscript";
import Highlight from "@tiptap/extension-highlight";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";
import DOMPurify from "dompurify";
import { AlignJustify } from "lucide-react";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code2,
  List,
  ListOrdered,
  ListTodo,
  Undo2,
  Redo2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Quote,
  Link as LinkIcon,
  Highlighter,
  Superscript as SupIcon,
  Subscript as SubIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

//import "@/styles/editor.scss";
import HighlightColorPicker from "./highlightColorPicker";
import ImageUploadButton from "./ImageUploadButton";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

export interface EditorProps<T extends FieldValues> {
  field: ControllerRenderProps<T, Path<T>>;
  placeholder?: string;
  height?: number;
  toolbar?: boolean;
  disabled?: boolean;
  className?: string;
}

function EditorField<T extends FieldValues>({
  field,
  placeholder,
  height = 200,
  toolbar = true,
  disabled = false,
  className = "",
}: EditorProps<T>) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link,
      Superscript,
      Subscript,
      Highlight.configure({
        multicolor: true,
      }),
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      BulletList,
      OrderedList,
      TaskList,
      TaskItem.configure({ nested: true }),
    ],
    content: field.value || "<p></p>",
    onUpdate({ editor }) {
      const html = DOMPurify.sanitize(editor.getHTML());
      field.onChange(html);
    },
    editorProps: {
      attributes: {
        class: `tiptap-editor dark-mode ${
          disabled ? "opacity-50 pointer-events-none" : ""
        }`,
        style: `min-height: ${height}px;`,
      },
    },
    editable: !disabled,
  });

  useEffect(() => {
    if (editor && field.value !== editor.getHTML()) {
      editor.commands.setContent(field.value || "<p></p>");
    }
  }, [editor, field.value]);

  if (!editor) return null;

  const headingOptions = [
    { value: "0", label: "Normal" },
    { value: "1", label: "H1" },
    { value: "2", label: "H2" },
    { value: "3", label: "H3" },
    { value: "4", label: "H4" },
    { value: "5", label: "H5" },
    { value: "6", label: "H6" },
  ];

  const toolbarItems = [
    {
      icon: <Undo2 size={18} />,
      action: () => editor.chain().focus().undo().run(),
      isActive: false,
      title: "Undo",
    },
    {
      icon: <Redo2 size={18} />,
      action: () => editor.chain().focus().redo().run(),
      isActive: false,
      title: "Redo",
    },
    {
      icon: <Bold size={18} />,
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: editor.isActive("bold"),
      title: "Bold",
    },
    {
      icon: <Italic size={18} />,
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: editor.isActive("italic"),
      title: "Italic",
    },
    {
      icon: <UnderlineIcon size={18} />,
      action: () => editor.chain().focus().toggleUnderline().run(),
      isActive: editor.isActive("underline"),
      title: "Underline",
    },
    {
      icon: <Strikethrough size={18} />,
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: editor.isActive("strike"),
      title: "Strikethrough",
    },
    {
      icon: <Code2 size={18} />,
      action: () => editor.chain().focus().toggleCode().run(),
      isActive: editor.isActive("code"),
      title: "Code",
    },
    {
      icon: <Highlighter size={18} />,
      action: () => editor.chain().focus().toggleHighlight().run(),
      isActive: editor.isActive("highlight"),
      title: "Highlight",
    },
    {
      icon: <SupIcon size={18} />,
      action: () => editor.chain().focus().toggleSuperscript().run(),
      isActive: editor.isActive("superscript"),
      title: "Superscript",
    },
    {
      icon: <SubIcon size={18} />,
      action: () => editor.chain().focus().toggleSubscript().run(),
      isActive: editor.isActive("subscript"),
      title: "Subscript",
    },
    {
      icon: <LinkIcon size={18} />,
      action: () => {
        const url = window.prompt("Enter the URL");
        if (url) editor.chain().focus().setLink({ href: url }).run();
      },
      isActive: editor.isActive("link"),
      title: "Link",
    },
    {
      icon: <Quote size={18} />,
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: editor.isActive("blockquote"),
      title: "Quote",
    },
    {
      icon: <List size={18} />,
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: editor.isActive("bulletList"),
      title: "Bullet List",
    },
    {
      icon: <ListOrdered size={18} />,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: editor.isActive("orderedList"),
      title: "Ordered List",
    },
    {
      icon: <ListTodo size={18} />,
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: editor.isActive("taskList"),
      title: "Task List",
    },
    {
      icon: <AlignLeft size={18} />,
      action: () => editor.chain().focus().setTextAlign("left").run(),
      isActive: editor.isActive({ textAlign: "left" }),
      title: "Align Left",
    },
    {
      icon: <AlignCenter size={18} />,
      action: () => editor.chain().focus().setTextAlign("center").run(),
      isActive: editor.isActive({ textAlign: "center" }),
      title: "Align Center",
    },
    {
      icon: <AlignRight size={18} />,
      action: () => editor.chain().focus().setTextAlign("right").run(),
      isActive: editor.isActive({ textAlign: "right" }),
      title: "Align Right",
    },
    {
      icon: <AlignJustify size={18} />,
      action: () => editor.chain().focus().setTextAlign("justify").run(),
      isActive: editor.isActive({ textAlign: "justify" }),
      title: "Justify",
    },
  ];

  return (
    <div className={`tiptap-wrapper border rounded-md ${className}`}>
      {toolbar && (
        <div className="toolbar border-b p-2 flex flex-wrap items-center gap-1 bg-muted/50">
          {toolbarItems.map((item, i) => (
            <Button
              key={i}
              type="button"
              variant={item.isActive ? "default" : "ghost"}
              size="sm"
              onClick={item.action}
              disabled={disabled}
              title={item.title}
              className="h-8 w-8 p-0"
            >
              {item.icon}
            </Button>
          ))}

          <div className="h-6 w-px bg-border mx-1" />

          <HighlightColorPicker
            onSelect={(color) => {
              if (!editor) return;
              editor
                .chain()
                .focus()
                .command(({ commands }) => {
                  color
                    ? commands.setHighlight({ color })
                    : commands.unsetHighlight();
                  return true;
                })
                .run();
            }}
          />

          <ImageUploadButton
            onImageAdd={(src) => {
              editor.chain().focus().setImage({ src }).run();
            }}
          />

          <Select
            value={
              editor.isActive("heading", { level: 1 })
                ? "1"
                : editor.isActive("heading", { level: 2 })
                ? "2"
                : editor.isActive("heading", { level: 3 })
                ? "3"
                : editor.isActive("heading", { level: 4 })
                ? "4"
                : editor.isActive("heading", { level: 5 })
                ? "5"
                : editor.isActive("heading", { level: 6 })
                ? "6"
                : "0"
            }
            onValueChange={(value) => {
              if (value === "0") {
                editor.chain().focus().setParagraph().run();
              } else {
                editor
                  .chain()
                  .focus()
                  .toggleHeading({
                    level: Number(value) as 1 | 2 | 3 | 4 | 5 | 6,
                  })
                  .run();
              }
            }}
            disabled={disabled}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {headingOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="p-4">
        <EditorContent
          editor={editor}
          placeholder={placeholder}
          className="prose dark:prose-invert max-w-none focus:outline-none"
        />
      </div>
    </div>
  );
}

export default EditorField;
