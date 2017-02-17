export interface GraphFolder {
    name: string; // user's display name
    graph: {
        lastChange: number;
        id: number; // whatever
        name: string;
    }[];
}
