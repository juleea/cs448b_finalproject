
function DataGarden(garden, useLive) { 
	this.garden = garden;
	this.useLive = useLive;
	

	if (!useLive) {
		this.now = new Date("2012-12-04T16:40:04.000Z");
		this.bigBang = new Date("2012-12-04T15:25:14.000Z");
		this.apocalypse = new Date("2012-12-04T19:18:24.000Z");
		this.currentIndex = 0;

		$.getJSON("../data/v2.n1440.clean", function(response) {
			this.data = response;
		})
	}

}

DataGarden.prototype.getLastN = function(n) {
}

DataGarden.prototype.getIntialData = function() {
	if (!this.useLive) {
		var then = this.bigBang;
		while (this.now > then) {
			this.currentIndex++;
		}
	return this.data.slice(0, this.currentIndex);
	}
}