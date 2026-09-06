---
title: Linux RDP_Wolf+moonlight+tailscale
aliases: []
tags:
  - Linux
  - remote-desktop
level: 1
link:
note:
published: false
---
`
`
## Preparation
1. Run tailscale `tailscale ip -4` to get host ip
2. Install docker compose 
## Compose Wolf on host
### create compose yml
For instance,this for AMD and Intel GPUon Linux, another GPU or OS ,see official website at tail.
```yaml
# docker compose yml for wolf
version: "3"
services:
  wolf:
    image: ghcr.io/games-on-whales/wolf:stable
    volumes:
      - /etc/wolf/:/etc/wolf
      - /var/run/docker.sock:/var/run/docker.sock:rw
      - /dev/:/dev/:rw
      - /run/udev:/run/udev:rw
    device_cgroup_rules:
      - 'c 13:* rmw'
    devices:
      - /dev/dri
      - /dev/uinput
      - /dev/uhid
    network_mode: host #will include tailscale 
    restart: unless-stopped
```

### compose
Run at same folder of docker-compose.yml
```bash
docker compose up -d
```

## Moonlight on client 
Install  moonlight, add server by tailscale IP
and pair
Then,run command 
```bash
docker compose logs wolf --tail=200 | grep 'pin'
```

We will get a http link, visit and. Add pin of client 

## Done 


---
## Reference 
- [Official website](https://games-on-whales.github.io/wolf/stable/user/quickstart.html)
- 