# bin/bash

mkdir -p ./nodes
for port in $(seq 1 6); do
  mkdir -p ./nodes/${port}/conf
  touch ./nodes/${port}/conf/redis.conf
  echo "port 6379
bind 0.0.0.0
cluster-enabled yes
cluster-config-file nodes.conf
cluster-node-timeout 5000
cluster-announce-port 6379
cluster-announce-bus-port 16379
appendonly yes" > ./nodes/${port}/conf/redis.conf
done
