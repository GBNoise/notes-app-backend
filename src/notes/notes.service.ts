import { Injectable } from "@nestjs/common";
import { Prisma, Note } from "@prisma/client";
import { prisma } from "prisma/prisma.utils";
import { AppResponse } from "src/utils";
import { GetNoteOptions, NotesServiceInterface } from "./notes.utils";

@Injectable()
export class NotesService implements NotesServiceInterface {
    async createNote(note: Prisma.NoteCreateInput, userID: string): Promise<Note | AppResponse> {
        try {
            const createdNote = await prisma.note.create({
                data: {
                    ...note,
                    user: {
                        connect: {
                            id: userID
                        }
                    }
                }
            })
            return Promise.resolve(createdNote)
        } catch (e) {
            const error: AppResponse = {
                message: "An error ocurred while trying to create a note",
                technicalMessage: e.message,
                status: 500
            }
            return Promise.reject(error);
        }
    }
    deleteNote: (id: string) => Promise<Note | AppResponse>;
    deleteAllNotes: () => Promise<boolean | AppResponse>;
    deleteUserNotes: (userID: string) => Promise<boolean | AppResponse>;
    updateNote: (note: Prisma.NoteUpdateInput) => Promise<Note | AppResponse>;
    getAllNotes: (options?: GetNoteOptions) => Promise<AppResponse | Note[]>;
    getUserNotes: (options?: GetNoteOptions) => Promise<AppResponse | Note[]>;
    getSingleNote: (options?: GetNoteOptions) => Promise<Note | AppResponse>;
}