/**
 * places.component
 */
import { LitComponent } from '../../../core';
import { GetMapping } from '../../../core';
import { HttpRequest, HttpResponse } from '../../../core/http';

@LitComponent()
export class PlacesComponent {
    
    @GetMapping()
    getPlaces(req: HttpRequest, res: HttpResponse) {
        res.json([
            {
                name: 'Home'
            },
            {
                name: 'Work'
            }
        ]);
    }
}