[![npm version](https://badge.fury.io/js/%40litstack%2Fcore.svg)](https://badge.fury.io/js/%40litstack%2Fcore) [![Build Status](https://travis-ci.org/codyjdalton/litstack.svg?branch=master)](https://travis-ci.org/codyjdalton/litstack) [![Coverage Status](https://coveralls.io/repos/github/codyjdalton/litstack/badge.svg?branch=master)](https://coveralls.io/github/codyjdalton/litstack?branch=master)

# Litstack

Using Angular and Spring boot design patterns, Litstack is a Typescript REST framework that Angular/Spring Boot engineers already know how to use, keeping their code organized and concise, and pushing off the express wiring to the library.

## Getting Started

### Option 1: Clone the seed app

Follow the directions in [the litstack seed](https://github.com/codyjdalton/litstack-seed) to get started right away.

### Option 2: Start with a blank slate

Create a new project and install the Litstack core library.

```
> npm install @litstack/core --save
```

Make sure experimental decorators are on in your tsconfig.json at the root level:

```json
{
    "compilerOptions": {
        "experimentalDecorators": true
    }
}
```

For more on building, see the minimum configuration section below.

## Bootstrapping

Bootstrap app.module at the index.ts level:

```typescript
// in index.ts
import { LitCompiler } from '@litstack/core/dist/compiler';

import { AppModule } from './modules/app.module';

LitCompiler.bootstrap(AppModule);
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

Modules can also import other modules with components:

```typescript
import { LitModule } from '@litstack/core';

import { ItemsModule } from  './modules/items/items.module';
import { OrdersModule } from  './modules/orders/orders.module';
import { PeopleModule } from  './modules/people/people.module';
import { VersionComponent } from  './components/version/version.component';

@LitModule({
    path: 'api', // will add all imported routes at '/api/..'
    imports: [ 
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

## Components
Components register route listeners:

### Basic Component

```typescript
// in app.component.ts
import { LitComponent } from '@litstack/core';
import { HttpResponse } from '@litstack/core/dist/http';
import { GetMapping } from '@litstack/core/dist/http/mappings';

@LitComponent()
export class AppComponent {

    private message = 'Hello World!';

    @GetMapping() // defaults to '/'
    onHello(res: HttpResponse): void {
        res.success({
            message: this.message
        });
    }
}
```

### Using path params

Specify params in the path:

```typescript
import { LitComponent } from '@litstack/core';
import { HttpRequest, HttpResponse } from '@litstack/core/dist/http';
import { GetMapping } from '@litstack/core/dist/http/mappings';

@LitComponent()
export class ItemsComponent {

    @GetMapping({
        path: ':id'
    })
    getItem(req: HttpRequest, res: HttpResponse): void {
        res.success({
            id: req.params.id
        });
    }
}
```

### Chaining methods with next

We can keep our route functionality isolated by using the "next" param:

```typescript
import { LitComponent } from '@litstack/core';
import { HttpRequest, HttpResponse, HttpNext } from '@litstack/core/dist/http';
import { PutMapping } from '@litstack/core/dist/http/mappings';

@LitComponent()
export class ItemsComponent {

    // NOTE: The order matters here:
    @PutMapping({
        path: ':id'
    })
    updateItem(req: HttpRequest, res: HttpResponse, next: HttpNext) {

        if(req.param.id === 'some-id') {

            // do some update
            res.success({ id: 'some-id' });
            return;
        }

        next();
    }

    // same route as above, will run only if "next" is called
    @PutMapping({
        path: ':id'
    })
    updateItemErr(res: HttpResponse) {
        
        res.error(404);
    }
}
```

### Dependency Injection

Services are a great place for business logic:

```typescript
// ./services/items.service
import { LitService } from '@litstack/core';

@LitService()
export class ItemsService {

    get description(): string {
        return 'This is an item description';
    }
}
```
And then in our component:

```typescript
import { LitComponent } from '@litstack/core';
import { HttpResponse } from '@litstack/core/dist/http';
import { GetMapping } from '@litstack/core/dist/http/mappings';

import { ItemsService } from './services/items.service';

@LitComponent()
export class ItemsComponent {

    constructor(private itemsService: ItemsService) {}

    @GetMapping()
    getItems(res: HttpResponse) {
        res.success({
            description: this.itemsService.description
        });
    }
}
```

## Testing

Test components [using supertest methods](https://github.com/visionmedia/supertest) and the Litstack TestBed:

```typescript
import { TestBed, LitComponentTest } from '@litstack/core/dist/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {

    let component: LitComponentTest;

    beforeEach(() => {
        
        component = TestBed.start(AppComponent);
    });

    afterEach(() => {

        TestBed.stop();
    });

    it('should return a welcome message', (done) => {

        component
            .get('/')
            .expect(200)
            .expect((res) => {
                expect(res.body.message).to.equal('Hello World!');
            })
            .end((err, res) => {
                if (err) return done(err);
                done();
            });
    });
});
```

## Minimum Configuration

The build process can be customized to the needs of the project, but a minimum configuration could look like this:

```
> mkdir my-project
> cd my-project
> npm init -y
> npm install @litstack/core --save
> npm install typescript -D
> npm install ts-node -D
```

Change the following in package.json:

```json
{
  "main": "dist/index.js",
  "scripts": {
    "start": "tsc && node dist/index.js"
  }
}
```

A tsconfig.json could look like this:

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

Now, run the app:

```
> npm start
```

Have fun!
