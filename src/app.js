import 'source-map-support/register';
import Hello from './Hello';

const hello = new Hello();
const message = hello.getMessage();

try {
  console.log(message);
  hello.throwException();

} catch (exception) {
  console.log(exception);
}