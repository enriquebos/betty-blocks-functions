import { replaceTemplateVariables } from "../../../src/utils/templating";

describe("replaceTemplateVariables", () => {
  it("replaces a single variable", () => {
    const text = "Hello, {{ name }}!";
    const variables = [{ key: "name", value: "Alice" }];
    const result = replaceTemplateVariables(text, variables);
    expect(result).toBe("Hello, Alice!");
  });

  it("replaces multiple variables", () => {
    const text = "Name: {{ name }}, Age: {{ age }}";
    const variables = [
      { key: "name", value: "Bob" },
      { key: "age", value: "30" },
    ];
    const result = replaceTemplateVariables(text, variables);
    expect(result).toBe("Name: Bob, Age: 30");
  });

  it("ignores unknown variables and keeps original placeholders", () => {
    const text = "Hello, {{ unknown }}!";
    const variables: { key: string; value: string }[] = [];
    const result = replaceTemplateVariables(text, variables);
    expect(result).toBe("Hello, {{ unknown }}!");
  });

  it("trims whitespace inside the variable", () => {
    const text = "Hello, {{   name   }}!";
    const variables = [{ key: "name", value: "Charlie" }];
    const result = replaceTemplateVariables(text, variables);
    expect(result).toBe("Hello, Charlie!");
  });

  it("handles empty input text", () => {
    const result = replaceTemplateVariables("", [{ key: "x", value: "y" }]);
    expect(result).toBe("");
  });

  it("handles undefined input text", () => {
    const result = replaceTemplateVariables(undefined, [{ key: "x", value: "y" }]);
    expect(result).toBe("");
  });

  it("preserves special prefixes like {{& var }} or {{! var }}", () => {
    const text = "Raw: {{& raw }}, Escaped: {{ normal }}, Commented: {{! note }}";
    const variables = [
      { key: "raw", value: "<b>Bold</b>" },
      { key: "normal", value: "EscapedValue" },
      { key: "note", value: "This is a comment" },
    ];
    const result = replaceTemplateVariables(text, variables);
    expect(result).toBe("Raw: <b>Bold</b>, Escaped: EscapedValue, Commented: This is a comment");
  });

  it("returns the original match if key not found", () => {
    const text = "Hello {{missing}}!";
    const variables = [{ key: "other", value: "value" }];
    const result = replaceTemplateVariables(text, variables);
    expect(result).toBe("Hello {{missing}}!");
  });

  it("returns empty string if key exists but value is undefined", () => {
    const text = "Hello, {{ name }}!";
    const variables = [{ key: "name", value: undefined as unknown as string }];
    const result = replaceTemplateVariables(text, variables);
    expect(result).toBe("Hello, !");
  });
});
