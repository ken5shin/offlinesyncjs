export function isOnline(): boolean {
  return navigator.onLine;
}

export function getCurrentTimestamp(): number {
  return Date.now();
}
