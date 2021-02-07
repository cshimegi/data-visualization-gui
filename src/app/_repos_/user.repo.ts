import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseRepositoryService } from './base.repo';


@Injectable({ providedIn: 'root' })

export class UserRepositoryService extends BaseRepositoryService {
    private userRepo = 'user';
    private userLogRepo = 'user_log';

    constructor(
        protected http: HttpClient
    ) {
        super(http);
    }

    /**
     * Get all users
     * 
     * @param repo
     * @param options
     * @returns Error|any
     */
    getAllUsers()
    {
        return this.getAll(this.userRepo);
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
            params: params
        };
        
        return this.getBy(this.userLogRepo + `/?page=${pageIndex+1}`, options);
    }
}