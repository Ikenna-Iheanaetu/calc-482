/**
 * @jest-environment jsdom
 */

const {
  appendToResult,
  bracketToResult,
  backspace,
  operatorToResult,
  clearResult,
  calculateResult,
  normalizeExpression,
  getExpression,
} = require("../assets/js/script.js");

beforeEach(() => {
  document.body.innerHTML = '<input type="text" id="result" value="" />';
  clearResult();
});

const display = () => document.getElementById("result").value;

describe("appendToResult", () => {
  test("appends a single digit", () => {
    appendToResult(5);
    expect(display()).toBe("5");
  });

  test("concatenates multiple digits", () => {
    appendToResult(1);
    appendToResult(2);
    appendToResult(3);
    expect(display()).toBe("123");
  });

  test("appends a decimal point", () => {
    appendToResult(3);
    appendToResult(".");
    appendToResult(1);
    expect(display()).toBe("3.1");
  });
});

describe("clearResult", () => {
  test("resets display to 0", () => {
    appendToResult(5);
    clearResult();
    expect(display()).toBe("0");
  });

  test("clears after a full expression", () => {
    appendToResult(9);
    operatorToResult("+");
    appendToResult(1);
    clearResult();
    expect(display()).toBe("0");
  });
});

describe("backspace", () => {
  test("removes the last character", () => {
    appendToResult(1);
    appendToResult(2);
    appendToResult(3);
    backspace();
    expect(display()).toBe("12");
  });

  test("shows 0 when expression becomes empty", () => {
    appendToResult(5);
    backspace();
    expect(display()).toBe("0");
  });
});

describe("operatorToResult", () => {
  test("appends + operator", () => {
    appendToResult(5);
    operatorToResult("+");
    expect(display()).toBe("5+");
  });

  test("appends - operator", () => {
    appendToResult(9);
    operatorToResult("-");
    expect(display()).toBe("9-");
  });

  test("builds full expression", () => {
    appendToResult(4);
    operatorToResult("*");
    appendToResult(3);
    expect(display()).toBe("4*3");
  });
});

describe("bracketToResult", () => {
  test("appends opening bracket", () => {
    bracketToResult("(");
    expect(display()).toBe("(");
  });

  test("appends closing bracket", () => {
    appendToResult(2);
    bracketToResult(")");
    expect(display()).toBe("2)");
  });
});

describe("calculateResult", () => {
  test("adds two numbers", () => {
    appendToResult(2);
    operatorToResult("+");
    appendToResult(3);
    calculateResult();
    expect(display()).toBe("5");
  });

  test("subtracts two numbers", () => {
    appendToResult(9);
    operatorToResult("-");
    appendToResult(4);
    calculateResult();
    expect(display()).toBe("5");
  });

  test("multiplies two numbers", () => {
    appendToResult(6);
    operatorToResult("*");
    appendToResult(7);
    calculateResult();
    expect(display()).toBe("42");
  });

  test("divides two numbers", () => {
    appendToResult(1);
    appendToResult(0);
    operatorToResult("/");
    appendToResult(2);
    calculateResult();
    expect(display()).toBe("5");
  });

  test("handles decimal results", () => {
    appendToResult(1);
    operatorToResult("/");
    appendToResult(4);
    calculateResult();
    expect(display()).toBe("0.25");
  });

  test("shows Error for invalid expression", () => {
    appendToResult("/");
    operatorToResult("+");
    calculateResult();
    expect(display()).toBe("Error");
  });

  test("does nothing when expression is empty", () => {
    calculateResult();
    expect(display()).toBe("0");
  });
});

describe("normalizeExpression", () => {
  test("replaces pi with Math.PI", () => {
    expect(normalizeExpression("pi")).toBe("Math.PI");
  });

  test("replaces e with Math.E", () => {
    expect(normalizeExpression("e")).toBe("Math.E");
  });

  test("replaces sin( with sinDeg(", () => {
    expect(normalizeExpression("sin(30)")).toBe("sinDeg(30)");
  });

  test("replaces cos( with cosDeg(", () => {
    expect(normalizeExpression("cos(60)")).toBe("cosDeg(60)");
  });

  test("replaces tan( with tanDeg(", () => {
    expect(normalizeExpression("tan(45)")).toBe("tanDeg(45)");
  });

  test("leaves unrelated expressions unchanged", () => {
    expect(normalizeExpression("2+3")).toBe("2+3");
  });
});
