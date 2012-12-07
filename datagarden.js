
function DataGarden(garden, useLive) { 
	this.garden = garden;
	this.useLive = useLive;

	var that = this;

	if (!useLive) {
		this.now = new Date("2012-12-05T16:08:56.000Z");
		this.bigBang = new Date("2012-12-05T16:07:56.000Z");
		this.apocalypse = new Date("2012-12-05T20:01:06.000Z");
		this.nextIndex = 0;
		this.dataInterval = 10000; // time (in milliseconds) between 2 data points

		$.getJSON("../data/v2.n1440.clean.json", function(response) {
			that.data = response;
			console.log(response[0]);
		});

	}
}

DataGarden.prototype.getLastN = function(n) {
	// console.log("getLastN()");
	if (!this.useLive) {
		// console.log(this.data.slice(0, 9));
		var start = this.nextIndex;
		this.nextIndex = start + n;
		// console.log("n = " + n + "index range: [" + start + ", " + this.nextIndex + "]");
		return this.data.slice(start, this.nextIndex);

	}
}


DataGarden.prototype.getInitialData = function(interval) {
	// console.log("get initial data()");
	if (!this.useLive) {
		var start = this.bigBang.getTime();
		if (interval) {
			start = this.now.getTime() - interval;

		}
		var returnData = this.getRange(start, this.now.getTime() + 1); // add one to include now
		this.nextIndex = this.getRange(this.bigBang.getTime(), this.now.getTime()).length; // hack-city to set next index
		// console.log("intial display num points: " + this.nextIndex);
		return returnData;
		// return this.data.slice(0, this.nextIndex);
	
	} else if (now && interval) {
		return this.getRange(now - interval, now); 
	
	} else {
		//TODO: change return condition?
		console.error("Error retrieving initial data. Returning empty array.");
		return [];
	}
}

// Get all data in the interval specified in epoch time (in milliseconds).
// start time is inclusive, end time is exclusive
DataGarden.prototype.getRange = function(start, end) {
	if (!this.useLive) {
		if (end < start) {
			console.error("Invalid query: end is before start. Returning empty array.");
			
			//TODO: change return condition?
			return [];
		}

		var startIndex = Math.max(Math.floor((start - this.bigBang.getTime()) / this.dataInterval), 0);
		var endIndex = Math.min(Math.floor((end - this.bigBang.getTime()) / this.dataInterval), this.data.length);
		console.log("Effective index range queried: [" + startIndex  + ", " + endIndex + "]");
		return this.data.slice(startIndex, endIndex);
	}
}