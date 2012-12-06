
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
		});

	}
}

DataGarden.prototype.getLastN = function(n) {
	// console.log("getLastN()");
	if (!this.useLive) {
		// console.log(this.data.slice(0, 9));
		var start = this.nextIndex;
		this.nextIndex = start + n;
		console.log("n = " + n + "index range: [" + start + ", " + this.nextIndex + "]");
		return this.data.slice(start, this.nextIndex);

	}
}

/*DataGarden.prototype.getInitialData = function() {
	if (!this.useLive) {
		var numPoints = (this.now.getTime() - this.bigBang.getTime())/10.0/1000;
		this.nextIndex = numPoints;
		console.log("intial display num points: " + this.nextIndex);
		return this.data.slice(0, this.nextIndex);
        */
DataGarden.prototype.getInitialData = function(now, interval) {
	// console.log("get initial data()");
	if (!this.useLive) {

		var returnData = this.getRange(this.bigBang.getTime(), this.now.getTime() + 1); // add one to include now
		console.log("Initial data: " + returnData);
		this.nextIndex = returnData.length;
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

        console.log((start - this.bigBang.getTime()) / this.dataInterval);
		var startIndex = Math.min(Math.max(Math.floor((start - this.bigBang.getTime()) / this.dataInterval), 0), this.data.length);
		var endIndex = Math.max(Math.min(Math.floor((end - this.bigBang.getTime()) / this.dataInterval), this.data.length), 0);
		console.log("Effective index range queried: [" + startIndex  + ", " + endIndex + "]");
		return this.data.slice(startIndex, endIndex);
	}
}
