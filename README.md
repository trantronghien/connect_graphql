# Android client 
 ### cài đặt apollo
 + b1: trong project android tạo package `/app/src/main/graphql/<package_app>.graphql/`   (*)
 + b2: cài đặt apollo lib `npm install -g apollo` .
 + b3: trong thư mục mới tạo ra ở (*) `apollo client:download-schema --endpoint=http://localhost:3000/graphql` cú pháp này lấy schema từ graphql server.
 ### tạo file .graphql và rebuild project
 + file __.graphql__ là tập các query đến graphql những file này sẽ được generate __java code__.
 
# Nodejs graphql server
 ### deloy docker images graphql to heroku 
 + link: https://github.com/heroku/heroku-container-registry
 + login `heroku container:login`
 + create a Heroku app `heroku create`  ==> tạo thành công log show tên app
 + build image và đẩy lên cloud heroku `heroku container:push web --app ${YOUR_APP_NAME}`
 + release: `heroku container:release web --app ${YOUR_APP_NAME}`
 + open app: `heroku open --app ${YOUR_APP_NAME}`
 + pull image: `heroku container:pull web ${YOUR_APP_NAME}`
 
### heroku public example:  [link](https://mighty-tor-63635.herokuapp.com/graphql)
### DB using mongodb:  [link](https://cloud.mongodb.com)

