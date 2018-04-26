/**
 * people.component
 */
import { LitComponent } from '../../../core';
import { GetMapping } from '../../../core';

// @TODO implement di
import { PeopleService } from './services/people.service';

@LitComponent()
export class PeopleComponent {

    // TODO: implement dependency injection
    // so the child component doesn't have to take care of this
    peopleService: PeopleService = new PeopleService()

    constructor() {
    }
    
    @GetMapping()
    getPeople(req, res) {

        res.json(
            this.peopleService.fetch()
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