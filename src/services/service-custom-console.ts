import {
  ClassExpression,
  ClassDeclaration,
  FunctionExpression,
  FunctionDeclaration,
} from "typescript";
import path from "path";

type TClass = ClassDeclaration | ClassExpression;
type TFunction = FunctionExpression | FunctionDeclaration;

class CustomConsoleService {
  private static getCallerName(caller: TClass | TFunction) {
    const name = Object.prototype.hasOwnProperty.call(caller, "constructor")
      ? caller.constructor.name
      : caller && caller.name
      ? caller.name.toString()
      : undefined;
  }

  static error(message: string, caller?: ClassExpression | FunctionExpression) {
    const _caller = caller && this.getCallerName(caller);
    const _pathname = require.main ? path.dirname(require.main.filename) : null;

    const errorFrom =
      _caller || _pathname
        ? `${_caller ? "FROM " + _caller : ""} ${
            _pathname ? " ,IN" + _pathname : ""
          }`
        : "";

    console.error(`[ ERROR ] ${message} ${errorFrom}`);
  }

  static warn(message: string, caller?: any) {
    const warningFrom = caller
      ? caller.constructor
        ? caller.constructor.name
        : caller.toString()
      : undefined;

    console.warn(
      `[ WARN ] ${message} ${warningFrom ?? "{ In \t " + warningFrom + " }"}`
    );
  }

  static log(message: string, caller?: any, path?: string) {
    const loggingFrom = caller
      ? caller.constructor
        ? caller.constructor.name
        : caller.toString()
      : undefined;

    console.log(
      `[ LOG ] ${message} ${loggingFrom ?? "{ In \t " + loggingFrom + " }"}`
    );
  }
}

export { CustomConsoleService as CC };
