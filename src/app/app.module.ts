/**
 * app.module
 */
import { LitModule } from '../core';

import { AppComponent } from './app.component';
import { PeopleModule } from './modules/people/people.module';
import { PlacesModule } from './modules/places/places.module';

@LitModule({
    path: '',
    imports: [
        PeopleModule,
        PlacesModule
    ],
    exports: [
        AppComponent
    ]
})
export class AppModule {

}