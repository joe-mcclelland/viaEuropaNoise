

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
//********************* Noise ********************************************************
function getSourceList(_STUDYAREA, _STUDYROUND) {
    //debugger;
    var _SearchURL = 'webservice/searchdata.asmx';
    var url = $.jmsajaxurl({
        url: _SearchURL,
        method: 'studysource',
        data: { 'STUDY_AREA': _STUDYAREA, 'STUDY_ROUND': _STUDYROUND }
    });

    try {
        if (_STUDYAREA == 'ALL') {
            $('#sel_1').empty().append('<option value=""><i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw"></i><span class="spSearching">Searching...</span></option>');

        } else {
            $('#sel_2').empty().append('<option value=""><i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw"></i><span class="spSearching">Searching...</span></option>');
        }
        $.ajax({
            url: url,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: function (xml, textStatus, XMLHttpRequest) {
               // debugger;
                if (_STUDYAREA == 'ALL') {
                    $('#sel_1').empty();
                } else {
                    $('#sel_2').empty();
                }
                if (xml.d.length > 0) {
                    $.each(xml.d,function(index,value){
                        if (_STUDYAREA == 'ALL') {
                            if (index == 0) {
                                $('#sel_1').append('<option value="None" selected>---- Select ----</option>');
                                
                            } 
                                $('#sel_1').append('<option value="' + value.SOURCE + '">' + value.SOURCE + '</option>');
                            
                        } else {
                            if (index == 0) {
                                $('#sel_2').append('<option value="None" selected>---- Select ----</option>');
                                
                            } 
                                $('#sel_2').append('<option value="' + value.SOURCE + '">' + value.SOURCE + '</option>');
                            
                        }
                    });
                   
                    //buildresultsdrilldown(xml.d);
                } else {
                   // $(_control).html('No Results');
                    //$(_control).html('<div class="div_spinner4"><i class="fa smile-o"></i><span class="spSearching">No Results.</span></div>');
                    //$(_control).html('<div class="div_spinner3"><i class="fa fa-smile-o"></i><span class="spSearching">No Records.</span></div>');

                }
            },
            error: function GetPostcodeFailed(jqXHR, textStatus, errorThrown) {
                errorhandlerd(errorThrown);
            },
            complete: function GetPostcodeComplete(jqXHR, textStatus) {

            }
        });
    } catch (err) {
        //debugger;
        errorhandledr(err);
    }
}
//*********************************************************************************************
//********************* Noise ********************************************************
function getAreaList(_STUDYSOURCE, _STUDYROUND) {
   // debugger;
    var _SearchURL = 'webservice/searchdata.asmx';
    var url = $.jmsajaxurl({
        url: _SearchURL,
        method: 'studyarea',
        data: { 'STUDY_SOURCE': _STUDYSOURCE, 'STUDY_ROUND': _STUDYROUND }
    });

    try {
        if (_STUDYSOURCE == 'ALL') {
            $('#sel_1').empty().append('<option value=""><i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw"></i><span class="spSearching">Searching...</span></option>');
        } else {
            $('#sel_2').empty().append('<option value=""><i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw"></i><span class="spSearching">Searching...</span></option>');
        }
        $.ajax({
            url: url,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: function (xml, textStatus, XMLHttpRequest) {
                //debugger;
                if (_STUDYSOURCE == 'ALL') {
                    $('#sel_1').empty();
                } else {
                    $('#sel_2').empty();
                }
                if (xml.d.length > 0) {
                    $.each(xml.d, function (index, value) {

                        if (_STUDYSOURCE == 'ALL') {
                            if (index == 0) {
                                $('#sel_1').append('<option value="None" selected>---- Select ----</option>');
                            } 
                                $('#sel_1').append('<option value="' + value.STUDY_AREA + '">' + value.STUDY_AREA + '</option>');
                            
                            
                        } else {
                            if (index == 0) {
                                $('#sel_2').append('<option value="None" selected>---- Select ----</option>');
                                
                            }
                                $('#sel_2').append('<option value="' + value.STUDY_AREA + '">' + value.STUDY_AREA + '</option>');
                           
                        }
                    });

                    //buildresultsdrilldown(xml.d);
                } else {
                    // $(_control).html('No Results');
                    //$(_control).html('<div class="div_spinner4"><i class="fa smile-o"></i><span class="spSearching">No Results.</span></div>');
                    //$(_control).html('<div class="div_spinner3"><i class="fa fa-smile-o"></i><span class="spSearching">No Records.</span></div>');

                }
            },
            error: function GetPostcodeFailed(jqXHR, textStatus, errorThrown) {
                errorhandlerd(errorThrown);
            },
            complete: function GetPostcodeComplete(jqXHR, textStatus) {

            }
        });
    } catch (err) {
        //debugger;
        errorhandledr(err);
    }
}
//*********************************************************************************************
//********************* Noise ********************************************************
function getStudyDetails(_STUDYAREA, _STUDYSOURCE, _STUDYROUND) {
    // debugger;
    var _SearchURL = 'webservice/searchdata.asmx';
    var url = $.jmsajaxurl({
        url: _SearchURL,
        method: 'studydetails',
        data: { 'STUDY_AREA': _STUDYAREA, 'STUDY_SOURCE': _STUDYSOURCE, 'STUDY_ROUND': _STUDYROUND }
    });

    try {
       
        $('#sel_3').empty().append('<option value=""><i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw"></i><span class="spSearching">Searching...</span></option>');

        $.ajax({
            url: url,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: function (xml, textStatus, XMLHttpRequest) {
                $('#sel_3').empty();
                if (xml.d.length > 0) {

                    $.each(xml.d, function (index, value) {
                        var _nicetext;
                        if (index == 0) {
                            $('#sel_3').append('<option value="None" selected>---- Select ----</option>');
                        }

                        switch (value.METRIC) {
                            case 'LDEN':
                                _nicetext = 'Day and Night';
                                $('#sel_3').append('<option value="' + value.METRIC + '">' + _nicetext + '</option>');
                                break;
                            case 'LDEN_CONTOURS':
                                _nicetext = 'Day, Evening and Night (Lden)';
                                $('#sel_3').append('<option value="' + value.METRIC + '">' + _nicetext + '</option>');
                                break;
                            case 'LNIGHT':
                                _nicetext = 'Night';
                                $('#sel_3').append('<option value="' + value.METRIC + '">' + _nicetext + '</option>');
                                break;
                            case 'LNIGHT_CONTOURS':
                                _nicetext = 'Night (Lnight)';
                                $('#sel_3').append('<option value="' + value.METRIC + '">' + _nicetext + '</option>');
                                break;
                        }

                       
                    });

                    //buildresultsdrilldown(xml.d);
                } else {
                    // $(_control).html('No Results');
                    //$(_control).html('<div class="div_spinner4"><i class="fa smile-o"></i><span class="spSearching">No Results.</span></div>');
                    //$(_control).html('<div class="div_spinner3"><i class="fa fa-smile-o"></i><span class="spSearching">No Records.</span></div>');

                }
            },
            error: function GetPostcodeFailed(jqXHR, textStatus, errorThrown) {
                errorhandlerd(errorThrown);
            },
            complete: function GetPostcodeComplete(jqXHR, textStatus) {

            }
        });
    } catch (err) {
        //debugger;
        errorhandledr(err);
    }
}
//*********************************************************************************************
//********************* Noise ********************************************************
function getAreaExtent(_STUDYAREA) {
    // debugger;
    var _SearchURL = 'webservice/searchdata.asmx';
    var url = $.jmsajaxurl({
        url: _SearchURL,
        method: 'SearchExtent',
        data: { 'searchTerm': _STUDYAREA}
    });

    try {
       
        //$('#sel_3').empty().append('<option value=""><i class="fa fa-circle-o-notch fa-spin fa-2x fa-fw"></i><span class="spSearching">Searching...</span></option>');

        $.ajax({
            url: url,
            type: "get",
            dataType: "json",
            contentType: "application/json",
            success: function (xml, textStatus, XMLHttpRequest) {
                //$('#sel_3').empty();
                //debugger;
                if (xml.d.length > 0) {
                    $.each(xml.d, function (index, value) {
                        //debugger;
                        //$('#sel_3').append('<option value="' + value.METRIC + '">' + value.METRIC + '</option>');
                        var myextent = new esri.geometry.Extent(value.xmin, value.ymin, value.xmax, value.ymax, new esri.SpatialReference({ wkid: 27700 }));

                        map.setExtent(myextent, true);
                    });

                    //buildresultsdrilldown(xml.d);
                } else {
                    // $(_control).html('No Results');
                    //$(_control).html('<div class="div_spinner4"><i class="fa smile-o"></i><span class="spSearching">No Results.</span></div>');
                    //$(_control).html('<div class="div_spinner3"><i class="fa fa-smile-o"></i><span class="spSearching">No Records.</span></div>');

                }
            },
            error: function GetPostcodeFailed(jqXHR, textStatus, errorThrown) {
                errorhandlerd(errorThrown);
            },
            complete: function GetPostcodeComplete(jqXHR, textStatus) {

            }
        });
    } catch (err) {
        //debugger;
        errorhandledr(err);
    }
}
//*********************************************************************************************

//************************ Error Handler ******************************************************
function errorhandlerd(errmessage) {
    debugger;
    $('.errorMessage').html(errmessage);
}

//*********************************************************************************************
