interface ConflictResolutionStrategy {
  resolve(localAction: any, remoteAction: any): any;
}

class LatestActionStrategy implements ConflictResolutionStrategy {
  resolve(localAction: any, remoteAction: any): any {
    return localAction.timestamp > remoteAction.timestamp ? localAction : remoteAction;
  }
}

class MergeChangesStrategy implements ConflictResolutionStrategy {
  resolve(localAction: any, remoteAction: any): any {
    if (localAction.type === 'update' && remoteAction.type === 'update') {
      return { ...remoteAction, ...localAction };
    }
    return localAction.timestamp > remoteAction.timestamp ? localAction : remoteAction;
  }
}

export { LatestActionStrategy, MergeChangesStrategy };
