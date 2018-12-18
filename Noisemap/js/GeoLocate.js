//Runs when the page has beeen loaded
$(function () {

    var nav = null;
    //var output = document.getElementById("geolocate_reply_map");

    $('.ui-locate-button').unbind('click').click(function () {
        //$('#btn_close_geolocation_reply').trigger('click');
        geoFindMe();
    });

    function geoFindMe() {
        if (watchID) {
            //
            navigator.geolocation.clearWatch(watchID);
        }
        var output = document.getElementById("geolocate_reply_map");

        if (!navigator.geolocation) {
            output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
            return;
        }

        function success_watch(position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            //***************************************************************************
            var myLatDec = latitude; //.replace(/^\s*|\s(?=\s)|\s*$/g, "");  //trim whitespace
            var myLongDec = longitude; //.replace(/^\s*|\s(?=\s)|\s*$/g, "");  //trim whitespace
            if (myLatDec == "" || isNaN(myLatDec)) {
                alert("Latitude must be a number")
                //break;
            }
            if (myLongDec == "" || isNaN(myLongDec)) {
                alert("Longitude must be a number")
                //break;
            }

            //alert(myLatDec+"  "+myLongDec)
            var thea = 6377563.396
            var theb = 6356256.91
            var thee0 = 400000
            var then0 = -100000
            var thef0 = 0.9996012717
            var thePHI0 = 49.00000
            var theLAM0 = -2.00000

            var myeast = Lat_Long_to_East(myLatDec, myLongDec, thea, theb, thee0, thef0, thePHI0, theLAM0) + 90
            myeast = Math.round(myeast)

            var mynorth = Lat_Long_to_North(myLatDec, myLongDec, thea, theb, thee0, then0, thef0, thePHI0, theLAM0) + 10
            mynorth = Math.round(mynorth)

            var Mypoint = new esri.geometry.Point(myeast, mynorth, new esri.SpatialReference({ wkid: 27700 }));

            AddGraphic(Mypoint);
        }

        function success(position) {

            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            //***************************************************************************
            var myLatDec = latitude; //.replace(/^\s*|\s(?=\s)|\s*$/g, "");  //trim whitespace
            var myLongDec = longitude; //.replace(/^\s*|\s(?=\s)|\s*$/g, "");  //trim whitespace
            if (myLatDec == "" || isNaN(myLatDec)) {
                alert("Latitude must be a number")
                //break;
            }
            if (myLongDec == "" || isNaN(myLongDec)) {
                alert("Longitude must be a number")
                //break;
            }

            //alert(myLatDec+"  "+myLongDec)
            var thea = 6377563.396
            var theb = 6356256.91
            var thee0 = 400000
            var then0 = -100000
            var thef0 = 0.9996012717
            var thePHI0 = 49.00000
            var theLAM0 = -2.00000

            var myeast = Lat_Long_to_East(myLatDec, myLongDec, thea, theb, thee0, thef0, thePHI0, theLAM0) + 90
            myeast = Math.round(myeast)

            var mynorth = Lat_Long_to_North(myLatDec, myLongDec, thea, theb, thee0, then0, thef0, thePHI0, theLAM0) + 10
            mynorth = Math.round(mynorth)

            var Mypoint = new esri.geometry.Point(myeast, mynorth, new esri.SpatialReference({ wkid: 27700 }));

            AddGraphic(Mypoint);
            //
            //var pxWidth = map.extent.getWidth() / map.width;
            //var padding = 3 * pxWidth;
            var padding = 10;
            var mapxmin = myeast - padding;
            var mapxmax = myeast + padding;
            var mapymin = mynorth - padding;
            var mapymax = mynorth + padding;

            var myextent = new esri.geometry.Extent(mapxmin, mapymin, mapxmax, mapymax, new esri.SpatialReference({ wkid: 27700 }));

            map.setExtent(myextent, true);
            //***************************************************************************
            // output.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>' +
            //    '<p>Easting is ' + myeast + ' <br>Northing is ' + mynorth + '</p>';

            //var img = new Image();
            //img.src = "https://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";

            //output.appendChild(img);
            var geo_options = {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 30000
            };

            // navigator.geolocation.getCurrentPosition(success, error, geo_options);
            watchID = navigator.geolocation.watchPosition(success_watch, error, geo_options);
        };

        function error(err) {
            //
            //alert("Unable to retrieve your location");
        };

        function AddGraphic(Mypoint) {
            //addGraphic(pt);
            //var Mypoint = new Point(_x, _y, map.spatialReference);
            var graphic = new esri.Graphic(Mypoint, graphic_Search);
            gl_Graphics.clear();

            //*******************************************************************

            var circleCenter = Mypoint;

            var radius = 20;
            var myradVal = 'METERS';

            var circle = new esri.geometry.Circle({
                center: circleCenter,
                radius: radius,
                radiusUnit: esri.Units[myradVal]
            });
            var graphic2 = new esri.Graphic(circle, graphic_shapefile_polygon);
            //gl_Graphics.add(graphic);
            gl_Graphics.add(graphic2);
            gl_Graphics.add(graphic);
            //*******************************************************************
        }

        //output.innerHTML = "<p>Locating…</p>";

        var geo_options = {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 30000
        };

        navigator.geolocation.getCurrentPosition(success, error, geo_options);
        // watchID = navigator.geolocation.watchPosition(success_watch, error, geo_options);
        //var watchID = navigator.geolocation.watchPosition(function (position) {
        //    do_something(position.coords.latitude, position.coords.longitude);
        //});

    }
    
});