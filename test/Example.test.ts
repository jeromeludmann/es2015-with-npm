declare function require(name: string): any;
declare function describe(name: string, fn: any): any;
declare function it(name: string, fn: any): any;

import {ExampleImpl} from "../src/shared/core/ExampleImpl";

const assert = require('assert');

describe('ExampleImpl', function () {
    it('should capitalize \"test\"', function () {
        const example = new ExampleImpl("test");
        assert.equal(example.capitalize(), "TEST");
    });
});