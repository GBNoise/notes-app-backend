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
    getUserNotes: (options?: GetNoteOptions) => Promise<Note[] | AppResponse>;
    getSingleNote: (options?: GetNoteOptions) => Promise<Note | AppResponse>;
}


export interface GetNoteOptions {
    page?: number;
    take?: number;
}