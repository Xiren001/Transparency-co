import { Node, mergeAttributes } from '@tiptap/core';
import { NodeViewWrapper, ReactNodeViewRenderer } from '@tiptap/react';
import { X } from 'lucide-react';

const ImageComponent = ({ node, updateAttributes, deleteNode }: any) => {
    const { src, alt, title } = node.attrs;

    return (
        <NodeViewWrapper className="group relative my-4">
            <img src={src} alt={alt} title={title} className="h-auto max-w-full rounded-lg shadow-md" />
            <button
                onClick={deleteNode}
                className="absolute top-2 right-2 rounded-full bg-red-500 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
            >
                <X className="h-4 w-4" />
            </button>
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
