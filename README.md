[![npm version](https://badge.fury.io/js/%40litstack%2Fcore.svg)](https://badge.fury.io/js/%40litstack%2Fcore) [![Build Status](https://travis-ci.org/codyjdalton/litstack.svg?branch=master)](https://travis-ci.org/codyjdalton/litstack) [![Coverage Status](https://coveralls.io/repos/github/codyjdalton/litstack/badge.svg?branch=master)](https://coveralls.io/github/codyjdalton/litstack?branch=master)

# Litstack

## Vision

Using Angular and Spring boot design patterns, create a Typescript REST framework that developers already know how to use, keeping their code organized and concise, and pushing off all the express wiring to the library.

## Getting Started

### Option 1: Clone the seed app

You can [clone the litstack seed](https://github.com/codyjdalton/litstack-seed) and get started right away. Or you can set up a project manually.

### Option 2: Start with a blank slate

Create a project and install the Litstack core library.

```
> mkdir my-project
> cd my-project
> npm init -y
> npm install typescript -D
> npm install @litstack/core
```

## Components
Components are used as route listeners.

### Basic Component

```typescript
// in app.component.ts
import { LitComponent } from '@litstack/core';
import { HttpRequest, HttpResponse } from '@litstack/core/dist/http';
import { GetMapping } from '@litstack/core/dist/http/mappings';

@LitComponent()
export class AppComponent {

    private message = 'Hello world!';

    @GetMapping({
        path: '' // GET / is routed to onHello
    })
    onHello(req: HttpRequest, res: HttpResponse): void {
        res.success({
            message: this.message
        });
    }
}
```

## Modules
Modules can export component routes and package other modules.

### Basic Module

This module will export app.component's routes.

```typescript
// in app.module.ts
import { LitModule } from '@litstack/core';

import { AppComponent } from './app.component';

@LitModule({
    exports: [
        AppComponent
    ]
})
export class AppModule {
}
```

### Module with Imports

Modules can also include imports.

```typescript
import { LitModule } from '@litstack/core';

import { ItemsModule } from  './modules/items/items.module';
import { OrdersModule } from  './modules/orders/orders.module';
import { PeopleModule } from  './modules/people/people.module';
import { VersionComponent } from  './components/version/version.component';

@LitModule({
    path: '', // this could be 'your-path' and all packaged routes
    imports: [  // would be registered at '/your-path/...'
        ItemsModule,
        PeopleModule,
        OrdersModule
    ],
    exports: [
        VersionComponent
    ]
})
export class AppModule {
}
```

## Bootstrapping

Bootstrap app.module at the index.ts level:

```typescript
// in index.ts
import { LitCompiler } from '@litstack/core/dist/compiler';
import { AppModule } from './modules/app.module';

LitCompiler.bootstrap(AppModule);
```

## Services

### Basic Service

Services can be defined and injected into components:

```typescript
// in hello.service
import { LitService } from '@litstack/core';

@LitService()
export class HelloService {
    
    getMessage(id: string) {
        return {
            message: 'Hello at ' + id
        };
    }
}
```

```typescript
// in app.component
import { LitComponent } from '@litstack/core';
import { HttpRequest, HttpResponse } from '@litstack/core/dist/http';
import { GetMapping } from '@litstack/core/dist/http/mappings';

import { HelloService } from './hello.service';

@LitComponent()
export class AppComponent {

    constructor(private helloService: HelloService) {
    }
    /**
     * @function sayHello
     * @description return a success response with a message
     */ 
    @GetMapping({
        path: ':id'
    })
    sayHello(req: HttpRequest, res: HttpResponse): void  {
        res.success({
            message: this.helloService.getMessage(req.params.id)
        });
    }
}
```

## Full Component Example

Notice the 'produces' param on the get mapping. That will add a 'Content-Type' header to the response.

```typescript
// people.component.ts

// listack imports:
import { LitComponent } from '@litstack/core';
import { HttpRequest, HttpResponse } from '@litstack/core/dist/http';
import { GetMapping,
         PutMapping,
         PostMapping } from '@litstack/core/dist/http/mappings';

// custom imports:
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
        // get the list of all people
        this.personService.fetchAll()
            .subscribe(
                (people: Person[]) => res.success(people),
                (err) => res.error(401)
            )
    }

    /**
     * @function getPerson
     * @description Return a single person
     */ 
    @GetMapping({
        path: ':id',
        produces: ResourceVersions.PEOPLE_V1 // Content-Type header
    })
    getPerson(req: HttpRequest, res: HttpResponse): void  {
        // get the list of all people
        this.personService.fetchById(req.params.id)
            .subscribe(
                (people: Person[]) => res.success(people),
                (err) => res.error(401)
            )
    }

    /**
     * @function updatePerson
     * @description Update a 'person' record
     */
    @PutMapping({
        path: ':id', // accessed by PUT /people/:id
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

    /**
     * @function createPerson
     * @description Create a 'person' record
     */
    @PostMapping({
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
}
```

## Building the app

Your build process can be customized to your needs, but a minimum configuration could look like this:

```
> npm install ts-node -D
> npm install @types/node -D
> npm install @types/express -D
```

Change the following in your package.json:

```json
{
  "main": "dist/index.js",
  "scripts": {
    "start": "tsc && node dist/index.js"
  }
}
```

You'll also need a tsconfig.json.

```json
{
    "compilerOptions": {
        "module": "commonjs",
        "target": "es5",
        "outDir": "dist",
        "lib": [
            "es7"
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

Have fun!
