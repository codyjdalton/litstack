/**
 * people.service
 */
import { of, merge, Observable } from 'rxjs';
import { mapTo, delay } from 'rxjs/operators';

import { LitService } from '../../../../../lib/core';

@LitService()
export class PeopleService {

    peopleList = [
        {
            id: 'test-1',
            name: 'Test Name'
        }
    ];
    
    fetch(): Observable<any> {
        const res = of(null);
        return merge(
            res.pipe(mapTo(
                this.peopleList
            ), delay(1000))
        );
    }
}