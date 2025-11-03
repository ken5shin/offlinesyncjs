import { v4 as uuidv4 } from 'uuid';


class Queue {
  private queue: Action[] = [];
  private maxQueueSize: number;

  constructor(config: { maxQueueSize: number } = { maxQueueSize: 100 }) {
    this.maxQueueSize = config.maxQueueSize;
  }

  // Add an action to the queue
  add(action: Action): void {
    if (!action.id) {
      action.id = `${action.type}-${Date.now()}-${uuidv4()}`; // Generate unique ID
    }

    // Check for duplicate actions
    const exists = this.queue.some(existingAction =>
      existingAction.id === action.id ||
      (existingAction.type === action.type && JSON.stringify(existingAction.data) === JSON.stringify(action.data))
    );

    if (exists) {
      console.warn(`Duplicate action detected: ${action.id}`);
      return;
    }

    // Maintain max queue size
    if (this.queue.length >= this.maxQueueSize) {
      this.queue.shift();
    }

    this.queue.push(action);
  }

  // Get all queued actions
  get(): Action[] {
    return [...this.queue]; // Return a copy to avoid mutation
  }

  // Replace the queue with new actions
  set(actions: Action[]): void {
    if (actions.length > this.maxQueueSize) {
      actions = actions.slice(0, this.maxQueueSize); // Truncate if necessary
    }
    this.queue = actions;
  }

  // Remove action by ID
  remove(actionId: string): void {
    this.queue = this.queue.filter(action => action.id !== actionId);
  }

  // Clear all actions
  clear(): void {
    this.queue = [];
  }

  // Check if the queue is empty
  isEmpty(): boolean {
    return this.queue.length === 0;
  }

  // Get the size of the queue
  size(): number {
    return this.queue.length;
  }
}

export default Queue;
