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
