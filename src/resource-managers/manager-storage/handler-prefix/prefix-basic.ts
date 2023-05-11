import { AbstractPrefixHandler } from './core/_prefix-abstract';

class BasicPrefixHandler extends AbstractPrefixHandler {
    protected readonly _prefix;

    constructor(namespace: string) {
        super(namespace);
        this._prefix = namespace.trim() + ':';
    }

    public concat(key: string): string {
        return key.startsWith(this._prefix) ? key : this._prefix + key;
    }

    public split(prefixedKey: string): string {
        return prefixedKey.replace(this._prefix, '');
    }
}

export { BasicPrefixHandler };
