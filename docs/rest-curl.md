# CURL

#### GET -> get List All `posts`

```shell
curl http://127.0.0.1:3000/post | jq
```

-->

```shell
curl -w "\nHTTP Status: %{http_code}\nTime Taken: %{time_total} seconds\n" -o /dev/null -s "http://127.0.0.1:3000/post"
```

```shell
time curl -o /dev/null -s "http://127.0.0.1:3000/post"
```

#### Create api '/post'

##### get list
```shell
curl 'http://127.0.0.1:3000/post' | jq
```

##### get A post 
```shell
curl 'http://127.0.0.1:3000/post/155' | jq
```

```shell
curl 'https://api.ciquan.duckdns.org/post' |jq
```

### inventory
```shell
curl http://127.0.0.1:3000/post/inventory | jq
```

### Get history warranty
```shell
curl http://127.0.0.1:3000/post/warranty | jq
```
