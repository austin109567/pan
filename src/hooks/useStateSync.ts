import { useEffect } from 'react';
import { stateManager } from '../services/StateManager';

export function useStateSync(event: string, callback: (...args: any[]) => void) {
  useEffect(() => {
    const unsubscribe = stateManager.subscribe(event, callback);
    return () => unsubscribe();
  }, [event, callback]);
}

export function useGlobalStateSync(callback: () => void) {
  useEffect(() => {
    const unsubscribe = stateManager.subscribe('stateSync', callback);
    return () => unsubscribe();
  }, [callback]);
}