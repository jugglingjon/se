var beaconFinder = (function() {
  // beaconFinderlication object.
  var beaconFinder = {};

  // Dictionary of beacons.
  var beacons = {};

  // Timer that displays list of beacons.
  var updateTimer = null;

  beaconFinder.initialize = function() {
    document.addEventListener(
      'deviceready',
      function() {
        evothings.scriptsLoaded(initScan)
      },
      false);
  };
  /**
   * Call this to stop the scanning
   */
  beaconFinder.stop = function() {
    stopScan();

  };

  function initScan() {
    console.log('initScan');
    // Start tracking beacons!
    startScan();

    // Display refresh timer.
    updateTimer = setInterval(setDisplay, 100);
  }
  /**
   * Stops the app from scanning for beacons.
   *
   */
  function stopScan() {
    beacons = {};
    clearInterval(updateTimer);
  }

  function startScan() {
    console.log('startScan');

    function onBeaconsRanged(beaconInfo) {
      //console.log('onBeaconsRanged: ' + JSON.stringify(beaconInfo))
      for (var i in beaconInfo.beacons) {
        // Insert beacon into table of found beacons.
        // Filter out beacons with invalid RSSI values.
        var beacon = beaconInfo.beacons[i];
        if (beacon.rssi < 0) {
          beacon.timeStamp = Date.now();
          var key = beacon.uuid + ':' + beacon.major + ':' + beacon.minor;
          beacons[key] = beacon;


        }
      }
    }

    function onError(errorMessage) {
      console.log('Ranging beacons did fail: ' + errorMessage);
    }

    // Request permission from user to access location info.
    // This is needed on iOS 8.
    estimote.beacons.requestAlwaysAuthorization();

    // Start ranging beacons.
    estimote.beacons.startRangingBeaconsInRegion({}, // Empty region matches all beacons
      // with the Estimote factory set UUID.
      onBeaconsRanged,
      onError);


  }

  function setDisplay() {

    $.each(beacons, function(key, beacon) {
      console.log(beacon);

      if (beacon.distance <= 2) {

        beaconController.handleBeaconFound(beacon);

      } else {
        //console.log('false');
      }
    });
  }




  return beaconFinder;
})();
