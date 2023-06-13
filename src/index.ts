export function rpn(expression: string): number {
  const stack: number[] = [];
  const operators: { [key: string]: (a: number, b: number) => number } = {
    "+": (a, b) => a + b,
    "-": (a, b) => a - b,
    "*": (a, b) => a * b,
    "/": (a, b) => a / b,
    MOD: (a, b) => a % b,
  };

  const unaryOperators: { [key: string]: (a: number) => number } = {
    NEGATE: (a) => -a,
  };

  expression.split(" ").forEach((token) => {
    if (operators[token]) {
      const [b, a] = [stack.pop(), stack.pop()];
      stack.push(operators[token](a!, b!));
    } else if (unaryOperators[token]) {
      const a = stack.pop();
      stack.push(unaryOperators[token](a!));
    } else {
      stack.push(parseFloat(token));
    }
  });

  if (stack.length !== 1) {
    throw new Error("Invalid RPN expression");
  }

  return stack[0];
}
