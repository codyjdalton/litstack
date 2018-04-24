/**
 * index
 */
import { serviceCompiler } from './core/classes/service-compiler.class';

import { AppModule } from './app/app.module';

serviceCompiler.bootstrap(AppModule);