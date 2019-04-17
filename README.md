# heroku-queue-worker-example

### Initial Heroku app config

1. heroku login
2. heroku create
3. git push heroku master

### Set up Redis

After app is ready, set up redis instance and worker

Add heroku instance to the app
```heroku addons:create heroku-redis```
check the redis instace status until it's created. 

Once created, you can copy the redis config url to .env file with
```heroku config```

### Set up worker

You need to deploy the code to heroku in order to run worker process, then
```heroku ps:scale worker=1```

To stop worker process,
```heroku ps:scale worker=0```
If you let worker continue to run, it will eat up your free dyno hours
