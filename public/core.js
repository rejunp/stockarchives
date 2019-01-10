/**
API Key : BL3MVV2379HDLNR9
API Call: https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=WLTW&apikey=BL3MVV2379HDLNR9
JSON Output:
{
    "bestMatches": [
        {
            "1. symbol": "WLTW",
            "2. name": "Willis Towers Watson Public Limited Company",
            "3. type": "Equity",
            "4. region": "United States",
            "5. marketOpen": "09:30",
            "6. marketClose": "16:00",
            "7. timezone": "UTC-05",
            "8. currency": "USD",
            "9. matchScore": "1.0000"
        }
    ]
}
**/
var rpStockApp = angular.module('rpStock', []);
let gTickerList;
let gComapnyDate;
/*
google.charts.load("visualization", "1", {
	'packages': ['corechart']
});
*/

rpStockApp.controller('topStocksController', function ($scope, $http) {
	$scope.formData = {};
	console.log("Inside Main Controller !!");
	// when landing on the page, get all todos and show them
	$http.get('/stocks/api/getstocks')
		.then(function (response) {
			$scope.stocks = response.data;
			console.log("Fetch1 Done:" + response);
			$http.get('/stocks/api/getsymbollist')
				.then(function (response) {
					$scope.tickerList = response.data;
					gTickerList = response.data;
					/*gTickerList = JSON.stringify(response.data);
					gTickerList = JSON.parse(gTickerList);*/
					console.log("Fetch 2 : " + response);
					autocomplete(document.getElementById("inpTicker"), gTickerList);
					// upper case color code and name
					/*_.each(gTickerList, function (color) {
						//color.code = color.code.toUpperCase();
						color.name = color.name.toUpperCase();
					});
					// sort by name
					gTickerList = _.sortBy(gTickerList, function (color) {
						return color.name;
					});*/

				}, function (error) {
					console.log('Error: ' + error);
				});
		}, function (error) {
			console.log('Error: ' + error);
		});

	$scope.searchByTicker = function () {
		document.getElementById("stockMainCard").style.display = "none";
		$http.post('/stocks/api/getstockbyname/', $scope.formData)
			.then(function (response) {
				$scope.formData = {}; // clear the form so our user is ready to enter another

				console.log(response);
				$scope.singleCompanyData = response.data.orgData;
				$scope.singleCompanyInfo = response.data.orgInfo[0];
				gComapnyDate = response.data.chartData;
				document.getElementById("stockMainCard").style.display = "block";

				console.log(gComapnyDate);
				//google.charts.setOnLoadCallback(drawChart);


				Highcharts.stockChart('container', {
					rangeSelector: {
						selected: 1
					},
					title: {
						text: $scope.singleCompanyInfo["1. symbol"] + ' Stock Price'
					},
					series: [{
						type: 'candlestick',
						name: $scope.singleCompanyInfo["1. symbol"] + ' Stock Price',
						data: gComapnyDate,
						dataGrouping: {
							units: [
									[
										'week', // unit name
										[1] // allowed multiples
									], [
										'month',
										[1, 2, 3, 4, 6]
										]
								]
						}
							}]
				});


			}, function (err) {
				console.log('Error: ' + err);
			});
	};
});

function autocomplete(inp, arr) {
	/*the autocomplete function takes two arguments,
	the text field element and an array of possible autocompleted values:*/
	var currentFocus;
	/*execute a function when someone writes in the text field:*/
	inp.addEventListener("input", function (e) {
		var a, b, i, val = this.value;
		/*close any already open lists of autocompleted values*/
		closeAllLists();
		if (!val) {
			return false;
		}
		currentFocus = -1;
		/*create a DIV element that will contain the items (values):*/
		a = document.createElement("DIV");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");
		/*append the DIV element as a child of the autocomplete container:*/
		this.parentNode.appendChild(a);
		/*for each item in the array...*/
		for (i = 0; i < arr.length; i++) {
			/*check if the item starts with the same letters as the text field value:*/
			if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				/*create a DIV element for each matching element:*/
				b = document.createElement("DIV");
				/*make the matching letters bold:*/
				b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
				b.innerHTML += arr[i].substr(val.length);
				/*insert a input field that will hold the current array item's value:*/
				b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
				/*execute a function when someone clicks on the item value (DIV element):*/
				b.addEventListener("click", function (e) {
					/*insert the value for the autocomplete text field:*/
					inp.value = this.getElementsByTagName("input")[0].value;
					/*close the list of autocompleted values,
					(or any other open lists of autocompleted values:*/
					closeAllLists();
				});
				a.appendChild(b);
			}
		}
	});
	/*execute a function presses a key on the keyboard:*/
	inp.addEventListener("keydown", function (e) {
		var x = document.getElementById(this.id + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
			/*If the arrow DOWN key is pressed,
			increase the currentFocus variable:*/
			currentFocus++;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 38) { //up
			/*If the arrow UP key is pressed,
			decrease the currentFocus variable:*/
			currentFocus--;
			/*and and make the current item more visible:*/
			addActive(x);
		} else if (e.keyCode == 13) {
			/*If the ENTER key is pressed, prevent the form from being submitted,*/
			e.preventDefault();
			if (currentFocus > -1) {
				/*and simulate a click on the "active" item:*/
				if (x) x[currentFocus].click();
			}
		}
	});

	function addActive(x) {
		/*a function to classify an item as "active":*/
		if (!x) return false;
		/*start by removing the "active" class on all items:*/
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = (x.length - 1);
		/*add class "autocomplete-active":*/
		x[currentFocus].classList.add("autocomplete-active");
	}

	function removeActive(x) {
		/*a function to remove the "active" class from all autocomplete items:*/
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}

	function closeAllLists(elmnt) {
		/*close all autocomplete lists in the document,
		except the one passed as an argument:*/
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	/*execute a function when someone clicks in the document:*/
	document.addEventListener("click", function (e) {
		closeAllLists(e.target);
	});
}



/*function drawChart() {
	var data = google.visualization.arrayToDataTable(gComapnyDate
		[
		      ['Mon', 20, 28, 38, 45],
		      ['Tue', 31, 38, 55, 66],
		      ['Wed', 50, 55, 77, 80],
		      ['Thu', 77, 77, 66, 50],
		      ['Fri', 68, 66, 22, 15]
		      // Treat first row as data as well.
		    ]
		, true);

	var options = {
		title: 'Stock Performance',
		legend: 'none',
		candlestick: {
			risingColor: {
				stroke: '#4CAF50',
				fill: 'white'
			},
			fallingColor: {
				stroke: '#F44336'
			}
		},
		colors: ['magenta']
	};

	var chart = new google.visualization.CandlestickChart(document.getElementById('chart_div'));

	chart.draw(data, options);
}*/
