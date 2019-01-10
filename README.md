# stockarchives

Stock Archives is an application build using the MEAN stack. 

# ![stockarchives](public/images/promo.png)

## Core Objectives

- Learn the basics `MEAN` stack.
- Work on `MongoDB` cloud DB
- `Highcharts` Integration
- `NodeJS` Server Side Scripting
- `nodemon` functionality
- `Bootstrap` integration

## Application Idea 
- [Hacker Earth](https://www.hackerearth.com/challenge/competitive/brainwaves-full-stack/?utm_source=satellite&utm_campaign=brainwaves-full-stack&utm_medium=link&rem-web=1) - Brainwave 2019

## Note 

- `key.config_sample.js` has to be renamed to `key.config.js`
- `MONGODB_ATLAS_URI` - The MongoDB URI will available in [MongoDB Atlas](https://cloud.mongodb.com/user#/atlas/login)
- `ALPHAVANTAGE_API_KEY` - To get Alphavantage API KEY, please register in [Aplhavantage](https://www.alphavantage.co/support/#api-key)

## Sample Data

Import sample [data](http://hck.re/CPKVPp) into MongoAtlas

```dos
mongoimport --uri "mongodb+srv://XXXXX:XXXXXX@maincluster-XXXXX.mongodb.net/test?retryWrites=true" --collection stocks --drop --type csv --file test.csv -f date,symbol,open,close,low,high,volume
```

## Features
- [x] MEAN Stack Implementation
- [x] Store and Fetch historical stock data
- [x] Fetch More details about Ticker Searched
- [x] Show OHLC graph of the data fetched
- [ ] Top Stock Calculation/Analysis
- [ ] Mobile Responsive 
