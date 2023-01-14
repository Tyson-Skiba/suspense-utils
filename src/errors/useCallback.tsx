import { useCallback as useCallbackReact, useState, DependencyList } from 'react';

type CallBackReturn<T extends (...args: any[]) => any> = ReturnType<typeof useCallbackReact<T>>;

export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: DependencyList): CallBackReturn<T>{
    const [error, setError] = useState<Error>();

    if (error) throw error;
    
    return useCallback(((...args: any) => {
        try {
            const result = callback(...args);
            Promise.resolve(result).catch((err) => setError(err));
            return result;
        } catch (err) {
            setError(err as Error);
            throw err;
        }
    }) as T, deps);
}
