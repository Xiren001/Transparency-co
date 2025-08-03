import { Button } from '@/components/ui/button';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import axios from 'axios';
import { AlertTriangle, Bold, Image as ImageIcon, Italic, List, ListOrdered, Redo, Save, Undo } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';
import { DangerBlock } from './DangerBlock';
import { ImageExtension } from './ImageExtension';

interface TipTapEditorProps {
    content?: any;
    onChange?: (content: any) => void;
    onSave?: (content: any) => void;
    isEditing?: boolean;
}

const TipTapEditor = ({ content, onChange, onSave, isEditing = true }: TipTapEditorProps) => {
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            DangerBlock,
            ImageExtension,
        ],
        content: content || {
            type: 'doc',
            content: [
                {
                    type: 'paragraph',
                    content: [
                        {
                            type: 'text',
                            text: '',
                        },
                    ],
                },
            ],
        },
        onUpdate: ({ editor }) => {
            const json = editor.getJSON();
            onChange?.(json);
        },
        editorProps: {
            attributes: {
                class: 'prose max-w-none focus:outline-none',
                placeholder: 'Start writing your content here...',
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
                    toast.success('Image uploaded successfully');
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
        <div className="overflow-hidden rounded-lg border">
            {isEditing && (
                <div className="flex flex-wrap gap-2 border-b bg-gray-50 p-2">
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

                    <div className="h-6 w-px bg-gray-300" />

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

                    <div className="h-6 w-px bg-gray-300" />

                    <Button variant="outline" size="sm" onClick={handleImageUpload} disabled={isUploading} title="Insert Image">
                        <ImageIcon className="h-4 w-4" />
                        {isUploading ? `Uploading ${uploadProgress}%` : 'Image'}
                    </Button>

                    <Button variant="outline" size="sm" onClick={() => editor.chain().focus().setNode('dangerBlock').run()} title="Danger Block">
                        <AlertTriangle className="h-4 w-4" />
                        Danger
                    </Button>

                    <div className="flex-1" />

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

            <div className="min-h-[400px] p-4">
                <EditorContent
                    editor={editor}
                    className="prose max-w-none focus:outline-none [&_.ProseMirror]:min-h-[350px] [&_.ProseMirror]:outline-none [&_.ProseMirror_li]:ml-4 [&_.ProseMirror_ol]:list-decimal [&_.ProseMirror_ul]:list-disc"
                />
            </div>

            {isEditing && (
                <div className="border-t bg-gray-50 p-2 text-xs text-gray-500">
                    <p>Keyboard shortcuts: Ctrl+B (Bold), Ctrl+I (Italic), Ctrl+Z (Undo), Ctrl+Y (Redo)</p>
                    <p>Lists: Use Tab to indent, Shift+Tab to outdent</p>
                </div>
            )}
        </div>
    );
};

export default TipTapEditor;
