# Betty Blocks functions
Typescript flavourd betty functions! Enter `./src` and click on a function for various action steps.


## Requirements
- nvm (latest)
- nvm zsh hook (Add to `~/.zshrc`)
```bash
autoload -U add-zsh-hook
load-nvmrc() {
  local node_version="$(nvm version)"
  local nvmrc_path="$(nvm_find_nvmrc)"

  if [ -n "$nvmrc_path" ]; then
    local nvmrc_node_version=$(nvm version "$(cat "${nvmrc_path}")")

    if [ "$nvmrc_node_version" = "N/A" ]; then
      nvm install
    elif [ "$nvmrc_node_version" != "$node_version" ]; then
      nvm use
    fi
  elif [ "$node_version" != "$(nvm version default)" ]; then
    echo "Reverting to nvm default version"
    nvm use default
  fi
}
add-zsh-hook chpwd load-nvmrc
load-nvmrc
```

### First time setup
Installing packages:
```bash
npm install
```
Adding a `config.json` to the root file containing
```json
{
  "host": "https://example.bettyblocks.com",
  "applicationId": "<app_id>",
  "zone": "<app_zone>"
}
```

### Publish
```bash
npm run publish
```