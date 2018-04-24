/**
 * app.module
 */
import { LitModule } from '../../../core';

import { PeopleComponent } from './people.component';

@LitModule({
    path: 'people',
    exports: [
        PeopleComponent
    ]
})
export class PeopleModule {

}