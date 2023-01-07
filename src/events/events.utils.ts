import { Prisma, Event } from "@prisma/client";
import { API_PATH, AppResponse, GetOptions } from "src/utils";

export const EVENTS_CONTROLLER_ROUTE = API_PATH + "/events";

export interface EventsServiceInterface {
    getUserEvents: (userID: string, options?: GetOptions) => Promise<Event[] | AppResponse>;
    getAllEvents: (options?: GetOptions) => Promise<Event[] | AppResponse>;
    createEvent: (userID: string, event: Prisma.EventCreateInput) => Promise<Event | AppResponse>;
    updateEvent: (event: Prisma.EventUpdateInput) => Promise<Event | AppResponse>;
    deleteEvent: (id: string) => Promise<Boolean | AppResponse>;
    deleteAllUserEvents: (userID: string) => Promise<Boolean | AppResponse>;
    deleteAllEvents: () => Promise<Boolean | AppResponse>;
}

