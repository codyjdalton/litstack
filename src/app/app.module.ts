/**
 * app.module
 */
import { LitModule } from '../core';

import { AppComponent } from './app.component';
import { PeopleModule } from './modules/people/people.module';

@LitModule({
    path: '',
    imports: [
        PeopleModule
    ],
    exports: [
        AppComponent
    ]
})
export class AppModule {

}