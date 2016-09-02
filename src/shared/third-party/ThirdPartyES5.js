function ThirdPartyES5(val) {
  this.value = val;
}

ThirdPartyES5.prototype.getValue = function () {
  return this.value;
};

ThirdPartyES5.prototype.throwException = function () {
  throw new Error("boum");
};

module.exports = ThirdPartyES5;