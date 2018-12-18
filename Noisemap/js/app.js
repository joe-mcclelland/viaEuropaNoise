
$(document).foundation();

var tourStep1;
var tourStep2;
var tourStep3;


var urlParams;

//Runs when the page has beeen loaded
$(function () {
    //*****************************************************************************
    $("#sliderOpacity").on('moved.zf.slider', function (event, value) {
        //debugger;
        var _opcValue = $("#sliderOutput1").val();
        if (dynamicMapServiceLayer) {
            dynamicMapServiceLayer.setOpacity((_opcValue / 100));
        }
    });
    //*****************************************************************************
    $('#studyRound').change(function (event) {
        dynamicMapServiceLayer.hide();
        $('#lbl_1').hide();
        $('#lbl_2').hide();
        $('#lbl_3').hide();
        $('#sel_1').empty();
        $('#sel_2').empty();
        $('#sel_3').empty();
        $('#fo_1').empty();
        $('#fo_2').empty();
        $('.radAreaSource').attr('checked', false);
    });

    $('#rd_source').click(function (event) {
        var _round = $("#studyRound option:selected").val();

        dynamicMapServiceLayer.hide();
        $('#lbl_1').show();
        $('#lbl_2').hide();
        $('#lbl_3').hide();
        getSourceList('ALL', _round);
        $('#sel_2').empty();
        $('#sel_3').empty();
        $('#fo_1').html('Select a source type');

    });
    $('#rd_area').click(function (event) {
        var _round = $("#studyRound option:selected").val();
        dynamicMapServiceLayer.hide();
        $('#lbl_1').show();
        $('#lbl_2').hide();
        $('#lbl_3').hide();
        getAreaList('ALL', _round);
        $('#sel_2').empty();
        $('#sel_3').empty();
        $('#fo_1').html('Select an area of interest');
    });



    $('#sel_1').change(function (event) {
        var _round = $("#studyRound option:selected").val();
        dynamicMapServiceLayer.hide();
        $('#lbl_2').show();
        $('#sel_3').empty();
        var _myarea = $('#rd_area').prop("checked")
        var _mysource = $('#rd_source').prop("checked")
        var myval = $('#sel_1').val();
        //debugger;
        if (!myval == '') {
            if (_myarea) {
                //getSourceList(myval[0]);
                //getAreaExtent(myval[0]);
                getSourceList(myval, _round);
                getAreaExtent(myval);
                $('#fo_2').html('Select a source type');
            }
            if (_mysource) {
                //getAreaList(myval[0]);
                getAreaList(myval, _round);
                $('#fo_2').html('Select an area of interest');
            }
        }
    });

    $('#sel_2').change(function (event) {
        var _round = $("#studyRound option:selected").val();
        dynamicMapServiceLayer.hide();
        $('#lbl_3').show();
        var _myarea = $('#rd_area').prop("checked");
        var _mysource = $('#rd_source').prop("checked");
        var myval1 = $('#sel_1').val();
        var myval2 = $('#sel_2').val();
        if (!myval1 == '' && !myval2 == '') {
            if (_myarea) {
                getStudyDetails(myval1, myval2, _round);
            }
            if (_mysource) {
                getStudyDetails(myval2, myval1, _round);
                getAreaExtent(myval2);
            }
        }
    });

    $('#sel_3').change(function (event) {
        var _round = $("#studyRound option:selected").val();
        var _myarea = $('#rd_area').prop("checked");
        var _mysource = $('#rd_source').prop("checked");
        var myval1 = $('#sel_1').val();
        var myval2 = $('#sel_2').val();
        var myval3 = $('#sel_3').val();
        //debugger;
        var _indicator = 'None';
        var _strindicator = myval3;
        //debugger;
        if (_strindicator.toLowerCase().indexOf("night") >= 0) {
            _indicator = 'NIGHT';
        }
        if (_strindicator.toLowerCase().indexOf("den") >= 0) {
            _indicator = 'DEN';
        }
        if (!myval1 == '' && !myval2 == '' && !myval3 == '') {
            if (_strindicator == 'None') {
                setDefQuery("STUDY_AREA = 'None' AND SOURCE = 'None' AND METRIC = 'None' AND ROUND = 'None'", _indicator);
            } else {
                if (_myarea) {
                    setDefQuery("STUDY_AREA = '" + myval1 + "' AND SOURCE = '" + myval2 + "' AND ROUND = '" + _round + "' AND METRIC = '" + myval3 + "'", _indicator);
                }
                if (_mysource) {
                    setDefQuery("STUDY_AREA = '" + myval2 + "' AND SOURCE = '" + myval1 + "' AND ROUND = '" + _round + "' AND METRIC = '" + myval3 + "'", _indicator);
                }
            }
        }
    });

    function setDefQuery(_definition, _indicator) {
         //debugger;
        var layerDefinitions = [];
        if (_indicator == 'DEN') {
            layerDefinitions[0] = _definition;
            dynamicMapServiceLayer.setVisibleLayers([0]);
        }
        if (_indicator == 'NIGHT') {
            layerDefinitions[1] = _definition;
            dynamicMapServiceLayer.setVisibleLayers([1]);
        }
        if (_indicator == 'None') {
            layerDefinitions[1] = _definition;
            dynamicMapServiceLayer.setVisibleLayers([1]);
        }
        dynamicMapServiceLayer.show();
        dynamicMapServiceLayer.setLayerDefinitions(layerDefinitions);

        //********** Set Visibility *****************************
        legend.refresh(legendLayers);
        //*******************************************************

    }
    //*****************************************************************************

    $('#btn_clearMap').click(function () {
        map.graphics.clear();
        gl_Graphics.clear();
        gl_WFS_Result_Graphics.clear();
        gl_REST_Result_Graphics.clear();
        gl_Query_draw.clear();
        $('.tableofcontents_content').empty();
    });

    $('.ui-toolbox-button').click(function () {
        $('.map_icon_tools').toggle();
    });
    
    $("#sepa-tabs").on('change.zf.tabs', function (event) {
            resizeMapDiv();
     });
    $("#search-tabs").on('change.zf.tabs', function (event) {
            resizeMapDiv();
    });
   
    $('#btnTour_Content').click(function (event) {
        startTour();
    });
    $('#btnAdd_Content').click(function (event) {
        $('#sepa-tabs').foundation('selectTab', 'panel2');
    });

    $('#btn_contents_pop').click(function (event) {
        setTimeout(function () {

            var myDocHeight = $(window).height();
            var myFooterHeight = $('.sepa_footer').height();
            var myHeaderHeight = $('.sepa_header').height();

            if ($("#left_nav").hasClass("popin")) {
                $('#btn_contents_pop i').addClass('fa-rotate-45');
				$('#btn_contents_pop i').removeClass('fa-angle-double-left').addClass('fa-thumb-tack');
                $('#btn_contents_pop i').removeClass('fa-lg');
                $('#left_nav').removeClass('popin').addClass('popout');
                $('#mapDiv').removeClass('small-12 medium-6 large-8').addClass('small-12 medium-12 large-12');
                $('#left_nav').height(myDocHeight);
                $('#btn_contents_close').trigger('click');
            } else {
                $('#left_nav').removeClass('popout').addClass('popin');
                $('#mapDiv').removeClass('small-12 medium-12 large-12').addClass('small-12 medium-6 large-8');
                $('#btn_contents_pop i').removeClass('fa-rotate-45');
                $('#btn_contents_pop i').removeClass('fa-thumb-tack').addClass('fa-angle-double-left');
                $('#btn_contents_pop i').addClass('fa-lg');
                $('#left_nav').height(myDocHeight - (myFooterHeight + myHeaderHeight));
            }
            $('#btn_contents_close').toggle();
            setTimeout(function () {
                resizeMapDiv();
            }, 600);
        }, 0);
    });
    $('#btn_contents_close').click(function () {
        setTimeout(function () {
            $('.btnMapContentShow').show();
        }, 500);
    });
    $('.btnMapContentShow').click(function () {
        $('.btnMapContentShow').hide();
        setTimeout(function () {
            resizeMapDiv();
        }, 500);
        
    });
    //**********************************************

    //***************** Background Buttons Click ***********************
    $('#bg_Standard').click(function () {
        //$('#btn_contents_close').trigger('click');
        baseMapServiceLayer_standard.setVisibility(true);
        baseMapServiceLayer_colour.setVisibility(false);
        baseMapServiceLayer_grey.setVisibility(false);
        baseMapServiceLayerAerial.setVisibility(false);
    });

    $('#bg_Colour').click(function () {
        //$('#btn_contents_close').trigger('click');
        baseMapServiceLayer_standard.setVisibility(false);
        baseMapServiceLayer_colour.setVisibility(true);
        baseMapServiceLayer_grey.setVisibility(false);
        baseMapServiceLayerAerial.setVisibility(false);
    });
    $('#bg_Grey').click(function () {
        //$('#btn_contents_close').trigger('click');
        baseMapServiceLayer_standard.setVisibility(false);
        baseMapServiceLayer_colour.setVisibility(false);
        baseMapServiceLayer_grey.setVisibility(true);
        baseMapServiceLayerAerial.setVisibility(false);
    });
    $('#bg_Aerial').click(function () {
        if (map.getScale() < 50000) {
            //$('#btn_contents_close').trigger('click');
            baseMapServiceLayer_standard.setVisibility(false);
            baseMapServiceLayer_colour.setVisibility(false);
            baseMapServiceLayer_grey.setVisibility(false);
            baseMapServiceLayerAerial.setVisibility(true);
        } else {
        }
    });

    $(window).resize(function () {
        resizeMapDiv();
    });

    setTimeout(function () {
        resizeMapDiv();
    }, 3000);

});
//*********************************************************************************************

