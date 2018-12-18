var map, toolbar, symbol, geomTask;
var initExtent;
var baseMapServiceLayerAerial;
var dynamicMapServiceLayer;
var dynamicMapServiceLayerLoadedHandlervar;
var dynamicMapServiceLayer2;
var dynamicMapServiceLayer2LoadedHandlervar;
var watchID;
var gl_Graphics;
var gl_WFS_Result_Graphics;
var gl_REST_Result_Graphics;
var gl_Query_draw;

var graphic_result_point;
var graphic_result_polygon;
var graphic_result_line;
var graphic_result_point_selected;
var graphic_shapefile_polygon
var graphic_draw_buffer;

var dynamicTransValue = 0.75;
var legendLayers = [];
var legend;


var resultDataset = []; //Result Dataset
var resContent;         //Result HTML Content
var mapIdentify;                   //Map Identify individual Results
var identifyTask, identifyParams;

var dom;

var ServiceURL = 'https://map.sepa.org.uk/arcgis/rest/services/NOISE_MAP_2017/MapServer';

var baseMapServiceLayer_standard;
var baseMapServiceLayer_colour;
var baseMapServiceLayer_grey;

var mapIdentifyClick;


require(["dojo/_base/connect", "dijit/registry", "esri/config", "esri/map", "esri/toolbars/draw", "esri/InfoTemplate", "esri/arcgis/utils", "esri/domUtils", "esri/layers/FeatureLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/dijit/PopupTemplate", "esri/dijit/Popup",
     "esri/layers/WMSLayer", "esri/layers/WMSLayerInfo", "esri/layers/GraphicsLayer", "esri/dijit/Scalebar", "esri/tasks/IdentifyTask", "esri/tasks/IdentifyParameters",
     "esri/geometry/Point", "dojo/_base/array", "esri/dijit/Legend",
     "esri/geometry/Extent", "esri/dijit/HomeButton", "esri/graphic", "esri/geometry/Circle",
     "esri/tasks/BufferParameters", "esri/geometry/geometryEngine", "esri/tasks/GeometryService",
     "esri/Color", "dojo/dom", "dojo/on", "dojo/dom-construct",
     "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/PictureMarkerSymbol", "esri/symbols/SimpleMarkerSymbol",
     "dojo/dom-attr", "dojo/dom-style", "dojo/query", "dojo/parser", "dojo/domReady!"

], function (connect, registry, esriConfig, Map, Draw, InfoTemplate, arcgisUtils, domUtils, FeatureLayer, ArcGISDynamicMapServiceLayer, PopupTemplate, Popup,
      WMSLayer, WMSLayerInfo, GraphicsLayer, Scalebar, IdentifyTask, IdentifyParameters,
      Point, arrayUtils, Legend,
      Extent, HomeButton, Graphic, Circle,
      BufferParameters, geometryEngine, GeometryService,
      Color, dom, on, domConstruct,
      SimpleFillSymbol, SimpleLineSymbol, PictureMarkerSymbol, SimpleMarkerSymbol,
      domAttr, domStyle, domquery, parser
      ) {
    dom = dom;
    //*************************** ESRI Confirguration ******************************************
    esriConfig.defaults.geometryService = new GeometryService("http://sepa-app-gis01/arcgis/rest/services/Utilities/Geometry/GeometryServer");
    esriConfig.defaults.io.alwaysUseProxy = false;
    esriConfig.defaults.io.proxyUrl = "sproxy/proxy.ashx";
    var proxyUrl = "http://map.sepa.org.uk/proxy/proxy.ashx"
    //var proxyUrl = "sproxy/proxy.ashx";
    esri.addProxyRule({
        urlPrefix: "http://www.getmapping.com/wms/scotland/scotland.wmsx",
        proxyUrl: proxyUrl
    });

    //debugger;
    //*********************************************************************************************
    // Graphics
    graphic_draw_buffer = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([76, 255, 0, 0.15]), 1), new Color([96, 117, 150, 0.45]));
    sls = new SimpleLineSymbol("solid", new Color("#444444"), 3);
    sfs = new SimpleFillSymbol("solid", sls, new Color([68, 68, 68, 0.25]));
    sps = new SimpleMarkerSymbol({
        "color": [255, 255, 255, 64],
        "size": 6,
        "angle": -30,
        "xoffset": 0,
        "yoffset": 0,
        "type": "esriSMS",
        "style": "esriSMSCircle",
        "outline": {
            "color": [0, 0, 0, 255],
            "width": 1,
            "type": "esriSLS",
            "style": "esriSLSSolid"
        }
    });

    //*********************************************************************************************

    //Graphics
    graphic_Search = new PictureMarkerSymbol("https://static.arcgis.com/images/Symbols/Shapes/BlueCircleLargeB.png", 30, 30).setOffset(0, 0);
    graphic_Identify = new PictureMarkerSymbol("https://static.arcgis.com/images/Symbols/Basic/RedStickpin.png", 25, 27).setOffset(0, 10);
    graphic_result_point = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 34, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 89, 131, 0.5]), 1), new Color([0, 0, 255, 0]));
    graphic_result_point_selected = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_CIRCLE, 34, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([150, 89, 131, 1]), 6), new Color([255, 0, 0, 0]));
    graphic_result_line = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([150, 89, 131, ]), 10);
    graphic_result_polygon = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 156, 247]), 1), new Color([0, 156, 247, 0.25]));
    graphic_shapefile_polygon = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 156, 247]), 1), new Color([0, 156, 247, 0.25]));

    //*********************************************************************************************
    //*********************************************************************************************
    //Initialise the Thinkwhere Maps
    init_background_layers();
    //*************************** Initial Extent ***************************************************
    initExtent = new Extent({ "xmin": -629028, "ymin": 442692, "xmax": 1050972, "ymax": 1299692, "spatialReference": { "wkid": 27700 } });
    //*********************************************************************************************
    //*************************** Map Layers ******************************************************

    map = new Map("mapDiv", { extent: initExtent, logo: false, sliderPosition: "bottom-right" });
    map.on("load", function (evt) {

        autoRecenter(map);  //Recenters the map when window changes
        bgChecker(); //keeps an eye on the aerial photography background
        //createToolbar(map);  //Creates Toolbar for drawing on the map
        //addIdentifyClick();
        setTimeout(function () {
            $('#transparency_slider_container').hide();
            $('.loaderModal').hide();
            addLegend();
        }, 3000);
        setTimeout(function () {
            $('.center_search_wrapper').show();
        }, 10000);
    });

    //function addIdentifyClick() {
    //    mapIdentifyClick = map.on("click", changeHandler);
    //    function changeHandler(evt) {
    //        //*******************************************
    //        var popupi = new Foundation.Reveal($('#modalViewIdentifyResults'), {
    //            'closeOnClick': false,
    //            'closeOnEsc': false
    //        });
    //        popupi.open();
    //        resizeMapDiv();
    //        $('.identifyResults_wrapper').empty();
    //        //*******************************************

    //    }
    //}
    //function removeIdentifyClick() {
    //    mapIdentifyClick.remove();
    //}

    map.on("zoom-end", bgChecker); //keeps an eye on the aerial photography background
    map.on("pan-end", bgChecker);  //keeps an eye on the aerial photography background
    map.on("zoom-end", showExtent); //keeps an eye on the aerial photography background
    map.on("pan-end", showExtent);  //keeps an eye on the aerial photography background

    $('.ui-home-button').click(function (event) {
        map.setExtent(initExtent);
    });

    baseMapServiceLayer_standard = new my.ThinkWhereStandard();
    map.addLayer(baseMapServiceLayer_standard);

    baseMapServiceLayer_colour = new my.ThinkWhereColour();
    baseMapServiceLayer_colour.visible = false;
    map.addLayer(baseMapServiceLayer_colour);

    baseMapServiceLayer_grey = new my.ThinkWhereGreyScale();
    baseMapServiceLayer_grey.visible = false;
    map.addLayer(baseMapServiceLayer_grey);


    //*************************** Aerial photography Layer ****************************************

    var layer1 = new WMSLayerInfo({
        name: "ScotlandBest250mm",
        title: "Latest Available Digital Aerial Photograpy of Scotland"
    });
    var resourceInfo = {
        extent: new esri.geometry.Extent(0, 31.500000, 700000, 1250000, {
            wkid: 27700
        }),
        layerInfos: [layer1]
    };

    baseMapServiceLayerAerial = new WMSLayer("http://www.getmapping.com/wms/scotland/scotland.wmsx", {
        resourceInfo: resourceInfo,
        visibleLayers: ["ScotlandBest250mm"],
        id: "bg_Aerial",
        visible: false
    });

    map.addLayer(baseMapServiceLayerAerial);

    gl_Graphics = new GraphicsLayer({ id: "SEPA_Graphics" });
    map.addLayer(gl_Graphics);

    //gl_Query_draw = new GraphicsLayer({ id: "WFS_Buffer_Graphics" });
    //map.addLayer(gl_Query_draw);

    //gl_WFS_Result_Graphics = new GraphicsLayer({ id: "WFS_Result_Graphics" });
    //map.addLayer(gl_WFS_Result_Graphics);

    //gl_REST_Result_Graphics = new GraphicsLayer({ id: "REST_Result_Graphics" });
    //map.addLayer(gl_REST_Result_Graphics);

    //*********************************************************************************************
    //*************************** Loading Dynamic Layers ******************************************

    dynamicMapServiceLayer = new ArcGISDynamicMapServiceLayer(ServiceURL, { id: 'layer1', opacity: dynamicTransValue });
    dynamicMapServiceLayer.setImageFormat('png32');
    dynamicMapServiceLayer.setVisibleLayers([]);
    map.addLayer(dynamicMapServiceLayer);

    //Check to see if the dynamiclayer is loaded 
    if (dynamicMapServiceLayer.loaded) {
        dynamicMapServiceLayerLoadedHandler();
    } else {
        dynamicMapServiceLayerLoadedHandlervar = dynamicMapServiceLayer.on("load", dynamicMapServiceLayerLoadedHandler);
    }

    function dynamicMapServiceLayerLoadedHandler() {
        dynamicMapServiceLayer;
        dynamicMapServiceLayerLoadedHandlervar.remove();
        showExtent();
    }
    $.each(legendLayers, function (index, layer) {
        if (layer.title == 'layer1' || layer.title == 'layer2') {
            //Already in Legend Layers
            legendLayers = [];
        }
    });
    //Populate the Legend Layers array with the dynamic service 
    legendLayers.push({ layer: dynamicMapServiceLayer, title: 'Noise Map' });
    //*************************
    //*************************** Loading Icon ****************************************************
    var loading = dom.byId("loadingImg");
    mapUpdateStart = map.on("update-start", MapUpdateStart);
    mapUpdateEnd = map.on("update-end", MapUpdateEnd);

    function MapUpdateStart() {
        esri.show(loading);
    }
    function MapUpdateEnd() {
        esri.hide(loading);
    }
    //*********************************************************************************************
    //*************************** Add Home Button and Scale bar ***********************************

    function addLegend(evt) {

        if (!legend) {
            legend = new Legend({
                map: map,
                layerInfos: legendLayers,
            }, "legendDiv");
            legend.startup();
        }
    }
    
    //Scale Bar
    var scalebar = new Scalebar({
        attachTo: "bottom-right",
        map: map,
        scalebarUnit: 'dual'
    });
    $('.esriScalebar').css({ 'right': '12.5rem', 'bottom': '2.5rem', 'backgroundColor': '#ffffff' });
    $('.esriSimpleSlider div').css({ 'width': '1.125em', 'height': '1.125em', 'font-size': '1.875em', 'line-height': '0.9375em' });
    $('.esriSimpleSliderVertical.esriSimpleSliderBR').css({ 'right': '0.3125em', 'bottom': '2.875em' });

    //************************************************************************************************
    //**************** Recenter the map when the window changes size**********************************
    function autoRecenter(map) {
        var resizeDelay = 100;
        on(map, 'load', function (map) {
            on(window, 'resize', map, map.resize);
        });
        on(map, 'resize', function (extent, width, height) {
            map.__resizeCenter = map.extent.getCenter();
            setTimeout(function () {
                map.centerAt(map.__resizeCenter);
            }, resizeDelay);
        });
    }
    //*********************************************************************************************
    //***************************************** Show Scale ****************************************
    function showExtent(extent) {
        var _mapScale = numberWithCommas(Math.round(map.getScale()));
        $('#plcScaleMap').html(' Map Scale: 1 : ' + _mapScale);
    }

    //*************************************************************************************************
    //*********************************** Drawing Toolbar *********************************************
    $('.drawbutton').click(activateTool);

    function activateTool() {
        // Remove the map identify click listner
        removeIdentifyClick();
        var tool = this.innerText.toUpperCase().replace(/ /g, "");
        toolbar.activate(Draw[tool]);
        map.hideZoomSlider();
    }

    function createToolbar(themap) {
        toolbar = new Draw(themap);
        toolbar.on("draw-end", addToMap);
    }

    function addToMap(evt) {
        // Add the map identify click listner
        addIdentifyClick();
        var symbol;
        toolbar.deactivate();
        map.showZoomSlider();
        switch (evt.geometry.type) {
            case "point":
            case "multipoint":
                symbol = new SimpleMarkerSymbol();
                break;
            case "polyline":
                symbol = new SimpleLineSymbol();
                break;
            default:
                symbol = new SimpleFillSymbol();
                break;
        }
        var graphic = new Graphic(evt.geometry, symbol);
        gl_Graphics.clear();
        gl_Graphics.add(graphic);
        bufferShape(evt);
    }
    //*************************************************************************************************


    //After load resize map
    resizeMapDiv();
});

//**************** Usefull funtion to make numbers nice :) ************************************
function numberWithCommas(x) {
    if (x == "-" || x == "0" || x == 0 || x == "") {
        return "-";
    } else {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
}
//*********************************************************************************************
//**************** Usefull funtion to make numbers nice :) ************************************
function numberWithCommasCurr(x) {
    if (x == "-" || x == "0" || x == 0 || x == "") {
        return "-";
    } else {
        return "£ " + x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

}
//*********************************************************************************************