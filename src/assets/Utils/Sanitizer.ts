export function Sanitizer(html: string) {
    return html
        .trim()
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/&nbsp;/g, ' ')
        .replace(/<[^>]*>/g, '')
}