//*********************************************************************************************
function resizeMapDiv() {

    var myDocHeight = $(window).height();

    var myFooterHeight = $('.sepa_footer').height();
    var myHeaderHeight = $('.sepa_header').height();
    //
    $('#mapDiv_zoom_slider').css({ 'bottom': myFooterHeight + 30 + 'px' });
    $('.Scalebar_wrapper').css({ 'bottom': myFooterHeight + 'px'});
    $('.esriScalebar').css({ 'bottom': myFooterHeight + 'px' });
    $('.scalebar_bottom-right.esriScalebar').css({ 'bottom': myFooterHeight + 18 + 'px' });

    $('.center_search_wrapper').css({ 'top': '5px' });
    $('.map_icon_wrapper').css({ 'top': myHeaderHeight + 70 + 'px' });

    $('#mapDiv').height(myDocHeight - (myFooterHeight + myHeaderHeight));

    $('#left_search').height(myDocHeight);

    var myLeftNavHeight = $('#left_nav').height();
    var myLeftNavWidth = $('#left_nav').width();

    var myLeftSearchHeight = $('#left_search').height();
    var myLeftHeaderHeight = $('#left_nav_header').height();
    var mySearchHeaderHeight = $('#content_header').height();
    var myIdentifyHeaderHeight = $('#identify_header').height();
    var mymodalViewMetaDataHeaderHeight = $('#modalViewMetaDataHeader1').height();
    //
    var tabsheader = $('#sepa-tabs').height();

    var myHeaderHeight2 = $('#left_search_header').height();
    $('.query_results').height(myDocHeight - myHeaderHeight2 - 50);

    var myMapwidth = $('#mapDiv').width();

    $('.center_search_wrapper').width(myMapwidth);

    var mytabulHeight = $('#sepa-tabs').height();

    //***********************************************************
    var is_mobile = false;
    //


    if ($('#some-element').css('display') == 'none') {
        is_mobile = true;
    }

    // now i can use is_mobile to run javascript conditionally

    if (is_mobile == true) {
        $('#btnTour_Content').hide();
        $('#btn_contents_pop').hide();
        //Conditional script here
        if ($("#mapDiv").hasClass("small-12 medium-12 large-12")) {
            //Do nothing
        } else {
            $('#btn_contents_pop').trigger('click');
        }
        //**************************************//**************************************
        $('#modalViewMetaData').css({ 'height': '100%' });
        $('#modalAddData').css({ 'height': '100%' });
        $('#modalViewIdentifyResults').css({ 'height': '100%' });
        //*************************
        var identify_reveal_height = $('#modalViewIdentifyResults').height();
        var identify_header_height = $('#modalViewIdentifyResultsHeader1').height();
        $('.identifyResults_wrapper').height(identify_reveal_height - identify_header_height);
        //*************************

        var search_reveal_height = $('#modalAddData').height();
        var searchtabsheader = $('#search-tabs').height();
        var searchactivetabs2 = $('#search_panel2').height();
        var searchactivetabs1 = $('#search_panel1').height();
        var searchactivetabs = 0;
        if ($('#search_panel1').css('display') == 'none') {
            searchactivetabs = searchactivetabs2;
        }
        if ($('#search_panel2').css('display') == 'none') {
            searchactivetabs = searchactivetabs1;
        }

        $('.Map_Data_Search_results').height(search_reveal_height - (mySearchHeaderHeight + searchtabsheader + searchactivetabs + 130));
        $('.Map_Data_Search_results_add').height(search_reveal_height - (mySearchHeaderHeight + searchtabsheader + searchactivetabs + 130));
        //**************************************//**************************************
        var identify_reveal_height = $('#modalViewIdentifyResults').height();
        var metadata_reveal_height = $('#modalViewMetaData').height();
        //
        $('.identifyResults_wrapper').height(identify_reveal_height - myIdentifyHeaderHeight);
        $('.ViewMetaData_wrapper').height(metadata_reveal_height - mymodalViewMetaDataHeaderHeight);
        //**************************************//**************************************
        $('.studyRound, .sel_1, .sel_2, .sel_3').attr("size", 1);

        //**************************************//**************************************
    } else {
        //**************************************//**************************************
        $('.studyRound').attr("size", 2);
        $('.sel_1, .sel_2').attr("size", 5);
        $('.sel_3').attr("size", 3);
        //**************************************//**************************************
        $('#modalViewMetaData').css({ 'height': '70%' });
        $('#modalAddData').css({ 'height': '70%'});
        $('#modalViewIdentifyResults').css({ 'height': '70%' });
        //*************************
        var identify_reveal_height = $('#modalViewIdentifyResults').height();
        var identify_header_height = $('#modalViewIdentifyResultsHeader1').height();
        $('.identifyResults_wrapper').height(identify_reveal_height - identify_header_height);
        //*************************
        var search_reveal_height = $('#modalAddData').height();
        var searchtabsheader = $('#search-tabs').height();
        var searchactivetabs2 = $('#search_panel2').height();
        var searchactivetabs1 = $('#search_panel1').height();
        var searchactivetabs = 0;
        if ($('#search_panel1').css('display') == 'none') {
            searchactivetabs = searchactivetabs2;
        }
        if ($('#search_panel2').css('display') == 'none') {
            searchactivetabs = searchactivetabs1;
        }
        //
        $('.Map_Data_Search_results').height(search_reveal_height - (mySearchHeaderHeight + searchtabsheader + searchactivetabs + 130));
        $('.Map_Data_Search_results_add').height(search_reveal_height - (mySearchHeaderHeight + searchtabsheader + searchactivetabs + 130));
        //**************************************//**************************************
        var identify_reveal_height = $('#modalViewIdentifyResults').height();
        var metadata_reveal_height = $('#modalViewMetaData').height();
        //
        $('.identifyResults_wrapper').height(identify_reveal_height - myIdentifyHeaderHeight);
        $('.ViewMetaData_wrapper').height(metadata_reveal_height - mymodalViewMetaDataHeaderHeight);

        $('#btnTour_Content').show();
        $('#btn_contents_pop').show();

    }
    //***********************************************************

    if ($("#mapDiv").hasClass("small-12 medium-12 large-12")) {
        $('#left_nav').height(myDocHeight);
        myLeftNavHeight = $('#left_nav').height();
        $('.left_nav_tabs-content').height(myLeftNavHeight - (myLeftHeaderHeight + tabsheader + 2));

        $('#legendDiv').height(myLeftNavHeight - (myLeftHeaderHeight + tabsheader + 30));

        var mytableofcontents_header = $('.tableofcontents_header').height();

        if ($('.tableofcontents').css('display') == 'none') {
            //nothing
        } else {
            $('.tableofcontents').height((myLeftNavHeight - (myLeftHeaderHeight + tabsheader + 30)) - mytableofcontents_header);
        }

    } else {
        setTimeout(function () {
            $('#left_nav').height(myDocHeight - (myHeaderHeight + myFooterHeight));
            myLeftNavHeight = $('#left_nav').height();
            $('.left_nav_tabs-content').height(myLeftNavHeight - (myLeftHeaderHeight + tabsheader + 2));
            $('#legendDiv').height(myLeftNavHeight - (myLeftHeaderHeight + tabsheader + 30));

            var mytableofcontents_header = $('.tableofcontents_header').height();
            if ($('.tableofcontents').css('display') == 'none') {
                //nothing
            } else {
                $('.tableofcontents').height((myLeftNavHeight - (myLeftHeaderHeight + tabsheader + 30)) - mytableofcontents_header);
            }
        }, 100);

    }

    var myMapDivWidth = $('#mapDiv').width();
    $('.loadingImg').css({ 'right': (myMapDivWidth / 2) - 5 + 'px' });
}
//*********************************************************************************************
//***************** Checks the Map Scale for the Aerial Photography ***************************
function bgChecker() {

    if (map.getScale() < 50000) {
        if (dojo.attr("bg_Selector", "title") == 'Aerial Photography') {
            $('.bg_Selector').attr("src", 'img/menu/Aerial_test.png');
            $('.aerial_message').hide();
        }
    } else {
        if (dojo.attr("bg_Selector", "title") == 'Aerial Photography') {
            $('.bg_Selector').attr("src", 'img/menu/Aerial_na_test.png');
            $('.aerial_message').show();
        }
        if (baseMapServiceLayerAerial == undefined) {

        } else {
            if (baseMapServiceLayerAerial.visible) {
                baseMapServiceLayer_standard.setVisibility(true);
                baseMapServiceLayer_colour.setVisibility(false);
                baseMapServiceLayer_grey.setVisibility(false);
                baseMapServiceLayerAerial.setVisibility(false);
            }
        }
    }
}
//*********************************************************************************************
//*************************** Start Tour ******************************************************
function startTour() {

	tourStep1 = $('#mnuMapLayers');
    tourStep2 = $('#mnuMapBackground');
    tourStep3 = $('#btnAdd_Content');
    tourStep4 = $('.esriIconFallbackText');
    tourStep5 = $('.esriSimpleSliderIncrementButton span');
    tourStep6 = $('#txtsearch');
    tourStep7 = $('#btnMenu');
    tourStep8 = $('#btn_contents_pop i');
	

    var tourStep1html = '<div class="row column tooltip tooltip_sepa">' +
                 '<div class="row">' +
                    '<button class="close-button" aria-label="Dismiss alert" id="btn_Step1_Close" type="button" >' +
                        '<span aria-hidden="true">&times;</span>' +
                    '</button>' +
                 '</div>' +
                 '<div class="row column">' +
                    '<div>' +
                        '<h7><strong><em>Step 1 of 8</em></strong></h7>' +
                    '</div>' +
                 '</div>' +
                 '<div class="row column">' +
                 '<p>' +
                    'Data tab contains information on the layers of data.' +
                 '</p>' +
                 '</div>' +
                 '<div class="row column">' +
                 '<a href="#" id="btn_GoStep2" class="small button float-right">Next</a>' +
                 '</div>' +
                 '</div>';

    var tourStep2html = '<div class="row column tooltip tooltip_sepa">' +
             '<div class="row">' +
                '<button class="close-button" aria-label="Dismiss alert" id="btn_Step2_Close" type="button" >' +
                    '<span aria-hidden="true">&times;</span>' +
                '</button>' +
             '</div>' +
             '<div class="row column">' +
                '<div>' +
                    '<h7><strong><em>Step 2 of 8</em></strong></h7>' +
                '</div>' +
             '</div>' +
             '<div class="row column">' +
             '<p>' +
             'Base map tab contains options of base layers to display.' +
             '</p>' +
             '<p>' +
             'Please note that the aerial photography is only available once you have zoomed in to a map scale greater than 1: 80,000.' +
             '</p>' +
             '</div>' +
             '<div class="row column">' +
             '<a href="#" id="btn_GoStep3" class="small button float-right">Next</a>' +
             '</div>' +
             '</div>';

    var tourStep3html = '<div class="row column tooltip tooltip_sepa">' +
             '<div class="row">' +
                '<button class="close-button" aria-label="Dismiss alert" id="btn_Step3_Close" type="button" >' +
                    '<span aria-hidden="true">&times;</span>' +
                '</button>' +
             '</div>' +
             '<div class="row column">' +
                '<div>' +
                    '<h7><strong><em>Step 3 of 8</em></strong></h7>' +
                '</div>' +
             '</div>' +
             '<div class="row column">' +
                 '<p>' +
                    'This will allow you to filter and data on the map.' +
                 '</p>' +
             '</div>' +
             '<div class="row column">' +
             '<a href="#" id="btn_GoStep4" class="small button float-right">Next</a>' +
             '</div>' +
             '</div>';
    var tourStep4html = '<div class="row column tooltip tooltip_sepa">' +
             '<div class="row">' +
                '<button class="close-button" aria-label="Dismiss alert" id="btn_Step4_Close" type="button" >' +
                    '<span aria-hidden="true">&times;</span>' +
                '</button>' +
             '</div>' +
             '<div class="row column">' +
                '<div>' +
                    '<h7><strong><em>Step 4 of 8</em></strong></h7>' +
                '</div>' +
             '</div>' +
             '<div class="row column ">' +
                 '<p>' +
                    'Displays the scale of the map.' +
                 '</p>' +
             '</div>' +
             '<div class="row column">' +
             '<a href="#" id="btn_GoStep5" class="small button float-right">Next</a>' +
             '</div>' +
             '</div>';

    var tourStep5html = '<div class="row column tooltip tooltip_sepa">' +
             '<div class="row">' +
                '<button class="close-button" aria-label="Dismiss alert" id="btn_Step5_Close" type="button" >' +
                    '<span aria-hidden="true">&times;</span>' +
                '</button>' +
             '</div>' +
             '<div class="row column">' +
                '<div>' +
                    '<h7><strong><em>Step 5 of 8</em></strong></h7>' +
                '</div>' +
             '</div>' +
             '<div class="row column ">' +
                 '<p>' +
                    'These controls allow you to zoom in and out of the map.' +
                 '</p>' +
             '</div>' +
             '<div class="row column">' +
             '<a href="#" id="btn_GoStep6" class="small button float-right">Next</a>' +
             '</div>' +
             '</div>';
    var tourStep6html = '<div class="row column tooltip tooltip_sepa">' +
             '<div class="row">' +
                '<button class="close-button" aria-label="Dismiss alert" id="btn_Step6_Close" type="button" >' +
                    '<span aria-hidden="true">&times;</span>' +
                '</button>' +
             '</div>' +
             '<div class="row column">' +
                '<div>' +
                    '<h7><strong><em>Step 6 of 8</em></strong></h7>' +
                '</div>' +
             '</div>' +
             '<div class="row column ">' +
                 '<p>' +
                    'Search for geographic locations and areas of interest.' +
                 '</p>' +
             '</div>' +
             '<div class="row column">' +
             '<a href="#" id="btn_GoStep7" class="small button float-right">Next</a>' +
             '</div>' +
             '</div>';
    var tourStep7html = '<div class="row column tooltip tooltip_sepa">' +
             '<div class="row">' +
                '<button class="close-button" aria-label="Dismiss alert" id="btn_Step7_Close" type="button" >' +
                    '<span aria-hidden="true">&times;</span>' +
                '</button>' +
             '</div>' +
             '<div class="row column">' +
                '<div>' +
                    '<h7><strong><em>Step 7 of 8</em></strong></h7>' +
                '</div>' +
             '</div>' +
             '<div class="row column ">' +
                 '<p>' +
                    'View previous search results.' +
                 '</p>' +
             '</div>' +
             '<div class="row column">' +
             '<a href="#" id="btn_GoStep8" class="small button float-right">Next</a>' +
             '</div>' +
             '</div>';
    var tourStep8html = '<div class="row column tooltip tooltip_sepa">' +
             '<div class="row">' +
                '<button class="close-button" aria-label="Dismiss alert" id="btn_Step8_Close" type="button" >' +
                    '<span aria-hidden="true">&times;</span>' +
                '</button>' +
             '</div>' +
             '<div class="row column">' +
                '<div>' +
                    '<h7><strong><em>Step 8 of 8</em></strong></h7>' +
                '</div>' +
             '</div>' +
             '<div class="row column ">' +
                 '<p>' +
                    'Pop out the side menu to make the map area bigger.' +
                 '</p>' +
             '</div>' +
             '<div class="row column">' +
             '<a href="#" id="btn_Tour_Close" class="small button float-right">Close</a>' +
             '</div>' +
             '</div>';

    var tourStep1_elem = new Foundation.Tooltip(tourStep1, {
        'template': tourStep1html,
        'tipText': '',
        'clickOpen': false,
        'disableHover':true
    });

    var tourStep2_elem = new Foundation.Tooltip(tourStep2, {
        'template': tourStep2html,
        'tipText': '',
        'clickOpen': false,
        'disableHover': true
    });
    var tourStep3_elem = new Foundation.Tooltip(tourStep3, {
        'template': tourStep3html,
        'tipText': '',
        'clickOpen': false,
        'disableHover': true
    });
    var tourStep4_elem = new Foundation.Tooltip(tourStep4, {
        'template': tourStep4html,
        'tipText': '',
        'clickOpen': false,
        'disableHover': true
    });
    var tourStep5_elem = new Foundation.Tooltip(tourStep5, {
        'template': tourStep5html,
        'tipText': '',
        'clickOpen': false,
        'disableHover': true
    });
    var tourStep6_elem = new Foundation.Tooltip(tourStep6, {
        'template': tourStep6html,
        'tipText': '',
        'clickOpen': false,
        'disableHover': true
    });
    var tourStep7_elem = new Foundation.Tooltip(tourStep7, {
        'template': tourStep7html,
        'tipText': '',
        'clickOpen': false,
        'disableHover': true
    });
    var tourStep8_elem = new Foundation.Tooltip(tourStep8, {
        'template': tourStep8html,
        'tipText': '',
        'clickOpen': false,
        'disableHover': true
    });

    $('#btn_GoStep2').click(function () {
        tourStep1.foundation('hide');
        tourStep2.foundation('show');
    });
    $('#btn_GoStep3').click(function () {
        tourStep2.foundation('hide');
        tourStep3.foundation('show');
    });
    $('#btn_GoStep4').click(function () {
        tourStep3.foundation('hide');
        tourStep4.foundation('show');
    });
    $('#btn_GoStep5').click(function () {
        tourStep4.foundation('hide');
        tourStep5.foundation('show');
    });
    $('#btn_GoStep6').click(function () {
        tourStep5.foundation('hide');
        tourStep6.foundation('show');
    });
    $('#btn_GoStep7').click(function () {
        tourStep6.foundation('hide');
        tourStep7.foundation('show');
    });
    $('#btn_GoStep8').click(function () {
        tourStep7.foundation('hide');
        tourStep8.foundation('show');
    });

    $('#btn_Step1_Close').click(function () {
        tourStep1.foundation('hide');
        endtour();
    });
    $('#btn_Step2_Close').click(function () {
        tourStep2.foundation('hide');
        endtour();
    });
    $('#btn_Step3_Close').click(function () {
        tourStep3.foundation('hide');
        endtour();
    });
    $('#btn_Step4_Close').click(function () {
        tourStep4.foundation('hide');
        endtour();
    });
    $('#btn_Step5_Close').click(function () {
        tourStep5.foundation('hide');
        endtour();
    });
    $('#btn_Step6_Close').click(function () {
        tourStep6.foundation('hide');
        endtour();
    });
    $('#btn_Step7_Close').click(function () {
        tourStep7.foundation('hide');
        endtour();
    });
    $('#btn_Step8_Close,#btn_Tour_Close').click(function () {
        tourStep8.foundation('hide');
        endtour();
    });
    tourStep1.foundation('show');
}

