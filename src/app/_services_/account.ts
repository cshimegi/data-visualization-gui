import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StatusCodes } from 'http-status-codes';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { User } from '@app/_models_';

const API_URL = environment.apiUrl;

@Injectable({ providedIn: 'root' })

export class AccountService {
    private readonly userBaseApi: string = API_URL + "/user";
    private readonly userLoginApi: string = this.userBaseApi + "/login";
    private readonly userRegisterApi: string = this.userBaseApi + "/register";
    private userSubject: BehaviorSubject<User>;
    public user: Observable<User>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
        this.user = this.userSubject.asObservable();
    }

    /**
     * User Getter
     * 
     * @returns User
     */
    public get userValue(): User
    {
        return this.userSubject.value;
    }

    /**
     * Login action
     * 
     * @param username 
     * @param password 
     * @returns Error|User
     */
    login(username: string, password: string)
    {
        const options = {
            name: username,
            password: password,
            isLogin: true
        };
        
        return this.http.post<Error|User>(this.userLoginApi, options)
            .pipe(
                map((data: any) => {
                    if (data.code !== StatusCodes.OK) {
                        return Error(data.error);
                    }

                    // store user details in local storage to keep user logged in between page refreshes
                    localStorage.setItem('user', JSON.stringify(data.user));
                    this.userSubject.next(data.user);
                    
                    return data.user;
                })
            );
    }

    /**
     * Logout action
     */
    logout()
    {
        // remove user from local storage and set current user to null
        localStorage.clear();
        this.userSubject.next(null);
        this.router.navigate(['/login']);
    }

    /**
     * Register action
     * 
     * @param user Object
     */
    register(user: Object)
    {
        user['isRegister'] = true;
        return this.http.post(this.userRegisterApi, user);
    }
}