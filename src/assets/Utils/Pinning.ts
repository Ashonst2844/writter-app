export type PinEntry = {
    id?: string;
    type: string;
    title: string;
    content: string;
    pinnedAt?: string;
}

const STORAGE_KEY = "writter_multipins";

export function getPins(): PinEntry[] {
    const raw = localStorage.getItem(STORAGE_KEY) ?? "[]";
    
    if (raw) return JSON.parse(raw) as PinEntry[];
    else return []
}

export function savePins(pins: PinEntry[]) {
    if (pins) localStorage.setItem(STORAGE_KEY, JSON.stringify(pins));
    else return null    
}

export function clearPins() {
    localStorage.removeItem(STORAGE_KEY);
}

export default function Pinning(title: string, content: string, type: string, id?: string) {
    const pins = getPins();
    const idx = pins.findIndex(p => p.type === type && (id ? p.id === id : p.title === title));
    if (idx > -1) {
        pins.splice(idx, 1);
        savePins(pins);
        return false;
    }

    const entry: PinEntry = {id, type, title, content};

    pins.unshift(entry);

    if (pins.length > 10) pins.splice(10);

    savePins(pins);
    return true;
}