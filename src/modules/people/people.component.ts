/**
 * people.component
 */
import { LitComponent } from '../../core';
import { GetMapping } from '../../core';

@LitComponent()
export class PeopleComponent {
    
    @GetMapping()
    getPeople(req, res) {
        res.json([]);
    }

    @GetMapping({
        path: ':id'
    })
    getPerson(req, res) {
        res.json({
            id: 'test'
        });
    }
}