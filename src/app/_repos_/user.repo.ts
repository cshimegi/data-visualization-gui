import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseRepositoryService } from './base.repo';


@Injectable({ providedIn: 'root' })

export class UserRepositoryService extends BaseRepositoryService {
    protected repo = 'user';

    constructor(
        protected http: HttpClient
    ) {
        super(http);
    }
}