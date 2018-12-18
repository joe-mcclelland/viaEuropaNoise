var mySearchArray = []; //Keeps an eye on searches

var _SearchURL;
if (window.location.protocol != "https:") {
    _SearchURL = "http://map.sepa.org.uk/GIS_Search/Search.asmx";
} else {
    _SearchURL = "https://map.sepa.org.uk/GIS_Search/Search.asmx";
}
$(function () {

    //*********************************************************************************************
    //************************ Search Click  ******************************************************

    $("#txtsearch").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#btnSearch").trigger('click');
        }
    });

    $('#btnSearch').click(function () {
        $("#btnSearch").focus();
        PreSearch();
        
    });

    //*********************************************************************************************
    //************************ Pre Search Function ************************************************

    function PreSearch() {
        var searchTerm = $("#txtsearch").val().toUpperCase();
        searchTerm = searchTerm.trim();
        //Check it has a value
        if (searchTerm === '') {
            //Use whatever controls to display feedback to the user
            //$('#lbl_Search').removeClass('fa-check').addClass('fa-times');
            $('.query_results').empty(); // clear the container
            $('.query_results').html("Not a valid search term.");
        } else {
            //Clear the message box
            //$('.errorMessage').empty();
            // Animation to help the user see some action
            $('.query_results').empty(); // clear the container
            $('.query_results').html('<div class="div_spinner"><i class="fa fa-circle-o-notch fa-spin fa-3x fa-fw"></i><span class="sr-only">Loading...</span></div>');
            $('#lbl_Search').removeClass('fa-times').addClass('fa-check');

            //Call the search function
            SearchData(searchTerm);
        }
    }
    //*********************************************************************************************
    //************************ Search Function ****************************************************

    function SearchData(searchTerm) {
        if (searchTerm.length) {
            var NGR_REGEX = /^(NA|NF|NL|NB|NG|NM|NR|NW|NC|NH|NN|NS|NX|ND|NJ|NO|NT|NY|NK|HW|HX|HY|HT|HP|HU|HZ)([0-9]{2}|[0-9]{4}|[0-9]{6}|[0-9]{8}|[0-9]{10})$/
            var myNGR = searchTerm.replace(/\s/g, '');
            if (myNGR.match(NGR_REGEX)) {
                // NGR Entered, zoom to it and display point str.replace(/\s/g, '');    .replace(' ', '')
                mySearchArray.push('NGR');
                ConvertandZoom(myNGR);
            } else {
                //Check it's a UPRN value - Number up to 12 length - can be shorter 5,6,7,8,9,10,11
                var UPRN_REGEX = /^[0-9]{5,12}$/
                if (searchTerm.match(UPRN_REGEX)) {
                    mySearchArray.push('UPRN');
                    GetSearchResults('uprn', 'uprn', 'json', searchTerm);
                }
                //Postcode Checker - does not detect partial postcode though
                var ispc = checkPostCode(searchTerm);
                if (ispc) {
                    searchTerm = ispc;
                    mySearchArray.push('POSTCODE');
                    GetSearchResults('postcode', 'pc', 'json', searchTerm);
                    mySearchArray.push('POSTCODE_PART');
                    GetPostcode(searchTerm, 'json');
                } else {
                    var DISTRICT_REGEX = /([A-PR-UWYZa-pr-uwyz]([0-9]{1,2}|([A-HK-Ya-hk-y][0-9]|[A-HK-Ya-hk-y][0-9]([0-9]|[ABEHMNPRV-Yabehmnprv-y]))|[0-9][A-HJKS-UWa-hjks-uw]))/;
                    if (searchTerm.match(DISTRICT_REGEX)) {
                        mySearchArray.push('POSTCODE_PART');
                        GetPostcode(searchTerm, 'json');
                    } else {
                        mySearchArray.push('OSOPENNAMES');
                        GetOSOpenNames(searchTerm, 'Scotland', 'json');
                        mySearchArray.push('POSTCODE_PART');
                        GetPostcode(searchTerm, 'json'); //Postcode Area Catcher
                        mySearchArray.push('LOCALAUTHORITY');
                        GetLocalAuthority(searchTerm, 'json'); //Local Authority
                        //mySearchArray.push('ADDRESS');
                        //GetSearchResults('address', 'address', 'json', searchTerm);

                    }
                }

                //Can place other searches in here.

            }
        }
    }
});
//*********************************************************************************************
//************************ Error Handler ******************************************************
function errorhandler(errmessage) {
    $('.errorMessage').html(errmessage);
}

