import { Injectable } from '@nestjs/common';
import { Event, Prisma } from '@prisma/client';
import { prisma } from 'prisma/prisma.utils';
import { GetOptions, AppResponse, filterGetOptions } from 'src/utils';
import { EventsServiceInterface } from './events.utils';

@Injectable()
export class EventsService implements EventsServiceInterface {
    /**
     * Function that retrieves all the user events belonging to a user
     * @param userID the unique user id 
     * @param options the filtering options containing how many events should be taken and the page
     * @returns the user events
     */
    async getUserEvents(userID: string, options: GetOptions): Promise<AppResponse | Event[]> {
        try {
            const { take, skip } = filterGetOptions(options);
            const events = await prisma.event.findMany({
                where: {
                    userId: userID
                }, take, skip
            });
            return Promise.resolve(events)
        } catch (e) {
            const error: AppResponse = {
                message: `An error ocurred while trying to delete all the events belonging to user ${userID}`,
                technicalMessage: e.message,
                status: 500,
            }
            return Promise.reject(error);
        }
    }

    /**
     * Function that will retrieve all the user events in the database
     * @param options the filtering options containing how many events should be taken and the page
     * @returns all the user events in the database
     */
    async getAllEvents(options: GetOptions): Promise<AppResponse | Event[]> {
        try {
            const { take, skip } = filterGetOptions(options);
            const events = await prisma.event.findMany({ take, skip })
            return Promise.resolve(events);
        } catch (e) {
            const error: AppResponse = {
                message: "An error ocurred while trying to get all events",
                technicalMessage: e.message,
                status: 500
            }
            return Promise.reject(error);
        }
    }

    /**
     * Function that allows to create a user event
     * @param userID the unique user id 
     * @param event the object containing the properties of the event that will be created
     * @returns the created user event
     */
    async createEvent(userID: string, event: Prisma.EventCreateInput): Promise<Event | AppResponse> {
        try {
            const createdEvent = await prisma.event.create({
                data: {
                    ...event,
                    user: {
                        connect: {
                            id: userID
                        }
                    }
                }
            })
            return Promise.reject(createdEvent);
        } catch (e) {
            const error: AppResponse = {
                message: "An error ocurred while trying to create a user event",
                technicalMessage: e.message,
                status: 500,
            }
            return Promise.reject(error);
        }
    }

    /**
     * Function that allows to update an existing user event
     * @param event the object containing the properties of the event that will be updated
     * @returns the updated event
     */
    async updateEvent(event: Prisma.EventUpdateInput): Promise<Event | AppResponse> {
        try {
            const updatedEvent = await prisma.event.update({
                where: { id: event.id as string },
                data: event
            })
            return Promise.resolve(updatedEvent);
        } catch (e) {
            const error: AppResponse = {
                message: "An error ocurred while trying to update a user event",
                technicalMessage: e.message,
                status: 500,
            }
            return Promise.reject(error);
        }
    }

    /**
     * Function that allows to delete an event
     * @param id the unique id of the event
     * @returns true if the user event was successfully deleted
     */
    async deleteEvent(id: string): Promise<Boolean | AppResponse> {
        try {
            // !!! NEED TO VERIFY IF THE EVENT BELONGS TO THE USER DELETING IT
            // !!! OR TO MAKE IT DELETABLE IF THE USER IS ADMIN
            // !!! SAME PROBLEM WITH NOTES I GUESS
            const deletedEvent = await prisma.event.delete({
                where: { id }
            })
            return Promise.resolve(true);
        } catch (e) {
            const error: AppResponse = {
                message: "An error ocurred while trying to delete a user event",
                technicalMessage: e.message,
                status: 500
            }
            return Promise.reject(error);
        }
    }

    /**
     * Function that allows to delete all of the events of a user
     * @param userID the unqiue id of the user which will have all their events deleted
     * @returns true if all of the user events correspoding to the user specified were deleted
     */
    async deleteAllUserEvents(userID: string): Promise<Boolean | AppResponse> {
        try {
            const deletedEvents = await prisma.event.deleteMany({
                where: {
                    userId: userID
                }
            })
            return Promise.resolve(true);
        } catch (e) {
            const error: AppResponse = {
                message: `An error ocurred while trying to delete all the user events from user ${userID}`,
                technicalMessage: e.message,
                status: 500,
            }
            return Promise.reject(error);
        }
    }


    /**
     * Function that allows to delete all of the user events stored in the database
     * @returns true if all of the events were deleted
     */
    async deleteAllEvents(): Promise<Boolean | AppResponse> {
        try {
            const deletedEvents = await prisma.event.deleteMany({});
            return Promise.resolve(true);
        } catch (e) {
            const error: AppResponse = {
                message: `An error ocurred while trying to delete all user events`,
                technicalMessage: e.message,
                status: 500
            }
            return Promise.reject(error);
        }
    }
}
