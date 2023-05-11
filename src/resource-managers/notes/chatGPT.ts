import { Redis } from "ioredis";

interface someInterface {}
abstract class SomeAbstractClass implements someInterface {}
class ExtendedClassA extends SomeAbstractClass {}
class ExtendedClassB extends SomeAbstractClass {}

// A Function Which Only Accepts Classes Extended By Abstract Class With The Interface Of Some Interface
function createInstance(someClass: new () => someInterface) {
  return new someClass();
}

// Q1 : Are we garanteed all classes extend from SomeAbstractClass has the interface of someInterface?
// Ans: YES.
// Q2 : what is the type of the " new someClass() " inwhich createInstance function returns?
// Ans: Depends on what the someClass is

// Continue ...
// Q3 : What doew the typeof SomeRandomClass means? the constuctor params ? the instance of the class ? What does it actually means?
// Ans: typeof SomeRandomClass refer to the constructor function of the class
// Q4 : Can we say that all the returns are the InstanceType of <type of SomeAbstractClass> in the createInstance function? (as below)
// type instance = InstanceType<typeof SomeAbstractClass>;
// Ans: No, we cannot. The function will accept any class constructors that satisfy the condition of implementing the 'someInterface'.

function createInstance2(someClass: new () => someInterface) {
  const someInstance = new someClass();
  return someInstance;
}
// Continue ...
// Q5 : Are there any ways to give the someInstance in the createInstance2 a type ? any ways.
// Ans: Yes , we can use a generic type which extends someInterface as below
function createInstance3<T extends someInterface>(someClass: new () => T): T {
  const someInstance: T = new someClass();
  return someInstance;
}
