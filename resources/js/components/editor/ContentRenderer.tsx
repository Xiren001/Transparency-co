import { AlertTriangle } from 'lucide-react';

interface ContentRendererProps {
    content: any;
}

const ContentRenderer = ({ content }: ContentRendererProps) => {
    const renderNode = (node: any, index: number) => {
        switch (node.type) {
            case 'paragraph':
                return (
                    <p key={index} className="mb-4 text-gray-700 dark:text-gray-300">
                        {node.content?.map((child: any, childIndex: number) => {
                            if (child.type === 'text') {
                                let text = child.text;
                                if (child.marks) {
                                    child.marks.forEach((mark: any) => {
                                        if (mark.type === 'bold') {
                                            text = <strong key={childIndex}>{text}</strong>;
                                        } else if (mark.type === 'italic') {
                                            text = <em key={childIndex}>{text}</em>;
                                        }
                                    });
                                }
                                return text;
                            }
                            return null;
                        })}
                    </p>
                );

            case 'bulletList':
                return (
                    <ul key={index} className="mb-4 list-inside list-disc text-gray-700 dark:text-gray-300">
                        {node.content?.map((item: any, itemIndex: number) => (
                            <li key={itemIndex} className="mb-1">
                                {item.content?.map((child: any, childIndex: number) => {
                                    if (child.type === 'text') {
                                        let text = child.text;
                                        if (child.marks) {
                                            child.marks.forEach((mark: any) => {
                                                if (mark.type === 'bold') {
                                                    text = <strong key={childIndex}>{text}</strong>;
                                                } else if (mark.type === 'italic') {
                                                    text = <em key={childIndex}>{text}</em>;
                                                }
                                            });
                                        }
                                        return text;
                                    }
                                    return null;
                                })}
                            </li>
                        ))}
                    </ul>
                );

            case 'orderedList':
                return (
                    <ol key={index} className="mb-4 list-inside list-decimal text-gray-700 dark:text-gray-300">
                        {node.content?.map((item: any, itemIndex: number) => (
                            <li key={itemIndex} className="mb-1">
                                {item.content?.map((child: any, childIndex: number) => {
                                    if (child.type === 'text') {
                                        let text = child.text;
                                        if (child.marks) {
                                            child.marks.forEach((mark: any) => {
                                                if (mark.type === 'bold') {
                                                    text = <strong key={childIndex}>{text}</strong>;
                                                } else if (mark.type === 'italic') {
                                                    text = <em key={childIndex}>{text}</em>;
                                                }
                                            });
                                        }
                                        return text;
                                    }
                                    return null;
                                })}
                            </li>
                        ))}
                    </ol>
                );

            case 'dangerBlock':
                return (
                    <div key={index} className="my-4 rounded-lg border-2 border-red-500 bg-red-50 p-4 dark:border-red-400 dark:bg-red-900/20">
                        <div className="mb-2 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
                            <span className="font-bold text-red-800 dark:text-red-200">DANGER</span>
                        </div>
                        <div className="text-red-700 dark:text-red-300">
                            {node.content?.map((child: any, childIndex: number) => renderNode(child, childIndex))}
                        </div>
                    </div>
                );

            case 'image':
                return (
                    <div key={index} className="my-4">
                        <img
                            src={node.attrs.src}
                            alt={node.attrs.alt || ''}
                            title={node.attrs.title || ''}
                            className="h-auto max-w-full rounded-lg shadow-md"
                        />
                    </div>
                );

            case 'heading':
                const level = node.attrs.level;
                const className = `mb-4 font-bold text-gray-900 dark:text-gray-100 ${
                    level === 1 ? 'text-3xl' : level === 2 ? 'text-2xl' : level === 3 ? 'text-xl' : 'text-lg'
                }`;

                if (level === 1) {
                    return (
                        <h1 key={index} className={className}>
                            {node.content?.map((child: any, childIndex: number) => {
                                if (child.type === 'text') {
                                    let text = child.text;
                                    if (child.marks) {
                                        child.marks.forEach((mark: any) => {
                                            if (mark.type === 'bold') {
                                                text = <strong key={childIndex}>{text}</strong>;
                                            } else if (mark.type === 'italic') {
                                                text = <em key={childIndex}>{text}</em>;
                                            }
                                        });
                                    }
                                    return text;
                                }
                                return null;
                            })}
                        </h1>
                    );
                } else if (level === 2) {
                    return (
                        <h2 key={index} className={className}>
                            {node.content?.map((child: any, childIndex: number) => {
                                if (child.type === 'text') {
                                    let text = child.text;
                                    if (child.marks) {
                                        child.marks.forEach((mark: any) => {
                                            if (mark.type === 'bold') {
                                                text = <strong key={childIndex}>{text}</strong>;
                                            } else if (mark.type === 'italic') {
                                                text = <em key={childIndex}>{text}</em>;
                                            }
                                        });
                                    }
                                    return text;
                                }
                                return null;
                            })}
                        </h2>
                    );
                } else if (level === 3) {
                    return (
                        <h3 key={index} className={className}>
                            {node.content?.map((child: any, childIndex: number) => {
                                if (child.type === 'text') {
                                    let text = child.text;
                                    if (child.marks) {
                                        child.marks.forEach((mark: any) => {
                                            if (mark.type === 'bold') {
                                                text = <strong key={childIndex}>{text}</strong>;
                                            } else if (mark.type === 'italic') {
                                                text = <em key={childIndex}>{text}</em>;
                                            }
                                        });
                                    }
                                    return text;
                                }
                                return null;
                            })}
                        </h3>
                    );
                } else {
                    return (
                        <h4 key={index} className={className}>
                            {node.content?.map((child: any, childIndex: number) => {
                                if (child.type === 'text') {
                                    let text = child.text;
                                    if (child.marks) {
                                        child.marks.forEach((mark: any) => {
                                            if (mark.type === 'bold') {
                                                text = <strong key={childIndex}>{text}</strong>;
                                            } else if (mark.type === 'italic') {
                                                text = <em key={childIndex}>{text}</em>;
                                            }
                                        });
                                    }
                                    return text;
                                }
                                return null;
                            })}
                        </h4>
                    );
                }

            default:
                return null;
        }
    };

    const renderContent = (content: any) => {
        if (!content || !content.content) return null;

        return content.content.map((node: any, index: number) => renderNode(node, index));
    };

    return <div className="prose max-w-none">{renderContent(content)}</div>;
};

export default ContentRenderer;
