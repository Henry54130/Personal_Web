---
tags:
  - CLI
  - Linux
published: true
---

Add "z" to command
```bash
echo 'eval "$(zoxide init bash)"' >> ~/.bashrc

```

Add directory and ignore hidden file
```bash
find ~ -maxdepth 4 -not -path '*/.*' -type d -exec zoxide add {} +

```

Check which path added to zoxide
```bash
 zoxide query --list
 
```