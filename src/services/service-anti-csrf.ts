import crypto from "crypto";
import { CC } from "./service-custom-console";
import { CE } from "./service-custom-error";

interface IStorageManager {
  add: (props: any) => Promise<any>;
}

interface IAntiCSRFServiceConfig {
  storage: IStorageManager;
  tokenLength: number;
}

class AntiCSRFService {
  private readonly _storage: IStorageManager;
  private readonly _tokenLength: number;

  constructor({ storage, tokenLength }: IAntiCSRFServiceConfig) {
    this._storage = storage;
    this._tokenLength = tokenLength;
  }

  get tokenLength() {
    return this._tokenLength;
  }

  private generateToken(): string {
    return crypto.randomBytes(this._tokenLength / 2).toString("hex");
  }

  public async createToken() {
    const maxRetries = 15;
    let retryCount = 0;

    do {
      const token = this.generateToken();
      try {
        await this._storage.add({ key: token });
        return token;
      } catch (error) {
        // key already exist
        if (retryCount > maxRetries) {
          CC.error(
            "Retried up to 15 times to create and save the token.",
            this
          );
          throw CE.BadRequestError({
            message: "Retried up to 15 times to create and save the token.",
          });
        }
      }
    } while (retryCount++ <= maxRetries);
  }
}
