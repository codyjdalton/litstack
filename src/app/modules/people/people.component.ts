/**
 * people.component
 */
import { LitComponent } from '../../../../lib/core';
import { HttpRequest, HttpResponse } from '../../../../lib/core/http'
import { GetMapping, PostMapping } from '../../../../lib/core/http/mappings';

import { PeopleService } from './services/people.service';

@LitComponent()
export class PeopleComponent {

    constructor(public peopleService: PeopleService) {
    }
    
    @GetMapping()
    getPeople(req: HttpRequest, res: HttpResponse): void {
        this.peopleService.fetch()
            .subscribe(
                data => res.json(data)
            );
    }

    @GetMapping({
        path: ':id'
    })
    getPerson(req: HttpRequest, res: HttpResponse): void {
        res.json({
            id: req.params.id,
            message: 'test'
        });
    }

    @PostMapping()
    createPerson(req: HttpRequest, res: HttpResponse): void {
        res.json({
            created: 'message'
        });
    }
}