const Stock = require('../models/stock.model');
const mongoose = require('mongoose');
const path = require('path');
const axios = require('axios');
const KEY = require('../key.config');
//Simple version, without validation or sanitation
exports.test = function (req, res) {
	res.send('Greetings from the Test controller!');
};


exports.stock_create = function (req, res) {
	//date	symbol	open	close	low	high	volume
	console.log("In create");
	console.log("Date --> " + req.body.date);
	let stock = new Stock({
		date: req.body.date,
		symbol: req.body.symbol,
		open: req.body.open,
		close: req.body.close,
		low: req.body.low,
		high: req.body.high,
		volume: req.body.volume
	});

	stock.save(function (err) {
		if (err) {
			console.log(err);
			return next(err);
		}
		res.send('Stock Created successfully')
	})
};

exports.stock_details = function (req, res) {
	Stock.findById(req.params.id, function (err, product) {
		if (err) return next(err);
		res.send(product);
	})
};

exports.stock_update = function (req, res) {
	Stock.findByIdAndUpdate(req.params.id, {
		$set: req.body
	}, function (err, product) {
		if (err) return next(err);
		res.send('Product udpated.');
	});
};

exports.stock_delete = function (req, res) {
	Stock.findOneAndDelete(req.params.id, function (err) {
		if (err) return next(err);
		res.send('Deleted successfully!');
	})
};

exports.get_symbol_list = function (req, res) {
	console.log("Inside get_symbol_list...");

	Stock.collection.distinct("symbol", function (error, results) {
		//console.log(results);
		if (error)
			res.send(error);
		res.json(results); // return all todos in JSON format
	});
}

exports.get_symbol_by_name = function (req, res) {
	console.log("Inside get_symbol_by_name...");

	let pickedTikcer = req.body.ticker.toUpperCase();
	console.log("Searching for --" + pickedTikcer);
	Stock.find({
		symbol: pickedTikcer
	}, ['date', 'low', 'open', 'close', 'high'], {
		sort: {
			date: 1 //Sort by Date Added DESC
		}
	}, function (err, stocks) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err)
			res.send(err)
		console.log("Found : " + stocks.length);
		var jsonArg = new Object();
		let subResult = [];
		let result = [];
		//result.push([]);
		for (i in stocks) {
			subResult = [];
			subResult.push(new Date(stocks[i].date).getTime());
			/*	subResult.push(stocks[i].low);
				subResult.push(stocks[i].open);
				subResult.push(stocks[i].close);
				subResult.push(stocks[i].high);*/
			subResult.push(stocks[i].open);
			subResult.push(stocks[i].high);
			subResult.push(stocks[i].low);
			subResult.push(stocks[i].close);
			result.push(subResult);
		}
		jsonArg.chartData = result;
		jsonArg.orgData = stocks;

		//Code to get more details about STOCK:
		console.log("KEY--->" + KEY.ALPHAVANTAGE_API_KEY);
		axios.get('https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=' + pickedTikcer + '&apikey=' + KEY.ALPHAVANTAGE_API_KEY)
			.then(response => {
				jsonArg.orgInfo = response.data.bestMatches;
				console.log(response.data.bestMatches);
				res.json(jsonArg); // return all todos in JSON format
			})
			.catch(error => {
				console.log(error);
			});
	});
}

exports.get_all_stocks = function (req, res) {
	console.log("Inside get_all_stocks...");

	Stock.find({}, [], {
		skip: 0, // Starting Row
		limit: 10, // Ending Row
		sort: {
			date: -1 //Sort by Date Added DESC
		}
	}, function (err, stocks) {
		// if there is an error retrieving, send the error. nothing after res.send(err) will execute
		if (err)
			res.send(err)
		res.json(stocks); // return all todos in JSON format
	});
}

//UI controls:
exports.stock_ui_home = function (req, res) {
	console.log("Inside stock_ui_home");
	res.sendFile(path.join(__dirname, '../public', 'index.html'));
}
