/**
 * app.component
 */
import { LitComponent } from '../core';
import { GetMapping } from '../core';
import { HttpRequest, HttpResponse } from '../core/http';

@LitComponent()
export class AppComponent {
    
    @GetMapping()
    home(req: HttpRequest, res: HttpResponse) {
        res.json({
            message: 'Hello world!'
        });
    }
}