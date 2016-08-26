import "source-map-support/register";
import {ExampleImpl} from "./ExampleImpl";

const stringUtil = new ExampleImpl("Hello World");
console.log(stringUtil.capitalize());
console.log(stringUtil.getLength());
stringUtil.value = null;
console.log(stringUtil.isEmpty());

async function call() {
    await Promise.resolve("test");
}

call();