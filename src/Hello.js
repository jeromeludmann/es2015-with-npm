export default class Hello {
  constructor() {
    this.str = 'Hello!';
  }

  getMessage() {
    return this.str;
  }

  throwException() {
    throw new Error('The purpose of this exception is only to test Source Map support');
  }
}