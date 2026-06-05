/**
 * @jest-environment jsdom
 */

const {
  appendToResult,
  bracketToResult,
  backspace,
  operatorToResult,
  clearResult,
  calculateBMI,
  clearBMICalculator,
  calculateResult,
  normalizeExpression,
  getExpression,
} = require("../assets/js/script.js");

beforeEach(() => {
  document.body.innerHTML = `
    <input type="text" id="result" value="" />
    <input type="number" id="bmi-weight" />
    <input type="number" id="bmi-height" />
    <div id="bmi-result" style="display:none;">
      <span id="bmi-value"></span>
      <span id="bmi-category"></span>
      <span id="bmi-note"></span>
    </div>
  `;
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

describe("power (xⁿ)", () => {
  test("2 to the power of 3 equals 8", () => {
    appendToResult(2);
    operatorToResult("^");
    appendToResult(3);
    calculateResult();
    expect(display()).toBe("8");
  });

  test("5 to the power of 2 equals 25", () => {
    appendToResult(5);
    operatorToResult("^");
    appendToResult(2);
    calculateResult();
    expect(display()).toBe("25");
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

describe("calculateBMI", () => {
  test("calculates correct BMI for normal weight", () => {
    document.getElementById("bmi-weight").value = "70";
    document.getElementById("bmi-height").value = "175";
    calculateBMI();
    expect(document.getElementById("bmi-value").textContent).toBe("22.9");
    expect(document.getElementById("bmi-category").textContent).toBe("Normal weight");
  });

  test("classifies underweight correctly", () => {
    document.getElementById("bmi-weight").value = "45";
    document.getElementById("bmi-height").value = "175";
    calculateBMI();
    expect(document.getElementById("bmi-category").textContent).toBe("Underweight");
  });

  test("classifies overweight correctly", () => {
    document.getElementById("bmi-weight").value = "90";
    document.getElementById("bmi-height").value = "175";
    calculateBMI();
    expect(document.getElementById("bmi-category").textContent).toBe("Overweight");
  });

  test("classifies obese correctly", () => {
    document.getElementById("bmi-weight").value = "120";
    document.getElementById("bmi-height").value = "175";
    calculateBMI();
    expect(document.getElementById("bmi-category").textContent).toBe("Obese");
  });

  test("clears BMI inputs and result", () => {
    document.getElementById("bmi-weight").value = "70";
    document.getElementById("bmi-height").value = "175";
    calculateBMI();
    clearBMICalculator();
    expect(document.getElementById("bmi-weight").value).toBe("");
    expect(document.getElementById("bmi-height").value).toBe("");
    expect(document.getElementById("bmi-result").style.display).toBe("none");
  });
});
