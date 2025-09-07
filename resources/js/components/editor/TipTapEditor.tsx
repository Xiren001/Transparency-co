import { Button } from '@/components/ui/button';
import Blockquote from '@tiptap/extension-blockquote';
import BulletList from '@tiptap/extension-bullet-list';
import CodeBlock from '@tiptap/extension-code-block';
import Color from '@tiptap/extension-color';
import Heading from '@tiptap/extension-heading';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import OrderedList from '@tiptap/extension-ordered-list';
import Placeholder from '@tiptap/extension-placeholder';
import Strike from '@tiptap/extension-strike';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Underline from '@tiptap/extension-underline';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axios from 'axios';
import {
    AlertTriangle,
    AlignCenter,
    AlignJustify,
    AlignLeft,
    AlignRight,
    Bold,
    ChevronDown,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Highlighter,
    Image as ImageIcon,
    Italic,
    Link as LinkIcon,
    List,
    ListOrdered,
    Minus,
    Palette,
    Quote,
    Redo,
    Save,
    Underline as UnderlineIcon,
    Undo,
    X,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { DangerBlock } from './DangerBlock';
import { ImageExtension } from './ImageExtension';

interface TipTapEditorProps {
    content?: any;
    onChange?: (content: any, html?: string) => void;
    onSave?: (content: any) => void;
    isEditing?: boolean;
}

const TipTapEditor = ({ content, onChange, onSave, isEditing = true }: TipTapEditorProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [showHighlightColors, setShowHighlightColors] = useState(false);
    const [showTextColors, setShowTextColors] = useState(false);

    // Pastel highlight colors
    const highlightColors = [
        { name: 'Lavender', color: 'lavender', bgColor: '#e6e6fa', textColor: '#6b46c1' },
        { name: 'Mint', color: 'mint', bgColor: '#f0fff4', textColor: '#059669' },
        { name: 'Peach', color: 'peach', bgColor: '#ffe4e1', textColor: '#dc2626' },
        { name: 'Sky', color: 'sky', bgColor: '#f0f9ff', textColor: '#0284c7' },
        { name: 'Rose', color: 'rose', bgColor: '#fff1f2', textColor: '#e11d48' },
        { name: 'Lemon', color: 'lemon', bgColor: '#fefce8', textColor: '#ca8a04' },
        { name: 'Lilac', color: 'lilac', bgColor: '#faf5ff', textColor: '#9333ea' },
        { name: 'Coral', color: 'coral', bgColor: '#fff7ed', textColor: '#ea580c' },
    ];

    // Text colors
    const textColors = [
        { name: 'Black', color: '#000000' },
        { name: 'Gray', color: '#6b7280' },
        { name: 'Red', color: '#dc2626' },
        { name: 'Orange', color: '#ea580c' },
        { name: 'Yellow', color: '#ca8a04' },
        { name: 'Green', color: '#059669' },
        { name: 'Blue', color: '#0284c7' },
        { name: 'Purple', color: '#9333ea' },
        { name: 'Pink', color: '#e11d48' },
        { name: 'Brown', color: '#92400e' },
    ];

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: false, // Disable from StarterKit to use our explicit version
                orderedList: false, // Disable from StarterKit to use our explicit version
                heading: false, // Disable from StarterKit to use our explicit version
                blockquote: false, // Disable from StarterKit to use our explicit version
                link: false, // Disable from StarterKit to use our explicit version
                underline: false, // Disable from StarterKit to use our explicit version
                codeBlock: false, // Disable from StarterKit to use our explicit version
                listItem: false, // Disable from StarterKit to use our explicit version
                strike: false, // Disable from StarterKit to use our explicit version
            }),
            BulletList.configure({
                keepMarks: true,
                keepAttributes: false,
            }),
            OrderedList.configure({
                keepMarks: true,
                keepAttributes: false,
            }),
            ListItem,
            Heading.configure({
                levels: [1, 2, 3],
            }),
            Blockquote,
            TextStyle,
            Color,
            Underline,
            Strike,
            Highlight.configure({
                multicolor: true,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline hover:text-blue-800',
                },
            }),
            CodeBlock.configure({
                HTMLAttributes: {
                    class: 'bg-gray-100 dark:bg-[#282828] rounded p-2 font-mono text-sm text-gray-900 dark:text-white',
                },
            }),
            Placeholder.configure({
                placeholder: 'Start writing your content here...',
            }),
            DangerBlock,
            ImageExtension,
        ],
        content: content || {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                },
            ],
        },
        onUpdate: ({ editor }) => {
            const json = editor.getJSON();
            const html = editor.getHTML();
            onChange?.(json, html);
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none dark:prose-invert',
                placeholder: 'Start writing your content here...',
                style: 'width: 100%; max-width: 100%; min-width: 0; word-break: break-word; overflow-wrap: break-word; white-space: normal; min-height: 350px; padding: 0; margin: 0; box-sizing: border-box;',
            },
            handleKeyDown: (view, event) => {
                // Keyboard shortcuts for headings
                if (event.ctrlKey || event.metaKey) {
                    switch (event.key) {
                        case '1':
                            event.preventDefault();
                            editor?.chain().focus().toggleHeading({ level: 1 }).run();
                            return true;
                        case '2':
                            event.preventDefault();
                            editor?.chain().focus().toggleHeading({ level: 2 }).run();
                            return true;
                        case '3':
                            event.preventDefault();
                            editor?.chain().focus().toggleHeading({ level: 3 }).run();
                            return true;
                    }
                }
                return false;
            },
        },
    });

    const uploadImage = useCallback(
        async (file: File) => {
            if (!file) return;

            // Validate file type
            const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
                return;
            }

            // Validate file size (2MB limit)
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size must be less than 2MB');
                return;
            }

            setIsUploading(true);
            setUploadProgress(0);

            const formData = new FormData();
            formData.append('image', file);

            try {
                // Get CSRF token from meta tag
                const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

                const response = await axios.post('/admin/harmfulcontent/upload-image', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRF-TOKEN': token || '',
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                            setUploadProgress(progress);
                        }
                    },
                });

                if (response.data.success) {
                    editor
                        ?.chain()
                        .focus()
                        .insertContent([
                            {
                                type: 'image',
                                attrs: {
                                    src: response.data.url,
                                    alt: file.name,
                                    title: file.name,
                                },
                            },
                        ])
                        .run();

                    if (response.data.reused) {
                        toast.success('Image reused from existing uploads');
                    } else {
                        toast.success('Image uploaded successfully');
                    }
                } else {
                    toast.error(response.data.message || 'Failed to upload image');
                }
            } catch (error: any) {
                console.error('Upload error:', error);
                const errorMessage = error.response?.data?.message || error.message || 'Failed to upload image';
                toast.error(errorMessage);

                // For debugging
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                }
            } finally {
                setIsUploading(false);
                setUploadProgress(0);
            }
        },
        [editor],
    );

    const handleImageUpload = useCallback(() => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                uploadImage(file);
            }
        };
        input.click();
    }, [uploadImage]);

    const handleLink = useCallback(() => {
        if (showLinkInput) {
            if (linkUrl) {
                editor?.chain().focus().setLink({ href: linkUrl }).run();
                setLinkUrl('');
            }
            setShowLinkInput(false);
        } else {
            setShowLinkInput(true);
        }
    }, [editor, linkUrl, showLinkInput]);

    const removeLink = useCallback(() => {
        editor?.chain().focus().unsetLink().run();
    }, [editor]);

    const applyHighlight = useCallback(
        (color: string) => {
            editor?.chain().focus().toggleHighlight({ color }).run();
            setShowHighlightColors(false);
        },
        [editor],
    );

    const removeHighlight = useCallback(() => {
        editor?.chain().focus().unsetHighlight().run();
    }, [editor]);

    const applyTextColor = useCallback(
        (color: string) => {
            editor?.chain().focus().setMark('textStyle', { color }).run();
            setShowTextColors(false);
        },
        [editor],
    );

    const removeTextColor = useCallback(() => {
        editor?.chain().focus().unsetMark('textStyle').run();
    }, [editor]);

    const handleSave = useCallback(() => {
        if (editor) {
            const json = editor.getJSON();
            const html = editor.getHTML();
            onSave?.({ json, html });
        }
    }, [editor, onSave]);

    if (!editor) {
        return null;
    }

    return (
        <div
            className="rounded-lg border border-gray-200 bg-white dark:border-[#282828] dark:bg-[#121212]"
            style={{
                width: '100%',
                maxWidth: '100%',
                display: 'grid',
                gridTemplateRows: 'auto 1fr',
                overflow: 'hidden',
            }}
        >
            {isEditing && (
                <div className="flex flex-wrap gap-2 border-b border-gray-200 bg-gray-50 p-2 dark:border-[#282828] dark:bg-[#282828]">
                    {/* Text Formatting */}
                    <div className="flex gap-1">
                        <Button
                            variant={editor.isActive('bold') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            title="Bold (Ctrl+B)"
                        >
                            <Bold className="h-4 w-4" />
                        </Button>

                        <Button
                            variant={editor.isActive('italic') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            title="Italic (Ctrl+I)"
                        >
                            <Italic className="h-4 w-4" />
                        </Button>

                        <Button
                            variant={editor.isActive('underline') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().toggleUnderline().run()}
                            title="Underline (Ctrl+U)"
                        >
                            <UnderlineIcon className="h-4 w-4" />
                        </Button>

                        <Button
                            variant={editor.isActive('strike') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            title="Strikethrough"
                        >
                            <Minus className="h-4 w-4" />
                        </Button>

                        {/* Highlight with Color Picker */}
                        <div className="relative">
                            <Button
                                variant={editor.isActive('highlight') ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setShowHighlightColors(!showHighlightColors)}
                                title="Highlight"
                                className="flex items-center gap-1"
                            >
                                <Highlighter className="h-4 w-4" />
                                <ChevronDown className="h-3 w-3" />
                            </Button>

                            {showHighlightColors && (
                                <div className="absolute top-full left-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-[#282828] dark:bg-[#121212]">
                                    <div className="grid grid-cols-4 gap-1">
                                        {highlightColors.map((colorOption) => (
                                            <button
                                                key={colorOption.color}
                                                onClick={() => applyHighlight(colorOption.color)}
                                                className="flex flex-col items-center gap-1 rounded p-2 hover:bg-gray-100 dark:hover:bg-[#282828]"
                                                title={colorOption.name}
                                            >
                                                <div className="h-6 w-6 rounded border" style={{ backgroundColor: colorOption.bgColor }} />
                                                <span className="text-xs text-gray-600 dark:text-gray-300">{colorOption.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-2 border-t border-gray-200 pt-2 dark:border-[#282828]">
                                        <Button variant="outline" size="sm" onClick={removeHighlight} className="w-full text-xs">
                                            Remove Highlight
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Text Color with Palette */}
                        <div className="relative">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowTextColors(!showTextColors)}
                                title="Text Color"
                                className="flex items-center gap-1"
                            >
                                <Palette className="h-4 w-4" />
                                <ChevronDown className="h-3 w-3" />
                            </Button>

                            {showTextColors && (
                                <div className="absolute top-full left-0 z-50 mt-1 rounded-lg border border-gray-200 bg-white p-2 shadow-lg dark:border-[#282828] dark:bg-[#121212]">
                                    <div className="grid grid-cols-4 gap-1">
                                        {textColors.map((colorOption) => (
                                            <button
                                                key={colorOption.color}
                                                onClick={() => applyTextColor(colorOption.color)}
                                                className="flex flex-col items-center gap-1 rounded p-2 hover:bg-gray-100 dark:hover:bg-[#282828]"
                                                title={colorOption.name}
                                            >
                                                <div className="h-6 w-6 rounded border" style={{ backgroundColor: colorOption.color }} />
                                                <span className="text-xs text-gray-600 dark:text-gray-300">{colorOption.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                    <div className="mt-2 border-t border-gray-200 pt-2 dark:border-[#282828]">
                                        <Button variant="outline" size="sm" onClick={removeTextColor} className="w-full text-xs">
                                            Remove Text Color
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="h-6 w-px bg-gray-300 dark:bg-[#282828]" />

                    {/* Headings */}
                    <div className="flex gap-1">
                        <Button
                            variant={editor.isActive('heading', { level: 1 }) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            title="Heading 1"
                        >
                            <Heading1 className="h-4 w-4" />
                        </Button>

                        <Button
                            variant={editor.isActive('heading', { level: 2 }) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            title="Heading 2"
                        >
                            <Heading2 className="h-4 w-4" />
                        </Button>

                        <Button
                            variant={editor.isActive('heading', { level: 3 }) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            title="Heading 3"
                        >
                            <Heading3 className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="h-6 w-px bg-gray-300 dark:bg-[#282828]" />

                    {/* Lists */}
                    <div className="flex gap-1">
                        <Button
                            variant={editor.isActive('bulletList') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            title="Bullet List"
                        >
                            <List className="h-4 w-4" />
                        </Button>

                        <Button
                            variant={editor.isActive('orderedList') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            title="Numbered List"
                        >
                            <ListOrdered className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="h-6 w-px bg-gray-300 dark:bg-[#282828]" />

                    {/* Text Alignment */}
                    <div className="flex gap-1">
                        <Button
                            variant={editor.isActive({ textAlign: 'left' }) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                            title="Align Left"
                        >
                            <AlignLeft className="h-4 w-4" />
                        </Button>

                        <Button
                            variant={editor.isActive({ textAlign: 'center' }) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                            title="Align Center"
                        >
                            <AlignCenter className="h-4 w-4" />
                        </Button>

                        <Button
                            variant={editor.isActive({ textAlign: 'right' }) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                            title="Align Right"
                        >
                            <AlignRight className="h-4 w-4" />
                        </Button>

                        <Button
                            variant={editor.isActive({ textAlign: 'justify' }) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
                            title="Justify"
                        >
                            <AlignJustify className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="h-6 w-px bg-gray-300 dark:bg-[#282828]" />

                    {/* Code and Blockquote */}
                    <div className="flex gap-1">
                        <Button
                            variant={editor.isActive('code') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().toggleCode().run()}
                            title="Inline Code"
                        >
                            <Code className="h-4 w-4" />
                        </Button>

                        <Button
                            variant={editor.isActive('codeBlock') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                            title="Code Block"
                        >
                            <Code className="h-4 w-4" />
                        </Button>

                        <Button
                            variant={editor.isActive('blockquote') ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            title="Blockquote"
                        >
                            <Quote className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="h-6 w-px bg-gray-300 dark:bg-[#282828]" />

                    {/* Links and Images */}
                    <div className="flex gap-1">
                        <Button variant={editor.isActive('link') ? 'default' : 'outline'} size="sm" onClick={handleLink} title="Insert Link">
                            <LinkIcon className="h-4 w-4" />
                        </Button>

                        {editor.isActive('link') && (
                            <Button variant="outline" size="sm" onClick={removeLink} title="Remove Link">
                                <X className="h-4 w-4" />
                            </Button>
                        )}

                        <Button variant="outline" size="sm" onClick={handleImageUpload} disabled={isUploading} title="Insert Image">
                            <ImageIcon className="h-4 w-4" />
                            {isUploading ? `Uploading ${uploadProgress}%` : 'Image'}
                        </Button>
                    </div>

                    <div className="h-6 w-px bg-gray-300 dark:bg-[#282828]" />

                    {/* Special Blocks */}
                    <Button variant="outline" size="sm" onClick={() => editor.chain().focus().setNode('dangerBlock').run()} title="Danger Block">
                        <AlertTriangle className="h-4 w-4" />
                        Danger
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Horizontal Rule">
                        <Minus className="h-4 w-4" />
                    </Button>

                    <div className="flex-1" />

                    {/* History and Save */}
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editor.chain().focus().undo().run()}
                        disabled={!editor.can().undo()}
                        title="Undo (Ctrl+Z)"
                    >
                        <Undo className="h-4 w-4" />
                    </Button>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editor.chain().focus().redo().run()}
                        disabled={!editor.can().redo()}
                        title="Redo (Ctrl+Y)"
                    >
                        <Redo className="h-4 w-4" />
                    </Button>

                    {onSave && (
                        <Button variant="default" size="sm" onClick={handleSave} title="Save Content">
                            <Save className="h-4 w-4" />
                            Save
                        </Button>
                    )}
                </div>
            )}

            {/* Link Input */}
            {showLinkInput && (
                <div className="border-b border-gray-200 bg-blue-50 p-2 dark:border-[#282828] dark:bg-[#282828]">
                    <div className="flex gap-2">
                        <input
                            type="url"
                            placeholder="Enter URL..."
                            value={linkUrl}
                            onChange={(e) => setLinkUrl(e.target.value)}
                            className="flex-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm text-gray-900 placeholder-gray-500 dark:border-[#282828] dark:bg-[#121212] dark:text-white dark:placeholder-gray-400"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleLink();
                                } else if (e.key === 'Escape') {
                                    setShowLinkInput(false);
                                    setLinkUrl('');
                                }
                            }}
                            autoFocus
                        />
                        <Button size="sm" onClick={handleLink}>
                            Insert
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                                setShowLinkInput(false);
                                setLinkUrl('');
                            }}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            <div
                className="bg-white p-4 dark:bg-[#121212]"
                style={{
                    width: '100%',
                    maxWidth: '100%',
                    minWidth: 0,
                    overflow: 'hidden',
                    gridRow: 2,
                }}
            >
                <div
                    style={{
                        width: '100%',
                        maxWidth: '100%',
                        minWidth: 0,
                        overflow: 'hidden',
                    }}
                >
                    <style>
                        {`
                            .ProseMirror {
                                width: 100% !important;
                                max-width: 100% !important;
                                min-width: 0 !important;
                                word-break: break-word !important;
                                overflow-wrap: break-word !important;
                                white-space: normal !important;
                                box-sizing: border-box !important;
                                outline: none !important;
                                min-height: 350px;
                                padding: 0;
                                margin: 0;
                                color: #111827;
                            }
                            .dark .ProseMirror {
                                color: #ffffff;
                            }
                            .ProseMirror p {
                                word-break: break-word !important;
                                overflow-wrap: break-word !important;
                                white-space: normal !important;
                                width: 100% !important;
                                max-width: 100% !important;
                            }
                            .ProseMirror mark {
                                padding: 0.1em 0.2em;
                                border-radius: 0.25em;
                            }
                            .ProseMirror mark[data-color="lavender"] {
                                background-color: #e6e6fa;
                                color: #6b46c1;
                            }
                            .ProseMirror mark[data-color="mint"] {
                                background-color: #f0fff4;
                                color: #059669;
                            }
                            .ProseMirror mark[data-color="peach"] {
                                background-color: #ffe4e1;
                                color: #dc2626;
                            }
                            .ProseMirror mark[data-color="sky"] {
                                background-color: #f0f9ff;
                                color: #0284c7;
                            }
                            .ProseMirror mark[data-color="rose"] {
                                background-color: #fff1f2;
                                color: #e11d48;
                            }
                            .ProseMirror mark[data-color="lemon"] {
                                background-color: #fefce8;
                                color: #ca8a04;
                            }
                            .ProseMirror mark[data-color="lilac"] {
                                background-color: #faf5ff;
                                color: #9333ea;
                            }
                            .ProseMirror mark[data-color="coral"] {
                                background-color: #fff7ed;
                                color: #ea580c;
                            }
                            .ProseMirror span[style*="color"] {
                                font-weight: 500;
                            }
                            .ProseMirror ul {
                                list-style-type: disc;
                                padding-left: 1.5em;
                                margin: 0.5em 0;
                            }
                            .ProseMirror ol {
                                list-style-type: decimal;
                                padding-left: 1.5em;
                                margin: 0.5em 0;
                            }
                            .ProseMirror li {
                                margin: 0.25em 0;
                            }
                            .ProseMirror h1 {
                                font-size: 1.875rem;
                                font-weight: 700;
                                margin: 1em 0 0.5em 0;
                                line-height: 1.2;
                            }
                            .ProseMirror h2 {
                                font-size: 1.5rem;
                                font-weight: 600;
                                margin: 1em 0 0.5em 0;
                                line-height: 1.3;
                            }
                            .ProseMirror h3 {
                                font-size: 1.25rem;
                                font-weight: 600;
                                margin: 1em 0 0.5em 0;
                                line-height: 1.4;
                            }
                            .ProseMirror blockquote {
                                border-left: 4px solid #e5e7eb;
                                padding-left: 1em;
                                margin: 1em 0;
                                font-style: italic;
                                color: #6b7280;
                            }
                            .dark .ProseMirror blockquote {
                                border-left: 4px solid #374151;
                                color: #9ca3af;
                            }
                            .ProseMirror blockquote p {
                                margin: 0.5em 0;
                            }
                        `}
                    </style>
                    <EditorContent
                        editor={editor}
                        className="focus:outline-none"
                        style={{
                            width: '100%',
                            maxWidth: '100%',
                            minWidth: 0,
                        }}
                    />
                </div>
            </div>

            {isEditing && (
                <div className="border-t border-gray-200 bg-gray-50 p-2 text-xs text-gray-500 dark:border-[#282828] dark:bg-[#282828] dark:text-gray-400">
                    <p>Keyboard shortcuts: Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+U (Underline), Ctrl+Z (Undo), Ctrl+Y (Redo)</p>
                    <p>Lists: Use Tab to indent, Shift+Tab to outdent</p>
                    <p>Headings: Ctrl+1 (H1), Ctrl+2 (H2), Ctrl+3 (H3)</p>
                    <p>Links: Press Enter to insert, Escape to cancel</p>
                </div>
            )}
        </div>
    );
};

export default TipTapEditor;
