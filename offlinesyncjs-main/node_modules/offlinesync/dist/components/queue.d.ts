declare class Queue {
    private queue;
    private maxQueueSize;
    constructor(config?: {
        maxQueueSize: number;
    });
    add(action: Action): void;
    get(): Action[];
    set(actions: Action[]): void;
    remove(actionId: string): void;
    clear(): void;
    isEmpty(): boolean;
    size(): number;
}
export default Queue;
