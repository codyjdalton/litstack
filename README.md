# Litstack

## Vision

This is currently a mostly pseudo-code exercise in designing the type of framework one would want to use for an express service.

## Bootstrapping
We will need to bootstrap our app module at the index level

```javascript
// index.ts
import { serviceCompiler } from '@litstack/core';
import { AppModule } from './modules/app.module';

serviceCompiler().bootstrapModule(AppModule);
```

## Modules
Modules can be declared and packaged with other modules:

```javascript
// people.module.ts
import { LitModule, StorageModule } from '@litstack/core';
import { PeopleComponent } from './components/people/people.component'

@LitModule({
    path: 'people',
    imports: [
        StorageModule,
        PeopleComponent
    ]
})
export class PeopleModule {
}
```

## Components
Components are used as route listeners.

```javascript
// people.component.ts
import { LitComponent } from '@litstack/core';
import { Paginated } from '@litstack/response';

import { ResourceVersions } from '../common/enums/resource-versions.enum';

@LitComponent()
export class PeopleComponent {

    /**
     * @function getPeople
     * @description Return a list of people, paginated
     */ 
    @GetMapping({
        path: '', // accessed by GET /people
        produces: ResourceVersions.PEOPLE_V1 // Content-Type header
    })
    @Paginated()
    getPeople(req, res): any  {
        // get the list of people by params
        return {
            people: []
        }
    }

    /**
     * @function updatePerson
     * @description Update a 'person' record
     */
    @PutMapping({
        path: ':id', // accessed by PUT /people/:id
        consumes: ResourceVersions.PEOPLE_V1 // Accept header
        produces: ResourceVersions.PEOPLE_V1 // Content-Type header
    })
    updatePerson(req, res): any  {
        // update person
        // then... return the person
        return {
            fName: 'test',
            lName: 'name'
        }
    }
}
```




