{
    type randomType1 = {
        randomType1Method(): void;
    };
    type randomType2 = {
        randomType2Method(): void;
    };

    type TSubModule<P> = new ({ someProps }: { someProps: P }) => Abstract_SubModule<P>;

    abstract class Abstract_SubModule<P> {
        protected readonly _someProps: P;

        constructor({ someProps }: { someProps: P }) {
            this._someProps = someProps;
        }

        abstract doSomething<P>(): void;
    }

    class SubModule1<P extends randomType1> extends Abstract_SubModule<P> {
        constructor({ someProps }: { someProps: P }) {
            super({ someProps });
        }

        doSomething<P>(): void {
            this._someProps.randomType1Method();
        }
    }

    class SubModule2<P extends randomType2> extends Abstract_SubModule<P> {
        constructor({ someProps }: { someProps: P }) {
            super({ someProps });
        }

        doSomething(): void {
            this._someProps.randomType2Method;
        }
    }

    abstract class AbstractMainModule<P> {
        protected abstract readonly _subModuleExtendedFromAbstract_SubModule: Abstract_SubModule<P>; // what is this type other than unknown???
    }

    class MainModuleUsingSubModule1<P extends randomType1> extends AbstractMainModule<P> {
        protected _subModuleExtendedFromAbstract_SubModule;

        constructor(someProps: P, subModel: TSubModule<P>) {
            super();

            this._subModuleExtendedFromAbstract_SubModule = new subModel({ someProps });
        }
    }

    class MainModuleUsingSubModule2<P extends randomType2> extends AbstractMainModule<P> {
        protected _subModuleExtendedFromAbstract_SubModule;

        constructor(someProps: P, subModel?: TSubModule<P>) {
            super();

            this._subModuleExtendedFromAbstract_SubModule = new SubModule2({ someProps });
        }
    }

    const randomTypeProp1 = {
        randomType1Method: console.log,
    };

    const randomTypeProp2 = {
        randomType2Method: console.warn,
    };

    const main1 = new MainModuleUsingSubModule1(randomTypeProp1, SubModule1);
    const main2 = new MainModuleUsingSubModule2(randomTypeProp2, SubModule2);
}
