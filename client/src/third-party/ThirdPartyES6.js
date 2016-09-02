class ThirdPartyES6 {
  constructor(val) {
    this.value = val;
  }

  getValue() {
    return this.value;
  }

  throwException() {
    throw new Error("boum");
  }
}

export default ThirdPartyES6;