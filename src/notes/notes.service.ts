import { Injectable } from "@nestjs/common";
import { Prisma, Note } from "@prisma/client";
import { prisma } from "prisma/prisma.utils";
import { AppResponse } from "src/utils";
import { filterGetNoteOptions, GetNoteOptions, NotesServiceInterface } from "./notes.utils";

@Injectable()
export class NotesService implements NotesServiceInterface {
    /**
     * Function that creates a note in the db and connects it to a user
     * @param note the object containing the properties of the note that will be created in the db
     * @param userID the id of the owner of the note
     * @returns the created note
     */
    async createNote(note: Prisma.NoteCreateInput, userID: string): Promise<Note | AppResponse> {
        try {
            // creating the note
            const createdNote = await prisma.note.create({
                data: {
                    // giving the passed note properties
                    ...note,
                    // connecting it to the corresponding user
                    user: {
                        connect: {
                            id: userID
                        }
                    }
                }
            })
            // returning the note
            return Promise.resolve(createdNote)
        } catch (e) {
            // in case of error
            const error: AppResponse = {
                message: "An error ocurred while trying to create a note",
                technicalMessage: e.message,
                status: 500
            }
            return Promise.reject(error);
        }
    }

    /**
     * Function that deletes a note from the database
     * @param id the id of the note that will be deleted
     * @returns the deleted note
     */
    async deleteNote(id: string): Promise<Note | AppResponse> {
        try {
            const deletedNote = await prisma.note.delete({
                where: { id }
            })
            return Promise.resolve(deletedNote);
        } catch (e) {
            const error: AppResponse = {
                message: `An error ocurred while trying to delete the note with id: ${id}`,
                technicalMessage: e.message,
                status: 500
            }
            return Promise.reject(e);
        }
    };

    /**
     * Function that deletes all the notes in the database
     */
    async deleteAllNotes(): Promise<boolean | AppResponse> {
        try {
            const deletedNotes = await prisma.note.deleteMany({})
            return Promise.resolve(true);
        } catch (e) {
            const error: AppResponse = {
                message: `An error ocurred while trying to delete all the notes`,
                technicalMessage: e.message,
                status: 500
            }
            return Promise.reject(error);
        }
    }

    /**
     * Function that deletes the notes of a user
     * @param userID the id of the user which will have its notes deleted
     * @returns true is the notes were deleted
     */
    async deleteUserNotes(userID: string): Promise<boolean | AppResponse> {
        try {
            const deletedNotes = await prisma.note.deleteMany({
                where: {
                    userId: userID
                }
            })
            return Promise.resolve(true);
        } catch (e) {
            const error: AppResponse = {
                message: `An error ocurred while trying to delete the notes from the user ${userID}`,
                technicalMessage: e.message,
                status: 500
            }
            return Promise.reject(error);
        }
    }

    /**
     * Function that allows to update a note
     * @param note object that contains the updated note properties
     * @returns the updated note
     */
    async updateNote(note: Prisma.NoteUpdateInput): Promise<Note | AppResponse> {
        try {
            const updatedNote = await prisma.note.update({
                where: { id: note.id as string },
                data: note
            })

            if (!updatedNote) throw new Error("The note was not found");

            return Promise.resolve(updatedNote);
        } catch (e) {
            const error: AppResponse = {
                message: "There was an error while trying to update the note",
                technicalMessage: e.message,
                status: 500
            }
            return Promise.reject(error);
        }
    }

    /**
     * Function that allows to get all of the notes created in the database with a 
     * predefined limit of 10 if no take is specified per page if no page is specified
     * take limit & page can be specified through url query in the NotesController
     * @param options the filtering options for the notes
     * @returns an array of notes based on the filtering options
     */
    async getAllNotes(options?: GetNoteOptions): Promise<AppResponse | Note[]> {
        try {
            const filteredOptions = filterGetNoteOptions(options);
            const { take, skip } = filteredOptions;
            const notes = await prisma.note.findMany({ take, skip });
            return Promise.resolve(notes);
        } catch (e) {
            const error: AppResponse = {
                message: "An error ocurred while trying to retrieve all notes",
                technicalMessage: e.message,
                status: 500
            }
            return Promise.reject(error);
        }
    }

    /**
     * Function that retrieves the notes belonging to a user
     * @param userID the user unique id used to retrieve the notes
     * @returns the user notes
     */
    async getUserNotes(userID: string): Promise<AppResponse | Note[]> {
        try {
            const notes = await prisma.note.findMany({
                where: {
                    userId: userID
                }
            })
            return Promise.resolve(notes);
        } catch (e) {
            const error: AppResponse = {
                message: `An error ocurred while trying to retrieve the notes from the user ${userID}`,
                technicalMessage: e.message,
                status: 500
            }
            return Promise.reject(error);
        }
    }

    /**
     * Function that allows to retrive a single note from the database
     * @param id the id of the note that will be searched in the db
     */
    async getSingleNote(id: string): Promise<Note | AppResponse> {
        return new Promise(() => { })
    }
}