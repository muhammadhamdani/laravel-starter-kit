import { cn } from '@/lib/utils';
import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import Typography from '@tiptap/extension-typography';
import { EditorContent, type Extension, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { InfoIcon } from 'lucide-react';
import { useEffect } from 'react';
import { Field, FieldDescription, FieldLabel } from '../ui/field';
import { ImageExtension } from '../ui/tiptap/extensions/image';
import { ImagePlaceholder } from '../ui/tiptap/extensions/image-placeholder';
import SearchAndReplace from '../ui/tiptap/extensions/search-and-replace';
import { EditorToolbar } from '../ui/tiptap/toolbars/editor-toolbar';

interface EditorProps {
    label?: string;
    className?: string;
    value: string;
    errors?: any;
    helperText?: string;
    handleOnChange: (value: string) => void;
}

export const EditorComponent = ({
    label,
    className,
    value = '',
    errors,
    helperText,
    handleOnChange,
}: EditorProps) => {
    const extensions = [
        StarterKit.configure({
            orderedList: {
                HTMLAttributes: {
                    class: 'list-decimal',
                },
            },
            bulletList: {
                HTMLAttributes: {
                    class: 'list-disc',
                },
            },
            heading: {
                levels: [1, 2, 3, 4, 5, 6],
            },
        }),
        Placeholder.configure({
            emptyNodeClass: 'is-editor-empty',
            placeholder: ({ node }) => {
                switch (node.type.name) {
                    case 'heading':
                        return `Heading ${node.attrs.level}`;
                    case 'detailsSummary':
                        return 'Section title';
                    case 'codeBlock':
                        // never show the placeholder when editing code
                        return '';
                    default:
                        return "Write, type '/' for commands";
                }
            },
            includeChildren: false,
        }),
        TextAlign.configure({
            types: ['heading', 'paragraph'],
        }),
        TextStyle,
        Subscript,
        Superscript,
        Color,
        Highlight.configure({
            multicolor: true,
        }),
        ImageExtension,
        ImagePlaceholder,
        SearchAndReplace,
        Typography,
    ];

    const editor = useEditor({
        immediatelyRender: false,
        extensions: extensions as Extension[],
        content: value,
        editorProps: {
            attributes: {
                class: 'max-w-full focus:outline-none',
            },
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            handleOnChange?.(html);
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value); // false = tidak fokuskan ulang cursor
        }
    }, [value, editor]);

    if (!editor) return null;

    return (
        <Field data-invalid={errors}>
            {label && <FieldLabel htmlFor={label}>{label}</FieldLabel>}
            <div
                className={cn(
                    'relative max-h-[calc(100dvh-6rem)] w-full overflow-hidden overflow-y-scroll border bg-card pb-15 sm:pb-0',
                    className,
                )}
            >
                <EditorToolbar editor={editor} />
                <EditorContent
                    editor={editor}
                    className="min-h-150 w-full min-w-full cursor-text sm:p-6"
                />
            </div>
            {helperText && (
                <FieldDescription
                    className={cn(
                        'flex items-center space-x-2',
                        errors ? 'text-destructive' : 'text-yellow-500',
                    )}
                >
                    <InfoIcon
                        className={cn(
                            'h-4 w-4',
                            errors ? 'text-destructive' : 'text-yellow-500',
                        )}
                    />
                    <span>{helperText}</span>
                </FieldDescription>
            )}
        </Field>
    );
};
