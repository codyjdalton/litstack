/**
 * people.component
 */
import { LitComponent } from '../../../core';
import { GetMapping } from '../../../core';
import { HttpRequest, HttpResponse } from '../../../core/http';

// @TODO implement di
import { PeopleService } from './services/people.service';

@LitComponent()
export class PeopleComponent {

    constructor(public peopleService: PeopleService) {
    }
    
    @GetMapping()
    getPeople(req: HttpRequest, res: HttpResponse) {
        this.peopleService.fetch()
            .subscribe(
                data => res.json(data)
            );
    }

    @GetMapping({
        path: ':id'
    })
    getPerson(req: HttpRequest, res: HttpResponse) {
        res.json({
            id: req.params.id,
            message: 'test'
        });
    }
}