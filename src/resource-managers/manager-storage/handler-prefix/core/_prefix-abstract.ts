type TPrefixHandler = new (namespace: string) => AbstractPrefixHandler;

abstract class AbstractPrefixHandler {
    protected abstract readonly _prefix: string;

    constructor(protected namespace: string) {}

    get prefix(): string {
        return this._prefix;
    }

    abstract concat(key: string): string;
    abstract split(prefixedKey: string): string;
}

export { AbstractPrefixHandler, TPrefixHandler };
