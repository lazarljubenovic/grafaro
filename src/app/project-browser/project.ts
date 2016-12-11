export interface Project {
    id: string;
    title: string;
    description: string;
    tags: string[];
    creator: {
        name: string;
        handle: string;
    };
    isMadeByProfessor: boolean;
    numberOfPeopleOnline: number;
    numberOfLikes: number;
    numberOfDislikes: number;
}
