
import { Type } from '../../utils/core.util';
import { HttpConsole } from '../../http/utils/http.utils';

export class CoreCompiler {
  console: HttpConsole = console;
}

export type ILitModule = Type<any>;
export type ILitComponent = Type<any>;