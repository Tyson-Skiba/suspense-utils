import hash from 'object-hash';

interface RepositoryOptions<TArgs extends unknown[] = []> {
    toCacheKey?: (...args: Partial<TArgs>) => string;
}

export interface SuspenseRepository<TReturn, TArgs extends unknown[] = []>{
    read: (...args: TArgs) => TReturn
}

export function createRepository<TReturn, TArgs extends unknown[] = []>(
    fetcher: (...args: TArgs) => Promise<TReturn>,
    options?: RepositoryOptions<TArgs>
) {
    let cache: Record<string, TReturn> = {};
    return {
        read: (...args: TArgs): TReturn => {
            const generateCacheKey = options?.toCacheKey ?? hash;
            const cacheKey = args ? generateCacheKey(args) : 'default';
            if (cache[cacheKey] === undefined) throw fetcher(...args).then(value => (cache[cacheKey] = value));
            else return cache[cacheKey];
        }
    }
}
