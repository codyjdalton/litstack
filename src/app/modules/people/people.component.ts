/**
 * people.component
 */
import { LitComponent } from '../../../core';
import { GetMapping } from '../../../core';

import { PeopleService } from './services/people.service';

@LitComponent()
export class PeopleComponent {

    constructor() {
    }
    
    @GetMapping()
    getPeople(req, res) {
        res.json([]);
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