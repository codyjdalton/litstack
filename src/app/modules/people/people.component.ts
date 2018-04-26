/**
 * people.component
 */
import { LitComponent } from '../../../core';
import { GetMapping } from '../../../core';

// @TODO implement di
//import { PeopleService } from './services/people.service';

@LitComponent()
export class PeopleComponent {

    peopleList = [
        {
            id: 'test-1',
            name: 'Test Name'
        }
    ];

    constructor() {
    }
    
    @GetMapping()
    getPeople(req, res) {
        res.json(
            this.peopleList
        );
    }

    @GetMapping({
        path: ':id'
    })
    getPerson(req, res) {
        res.json({
            id: req.params.id,
            message: 'test'
        });
    }
}