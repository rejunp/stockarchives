const Stock = require('../models/stock.model');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
const KEY = require('../key.config');

exports.stock_ui_home = function (req, res) {
	console.log("Inside stock_ui_home");
	res.sendFile(path.join(__dirname, '../public', 'index.html'));
}

exports.get_symbol_list = function (req, res) {
	console.log("Inside get_symbol_list...");
	Stock.collection.distinct("symbol", function (error, results) {
		if (error)
			res.send(error);
		res.json(results); // return all todos in JSON format
	});
}

exports.get_symbol_by_name = function (req, res) {
	console.log("Inside get_symbol_by_name...");
	let pickedTikcer = req.body.ticker.toUpperCase();
	Stock.find({
		symbol: pickedTikcer
	}, ['date', 'low', 'open', 'close', 'high'], {
		sort: {
			date: 1
		}
	}, function (err, stocks) {
		if (err)
			res.send(err)
		console.log("Found : " + stocks.length);
		var jsonArg = new Object();
		let subResult = [];
		let result = [];
		for (i in stocks) {
			subResult = [];
			subResult.push(new Date(stocks[i].date).getTime());
			subResult.push(stocks[i].open);
			subResult.push(stocks[i].high);
			subResult.push(stocks[i].low);
			subResult.push(stocks[i].close);
			result.push(subResult);
		}
		jsonArg.chartData = result;
		jsonArg.orgData = stocks;

		axios.get('https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=' + pickedTikcer + '&apikey=' + KEY.ALPHAVANTAGE_API_KEY)
			.then(response => {
				jsonArg.orgInfo = response.data.bestMatches;
				console.log(response.data.bestMatches);
				res.json(jsonArg);
			})
			.catch(error => {
				console.log(error);
			});
	});
}

exports.get_all_stocks = function (req, res) {
	console.log("Inside get_all_stocks...");

	Stock.find({}, [], {
		skip: 0,
		limit: 10,
		sort: {
			date: -1
		}
	}, function (err, stocks) {
		if (err)
			res.send(err)
		res.json(stocks);
	});
}
