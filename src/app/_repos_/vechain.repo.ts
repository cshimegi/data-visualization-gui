import { Injectable } from '@angular/core';
import { BaseRepositoryService } from './base.repo';
import { HttpClient } from '@angular/common/http';


@Injectable({ providedIn: 'root' })

export class VechainRepositoryService extends BaseRepositoryService {
    private vechainRepo = 'vechain';

    constructor(
        protected http: HttpClient
    ) {
        super(http);
    }

    /**
     * Get all vechain
     * 
     * @param repo
     * @param options
     * @returns Error|any
     */
    getAllVechain()
    {
        return this.getAll(this.vechainRepo);
    }

    /**
     * Get vechain By conditions
     * 
     * @param params
     * @returns Error|any
     */
    getVechainBy(params: any)
    {
        const options = {
            params: params
        };
        
        return this.getBy(this.vechainRepo, options);
    }
}