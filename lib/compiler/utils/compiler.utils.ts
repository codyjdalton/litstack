
import { HttpConsole } from "../../http/utils/http.utils";
import { Type } from "../../utils/core.util";

export class CoreCompiler {
  public console: HttpConsole = console;
}

export type ILitModule = Type<any>;
export type ILitComponent = Type<any>;
