import type { RefObject } from "react";

export function useFormat(ref: Array<RefObject<HTMLElement | null>>) {
    const executeCommand = (command: string) => {
        document.execCommand(command, false, undefined);
        ref.forEach(r => r.current?.focus());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.execCommand('insertLineBreak', false);
        }
        if (e.key === 'Tab') {
            e.preventDefault();
            document.execCommand('insertHTML', false, '&nbsp;&nbsp;')
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
    };

    const clearFormat = () => {
        document.execCommand("removeFormat", false, undefined);
        
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const fragment = range.extractContents();
            
            const removeBackgroundColor = (node: Node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node as HTMLElement;
                    element.style.backgroundColor = "";
                    element.style.background = "";
                    Array.from(element.childNodes).forEach(removeBackgroundColor);
                }
            };
            
            removeBackgroundColor(fragment);
            range.insertNode(fragment);
            selection.removeAllRanges();
            selection.addRange(range);
        }
        
        ref.forEach(r => r.current?.focus());
    };

    return {executeCommand, handleKeyDown, handlePaste, clearFormat}
}