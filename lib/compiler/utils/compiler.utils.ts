
import { HttpConsole } from '../../http/utils/http.utils';
import { Type } from '../../utils/core.util';

export class CoreCompiler {
  public logged: string[] = [];
  protected console: HttpConsole = console;
}

export type ILitModule = Type<any>;
export type ILitComponent = Type<any>;
