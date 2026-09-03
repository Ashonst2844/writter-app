export function Sanitizer(html: string) {
    return html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/&nbsp;/g, ' ')
        .replace(/<[^>]*>/g, '')
}

export default function Pinning(head: string, body: string, from: string) {
    if(!head && !body && !from) return
    window.localStorage.setItem('pinned', JSON.stringify({
        head: Sanitizer(head),
        body: Sanitizer(body),
        from: Sanitizer(from)
    }))
}