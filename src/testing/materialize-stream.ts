import { Notification, Observable } from 'rxjs';
import { materialize } from 'rxjs/operators';

export function materializeStream<T>(stream: Observable<T>): { events: Notification<T>[]; close(): void } {

    const events: Notification<T>[] = [];

    const subscription = stream.pipe(materialize()).subscribe((event) => events.push(event));

    return { events, close: () => subscription.unsubscribe() };
}
