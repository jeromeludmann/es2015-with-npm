import { ExampleUtil } from "./Example";

export class ExampleImpl implements ExampleUtil {
    private _value: string;

    constructor(value: string) {
        this._value = value || "";
    }

    capitalize(): string {
        return this.value ? this.value.toUpperCase() : "";
    }

    isEmpty(): boolean {
        return this.value ? this.value.length === 0 : true;
    }

    getLength(): number {
        return this.value ? this.value.length : 0;
    }

    get value(): string {
        return this._value;
    }

    set value(value: string) {
        this._value = value;
    }
}