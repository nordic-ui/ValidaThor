import { parse, min, max, minLength, maxLength, email, object, string, number, boolean, date } from 'validathor';

const TestPage = () => {
  console.log(parse(object({}), {}))
  return (<p>Test</p>)
}

export default TestPage