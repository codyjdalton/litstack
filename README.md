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
import { LitComponent } from '@service-starter/core';

@LitComponent()
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




