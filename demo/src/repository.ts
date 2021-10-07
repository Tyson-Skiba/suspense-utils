import { createRepository } from 'suspense-utils';

interface Entry {
    API: string;
    Auth: string;
    Category: string;
    Cors: 'unknown' | 'yes' | 'no';
    Description: string;
    HTTPS: boolean;
    Link: string;
}

export interface Result {
    count: number;
    entries: Entry[];
}

const dataResolver = async (searchTerm: string) => {
    if (!searchTerm) return { count: 0, entries: [] };

    const response = await fetch(`https://api.publicapis.org/entries?title=${searchTerm}`);
    const data = await response.json();

    return data as Result;
}

export const repository = createRepository(dataResolver);
