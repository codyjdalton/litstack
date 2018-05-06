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
> npm install @litstack/core
```

Install required types:

```
> npm install @types/express -D
> npm install @types/node -D
```

## Components
Components are used as route listeners.

### Basic Component

Create a basic component at ./app.component.ts

```typescript
// in app.component
import { LitComponent } from '@litstack/core';
import { HttpRequest, HttpResponse } from '@litstack/core/dist/http';
import { GetMapping } from '@litstack/core/dist/http/mappings';

@LitComponent()
export class AppComponent {
    @GetMapping({
        path: ':id'
    })
    sayHello(req: HttpRequest, res: HttpResponse): void  {
        res.success({
            message: 'Hello at ' + req.params.id
        });
    }
}
```

Now we will need to wire our component into a module.

## Modules
Modules can be declared and packaged with other imports.

Create a module at app.module.ts:

```typescript
// in app.module.ts
import { LitModule } from '@litstack/core';

import { AppComponent } from './app.component';

@LitModule({
    path: '', // this could be 'hello' or something
    exports: [ // and your route would be /hello/some-path
        AppComponent // this is our app.component we created
    ]
})
export class AppModule {
}
```

## Bootstrapping

Bootstrap your app.module at the index level.

```typescript
// in index.ts
import { LitCompiler } from '@litstack/core/dist/compiler';
import { AppModule } from './modules/app.module';

LitCompiler.bootstrap(AppModule);
```

### Basic Service

We can inject service into components. First create a service at hello.service.ts:

```typescript
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

You can include your service in app component:

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

So what does a full blown component look like? Check out the example below. Notice the 'produces' param on the get mapping. That will add a 'Content-Type' header to the response.

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