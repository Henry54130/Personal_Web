---
title: Hermes-agent在Linux docker檔案寫入問題
aliases: []
tags:
  - AI-agent
  - Linux
  - docker
level: 1
link:
note:
published: true
---

## 問題
Hermes Agent (在 Docker )嘗試編輯檔案時，遭遇 `Permission denied` 錯誤。

## 可能問題一：白名單限制
**描述：** Hermes Agent 的內建檔案操作工具 (`read_file`, `write_file` 等) 僅能操作位於 `/opt/data/` (白名單區域) 中的檔案。嘗試在白名單外寫入會失敗。
**解決方式：** 
* 確保所有需要 Agent 寫入的資料夾，掛載到  `/opt/data/` 之下。
* 或引導agent 使用CLI指令編寫文件

## 可能問題二：Linux UID/GID 權限不一致
**描述：** 即使資料夾掛載於 `/opt/data/` 且 `mount` 顯示 `rw`，Agent 仍可能因為與宿主機目錄的所有者 (UID/GID) 不匹配而遇到 `Permission denied`。
**根源：** Docker 自動建立目錄時，可能使用了宿主機 `root` (UID 0) 建立，導致容器內的非 `root` 用戶 `hermes`  沒有寫入權限。

**解決方式：調整宿主機檔案所有權**
1.  **查看目錄所有者：** 在宿主機上執行以下命令，查看目標目錄的所有者和群組：
```bash
ls -ld /path/to/your/directory
```
2.  **調整所有權：** 
```bash
sudo chown -R [你的用戶名稱]:[你的用戶組] /path/to/your/directory
```
