var rpStockApp = angular.module('rpStock', []);
let gTickerList;
let gComapnyDate;

rpStockApp.controller('topStocksController', function ($scope, $http) {
	$scope.formData = {};
	console.log("Inside Main Controller !!");
	// when landing on the page, get all todos and show them
	$http.get('/stocks/api/getstocks')
		.then(function (response) {
			$scope.stocks = response.data;
			$http.get('/stocks/api/getsymbollist')
				.then(function (response) {
					$scope.tickerList = response.data;
					gTickerList = response.data;
					autocomplete(document.getElementById("inpTicker"), gTickerList);
				}, function (error) {
					console.log('Error: ' + error);
				});
		}, function (error) {
			console.log('Error: ' + error);
		});

	$scope.searchByTicker = function () {
		document.getElementById("stockMainCard").style.display = "none";
		$scope.formData.ticker=document.getElementById("inpTicker").value;
		$http.post('/stocks/api/getstockbyname/', $scope.formData)
			.then(function (response) {
				$scope.formData = {};
				console.log(response);
				$scope.singleCompanyData = response.data.orgData;
				$scope.singleCompanyInfo = response.data.orgInfo[0];
				gComapnyDate = response.data.chartData;
				document.getElementById("stockMainCard").style.display = "block";
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
	var currentFocus;
	inp.addEventListener("input", function (e) {
		var a, b, i, val = this.value;
		closeAllLists();
		if (!val) {
			return false;
		}
		currentFocus = -1;
		a = document.createElement("DIV");
		a.setAttribute("id", this.id + "autocomplete-list");
		a.setAttribute("class", "autocomplete-items");
		this.parentNode.appendChild(a);
		for (i = 0; i < arr.length; i++) {
			if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
				b = document.createElement("DIV");
				b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
				b.innerHTML += arr[i].substr(val.length);
				b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
				b.addEventListener("click", function (e) {
					inp.value = this.getElementsByTagName("input")[0].value;
					closeAllLists();
				});
				a.appendChild(b);
			}
		}
	});
	inp.addEventListener("keydown", function (e) {
		var x = document.getElementById(this.id + "autocomplete-list");
		if (x) x = x.getElementsByTagName("div");
		if (e.keyCode == 40) {
			currentFocus++;
			addActive(x);
		} else if (e.keyCode == 38) { //up
			currentFocus--;
			addActive(x);
		} else if (e.keyCode == 13) {
			e.preventDefault();
			if (currentFocus > -1) {
				if (x) x[currentFocus].click();
			}
		}
	});

	function addActive(x) {
		if (!x) return false;
		removeActive(x);
		if (currentFocus >= x.length) currentFocus = 0;
		if (currentFocus < 0) currentFocus = (x.length - 1);
		x[currentFocus].classList.add("autocomplete-active");
	}

	function removeActive(x) {
		for (var i = 0; i < x.length; i++) {
			x[i].classList.remove("autocomplete-active");
		}
	}

	function closeAllLists(elmnt) {
		except the one passed as an argument:*/
		var x = document.getElementsByClassName("autocomplete-items");
		for (var i = 0; i < x.length; i++) {
			if (elmnt != x[i] && elmnt != inp) {
				x[i].parentNode.removeChild(x[i]);
			}
		}
	}
	document.addEventListener("click", function (e) {
		closeAllLists(e.target);
	});
}
