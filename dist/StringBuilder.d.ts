export declare class StringBuilder {
    private string;
    constructor(initial?: string);
    append(text: string | number): StringBuilder;
    delete(start: number, end: number): StringBuilder;
    deleteChar(index: number): StringBuilder;
    indexOf(str: string, fromIndex?: number): number;
    lastIndexOf(str: string, fromIndex?: number): number;
    replace(start: number, end: number, string: string): StringBuilder;
    reverse(): StringBuilder;
    length(): number;
    substring(start: number, end?: number): string;
    setCharAt(index: number, text: string): void;
    toString(): string;
}
