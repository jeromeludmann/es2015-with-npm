import 'source-map-support/register';
import {ExampleImpl} from "./ExampleImpl";

const stringUtil = new ExampleImpl("Hello World");
console.log(stringUtil.capitalize());

stringUtil.value = "new string";
console.log(stringUtil.getLength());

stringUtil.value = null;
console.log(stringUtil.isEmpty());