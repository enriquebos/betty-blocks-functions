### Summary
This will create or update an object based on if it exists or not. If the fetched object is empty it will be created else it will update. This allows for more complex conditions rather than a unique by upsert.

### Inputs
#### Create or Update Record Object input
| Argument | Info |
|----------|------|
| Record | The object you want to create/update model will be based on the object |
| Value Mapping | Main mapping that will be filled in for both create AND update
| Value Mapping Create | Special mapping that will ONLY happen on create, **this will override the main mapping**.
| Value Mapping Update | Special mapping that will ONLY happen on update, **this will override the main mapping**.

### Prefab (function.json)
![function_prefab](https://github.com/user-attachments/assets/1649c156-0837-4fea-9e31-e7ba5c5cd45e)
