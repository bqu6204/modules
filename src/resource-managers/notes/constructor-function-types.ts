{
    abstract class Abstract_SubModule<P> {
        protected readonly _someProps: P;

        constructor({ someProps }: { someProps: P }) {
            this._someProps = someProps;
        }
    }

    class SubModule<P> extends Abstract_SubModule<P> {
        constructor({ someProps }: { someProps: P }) {
            super({ someProps });
        }
    }

    type TAbstractSubModule1<P> = new ({ someProps }: { someProps: P }) => Abstract_SubModule<P>;
    type TAbstractSubModule2<P> = typeof Abstract_SubModule<P>;

    type TSubModule1<P> = new ({ someProps }: { someProps: P }) => SubModule<P>;
    type TSubModule2<P> = typeof SubModule<P>;

    function MainModule1<P>(someclass: TAbstractSubModule1<P>, someProps: P) {
        const subModule: Abstract_SubModule<P> = new someclass({ someProps: someProps });
        return subModule;
    }

    // this will complain since we CANNOT create an instance out of typeof an abstract class
    // expected to fail
    function MainModule2<P>(someclass: TAbstractSubModule2<P>, someProps: P) {
        const subModule: Abstract_SubModule<P> = new someclass({ someProps: someProps });
        return subModule;
    }

    function MainModule3<P>(someclass: TSubModule1<P>, someProps: P) {
        const subModule: Abstract_SubModule<P> = new someclass({ someProps: someProps });
        return subModule;
    }

    // work fine with because we can create instance out of typeof SubModule .
    function MainModule4<P>(someclass: TSubModule2<P>, someProps: P) {
        const subModule: Abstract_SubModule<P> = new someclass({ someProps: someProps });
        return subModule;
    }

    MainModule1(SubModule, 'any');
    MainModule2(SubModule, 'any');
    MainModule3(SubModule, 'any');
    MainModule4(SubModule, 'any');
}
