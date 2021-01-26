import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/internal/operators/catchError';

export const catchErrorHandler = ((httpErrorResponse: HttpErrorResponse) => {
    if (typeof (httpErrorResponse.error) === 'string') {
        alert(httpErrorResponse.error)
    } else if (typeof (httpErrorResponse.error) === 'object') {
        if (httpErrorResponse.error.message) {
            alert(httpErrorResponse.error.message)
        } else {
            alert('Http failure response');
        }
    } else {
        alert('Http failure response');
    }
    return throwError(httpErrorResponse);
});

export const toPromise = (observable: Observable<any>, options?: any): Promise<any> => new Promise((resolve, reject) => {

    if (options && options.customCheckbox) {
        observable.pipe(
            catchError((response => {
                reject(response.error);
                return catchErrorHandler(response);
            }))
        ).subscribe((response) => {
            options.customCheckbox.instance.clean();
            options.customCheckbox.instance.init({

                dataItem: response.data,
                key: options.customCheckbox.key,
                visibleCheckbox: options.customCheckbox.visibleCheckbox
            });
            resolve(response);
        });
    }
    else {
        observable.pipe(
            catchError((response => {
                reject(response.error);
                return catchErrorHandler(response);
            }))
        ).subscribe(resolve);
    }
});