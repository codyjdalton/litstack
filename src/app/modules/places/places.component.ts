/**
 * places.component
 */
import { LitComponent } from '../../../core';
import { GetMapping } from '../../../core';

@LitComponent()
export class PlacesComponent {
    
    @GetMapping()
    getPlaces(req, res) {
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