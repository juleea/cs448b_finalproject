
function DataGarden(garden, useLive) { 
	this.garden = garden;
	this.useLive = useLive;

	var that = this;

	if (!useLive) {
		this.now = new Date("2012-12-05T16:08:56.000Z");
		this.bigBang = new Date("2012-12-05T16:07:56.000Z");
		this.apocalypse = new Date("2012-12-04T19:18:24.000Z");
		this.nextIndex = 0;

		$.getJSON("../data/v2.n1440.clean.json", function(response) {
			that.data = response;
		});

	}
}

DataGarden.prototype.getLastN = function(n) {
	// console.log("getLastN()");
	if (!this.useLive) {
		console.log(this.data.slice(0, 9));
		var start = this.nextIndex;
		this.nextIndex = start + n;
		console.log("n = " + n + "index range: [" + start + ", " + this.nextIndex + "]");
		return this.data.slice(start, this.nextIndex);

	}
}

DataGarden.prototype.getInitialData = function() {
	if (!this.useLive) {
		var numPoints = (this.now.getTime() - this.bigBang.getTime())/10.0/1000;
		this.nextIndex = numPoints;
		console.log("intial display num points: " + this.nextIndex);
		return this.data.slice(0, this.nextIndex);
	}
}
