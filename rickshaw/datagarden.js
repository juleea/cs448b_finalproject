/**
 * datagarden.js
 *
 */

DataGarden.prototype.DEMO_DATA = "../data/demodata.clean_.json";

function DataGarden(garden, useLive, dataInterval) { 

	this.garden = garden;
	this.useLive = useLive;
	this.dataInterval = dataInterval;

	var that = this;

	//use local static demo data
	if (!useLive) {

		this.nextIndex = 0;

		$.getJSON(this.DEMO_DATA, function(response) {
			that.data = response;
			that.bigBang = new Date(that.data[0].time);
        	// that.apocalypse = new Date(that.data[that.data.length-1].time);
		});

	}
}

// Get all data in the interval specified in epoch time (in milliseconds).
// start time is inclusive, end time is exclusive
DataGarden.prototype.getRange = function(startDate, endDate, isMonitorMode, updateFunction) {

	if (end < start) {
		console.error("Invalid query: end is before start. Returning empty array.");			
		return [];
	}

	if (!this.useLive && isMonitorMode) {
		var start = startDate.getTime();
		var end = endDate.getTime();
		console.log("start: " + start + ", end: " + end + ", dataInterval " + dataInterval);
		var numPoints = (end - start) / this.dataInterval; // number of points to return
		// var startIndex = Math.min(Math.max(Math.floor((start - this.bigBang.getTime()) / this.dataInterval), 0), this.data.length);
		// var endIndex = Math.max(Math.min(Math.floor((end - this.bigBang.getTime()) / this.dataInterval), this.data.length), 0);
		var startIndex = this.nextIndex;
		this.nextIndex = Math.min(Math.floor(startIndex) + numPoints , this.data.length);
		
		console.log("Effective index range queried: [" + startIndex  + ", " + this.nextIndex + "]");

		updateFunction(this.data.slice(startIndex, this.nextIndex));
	
	} else if (!this.useLive && !isMonitorMode) {
		var startIndex = Math.max(0, Math.floor((startDate.getTime() - this.bigBang.getTime()) / dataInterval));
		var endIndex = Math.min(Math.floor((endDate.getTime() - this.bigBang.getTime()) / dataInterval + 1), this.data.length);

		console.log("startDate: " + startDate.getTime() + ", endDate: " + endDate);
		console.log("bigBang: " + this.bigBang.getTime());

		console.log("Effective index range queried: [" + startIndex  + ", " + endIndex + "]");

		updateFunction(this.data.slice(startIndex, endIndex));		

	} else {
		var numEntries = Math.floor((endDate.getTime() - startDate.getTime()) / dataInterval + 8); // add 8 for buffer because data interval isn't consistently 10 seconds
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
