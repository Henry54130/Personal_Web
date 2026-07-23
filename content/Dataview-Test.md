---
title: Dataview Test Page
tags: [math, science, test]
date: 2026-07-24
---

# Dataview Plugin Test

這是一張測試頁面，用於驗證 Quartz Dataview 插件的功能。

## 1. LIST 查詢測試 (標籤含有 math)

```dataview
LIST
FROM ""
WHERE contains(tags, "math")
SORT file.name ASC
```

## 2. TABLE 查詢測試 (標籤含有 science)

```dataview
TABLE file.name, tags
FROM ""
WHERE contains(tags, "digital-life")
SORT file.name ASC
LIMIT 5
```

## 3. 進階功能與不支援語法提示測試

```dataview
LIST "🔗 " + length(file.inlinks)
FROM ""
WHERE contains(category, "quote")
SORT length(file.inlinks) DESC
```
