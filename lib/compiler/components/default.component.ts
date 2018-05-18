/**
 * default.component
 */
import { HttpResponse } from "../../http";
import { LitComponent } from "../..";

@LitComponent()
export class DefaultComponent {

    notImplemented(res: HttpResponse): void {
        
        res.errored(501);
    }
}