
function DataGarden(garden, useLive) { 
	this.garden = garden;
	this.useLive = useLive;

	var that = this;

	if (!useLive) {
		this.now = new Date("2012-12-04T15:30:04.000Z");
		this.bigBang = new Date("2012-12-04T15:25:14.000Z");
		this.apocalypse = new Date("2012-12-04T19:18:24.000Z");
		this.nextIndex = 0;

		$.getJSON("../data/v2.n1440.clean.json", function(response) {
			that.data = response.reverse();
			console.log("data retrieved: " + that.data.length + " points");
		});

	}
}

DataGarden.prototype.getLastN = function(n) {
	console.log("getLastN()");
	if (!this.useLive) {
		var start = this.nextIndex;
		this.nextIndex = start + n;
		console.log(this.data[0].time + " ... " + this.data[1].time);
		return this.data.slice(start, this.nextIndex);
	}
}

DataGarden.prototype.getInitialData = function() {
    /*console.log("hi");
	if (!this.useLive) {
        console.log("hi");
		var then = this.bigBang;
		while (this.now > then) {
			this.currentIndex++;
		}
        return this.data.slice(0, this.currentIndex);
	}
}
*/
	console.log("get initial data()");
	if (!this.useLive) {
		console.log(this.now.getTime() - this.bigBang.getTime());
		var numPoints = (this.now.getTime() - this.bigBang.getTime())/10.0/1000;
		this.nextIndex = numPoints;
		return this.data.slice(0, this.nextIndex);
	}
}