//*********************************************************************************************
//********************* Check Search Complete *************************************************
function CheckSearchComplete(_arrayItem) {
    //
    if (mySearchArray) {
        var imyval = $.inArray(_arrayItem, mySearchArray);
        if (imyval >= 0) {
            //it is in the array;
            mySearchArray.splice(imyval, 1);
        }
        if (mySearchArray.length == 0) {
            $('.div_spinner').remove();

            var resultslength = $('.query_results').html().length;
            if (resultslength>0) { 

            //**********************************************
            //**************** Click events ****************
            $('.ser_result_a').unbind('click').click(function (event) {
                event.preventDefault();
                
                // Attributes of the link
                var _encoords = $(this).attr('data-encoord').split(",");
                var _bbox = $(this).attr('data-bbox').split(",");

                if (_bbox.length == 4) {
                    //*****************
                    var _newExtent = new esri.geometry.Extent();
                    _newExtent.xmin = parseInt(_bbox[0]);
                    _newExtent.ymin = parseInt(_bbox[1]);
                    _newExtent.xmax = parseInt(_bbox[2]);
                    _newExtent.ymax = parseInt(_bbox[3]);
                    _newExtent.spatialReference = map.spatialReference;
                    map.setExtent(_newExtent);

                } else {
                    if (_encoords.length == 2)
                        //*****************
                        var _zoomBuffer = 100;
                    var _xMin = parseFloat(_encoords[0]) - _zoomBuffer;
                    var _yMin = parseFloat(_encoords[1]) - _zoomBuffer;
                    var _xMax = parseFloat(_encoords[0]) + _zoomBuffer;
                    var _yMax = parseFloat(_encoords[1]) + _zoomBuffer;
                    var _newExtent = new esri.geometry.Extent();
                    _newExtent.xmin = _xMin;
                    _newExtent.ymin = _yMin;
                    _newExtent.xmax = _xMax;
                    _newExtent.ymax = _yMax;
                    _newExtent.spatialReference = map.spatialReference;
                    map.setExtent(_newExtent);
                }
                $('#btn_search_close').trigger('click');
            });
                //**********************************************
            } else {
                $('.query_results').html('No Results Found')
            }
        }
    }
}
//*********************************************************************************************
//********************* converts the URL to string ********************************************
function buildresults(result, strtype) {
    //
    //**********************************************************
    //***************** OS Names Types *************************
    var _osnamesType = [];
    if (strtype == 'osnames') {
        $.each(result, function (index, value) {
            var mytype = value.LOCAL_TYPE;
            var imyval = $.inArray(mytype, _osnamesType);
            if (imyval < 0) {
                //it is not in the array;
                _osnamesType.push(mytype);
            }
        });
    }
    if (_osnamesType.length > 0) {
        var myelement = $('#ul_' + strtype + '');
        $.each(_osnamesType, function (index, value) {
            if (myelement.length == 0) {
                $('.query_results').append('<ul id="ul_' + strtype + '_' + index + '" class="no-bullet"><li id="li_' + strtype + '_' + index + '">' + value + '<ul class="no-bullet" id="ul_' + strtype + '_' + index + '_results"></ul></li></ul>');
            }
        });
    }
    //**********************************************************

    $.each(result, function (index, value) {
        switch (strtype) {
            case 'postcode':
                //**********************************************************
                var myelement = $('#ul_' + strtype);
                if (myelement.length == 0) {
                    $('.query_results').append('<ul id="ul_' + strtype + '" class="no-bullet"><li id="li_' + strtype + '">Address<ul class="no-bullet" id="ul_' + strtype + '_results"></ul></li></ul>');
                }
                $('#ul_' + strtype + '_results').append('<li id="li_' + strtype + '_' + index + '"><a href="#" class="ser_result_a" data-encoord="' + value.x_coord + ',' + value.y_coord + '" data-bbox="" class="">' + value.address + '</a></li>');
                break;
                //**********************************************************
            case 'uprn':
                //**********************************************************
                var myelement = $('#ul_' + strtype);
                if (myelement.length == 0) {
                    $('.query_results').append('<ul id="ul_' + strtype + '" class="no-bullet"><li id="li_' + strtype + '">UPRN<ul class="no-bullet" id="ul_' + strtype + '_results"></ul></li></ul>');
                }
                $('#ul_' + strtype + '_results').append('<li id="li_' + strtype + '_' + index + '"><a href="#" class="ser_result_a" data-encoord="' + value.x_coord + ',' + value.y_coord + '" data-bbox="" class="">' + value.uprn + ' - ' + value.address + '</a></li>');
                break;
                //**********************************************************
            case 'address':
                //**********************************************************
                var myelement = $('#ul_' + strtype);
                if (myelement.length == 0) {
                    $('.query_results').append('<ul id="ul_' + strtype + '" class="no-bullet"><li id="li_' + strtype + '">Address<ul class="no-bullet" id="ul_' + strtype + '_results"></ul></li></ul>');
                }
                $('#ul_' + strtype + '_results').append('<li id="li_' + strtype + '_' + index + '"><a href="#" class="ser_result_a" data-encoord="' + value.x_coord + ',' + value.y_coord + '" data-bbox="" class="">' + value.address + '</a></li>');
                break;
                //**********************************************************
            case 'geographic':
                //**********************************************************
                //Not sure if we are going to use this one
                break;
                //**********************************************************
            case 'osnames':
                //**********************************************************
                if (_osnamesType.length > 0) {
                    $.each(_osnamesType, function (index2, value2) {
                        if (value.LOCAL_TYPE == value2) {
                            var myelement = $('#ul_' + strtype + '_' + index2 + '_results');
                            if (myelement.length > 0) {
                                //
                                $(myelement).append('<li id="li_' + strtype + '_' + index + '"><a href="#" class="ser_result_a" data-encoord="' + value.GEOMETRY_X + ',' + value.GEOMETRY_Y + '" data-bbox="' + value.MBR_XMIN + ',' + value.MBR_YMIN + ',' + value.MBR_XMAX + ',' + value.MBR_YMAX + '" class="">' + value.NAME1 + ' - ' + value.COUNTY_UNITARY + '</a></li>');
                            }
                        }
                    });
                }
                break;
                //**********************************************************
            case 'localauthority':
                //**********************************************************
                var myelement = $('#ul_' + strtype);
                if (myelement.length == 0) {
                    $('.query_results').prepend('<ul id="ul_' + strtype + '" class="no-bullet"><li id="li_' + strtype + '">Local Authority<ul class="no-bullet" id="ul_' + strtype + '_results"></ul></li></ul>');
                }
                $('#ul_' + strtype + '_results').append('<li id="li_' + strtype + '_' + index + '"><a href="#" class="ser_result_a" data-encoord="' + value.xcoord + ',' + value.ycoord + '" data-bbox="' + value.extent.xmin + ',' + value.extent.ymin + ',' + value.extent.xmax + ',' + value.extent.ymax + '" class="">' + value.name + '</a></li>');
                break;
                //**********************************************************
            case 'postcode_part':
                //**********************************************************
                var myelement = $('#ul_' + strtype);
                if (myelement.length == 0) {
                    $('.query_results').prepend('<ul id="ul_' + strtype + '" class="no-bullet"><li id="li_' + strtype + '">Postcode<ul class="no-bullet" id="ul_' + strtype + '_results"></ul></li></ul>');
                }
                $('#ul_' + strtype + '_results').append('<li id="li_' + strtype + '_' + index + '"><a href="#" class="ser_result_a" data-encoord="' + value.xcoord + ',' + value.ycoord + '" data-bbox="' + value.extent.xmin + ',' + value.extent.ymin + ',' + value.extent.xmax + ',' + value.extent.ymax + '" class="">' + value.name + '</a></li>');
                break;
                //**********************************************************
        }
    });
}
//*********************************************************************************************
//********************* converts the URL to string ********************************************
$.jmsajaxurl = function (options) {
    var url = options.url;
    url += "/" + options.method;
    if (options.data) {
        var data = ""; for (var i in options.data) {
            if (data != "")
                data += "&"; data += i + "=" +
                        JSON.stringify(options.data[i]);
        }
        url += "?" + data; data = null; options.data = "{}";
    }
    return url;
};
//*********************************************************************************************
//********************* Postcode query ********************************************************
function GetPostcode(searchTerm, qry_format) {
    //http://sepa-app-gis01/GIS_Search/Search.asmx
    //webservice/Search.asmx
    var url = $.jmsajaxurl({
        url: _SearchURL,
        method: "PostcodeSearch",
        data: { 'searchTerm': searchTerm }
    });

    try {
        $.ajax({
            url: url,
            type: "get",
            dataType: qry_format + "p",
            contentType: "application/" + qry_format,
            success: function (xml, textStatus, XMLHttpRequest) {
                if (xml.d.length > 0) {
                    buildresults(xml.d, 'postcode_part');
                }
            },
            error: function GetPostcodeFailed(jqXHR, textStatus, errorThrown) {
                errorhandler(errorThrown);
            },
            complete: function GetPostcodeComplete(jqXHR, textStatus) {
                CheckSearchComplete('POSTCODE_PART');
            }
        });
    } catch (err) {
        errorhandler(err);
    }
}
//*********************************************************************************************
//********************* OS Open Names Query ***************************************************
function GetLocalAuthority(searchTerm, qry_format) {

    var url = $.jmsajaxurl({
        url: _SearchURL,
        method: "LocalAuthority",
        data: { 'searchTerm': searchTerm }
    });

    try {
        $.ajax({
            url: url,
            type: "get",
            dataType: qry_format + "p",
            contentType: "application/" + qry_format,
            success: function (xml, textStatus, XMLHttpRequest) {
                //
                if (xml.d.length > 0) {
                    buildresults(xml.d, 'localauthority');
                }
            },
            error: function GetOSOpenNamesFailed(jqXHR, textStatus, errorThrown) {
                //
                errorhandler(errorThrown);
            },
            complete: function GetOSOpenNamesComplete(jqXHR, textStatus) {
                CheckSearchComplete('LOCALAUTHORITY');
            }
        });
    } catch (err) {
        errorhandler(err);
    }
}
//*********************************************************************************************
//********************* OS Open Names Query ***************************************************
function GetOSOpenNames(searchTerm, searchCountry, qry_format) {

    var url = $.jmsajaxurl({
        url: _SearchURL,
        method: "OS_OpenNames",
        data: { 'searchTerm': searchTerm, 'searchCountry': searchCountry }
    });

    var mystring = { searchTerm: searchTerm, searchCountry: searchCountry };

    try {
        $.ajax({
            url: url,
            type: "get",
            dataType: qry_format + "p",
            contentType: "application/" + qry_format,
            success: function (xml, textStatus, XMLHttpRequest) {
                if (xml.d.length > 0) {
                    buildresults(xml.d, 'osnames');
                }
            },
            error: function GetOSOpenNamesFailed(jqXHR, textStatus, errorThrown) {
                errorhandler(errorThrown);
            },
            complete: function GetOSOpenNamesComplete(jqXHR, textStatus) {
                CheckSearchComplete('OSOPENNAMES');
            }
        });
    } catch (err) {
        errorhandler(err);
    }
}
//*********************************************************************************************
//********************* Results from query ****************************************************
function GetSearchResults(qry_select, qry_field, qry_format, qry_value) {
    //webservice/Search_Stuff.ashx
    //http://sepa-app-gis01/GIS_Search/Search_handler.ashx
    // var strGetSearchResults = "http://sepa-app-gis01/GIS_Search/Search_handler.ashx";
    var strGetSearchResults = "webservice/Search_External.ashx";

    var mystring = { 'st': qry_select, 'format': qry_format };
    mystring[qry_field] = qry_field;
    mystring[qry_field] = qry_value;



    //
    try {
        $.ajax({
            data: mystring,
            url: strGetSearchResults,
            type: "GET",
            dataType: qry_format + "",
            success: function (xml, textStatus, XMLHttpRequest) {
                if (xml.totalResults > 0) {
                    buildresults(xml.results, qry_select);
                }
            },
            error: function GetSearchResultsFailed(jqXHR, textStatus, errorThrown) {
                
                errorhandler(errorThrown);
            },
            complete: function GetSearchResultsComplete(jqXHR, textStatus) {
                var myvar = qry_select.toUpperCase();
                CheckSearchComplete(myvar);
            }
        });
    } catch (err) {
        errorhandler(err);
    }
}
//*********************************************************************************************
//********************* Check Post Code *******************************************************

