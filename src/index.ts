/**
 * index
 */
import { LitCompiler } from '../lib/core/compiler';

import { AppModule } from './app/app.module';

LitCompiler.bootstrap(AppModule);