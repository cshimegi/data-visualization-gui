import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseRepositoryService } from './base.repo';


@Injectable({ providedIn: 'root' })

export class UserLogRepositoryService extends BaseRepositoryService {
    protected repo = 'user_log';

    constructor(
        protected http: HttpClient
    ) {
        super(http);
    }

    /**
     * Get user logs By page index and conditions
     * 
     * @param pageIndex
     * @param params
     * @returns Error|any
     */
    getUserLogsBy(pageIndex: number, params: any)
    {
        const options = {
            params: params,
            page: pageIndex + 1
        };
        
        return this.getBy(options);
    }
}