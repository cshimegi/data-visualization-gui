import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })

export class BaseRepositoryService {
    private rest_api_server = environment.apiUrl + '/';
    protected repo: string;

    constructor(
        protected http: HttpClient
    ) {}

    /**
     * Get all
     * 
     * @returns Error|any
     */
    getAll()
    {
        return this.http.get<any>(this.rest_api_server + this.repo);
    }

    /**
     * Get by conditions
     * 
     * @param options
     * @returns Error|any
     */
    getBy(options: any)
    {
        return this.http.get<any>(this.rest_api_server + this.repo, options);
    }

    /**
     * Get by id
     * 
     * @param id
     * @param options
     * @returns Error|any
     */
    getById(id: number, options: any)
    {
        return this.http.get<any>(this.rest_api_server + this.repo + `/${id}`, options);
    }

    /**
     * Post action
     * 
     * @param options
     * @returns Error|any
     */
    post(options: any)
    {
        return this.http.post<any>(this.rest_api_server + this.repo + '/', options);
    }
    
    /**
     * Update by id
     * 
     * @param id
     * @param options
     * @returns Error|any
     */
    updateById(id: number, options: any)
    {
        return this.http.put<any>(this.rest_api_server + this.repo + `/${id}`, options);
    }

    /**
     * Partially update by id
     * 
     * @param id
     * @param options
     * @returns Error|any
     */
    partialUpdateById(id: number, options: any)
    {
        return this.http.patch<any>(this.rest_api_server + this.repo + `/${id}`, options);
    }

    /**
     * Delete by id
     * 
     * @param options
     * @returns Error|any
     */
    deleteById(id: number)
    {
        return this.http.delete<any>(this.rest_api_server + this.repo + `/${id}`);
    }
}