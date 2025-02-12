## Summary  
This prefab enables users to evaluate a JavaScript expression dynamically using LiquidJS syntax (`{{ variable_name }}`). It allows seamless data interpolation, making it ideal for formatting and manipulating data in a no-code/low-code environment. In this example, we concatenate a first name and a last name with a space in between.

LiquidJS docs: https://liquidjs.com/tags/overview.html

## Inputs  

### Expression  
Define the JavaScript expression to be evaluated. Variables enclosed within double curly brackets (`{{ variable_name }}`) are replaced with actual values at runtime.  

**Example:**  
```liquid  
{{ first_name }} {{ last_name }}  
```

If `first_name = "John"` and `last_name = "Doe"`, the result will be: `"John Doe"`.  

### Variables  
Define the key-value pairs used in the expression. These values are dynamically injected into the Liquid template.  

**Example:**  
| Key        | Value |  
|------------|-------|  
| first_name | John  |  
| last_name  | Doe   |  

### Schema Model  
Users can optionally bind the result to a schema model by selecting a predefined model. This allows integration with database records or API responses.  

### Result  
The result of the evaluated expression is stored in the specified output variable. This can be used in subsequent actions within the workflow.  

### Prefab (function.json)   
![Screenshot 2025-02-11 at 09 31 49](https://github.com/user-attachments/assets/6b526938-3915-449e-9e92-cccd0710783d)
