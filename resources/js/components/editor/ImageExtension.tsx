import { Node, mergeAttributes } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { X } from 'lucide-react';

const ImageComponent = ({ node, updateAttributes, deleteNode }: any) => {
    const { src, alt, title } = node.attrs;
    
    // Extract filename from src URL or use alt/title
    const getImageName = () => {
        if (src) {
            // Try to extract filename from URL
            try {
                const url = new URL(src);
                const pathname = url.pathname;
                const filename = pathname.split('/').pop();
                if (filename) return filename;
            } catch {
                // If URL parsing fails, try to extract from path
                const pathParts = src.split('/');
                const filename = pathParts[pathParts.length - 1];
                if (filename) return filename;
            }
        }
        // Fallback to alt or title
        return alt || title || 'Image';
    };

    const imageName = getImageName();

    return (
        <NodeViewWrapper className="group relative my-4">
            <div className="flex items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-4 hover:border-gray-400 transition-colors">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6l.586-.586a2 2 0 012.828 0L20 8m-6-6l-.586.586a2 2 0 00-2.828 0L8 8m-6-6l.586-.586a2 2 0 00-2.828 0L4 8" />
                    </svg>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{imageName}</p>
                    <p className="text-xs text-gray-500">Image file</p>
                </div>
                <button
                    onClick={deleteNode}
                    className="rounded-full bg-red-500 p-2 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-600"
                    title="Remove image"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </NodeViewWrapper>
    );
};

export const ImageExtension = Node.create({
    name: 'image',
    group: 'block',
    atom: true,

    addAttributes() {
        return {
            src: {
                default: null,
            },
            alt: {
                default: null,
            },
            title: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'img[src]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['img', mergeAttributes(HTMLAttributes)];
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageComponent);
    },
});
