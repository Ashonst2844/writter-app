export function Sanitizer(html: string) {
    return html
        .trim()
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/&nbsp;/g, ' ')
        .replace(/<[^>]*>/g, '')
}
export function Slug(text: string | null | undefined) {
    if (!text) return "NONE";
    return text.toLowerCase().trim().replaceAll(" ","-");
}