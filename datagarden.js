function DataGarden(garden, useLive) { 

	this.garden = garden;
	this.useLive = useLive;
	
	var that = this;

	//use local static data
	if (!useLive) {
		this.now = new Date("2012-12-05T08:30:56.000Z");
		this.bigBang = new Date("2012-12-05T08:08:56.000Z");
		this.apocalypse = new Date("2012-12-05T12:08:56.000Z");
		this.nextIndex = 0;
		this.dataInterval = 10000; // time (in milliseconds) between 2 data points
		$.getJSON("../data/demodata.clean_.json", function(response) {
			that.data = response;
		});

	} else { //use live data!

	}
}

DataGarden.prototype.DEFAULT_VISIBLE_TIME_RANGE = 5 * 60 * 1000; // 5 minutes


DataGarden.prototype.getLastN = function(n) {
	if (!this.useLive) {
		// console.log(this.data.slice(0, 9));
		var start = this.nextIndex;
		this.nextIndex = start + n;
		//console.log("n = " + n + "index range: [" + start + ", " + this.nextIndex + "]");
		return this.data.slice(start, this.nextIndex);

	} else {

	}
}


DataGarden.prototype.getInitialData = function(start, interval) {
	if (!start) {
		start = new Date().getTime();
	}

	if (!interval) {
		interval = DEFAULT_VISIBLE_TIME_RANGE;	
	}

	// console.log("get initial data()");
	if (!this.useLive) { 
		start = this.bigBang.getTime();
		if (interval) {
			start = this.now.getTime() - interval;

		}
		var returnData = this.getRange(start, this.now.getTime() + 1); // add one to include now
		this.nextIndex = this.getRange(this.bigBang.getTime(), this.now.getTime()).length; // hack-city to set next index
		// console.log("intial display num points: " + this.nextIndex);
		return returnData;
		// return this.data.slice(0, this.nextIndex);
		
	} else {
		//TODO: change return condition?
		console.error("Error retrieving initial data. Returning empty array.");
		return [];
	}
}

// Get all data in the interval specified in epoch time (in milliseconds).
// start time is inclusive, end time is exclusive
DataGarden.prototype.getRange = function(startDate, endDate, updateFunction) {

	// var queryUrl = "http://50.19.108.27/arduino/garden/" + garden + "?num=" + numEntries;

	if (end < start) {
		console.error("Invalid query: end is before start. Returning empty array.");			
		//TODO: change return condition?
		return [];
	}

	if (!this.useLive) {
//TODO CHANGE TO HANDLE startDate and endDate inste

		var start = startDate.getTime();
		var end = endDate.getTime();
		var startIndex = Math.min(Math.max(Math.floor((start - this.bigBang.getTime()) / this.dataInterval), 0), this.data.length);
		var endIndex = Math.max(Math.min(Math.floor((end - this.bigBang.getTime()) / this.dataInterval), this.data.length), 0);
		console.log("Effective index range queried: [" + startIndex  + ", " + endIndex + "]");
		return this.data.slice(startIndex, endIndex);

	} else {
		var numEntries = Math.floor((endDate.getTime() - startDate.getTime()) / 10000 + 4);
		// http://50.19.108.27/arduino/garden/range/v2?start_time=2012-11-20T02:37:38.963Z&end_time=2012-11-28T02:37:38.963Z&num=10
		var queryUrl = "http://50.19.108.27/arduino/garden/range/" + garden + "?start_time=" + startDate.toJSON() + "&end_time=" + endDate.toJSON() + "&num=" + numEntries;
	    
	    console.log("query: " + queryUrl);

	    jQuery.ajax({
	        url: queryUrl,
	        type: "GET",
	        dataType: "json",
	  		success: function(data, textStatus, jqXHR) { updateFunction(data); console.log("data retrieved: " + data.length); }
	    });

	    
	}
}
