# Litstack

## Vision

This is currently a pseudo-code exercise in designing the type of framework one would want to use for an express web service.


## Bootstrapping
First, we will need to bootstrap our app module at the index level.

```javascript
// index.ts
import { serviceCompiler } from '@litstack/core';

import { AppModule } from './modules/app.module';

serviceCompiler().bootstrapModule(AppModule);
```

## Modules
Modules can be declared and packaged with other imports:

```javascript
// people.module.ts
import { LitModule } from '@litstack/core';

import { PeopleComponent } from './people.component';
import { PeopleDetailsComponent } from './components/people-details/people-details.component';

@LitModule({
    path: 'people',
    exports: [
        PeopleComponent,
        PeopleDetailsComponent
    ]
})
export class PeopleModule {
}
```

## Components
Components are used as route listeners.

### Basic Component

```typescript
// people.component.ts
import { LitComponent } from '@litstack/core';
import { HttpRequest, HttpResponse } from '@litstack/http';
import { GetMapping } from '@litstack/http/mappings';

@LitComponent()
export class PeopleComponent {
    /**
     * @function getPeople
     * @description Return a list of people
     */ 
    @GetMapping() // accessed by GET /people
    getPeople(req: HttpRequest, res: HttpResponse): void  {
        // respond with an empty array of people
        res.json([]);
    }
}
```

### Target Component

This is not yet a reality, but it is the direction:

```typescript
// people.component.ts
import { LitComponent } from '@litstack/core';
import { Request, Response } from '@litstack/http';
import { GetMapping, PutMapping, PostMapping } from '@litstack/http/mappings';

import { Person } from '../../common/models/person.model';
import { PersonService } from '../../common/services/person.service';
import { ResourceVersions } from '../common/enums/resource-versions.enum';

@LitComponent()
export class PeopleComponent {

    constructor(private personService: PersonService) {
    }

    /**
     * @function getPeople
     * @description Return a list of people
     */ 
    @GetMapping({
        produces: ResourceVersions.PEOPLE_V1 // Content-Type header
    })
    getPeople(req: Request, res: Response): void  {
        // get the list of people by params
        this.personService.fetchAll({})
            .subscribe(
                (people: Person[]) => res.json(people)
            )
    }

    /**
     * @function createPerson
     * @description Create a 'person' record
     */
    @PostMapping({
        consumes: ResourceVersions.PERSON_V1 // Accept header
        produces: ResourceVersions.PERSON_V1 // Content-Type header
    })
    createPerson(req: Request, res: Response): void  {
        // update person
        this.personService.update(null, req.body)
            .subscribe(
                (person: Person) => res.json(person)
            )
    }

    /**
     * @function updatePerson
     * @description Update a 'person' record
     */
    @PutMapping({
        path: ':id', // accessed by PUT /people/:id
        consumes: ResourceVersions.PERSON_V1 // Accept header
        produces: ResourceVersions.PERSON_V1 // Content-Type header
    })
    updatePerson(req: Request, res: Response): void  {
        // update person
        this.personService.update(req.params.id, req.body)
            .subscribe(
                (person: Person) => res.json(person)
            )
    }
}
```