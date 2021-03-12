import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })

export class BaseRepositoryService {
    private rest_api_server = environment.apiUrl + '/';

    constructor(
        protected http: HttpClient
    ) {}

    /**
     * Get all
     * 
     * @param repo
     * @returns Error|any
     */
    protected getAll(repo: string)
    {
        return this.http.get<any>(this.rest_api_server + repo);
    }

    /**
     * Get by conditions
     * 
     * @param repo
     * @param options
     * @returns Error|any
     */
    protected getBy(repo: string, options: any)
    {
        return this.http.get<any>(this.rest_api_server + repo, options);
    }

    /**
     * Get by id
     * 
     * @param repo
     * @param id
     * @param options
     * @returns Error|any
     */
    protected getById(repo: string, id: number, options: any)
    {
        return this.http.get<any>(this.rest_api_server + repo + `/${id}`, options);
    }

    /**
     * Post action
     * 
     * @param repo
     * @param options
     * @returns Error|any
     */
    protected post(repo: string, options: any)
    {
        return this.http.post<any>(this.rest_api_server + repo + '/', options);
    }
    
    /**
     * Update by id
     * 
     * @param repo
     * @param id
     * @param options
     * @returns Error|any
     */
    protected updateById(repo: string, id: number, options: any)
    {
        return this.http.put<any>(this.rest_api_server + repo + `/${id}`, options);
    }

    /**
     * Partially update by id
     * 
     * @param repo
     * @param id
     * @param options
     * @returns Error|any
     */
    protected partialUpdateById(repo: string, id: number, options: any)
    {
        return this.http.patch<any>(this.rest_api_server + repo + `/${id}`, options);
    }

    /**
     * Delete by id
     * 
     * @param repo
     * @param options
     * @returns Error|any
     */
    protected deleteById(repo: string, id: number)
    {
        return this.http.delete<any>(this.rest_api_server + repo + `/${id}`);
    }
}