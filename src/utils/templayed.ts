// *
// * templayed.js 0.2.3 (Uncompressed)
// * The fastest and smallest Mustache compliant Javascript templating library written in 2167 bytes (uncompressed)
// *
// * (c) 2023 Paul Engel
// * templayed.js is licensed under MIT license
// *
// * $Date: 2023-01-05 11:55:52 +0100 (Thu, 05 January 2023) $
// *

export default (template: string): ((vars: any) => string) => {
  let inc: number = 0;

  const get = (path: string): string => {
    let i: number = 1;
    path = path.replace(/\.{2}\//g, () => {
      i++;
      return "";
    });
    const js: string[] = [`vars[vars.length - ${i}]`];
    const keys: string[] = path === "." ? [] : path.split(".");
    for (let j = 0; j < keys.length; j++) {
      js.push("." + keys[j]);
    }
    return js.join("");
  };

  const tag = (template: string): string => {
    return template.replace(/\{\{(!|&|\{)?\s*(.*?)\s*}}+/g, (_, operator, context) => {
      if (operator === "!") return "";
      let i: number = inc++;
      return (
        `"; var o${i} = ` +
        get(context) +
        `, s${i} = typeof(o${i}) == "function" ? o${i}.call(vars[vars.length - 1]) : o${i}; s${i} = ( s${i} || s${i} == 0 ? s${i} : "") + ""; s += ` +
        (operator
          ? `s${i}`
          : `(/[&"><]/.test(s${i}) ? s${i}.replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/>/g,"&gt;").replace(/</g,"&lt;") : s${i})`) +
        ` + "`
      );
    });
  };

  const block = (template: string): string => {
    return tag(
      template.replace(/\{\{(\^|#)(.*?)}}(.*?)\{\{\/\2}}/g, (_, operator, key, context) => {
        let i: number = inc++;
        return (
          `"; var o${i} = ` +
          get(key) +
          "; " +
          (operator === "^"
            ? `if ((o${i} instanceof Array) ? !o${i}.length : !o${i}) { s += "${block(context)}"; } `
            : `if (typeof(o${i}) == "boolean" && o${i}) { s += "${block(context)}"; } else if (o${i}) { for (var i${i} = 0; i${i} < o${i}.length; i${i}++) { vars.push(o${i}[i${i}]); s += "${block(context)}"; vars.pop(); }}`) +
          '; s += "'
        );
      })
    );
  };

  return new Function(
    "vars",
    "s",
    `vars = [vars], s = "${block(template.replace(/"/g, '\\"').replace(/(\n|\r\n)/g, "\\n"))}"; return s;`
  ) as (vars: any) => string;
};
