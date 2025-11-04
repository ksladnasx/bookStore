 function sum(a: number, b: number): number {
  return a + b;
}
function multiply(a: number, b: number): number {
  return a * b;
}

function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("除数不能为零");
  }
  return a / b;
}

function subtract(a: number, b: number): number {
  return a - b;
}

export {
  sum,
  multiply,
  divide,
  subtract
}