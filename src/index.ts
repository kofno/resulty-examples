import { err, ok, Result } from 'resulty';

const parseIntR = (value: string): Result<string, number> => {
  const n = parseInt(value, 10);
  return isNaN(n) ? err(`Could not convert '${value}' to an integer`) : ok(n);
};

const add = (x: number) => (y: number): number => x + y;

const asString = (result: Result<any, any>): string =>
  result.cata({
    Ok: v => `Ok ${JSON.stringify(v)}`,
    Err: err => `Err ${JSON.stringify(err)}`,
  });

const logR = (result: Result<any, any>): void => {
  console.log(asString(result));
};

console.log('---- single parse ------');

logR(parseIntR('4'));

logR(parseIntR('foo'));

console.log('--------- combining parsed values -------------');

logR(parseIntR('4').map(add(2)));

logR(parseIntR('4').andThen(x => parseIntR('5').map(y => ({ x, y }))).map(nums => nums.x + nums.y));

logR(
  parseIntR('foo').andThen(x => parseIntR('5').map(y => ({ x, y }))).map(nums => nums.x + nums.y),
);

logR(
  parseIntR('4').andThen(x => parseIntR('bar').map(y => ({ x, y }))).map(nums => nums.x + nums.y),
);

console.log('------------ using assign ---------------');

logR(ok({}).assign('x', parseIntR('4')).assign('y', parseIntR('5')).map(ns => ns.x + ns.y));

logR(ok({}).assign('x', parseIntR('4')).assign('y', parseIntR('bar')).map(ns => ns.x + ns.y));
