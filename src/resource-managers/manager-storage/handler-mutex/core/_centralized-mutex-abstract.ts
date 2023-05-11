// storage-manager
//    props:
//        _client         # generic
//        _prefix-handler # implemented
//        _CRUD-handler   # implemented
//        _mutex-handler  ### working on this

class DemoStorageManager<C> {
    private _mutexHandler: MutexHandler<C>;
    constructor(mutexConfig: any) {
        this._mutexHandler = new MutexHandler(mutexConfig);
    }
    public async add() {
        // const lock = await this._mutexHandler.acquireAll();
        try {
            // ...interact with storage
        } catch {
            // ...handle error
        } finally {
            //await lock.releaseAll()
        }
    }
}

abstract class CentralizedMutex {}

abstract class DistributedMutex<C> {
    constructor(client: C) {}
}

class HandMadeLock extends CentralizedMutex {}

class Redlock<C> extends DistributedMutex<C> {}

type TMutexHandlerConfig<C> = {
    CentralizedMutexList: (new () => CentralizedMutex)[];
    DistributedMutexList: (new (client: C) => DistributedMutex<C>)[];
    client: C;
};

class MutexHandler<C> {
    private _centralizedMutexList: any;
    private _distributedMutexList: any;
    private _distributedLockedMutex: any;
    constructor({ CentralizedMutexList, DistributedMutexList, client }: TMutexHandlerConfig<C>) {
        this._centralizedMutexList = CentralizedMutexList.map(MutexClass => new MutexClass());
        this._distributedMutexList = DistributedMutexList.map(MutexClass => new MutexClass(client));
    }

    public acquireAll() {
        // for mutex in  _centralizedMutexList , mutex.acquire()
        // for mutex in  _distributedMutexList{
        //     const lock = mutex.acquire()
        //     _distributedLockedMutex.push(lock);
        // }
    }
    public releaseAll() {
        // for mutex in  _centralizedMutexList , mutex.release()
        // for lock in  _distributedLockedMutex{
        //     lock.release();
        // }
    }
}
