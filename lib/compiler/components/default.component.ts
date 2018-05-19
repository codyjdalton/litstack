/**
 * default.component
 */
import { LitComponent } from "../..";
import { HttpResponse } from "../../http";

@LitComponent()
export class DefaultComponent {

    public notImplemented(res: HttpResponse): void {

        res.errored(501);
    }
}
