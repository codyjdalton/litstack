/**
 * app.component
 */
import { LitComponent } from '../core';
import { GetMapping } from '../core';

@LitComponent()
export class AppComponent {
    
    @GetMapping()
    home(req, res) {
        res.json({
            message: 'Hello world!'
        });
    }
}