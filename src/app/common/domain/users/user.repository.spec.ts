import { HttpMethod, createHttpFactory } from '@ngneat/spectator';

import { materializeStream } from '../../../../testing/materialize-stream';

import { UserRepository } from './user.repository';

describe('UserRepository class', () => {

    describe('createUser function', () => {

        const http = createHttpFactory(UserRepository);

        it('sends the correct request to the backend', () => {
            const { service, expectOne } = http();

            service.createUser({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 's3cr3t' });

            const request = expectOne('https://demo-api.now.sh/users', HttpMethod.POST);

            expect(request.request.body).toEqual({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' });
        });

        it('emits `undefined` when a successful response is received', () => {
            const { service, expectOne } = http();

            const result$ = service.createUser({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 's3cr3t' });

            const { events, close } = materializeStream(result$);

            try {
                expect(events.length).toBe(0);

                const request = expectOne('https://demo-api.now.sh/users', HttpMethod.POST);

                request.flush(null);

                expect(events.length).toBe(2);
                expect(events[0].kind).toBe('N');
                expect(events[0].value).toBeUndefined();
                expect(events[1].kind).toBe('C');
            } finally {
                close();
            }
        });

        it('emits an error event when a unsuccessful response is received', () => {
            const { service, expectOne } = http();

            const result$ = service.createUser({ firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com', password: 's3cr3t' });

            const { events, close } = materializeStream(result$);

            try {
                expect(events.length).toBe(0);

                const request = expectOne('https://demo-api.now.sh/users', HttpMethod.POST);

                request.error(new ErrorEvent('kaboom'), { status: 500, statusText: 'Intenal Server Error' });

                expect(events.length).toBe(1);
                expect(events[0].kind).toBe('E');
            } finally {
                close();
            }
        });

    });

});
