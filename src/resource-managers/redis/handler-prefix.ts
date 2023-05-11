interface IPrefixHandler {
    prefix: string;
    concat(key: string): string;
    split(prefixedKey: string): string;
}

class PrefixHandler implements IPrefixHandler {
    private readonly _prefix: string;
    constructor(prefix: string) {
        this._prefix = prefix;
    }

    get prefix() {
        return this._prefix;
    }

    public concat(key: string): string {
        return key.startsWith(this._prefix) ? key : this._prefix + key;
    }

    public split(prefixedKey: string): string {
        return prefixedKey.replace(this.prefix, '');
    }
}

export { PrefixHandler, IPrefixHandler };
