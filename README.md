# Android client 
 ### cài đặt apollo generate code
 npm install -g apollo
 
 ### cmd: download schema <package_graphql>
 apollo client:download-schema --endpoint=http://localhost:3000/graphql
 
 ### tạo file .graphql và rebuild project
 
# Nodejs graphql server

 ### deloy docker images to heroku 
 + link: https://github.com/heroku/heroku-container-registry
 + login `heroku container:login`
 + create a Heroku app `heroku create`  ==> tạo thành công log show tên app
 + build image và đẩy lên cloud heroku `heroku container:push web --app ${YOUR_APP_NAME}`
 + release: `heroku container:release web --app ${YOUR_APP_NAME}`
 + open app: `heroku open --app ${YOUR_APP_NAME}`
 + pull image: `heroku container:pull web ${YOUR_APP_NAME}`
 
### heroku public example:  [link](https://mighty-tor-63635.herokuapp.com/graphql)
