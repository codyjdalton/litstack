/**
 * app.module
 */
import { LitModule } from '../core';

import { PeopleModule } from './people/people.module';
import { PlacesModule } from './places/places.module';

@LitModule({
    path: '',
    imports: [
        PeopleModule
    ]
})
export class AppModule {

}