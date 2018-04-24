/**
 * app.module
 */
import { LitModule } from '../core';

import { PeopleModule } from './people/people.module';

@LitModule({
    path: '',
    imports: [
        PeopleModule
    ]
})
export class AppModule {

}