# create the DB schema and it's user (MySql):
```
    CREATE DATABASE `twitter-db` CHARACTER SET utf8 COLLATE utf8_general_ci;
    CREATE USER 'twitter-admin'@'localhost' IDENTIFIED BY '123';
    GRANT ALL PRIVILEGES ON * . * TO 'twitter-admin'@'localhost';
```

# setting up the environment: 
```
    npm run setup
```

# start the app:
```
    npm start
```

# APIs prefix (example):
```
    http://localhost:3000/v1/<route>
```