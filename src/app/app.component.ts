/**
 * app.component
 */
import { LitComponent } from '../../lib/core';
import { HttpRequest, HttpResponse } from '../../lib/core/http';
import { GetMapping } from '../../lib/core/http/mappings';

@LitComponent()
export class AppComponent {
    
    @GetMapping()
    home(req: HttpRequest, res: HttpResponse) {
        res.success({
            message: 'Hello world!'
        });
    }
}