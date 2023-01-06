import { Note, Prisma } from "@prisma/client";
import { API_PATH, AppResponse } from "src/utils";

export const NOTES_CONTROLLER_ROUTE: string = API_PATH + "/notes";

export interface NotesServiceInterface {
    createNote: (note: Prisma.NoteCreateInput, userID: string) => Promise<Note | AppResponse>;
    deleteNote: (id: string) => Promise<Note | AppResponse>;
    deleteAllNotes: () => Promise<boolean | AppResponse>;
    deleteUserNotes: (userID: string) => Promise<boolean | AppResponse>;
    updateNote: (note: Prisma.NoteUpdateInput) => Promise<Note | AppResponse>;
    getAllNotes: (options?: GetNoteOptions) => Promise<Note[] | AppResponse>;
    getUserNotes: (userID: string) => Promise<Note[] | AppResponse>;
    getSingleNote: (id:string) => Promise<Note | AppResponse>;
}


export interface GetNoteOptions {
    page?: number;
    take?: number;
}

export const filterGetNoteOptions = (options: GetNoteOptions) => {
    let { page, take } = options;
    page = page ? page <= 0 ? 1 : page : 1;
    take = take || 10;
    let skip = page ? (page * take) - take : 0;
    return { take, skip };
}