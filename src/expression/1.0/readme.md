# Expression Prefab

## Summary
This prefab allows users to evaluate a JavaScript expression dynamically by interpolating values using Mustache syntax (`{{variable_name}}`). In this example, it concatenates a first name and a last name with a space in between. This functionality is useful for formatting and manipulating data within a no-code/low-code environment.

## Inputs

### Expression
Define the JavaScript expression to be evaluated. Variables inside double curly brackets (`{{variable_name}}`) are replaced with actual values at runtime.

Example:
```javascript
"{{first_name}}" + " " + "{{last_name}}"
```

If `first_name = "John"` and `last_name = "Doe"`, the result will be: `"John Doe"`

### Variables
Define the key-value pairs used in the expression. These values are dynamically injected into the Mustache template.

Example:
| Key        | Value |
|------------|-------|
| first_name | John  |
| last_name  | Doe   |

### Schema Model

Users can optionally bind the result to a schema model by selecting a predefined model. This allows integration with database records or API responses.

### Result

The result of the evaluated expression is stored in the specified output variable. This can be used in subsequent actions within the workflow.

### Prefab (function.json)
![function_prefab](https://github.com/user-attachments/assets/f4f1189d-99e2-4563-840d-9d53762b7d46)

### Advanced Expressions

## Functions:

Note: Passing strings in functions need to have quotes around them in order to work.

```javascript
(function(one, two) {
   return one + two;
})({{{ one }}}, {{{ two }}});
```
| Key | Value |
|-----|-------|
| one | 1     |
| two | 2     |

Result: `3`


```javascript
(function(obj) {
   return obj.one + obj.two;
})({{{ obj }}});
```

| Key | Value              |
|-----|--------------------|
| obj | { one: 1, two: 2 } |

Result: `3`

Here `obj` is interpolated with tripe brackets (`{`)! This means the value will be instantly evaluated into the right type.

## Loops

```javascript
{{{ names }}}.map((name) => name + "!")
```

| Key   | Value              |
|-------|--------------------|
| names | ["Jack", "Amy"]    |

Result: `["Jack!", "Amy!"]`
