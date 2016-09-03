import { ExampleImpl } from "../../src/core/ExampleImpl";

declare function require(name: string): any;
declare function describe(name: string, fn: any): any;
declare function it(name: string, fn: any): any;

const assert = require("assert");

describe("ExampleImpl", function () {
    it("should capitalize \"test\"", function () {
        const example = new ExampleImpl("test");
        return assert(example.capitalize() === "TEST");
    });
});