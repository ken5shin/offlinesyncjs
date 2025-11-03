interface ConflictResolutionStrategy {
    resolve(localAction: any, remoteAction: any): any;
}
declare class LatestActionStrategy implements ConflictResolutionStrategy {
    resolve(localAction: any, remoteAction: any): any;
}
declare class MergeChangesStrategy implements ConflictResolutionStrategy {
    resolve(localAction: any, remoteAction: any): any;
}
export { LatestActionStrategy, MergeChangesStrategy };
