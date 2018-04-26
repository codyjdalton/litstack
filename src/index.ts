/**
 * index
 */
import { serviceCompiler } from '../lib/core/compiler';

import { AppModule } from './app/app.module';

serviceCompiler.bootstrap(AppModule);