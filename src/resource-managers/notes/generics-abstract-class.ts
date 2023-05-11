import { Redis } from 'ioredis';
{
    abstract class Abstract_SubModule<C> {
        protected readonly _someClient: C;

        constructor({ someClient }: { someClient: C }) {
            this._someClient = someClient;
        }
    }

    class SubModule_RedisClient<C extends Redis> extends Abstract_SubModule<C> {
        constructor({ someClient }: { someClient: C }) {
            super({ someClient });
        }
    }

    class SubModule_OtherClient<C> extends Abstract_SubModule<C> {
        constructor({ someClient }: { someClient: C }) {
            super({ someClient });
        }
    }

    type TSubModule<C> = new ({ someClient }: { someClient: C }) => Abstract_SubModule<C>;

    function MainModule<C>(someclass: TSubModule<C>, someClient: C) {
        const subModule: Abstract_SubModule<C> = new someclass({ someClient: someClient });

        return subModule;
    }

    const redis = new Redis();

    MainModule(SubModule_RedisClient, redis);
    MainModule(SubModule_RedisClient, 'other'); // expect it to fail , the client should be a type extended from Redis
    MainModule(SubModule_OtherClient, 'other');
    MainModule(SubModule_OtherClient, redis);
}
