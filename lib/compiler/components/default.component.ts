/**
 * default.component
 */
import { LitComponent } from '../..';
import { HttpResponse } from '../../http';
import { GetMapping } from '../../http/mappings';

@LitComponent()
export class DefaultComponent {

    @GetMapping()
    public notImplemented(res: HttpResponse): void {

        res.errored(501);
    }
}
