### DEMO:

# resource-managers

    -   manager-storage
        -   core
            \_storage-manager-abstract.ts

        -   storage-manager.ts

        -   handler-CRUD
            -   core
                \_CRUD-abstract.ts
                CRUD-redis.ts
        -   handler-mutex
            -   core
                \_distrubted-mutex-abstract.ts
                \_centralized-mutex-abstract.ts
                distrubted-mutex-redlock.ts
        -   handler-prefix
            -   core
                \_prefix-abstract.ts
                prefix-basic.ts

    -   manager-otherElse
        -   core
            ....
