/**
 * app.module
 */
import { LitModule } from '../../core';

import { PlacesComponent } from './places.component';

@LitModule({
    path: 'places',
    exports: [
        PlacesComponent
    ]
})
export class PlacesModule {

}