### Summary
Easily get the record count inside a model. Select a model define result for the enitre model. If a filter is needed it can be provided using the GraphQL format.

### Inputs
#### Filter
I recommend trying out the filter in the [playground](https://docs.bettyblocks.com/en/articles/5775378-setting-up-data-api).

#### Variables
Insert variables using mapping, example:
Key: name
Value: John

Filter:
_and: [ { name: { eq: \"{{name}}\" } }, { age: { eq: 28 } } ]

Result:
_and: [ { name: { eq: \"John\" } }, { age: { eq: 28 } } ]

### Prefab (function.json)
![function_prefab](https://github.com/user-attachments/assets/71ae2ee3-a040-47ca-9c8f-880413672774)

### GraphQL operators
| Operator       | Description                                 |
|----------------|---------------------------------------------|
| in             | if a value is in an array                   |
| nin            | if a value is not in an array               |
| eq             | if value equals to                          |
| neq            | if value not equals to                      |
| regex          | if value matches a regex                    |
| starts_with    | if value starts with                        |
| ends_with      | if value ends with                          |
| matches        | if value contains a value or string         |
| does_not_match | if value does not contain a value or string |
| gteq           | greater than or equal to                    |
| lteq           | lower than or equal to                      |
| gt             | greater than                                |
| lt             | lower than                                  |
