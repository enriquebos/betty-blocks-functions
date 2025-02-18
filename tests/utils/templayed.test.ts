import templayed from "../../src/utils/templayed";
import { variableMap } from "../../src/utils/utilityFuncs";

describe("templayed.js", () => {
  it("should append exclamation marks to each name in the array", () => {
    const template = `{{{ names }}}.map((name) => name + "!")`;
    const vars = [{ key: "names", value: '["Alice", "Bob", "Charlie"]' }];
    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toEqual(["Alice!", "Bob!", "Charlie!"]);
  });

  it("should return the value of a single variable surrounded by quotes", () => {
    const template = `"{{ name }}"`;
    const vars = [{ key: "name", value: "Alice" }];
    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toBe("Alice");
  });

  it("should correctly add two variables", () => {
    const template = `{{ one }} + {{ two }}`;
    const vars = [
      { key: "one", value: "2" },
      { key: "two", value: "3" },
    ];
    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toBe(5);
  });

  it("should replace simple variables", () => {
    const template = `(function(name) { return "Hello, " + name; })({{{ name }}});`;
    const vars = [{ key: "name", value: '"World"' }];
    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toBe("Hello, World");
  });

  it("should handle sections with truthy conditions", () => {
    const template = `(function(show) { return show ? "Visible" : ""; })({{{ show }}});`;
    const vars = [{ key: "show", value: "true" }];
    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toBe("Visible");
  });

  it("should handle sections with falsy conditions", () => {
    const template = `(function(show) { return show ? "Visible" : ""; })({{{ show }}});`;
    const vars = [{ key: "show", value: "false" }];
    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toBe("");
  });

  it("should handle inverted sections with falsy conditions", () => {
    const template = `(function(show) { return !show ? "Not Visible" : ""; })({{{ show }}});`;
    const vars = [{ key: "show", value: "false" }];
    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toBe("Not Visible");
  });

  it("should handle inverted sections with truthy conditions", () => {
    const template = `(function(show) { return !show ? "Not Visible" : ""; })({{{ show }}});`;
    const vars = [{ key: "show", value: "true" }];
    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toBe("");
  });

  it("should iterate over arrays", () => {
    const template = `(function(items) { return items.map(item => item).join(" "); })({{{ items }}});`;
    const vars = [{ key: "items", value: `["apple", "banana", "cherry"]` }];
    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toBe("apple banana cherry");
  });

  it("should handle nested properties", () => {
    const template = `(function(user) { return user.name + " is " + user.age + " years old."; })({{{ user }}});`;
    const vars = [{ key: "user", value: `{ name: "John", age: 30 }` }];
    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toBe("John is 30 years old.");
  });

  it("should handle functions as variables", () => {
    const template = `(function(greet) { return greet(); })({{{ greet }}});`;
    const vars = [{ key: "greet", value: `() => "Hello, World!"` }];
    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toBe("Hello, World!");
  });

  it("should handle complex templates", () => {
    const template = `(function(user) {
      return "Hello, " + user.name + "! " + (user.admin ? "You are an admin." : "You are not an admin.");
    })({{{ user }}});`;
    const vars = [{ key: "user", value: `{ name: "Jane", admin: false }` }];
    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toBe("Hello, Jane! You are not an admin.");
  });

  it("should handle JavaScript expressions like .map()", () => {
    const template = `(function(names) { return names.map((name) => name + "!").join(", "); })({{{ names }}});`;
    const vars = [{ key: "names", value: `["Alice", "Bob", "Charlie"]` }];
    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toBe("Alice!, Bob!, Charlie!");
  });

  it("should handle triple brackets with nested properties", () => {
    const template = `(function(user) { return user.details; })({{{ user }}});`;
    const vars = [{ key: "user", value: `{ details: "<em>details</em>" }` }];
    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toBe("<em>details</em>");
  });

  it("should handle triple brackets with functions", () => {
    const template = `(function(greet) { return greet(); })({{{ greet }}});`;
    const vars = [{ key: "greet", value: `() => "<strong>Hello!</strong>"` }];
    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toBe("<strong>Hello!</strong>");
  });

  it("should evaluate a function with arguments passed from the template", () => {
    const template = `(function(one, two) { return one + two; })({{{ one }}}, {{{ two }}});`;
    const vars = [
      { key: "one", value: "5" },
      { key: "two", value: "10" },
    ];

    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toBe(15);
  });

  it("should handle string concatenation in the function", () => {
    const template = `(function(one, two) { return one + two; })({{{ one }}}, {{{ two }}});`;
    const vars = [
      { key: "one", value: '"Hello, "' },
      { key: "two", value: '"World!"' },
    ];

    const result = new Function(`return ${templayed(template)(variableMap(vars))}`)();

    expect(result).toBe("Hello, World!");
  });
});