function endtour() {
    tourStep1.foundation('destroy');
    tourStep2.foundation('destroy');
    tourStep3.foundation('destroy');
    tourStep4.foundation('destroy');
    tourStep5.foundation('destroy');
    tourStep6.foundation('destroy');
    tourStep7.foundation('destroy');
    tourStep8.foundation('destroy');

    tourStep1.removeAttr("title");
    tourStep2.removeAttr("title");
    tourStep3.removeAttr("title");
    tourStep4.removeAttr("title");
    tourStep5.removeAttr("title");
    tourStep6.removeAttr("title");
    tourStep7.removeAttr("title");
    tourStep8.removeAttr("title");
}

//*********************************************************************************************
  
    function user_message(usermessage, mesagetype) {
        var strIcon;
        switch (mesagetype) {
            case 'war':
                strIcon = '<i class="fa fa-exclamation-triangle fa-2x sepa_warning" aria-hidden="true"></i>&nbsp; Warning</br>';
                break;
            case 'err':
                strIcon = '<i class="fa fa-times fa-2x sepa_error" aria-hidden="true"></i>&nbsp; Error</br>';
                break;
            case 'inf':
                strIcon = '<i class="fa fa-info-circle fa-2x sepa_information" aria-hidden="true"></i>&nbsp; Information</br>';
                break;
            default:
                strIcon = '<i class="fa fa-exclamation-triangle fa-2x" aria-hidden="true"></i>&nbsp;';
                break;
        }
        $('.sepa_usermessage').show(500);
        $('#user_message').html(strIcon + usermessage);
    }

    function isObject(val) {
        if (val === null) { return false; }
        return ((typeof val === 'function') || (typeof val === 'object'));
    }

    function urlify(text) {
        var urlRegex = /(((https?:\/\/)|(www\.))[^\s]+)/g;
        //var urlRegex = /(https?:\/\/[^\s]+)/g;
        if ($.isNumeric(text)) {
            return text;
        } else {
            try {
                if (text) {
                    return text.replace(urlRegex, function (url, b, c) {
                        var url2 = (c == 'www.') ? 'http://' + url : url;
                        return '<a href="' + url2 + '" target="_blank">more info</a>';
                    })
                } else {
                    return 'none';
                }
            }
            catch (ex) {
                text;
                debugger;
            }

        }

    }