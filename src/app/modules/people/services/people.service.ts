
import { LitService } from '../../../../core';

@LitService()
export class PeopleService {

    peopleList = [
        {
            id: 'test-1',
            name: 'Test Name'
        }
    ];
    
    fetch(): any[] {
        return this.peopleList;
    }
}