---
title: Git指令關系
aliases: []
tags:
  - git
  - software
level: 1
link:
  - "[[git basic command]]"
  - "[[GIT_備份在同資料夾]]"
note:
published: true
---


```mermaid
flowchart BT
    A["💻 working directory"] -- git add --> B["📋 staging area"]
    B -- git commit --> C["🏡 local repository"]
    C -- git push --> D["☁️ remote repository"]

```

