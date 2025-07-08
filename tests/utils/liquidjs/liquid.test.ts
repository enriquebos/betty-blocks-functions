import renderLiquidTemplate from "../../../src/utils/liquidjs";

describe("renderLiquidTemplate", () => {
  it("should render a basic template with context", () => {
    const template = "Hello, {{ name }}!";
    const context = [{ key: "name", value: "World" }];

    const result = renderLiquidTemplate(template, context);
    expect(result).toBe("Hello, World!");
  });

  it("should not render when template is empty", () => {
    const template = "";
    const context = [{ key: "name", value: "World" }];

    const result = renderLiquidTemplate(template, context);
    expect(result).toBe("");
  });

  it("should handle multiple context items", () => {
    const template = "{{ greeting }}, {{ name }}!";
    const context = [
      { key: "greeting", value: "Hello" },
      { key: "name", value: "World" },
    ];

    const result = renderLiquidTemplate(template, context);
    expect(result).toBe("Hello, World!");
  });

  it("should throw an error if the template is invalid", () => {
    const template = "Hello, {{ name }!";
    const context = [{ key: "name", value: "World" }];

    expect(() => renderLiquidTemplate(template, context)).toThrow();
  });

  it("should handle complex templates with loops and conditionals", () => {
    const template = `{% if showGreeting %}{% for item in items %}{{ item }}, {% endfor %}{% endif %}`;
    const context = [
      { key: "showGreeting", value: true },
      { key: "items", value: `["Apple", "Banana", "Carrot"]` },
    ];

    const result = renderLiquidTemplate(template, context).trim();
    expect(result).toBe("Apple, Banana, Carrot,");
  });

  it("should apply the custom 'group' filter", () => {
    const template = `{% assign grouped = items | group: "type" %}{% for type in grouped %}{{ type[0] }}:{% for item in type[1] %} {{ item.name }}{% endfor %}; {% endfor %}`;
    const context = [
      {
        key: "items",
        value: JSON.stringify([
          { name: "Apple", type: "fruit" },
          { name: "Banana", type: "fruit" },
          { name: "Carrot", type: "vegetable" },
        ]),
      },
    ];

    const result = renderLiquidTemplate(template, context);
    expect(result.trim()).toBe("fruit: Apple Banana; vegetable: Carrot;");
  });
});
