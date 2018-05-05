[![Build Status](https://travis-ci.org/codyjdalton/litstack.svg?branch=master)](https://travis-ci.org/codyjdalton/litstack) [![npm version](https://badge.fury.io/js/%40litstack%2Fcore.svg)](https://badge.fury.io/js/%40litstack%2Fcore) [![Coverage Status](https://coveralls.io/repos/github/codyjdalton/litstack/badge.svg?branch=master)](https://coveralls.io/github/codyjdalton/litstack?branch=master)

# Litstack

## Vision

Using Angular and Spring boot design patterns, create a Typescript REST framework that developers already know how to use, keeping their code organized and concise, and pushing off all the express wiring to the library.

## Getting Started

Create a project and install the Litstack core library:

```
> mkdir my-project
> cd my-project
> npm init -y
> npm install @litstack/core
```

## Bootstrapping
First, we will need to bootstrap our app module at the index level.

```typescript
// in index.ts
import { LitCompiler } from '@litstack/core';

import { AppModule } from './app.module';

LitCompiler.bootstrap(AppModule);
```

## Modules
Modules can be declared and packaged with other imports:

```typescript
// in app.module.ts
import { LitModule } from '@litstack/core';

import { AppComponent } from './app.component';

@LitModule({
    path: '', // this could be 'api' or something
    exports: [
        AppComponent
    ]
})
export class AppModule {
}
```

## Components
Components are used as route listeners.

### Basic Component

```typescript
// in app.component
import { LitComponent } from '@litstack/core';
import { HttpRequest, HttpResponse } from '@litstack/core/http';
import { GetMapping } from '@litstack/core/http/mappings';

import { HelloService } from './services/hello.service';

@LitComponent()
export class AppComponent {

    constructor(private helloService: HelloService) {
    }

    /**
     * @function sayHello
     * @description return a success response with a message
     */ 
    @GetMapping() // accessed by GET /
    sayHello(req: HttpRequest, res: HttpResponse): void  {
        // respond with an empty array of people
        res.success({
            message: this.helloService.message
        });
    }
}
```

### Basic Service

```typescript
// in services/hello.service
import { LitService } from '@litstack/core';

@LitService()
export class HelloService {

    private messageText = 'Hello world!';
    
    get message(): string {
        return this.messageText;
    }
}
```

## Building the app

Your build process can be customized to your needs, but a minimum configuration could look
like this:

```
> npm install ts-node -D
```

And then in your package.json "scripts" change your start script to this: 

```
"start": "tsc && node dist/index.js"
```

You'll also need a tsconfig.json.

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es6",
        "outDir": "dist",
        "lib": [
            "es6"
        ],
        "experimentalDecorators": true,
        "emitDecoratorMetadata": true
        
    },
    "include": [
        "**/*.ts"
    ]
}
```

Now you should be able to run your app:

```
> npm start
```

### What else?

You can't quite do everything below, but you can do *most* of what is shown below.

```typescript
// people.component.ts
import { LitComponent } from '@litstack/core';
import { HttpRequest, HttpResponse } from '@litstack/core/http';
import { GetMapping,
         PutMapping,
         PostMapping } from '@litstack/core/http/mappings';
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
    getPeople(req: HttpRequest, res: HttpResponse): void  {
        // get the list of people by params
        this.personService.fetchAll({})
            .subscribe(
                (people: Person[]) => res.success(people),
                (err) => res.error(401)
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
    createPerson(req: HttpRequest, res: HttpResponse): void  {
        // update person
        this.personService.update(null, req.body)
            .subscribe(
                (person: Person) => res.created(person),
                (err) => res.error(404)
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
    updatePerson(req: HttpRequest, res: HttpResponse): void  {
        // update person
        this.personService.update(req.params.id, req.body)
            .subscribe(
                (person: Person) => res.success(person),
                (err) => res.error(404)
            )
    }
}
```