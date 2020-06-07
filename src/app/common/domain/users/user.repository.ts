import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mapTo } from 'rxjs/operators';

import { commit } from '../../util/rxjs/commit.operator';

import { User } from './user.model';

@Injectable({ providedIn: 'root' })
export class UserRepository {

    constructor(
        private readonly httpClient: HttpClient
    ) { }

    public createUser(user: User): Observable<void> {
        return this.httpClient.post('https://demo-api.now.sh/users', this.serializeUser(user)).pipe(
            mapTo(undefined),
            commit()
        );
    }

    private serializeUser(user: User): UserDto {
        return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email
        };
    }

}

interface UserDto {
    firstName: string;
    lastName: string;
    email: string;
}
