import { Injectable } from '@angular/core';
import { BaseRepositoryService } from './base.repo';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })

export class CalendarRepositoryService extends BaseRepositoryService {
    protected repo = 'calendar';

    constructor(
        protected http: HttpClient
    ) {
        super(http);
    }

    /**
     * Get calendar By conditions
     * 
     * @param params
     * @returns Error|any
     */
    getCalendarBy(params: any)
    {
        const options = {
            params: params
        };
        
        return this.getBy(options);
    }

    /**
     * Create a new calendar
     * 
     * @param params
     * @returns Error|any
     */
    createCalendar (params: any)
    {
        const options = params;

        return this.post(options);
    }
}