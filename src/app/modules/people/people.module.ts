/**
 * app.module
 */
import { LitModule } from '../../../../lib/core';

import { PeopleComponent } from './people.component';

@LitModule({
    path: 'people',
    exports: [
        PeopleComponent
    ]
})
export class PeopleModule {

}