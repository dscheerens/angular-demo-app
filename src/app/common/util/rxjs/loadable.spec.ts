import { Subject } from 'rxjs';

import { materializeStream } from '../../../../testing/materialize-stream';

import { LOADING, mapToLoadable, Success, Failed } from './loadable';

describe('mapToLoadable operator', () => {

    it('always starts with a loading state', () => {
        const subject = new Subject<string>();

        const { events, close } = materializeStream(subject.pipe(mapToLoadable()));

        try {
            expect(events.length).toBe(1);
            expect(events[0].kind).toEqual('N');
            expect(events[0].value).toEqual(LOADING);
        } finally {
            close();
        }
    });

    it('emits success when the source observable emits a value', () => {
        const subject = new Subject<string>();

        const { events, close } = materializeStream(subject.pipe(mapToLoadable()));

        try {
            expect(events.length).toBe(1);
            expect(events[0].kind).toEqual('N');
            expect(events[0].value).toEqual(LOADING);

            subject.next('okidoki');

            expect(events.length).toBe(2);
            expect(events[1].kind).toEqual('N');
            expect(events[1].value?.success).toBe(true);
            expect((events[1].value as Success<string>).value).toBe('okidoki');
        } finally {
            close();
        }
    });

    it('emits failed and terminates when the source observable emits an error', () => {
        const subject = new Subject<string>();

        const { events, close } = materializeStream(subject.pipe(mapToLoadable()));

        try {
            expect(events.length).toBe(1);
            expect(events[0].kind).toEqual('N');
            expect(events[0].value).toEqual(LOADING);

            subject.error({ code: 123, description: 'kaboom' });

            expect(events.length).toBe(3);
            expect(events[1].kind).toEqual('N');
            expect(events[1].value?.failed).toBe(true);
            expect((events[1].value as Failed<{ code: number; description: string }>).error).toEqual({ code: 123, description: 'kaboom' });
            expect(events[2].kind).toEqual('C');
        } finally {
            close();
        }
    });

    it('terminates when the the source observable completes', () => {
        const subject = new Subject<string>();

        const { events, close } = materializeStream(subject.pipe(mapToLoadable()));

        try {
            expect(events.length).toBe(1);
            expect(events[0].kind).toEqual('N');
            expect(events[0].value).toEqual(LOADING);

            subject.complete();

            expect(events.length).toBe(2);
            expect(events[1].kind).toEqual('C');
        } finally {
            close();
        }
    });

});
