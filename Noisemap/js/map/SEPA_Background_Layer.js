var _thinkwhere = 'https://map.sepa.org.uk/proxy/thinkwhere.ashx';

function init_background_layers() {
    dojo.declare("my.ThinkWhereStandard", esri.layers.TiledMapServiceLayer, {
        constructor: function () {
            this.spatialReference = new esri.SpatialReference({ wkid: 27700 });
            this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-49743770.85697311, -33016566.845420867, 50443770.85697311, 34766566.84542087, this.spatialReference));
            this.id = 'bg1';
            this.opacity = 1.0;
            this.tileInfo = new esri.layers.TileInfo({
                "rows": 256,
                "cols": 256,
                "dpi": 96,
                "format": "image/png",
                "origin": {
                    "x": 0,
                    "y": 1300000
                },
                "spatialReference": {
                    "wkid": 27700
                },
                "lods": [
                                         { "level": 0, "resolution": 1000.0000000004, "scale": 3571428.571429 },
                                         { "level": 1, "resolution": 499.99999999880004, "scale": 1785714.285714 },
                                         { "level": 2, "resolution": 200.00000000008, "scale": 714285.714286 },
                                         { "level": 3, "resolution": 100.00000000004, "scale": 357142.857143 },
                                         { "level": 4, "resolution": 49.999999999879996, "scale": 178571.428571 },
                                         { "level": 5, "resolution": 24.999999999996, "scale": 89285.714286 },
                                         { "level": 6, "resolution": 10.000000000004, "scale": 35714.285714 },
                                         { "level": 7, "resolution": 4.999999999988, "scale": 17857.142857 },
                                         { "level": 8, "resolution": 2.4999999999996, "scale": 9448.818897636284 },
                                         { "level": 9, "resolution": 1.2699999999987999, "scale": 4535.714286 }
                ]
            });
            this.loaded = true;
            this.onLoad(this);
        },

        getTileUrl: function (level, row, col) {
			return _thinkwhere + "?https://api.themapcloud.com/maps/wmts/os_standard_look_feel/uk_bng_largescale/" + level + "/" + col + "/" + row + "." + "png";
        }
    });

    dojo.declare("my.ThinkWhereColour", esri.layers.TiledMapServiceLayer, {
        constructor: function () {
            this.spatialReference = new esri.SpatialReference({ wkid: 27700 });
            this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-49743770.85697311, -33016566.845420867, 50443770.85697311, 34766566.84542087, this.spatialReference));
            this.id = 'bg2';
            this.opacity = 1.0;
            this.tileInfo = new esri.layers.TileInfo({
                "rows": 256,
                "cols": 256,
                "dpi": 96,
                "format": "image/png",
                "origin": {
                    "x": 0,
                    "y": 1300000
                },
                "spatialReference": {
                    "wkid": 27700
                },
                "lods": [
                                         { "level": 0, "resolution": 1000.0000000004, "scale": 3571428.571429 },
                                         { "level": 1, "resolution": 499.99999999880004, "scale": 1785714.285714 },
                                         { "level": 2, "resolution": 200.00000000008, "scale": 714285.714286 },
                                         { "level": 3, "resolution": 100.00000000004, "scale": 357142.857143 },
                                         { "level": 4, "resolution": 49.999999999879996, "scale": 178571.428571 },
                                         { "level": 5, "resolution": 24.999999999996, "scale": 89285.714286 },
                                         { "level": 6, "resolution": 10.000000000004, "scale": 35714.285714 },
                                         { "level": 7, "resolution": 4.999999999988, "scale": 17857.142857 },
                                         { "level": 8, "resolution": 2.4999999999996, "scale": 9448.818897636284 },
                                         { "level": 9, "resolution": 1.2699999999987999, "scale": 4535.714286 }
                ]
            });
            this.loaded = true;
            this.onLoad(this);
        },

        getTileUrl: function (level, row, col) {
            return _thinkwhere + "?https://api.themapcloud.com/maps/wmts/os_licensed_background_colour/uk_bng_largescale/" + level + "/" + col + "/" + row + "." + "png";
        }
    });

    dojo.declare("my.ThinkWhereGreyScale", esri.layers.TiledMapServiceLayer, {
        constructor: function () {
            this.spatialReference = new esri.SpatialReference({ wkid: 27700 });
            this.initialExtent = (this.fullExtent = new esri.geometry.Extent(-49743770.85697311, -33016566.845420867, 50443770.85697311, 34766566.84542087, this.spatialReference));
            this.id = 'bg3';
            this.opacity = 1.0;
            this.tileInfo = new esri.layers.TileInfo({
                "rows": 256,
                "cols": 256,
                "dpi": 96,
                "format": "image/png",
                "origin": {
                    "x": 0,
                    "y": 1300000
                },
                "spatialReference": {
                    "wkid": 27700
                },
                "lods": [
                                         { "level": 0, "resolution": 1000.0000000004, "scale": 3571428.571429 },
                                         { "level": 1, "resolution": 499.99999999880004, "scale": 1785714.285714 },
                                         { "level": 2, "resolution": 200.00000000008, "scale": 714285.714286 },
                                         { "level": 3, "resolution": 100.00000000004, "scale": 357142.857143 },
                                         { "level": 4, "resolution": 49.999999999879996, "scale": 178571.428571 },
                                         { "level": 5, "resolution": 24.999999999996, "scale": 89285.714286 },
                                         { "level": 6, "resolution": 10.000000000004, "scale": 35714.285714 },
                                         { "level": 7, "resolution": 4.999999999988, "scale": 17857.142857 },
                                         { "level": 8, "resolution": 2.4999999999996, "scale": 9448.818897636284 },
                                         { "level": 9, "resolution": 1.2699999999987999, "scale": 4535.714286 }
                ]
            });
            this.loaded = true;
            this.onLoad(this);
        },

        getTileUrl: function (level, row, col) {
            return _thinkwhere + "?https://api.themapcloud.com/maps/wmts/os_licensed_background_greyscale/uk_bng_largescale/" + level + "/" + col + "/" + row + "." + "png";
        }
    });
}