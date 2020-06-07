import { OperatorFunction, of } from 'rxjs';
import { map, catchError, startWith } from 'rxjs/operators';

export interface Loading {
    loading: true;
    success: false;
    failed: false;
}

export interface Success<ValueType> {
    loading: false;
    success: true;
    failed: false;
    value: ValueType;
}

export interface Failed<ErrorType> {
    loading: false;
    success: false;
    failed: true;
    error: ErrorType;
}

export type Loadable<ValueType, ErrorType = any> = Loading | Success<ValueType> | Failed<ErrorType>;

export const LOADING: Loading = { loading: true, success: false, failed: false };

export function success<T>(value: T): Success<T> {
    return { loading: false, success: true, failed: false, value };
}

export function failed<T>(error: T): Failed<T> {
    return { loading: false, success: false, failed: true, error };
}

export function mapToLoadable<T>(): OperatorFunction<T, Loadable<T>> {
    return (source$) => source$.pipe(
        map(success),
        catchError((error) => of(failed(error))),
        startWith(LOADING)
    );
}
