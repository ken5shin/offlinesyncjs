declare class Storage {
    static load(key: string): any;
    static save(key: string, value: any): void;
    static remove(key: string): void;
    static clear(): void;
}
export default Storage;
