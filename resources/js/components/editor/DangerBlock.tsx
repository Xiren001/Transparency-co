import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { AlertTriangle } from 'lucide-react';

const DangerBlockComponent = ({ node }: { node: any }) => {
    return (
        <div className="my-4 rounded-lg border-2 border-red-500 bg-red-50 p-4 dark:border-red-400 dark:bg-red-900/20">
            <div className="mb-2 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="font-bold text-red-800 dark:text-red-200">DANGER</span>
            </div>
            <div className="text-red-700 dark:text-red-300" />
        </div>
    );
};

export const DangerBlock = Node.create({
    name: 'dangerBlock',
    group: 'block',
    content: 'block+',
    defining: true,

    addAttributes() {
        return {
            id: {
                default: null,
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'div[data-type="danger-block"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['div', mergeAttributes(HTMLAttributes, { 'data-type': 'danger-block' }), 0];
    },

    addNodeView() {
        return ReactNodeViewRenderer(DangerBlockComponent);
    },

    addKeyboardShortcuts() {
        return {
            'Mod-Alt-d': () => this.editor.commands.setNode(this.name),
        };
    },

    // Remove custom commands to avoid TypeScript issues
    // Commands will be handled directly in the editor
});
