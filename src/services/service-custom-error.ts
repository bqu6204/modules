interface IErrorProps {
  message: string;
  field?: string;
  statusCode?: number;
}

class CustomError extends Error {
  private _message: string;
  private _field?: string;
  private _statusCode: number;
  constructor({ message, field, statusCode }: IErrorProps) {
    if (CustomError.INSTANCE) {
      throw new Error("Custom Error should be called with static methods.");
    }
    super(message);

    this._message = message;
    this._field = field;
    this._statusCode = statusCode || 500;

    Object.setPrototypeOf(this, Error.prototype);

    CustomError.INSTANCE = this;
  }

  get statusCode() {
    return this._statusCode;
  }

  public serializeErrors() {
    return this._field
      ? [{ message: this._message, field: this._field }]
      : [{ message: this._message }];
  }

  public static BadRequestError400({ message, field }: IErrorProps) {
    const statusCode = 400;
    return new CustomError({ message, field, statusCode });
  }

  public static NotAuthorizedError401({ message, field }: IErrorProps) {
    const statusCode = 401;
    return new CustomError({ message, field, statusCode });
  }

  // Prevent direct instantiation of the class
  private static INSTANCE = new CustomError({
    message: "",
    statusCode: 500,
  });

  static get instance() {
    return this.INSTANCE;
  }
}
export { CustomError as CE };
