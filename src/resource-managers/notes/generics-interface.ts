import { Redis } from 'ioredis';
{
    interface ISubModule<C> {
        _someClient: C;
        doSomething(): void;
    }

    class SubModule_RedisClient<C extends Redis> implements ISubModule<C> {
        public readonly _someClient: C;

        protected readonly _requiredSensitiveVar: string; // 'This is a var needs to be protected';
        constructor({ someClient, _requiredSensitiveVar }: { someClient: C; _requiredSensitiveVar: string }) {
            this._requiredSensitiveVar = _requiredSensitiveVar;
            this._someClient = someClient;
        }
        public doSomething() {
            if (this._someClient) console.log('this._someClient exists.');
            else console.log('this._someClient exists.');
        }
    }

    class SubModule_OtherClient<C> implements ISubModule<C> {
        public readonly _someClient: C;
        protected readonly RequiredSensitiveVar: string = 'This is a var needs to be protected';

        constructor({ someClient }: { someClient: C }) {
            this._someClient = someClient;
        }

        public doSomething() {
            if (this._someClient) console.log('this._someClient exists.');
            else console.log('this._someClient exists.');
        }
    }

    class SubModule_Bug<C> implements ISubModule<C> {
        public readonly _someClient: C;
        // protected readonly _requiredSensitiveVar is forgotten to declare, but with implementing interface instead of abstract class, there are no warnings

        constructor({ someClient }: { someClient: C }) {
            // _requiredSensitiveVar is forgotten
            this._someClient = someClient;
        }

        public doSomething() {
            if (this._someClient) console.log('this._someClient exists.');
            else console.log('this._someClient exists.');
        }
    }

    type TSubModule<C> = new ({
        someClient,
        _requiredSensitiveVar,
    }: {
        someClient: C;
        _requiredSensitiveVar: string;
    }) => ISubModule<C>;

    function MainModule<C>(someclass: TSubModule<C>, someClient: C) {
        const subModule: ISubModule<C> = new someclass({ someClient: someClient, _requiredSensitiveVar: 'hello' });

        return subModule;
    }

    const redis = new Redis();

    MainModule(SubModule_RedisClient, redis);
    MainModule(SubModule_RedisClient, 'other'); // expect it to fail , the client should be a type extended from Redis
    MainModule(SubModule_Bug, 'other'); // expect it to fail, but it didn't. No warning from the missing protected/private require prop
    MainModule(SubModule_OtherClient, 'other');
    MainModule(SubModule_OtherClient, redis);
}
