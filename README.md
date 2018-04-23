# Typescript Service Starter Kit

## Vision

This is currently a mostly pseudo-code exercise in designing the type of framework one would want to use for an express service.

## Bootstrapping
We will need to bootstrap our app module at the index level

```javascript
// index.ts
import { serviceCompiler } from '@service-starter/core';
import { AppModule } from './modules/app.module';

serviceCompiler().bootstrapModule(AppModule);
```

## Modules
Modules can be declared and packaged with other modules:

```javascript
// people.module.ts
import { ServiceModule, StorageModule } from '@service-starter/core';
import { PeopleComponent } from './components/people/people.component'

@ServiceModule({
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
import { ServiceComponent } from '@service-starter/core';

@ServiceComponent()
export class PeopleComponent {

    @GetMapping({
        path: '/',
        produces: 'application/vnd.people.v1+json'
    })
    getPeople(req, res): any  {
        // endpoint logic here
        return {
            people: []
        }
    }
}
```