function checkPostCode(toCheck) {
    // Permitted letters depend upon their position in the postcode.
    var alpha1 = "[abcdefghijklmnoprstuwyz]";                       // Character 1
    var alpha2 = "[abcdefghklmnopqrstuvwxy]";                       // Character 2
    var alpha3 = "[abcdefghjkstuw]";                                // Character 3
    var alpha4 = "[abehmnprvwxy]";                                  // Character 4
    var alpha5 = "[abdefghjlnpqrstuwxyz]";                          // Character 5
    // Array holds the regular expressions for the valid postcodes
    var pcexp = new Array();
    // Expression for postcodes: AN NAA, ANN NAA, AAN NAA, and AANN NAA
    pcexp.push(new RegExp("^(" + alpha1 + "{1}" + alpha2 + "?[0-9]{1,2})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));
    // Expression for postcodes: ANA NAA
    pcexp.push(new RegExp("^(" + alpha1 + "{1}[0-9]{1}" + alpha3 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));
    // Expression for postcodes: AANA  NAA
    pcexp.push(new RegExp("^(" + alpha1 + "{1}" + alpha2 + "?[0-9]{1}" + alpha4 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));
    // Exception for the special postcode GIR 0AA
    pcexp.push(/^(GIR)(\s*)(0AA)$/i);
    // Standard BFPO numbers
    pcexp.push(/^(bfpo)(\s*)([0-9]{1,4})$/i);
    // Load up the string to check
    var postCode = toCheck;
    // Assume postcode entered is not valid
    var valid = false;
    // Check the string against the types of post codes
    for (var i = 0; i < pcexp.length; i++) {
        if (pcexp[i].test(postCode)) {
            // The post code is valid - split the post code into component parts
            pcexp[i].exec(postCode);
            // Copy it back into the original string, converting it to uppercase and
            // inserting a space between the inward and outward codes
            postCode = RegExp.$1.toUpperCase() + " " + RegExp.$3.toUpperCase();
            // Load new postcode back into the form element
            valid = true;
            // Remember that we have found that the code is valid and break from loop
            break;
        }
    }
    // Return with either the reformatted valid postcode or the original invalid
    // postcode
    if (valid) { return postCode; } else return false;
}
//*********************************************************************************************
//************************* Convert NGR to Easting and Northing *******************************
function ConvertandZoom(value) {

    var result = ConverttoEastingNorthing(value);

    if (typeof result === 'string') {
        $('.errorMessage').html(result);
    } else {

        if (result.length) {

            var PlotSymbol = new esri.symbol.PictureMarkerSymbol("http://static.arcgis.com/images/Symbols/Basic/RedStickpin.png", 50, 52).setOffset(0, 24);
            var point = new esri.geometry.Point(parseInt(result[0]), parseInt(result[1]), map.spatialReference);
            var graphic = new esri.Graphic(point, PlotSymbol);

            map.graphics.add(graphic);

            //*****************
            var _zoomBuffer = 200;
            var _xMin = parseFloat(result[0]) - _zoomBuffer;
            var _yMin = parseFloat(result[1]) - _zoomBuffer;
            var _xMax = parseFloat(result[0]) + _zoomBuffer;
            var _yMax = parseFloat(result[1]) + _zoomBuffer;
            var _newExtent = new esri.geometry.Extent();
            _newExtent.xmin = _xMin;
            _newExtent.ymin = _yMin;
            _newExtent.xmax = _xMax;
            _newExtent.ymax = _yMax;
            _newExtent.spatialReference = map.spatialReference;
            map.setExtent(_newExtent);

            CheckSearchComplete('NGR');
            //*******************
            //$('.errorMessage').html('Plot Complete');
        }
    }
}
//*********************************************************************************************
//************************* Convert NGR to Easting and Northing *******************************
function ConverttoEastingNorthing(gridref) {

    /**
    * Converts standard grid reference (eg 'SU387148') to fully numeric ref (eg [438700,114800]).
    *
    * @param   {string}    gridref - Standard format OS grid reference.
    * @returns {OsGridRef} Numeric version of grid reference in metres from false origin, centred on
    *   supplied grid square.
    *
    * @example
    *   var grid = OsGridRef.parse('TG 51409 13177'); // grid: { easting: 651409, northing: 313177 }
    */
    var strOrginal = gridref.toUpperCase();
    if (typeof String.prototype.trim !== 'function') {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, '');
        };
    }
    gridref = gridref.toString();
    gridref = gridref.trim();
    //gridref = String(gridref).trim();


    if (gridref.length > 7) {
        //;
        // get numeric values of letter references, mapping A->0, B->1, C->2, etc:
        var l1 = gridref.toUpperCase().charCodeAt(0) - 'A'.charCodeAt(0);
        var l2 = gridref.toUpperCase().charCodeAt(1) - 'A'.charCodeAt(0);
        // shuffle down letters after 'I' since 'I' is not used in grid:
        if (l1 > 7) l1--;
        if (l2 > 7) l2--;

        // convert grid letters into 100km-square indexes from false origin (grid square SV):
        var e = ((l1 - 2) % 5) * 5 + (l2 % 5);
        var n = (19 - Math.floor(l1 / 5) * 5) - Math.floor(l2 / 5);
        if (e < 0 || e > 6 || n < 0 || n > 12) {
            return 'No valid result, please check your first two characters.';
            //                $('.TopsearchResultsDiv').empty();
            //                $('.TopsearchResultsDivMain').show();
            //                $('.TopsearchResultsDiv').html('No valid result, please check your first two characters.');
            //                $('#imgTopSearch').hide();

            //return false;
        };

        // skip grid letters to get numeric part of ref, stripping any spaces:
        gridref = gridref.slice(2).replace(/ /g, '');

        // append numeric part of references to grid index:
        e += gridref.slice(0, gridref.length / 2);
        n += gridref.slice(gridref.length / 2);

        // normalise to 1m grid, rounding up to centre of grid square:
        switch (gridref.length) {
            case 0: e += '50000'; n += '50000'; break;
            case 2: e += '5000'; n += '5000'; break;
            case 4: e += '500'; n += '500'; break;
            case 6: e += '50'; n += '50'; break;
            case 8: e += '5'; n += '5'; break;
            case 10: break; // 10-digit refs are already 1m
            default:
                //                    $('.TopsearchResultsDiv').empty();
                //                    $('.TopsearchResultsDivMain').show();
                //                    $('.TopsearchResultsDiv').html('No valid result, please check your input value.');
                //                    $('#imgTopSearch').hide();
                //                    return false;
                return 'No valid result, please check your input value.'
                break;
        }
        //;
        function _withinScotland(xcoord, ycoord) {
            // Returns true if within MBR of Scotland's 3nm limit, otherwise false. NGR must be set.

            if ((xcoord < 475885 && xcoord > -302003) && (ycoord < 1225906 && ycoord > 524072)) {
                return true;
            }
            else {
                return false;
            }
        }
        var test_withinScotland = _withinScotland(e, n)
        var strMessage = '';
        if (test_withinScotland) {
            strMessage = "";
        } else {
            strMessage = " - NGR not in Scotland ";
        }

        return [e, n];

        //            $('.TopsearchResultsDiv').empty();
        //            $('.TopsearchResultsDivMain').show();
        //            $('#imgTopSearch').hide();
        //            $('.TopsearchResultsDiv').append('<div class="divheader">Valid National Grid Reference </div>');
        //            $('.TopsearchResultsDiv').append('<div class="divdata" title="' + e + ',' + n + '">' + strOrginal + strMessage + '</div>');

        //            $('.divdata').click(function () {
        //                $('.TopsearchResultsDivMain').hide();
        //                var htit = $(this).attr('title');
        //                var res = htit.split(",");
        //                //;
        //                if (res.length > 2) {
        //                    ZoomTo(e, n);
        //                } else {
        //                    ZoomTo(e, n);
        //                }
        //            });

        //            $('.divdata').hover(function () {
        //                $(this).css({
        //                    cursor: 'pointer'
        //                });
        //            });
    } else {
        //            $('.TopsearchResultsDivMain').show();
        //            $('.TopsearchResultsDiv').html('Must be at least 8 characters in length to convert.');
        //            $('#imgTopSearch').hide();
        return 'Must be at least 8 characters in length to convert.'
    }
}
//*********************************************************************************************
//****************************** String Trim Functions ***************************************

String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}
String.prototype.ltrim = function () {
    return this.replace(/^\s+/, "");
}
String.prototype.rtrim = function () {
    return this.replace(/\s+$/, "");
}
//*********************************************************************************************