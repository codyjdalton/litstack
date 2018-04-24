/**
 * index
 */
import { serviceCompiler } from './core/classes/service-compiler.class';

import { AppModule } from './modules/app.module';

serviceCompiler.bootstrap(AppModule);