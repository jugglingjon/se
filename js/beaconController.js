/**
 * Beacon controller finds the beacons fromt he beaconlist js file and runs the onFind() function
 * its findes the beaconlist object based on the major value of the beacon.
 * these can be set to whatever. I was using 100, 200, and 300 for locations 1,2, and 3
 */
var beaconController = {
	beaconlist:beaconlist,
	/**
	 * Finds the beacon from the list and calls the onFind function
	 */
	handleBeaconFound:function(beacon){
	  var b = beaconController.getBeaconInfobyMajor(beacon.major);
    b.onFind();
	},
	/*
	 * Beacon List lookup
	 */
	getBeaconInfobyMajor:function(major){
		var beaconInfo = {};
		this.beaconlist.forEach(function(beacon){
			if(beacon.major == major){
				beaconInfo = beacon;
			}
		});

		return beaconInfo;
	}
};
