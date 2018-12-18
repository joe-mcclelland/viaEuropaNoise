function Lat_Long_to_East(PHI, LAM, a, b, e0, f0, PHI0, LAM0) {
    //Project Latitude and longitude to Transverse Mercator eastings.
    //Input: - _
    // Latitude (PHI) and Longitude (LAM) in decimal degrees; _
    // ellipsoid axis dimensions (a & b) in meters; _
    // eastings of false origin (e0) in meters; _
    // central meridian scale factor (f0); _
    // latitude (PHI0) and longitude (LAM0) of false origin in decimal degrees.

    //Convert angle measures to radians
    var Pi = 3.14159265358979
    var RadPHI = PHI * (Pi / 180)
    var RadLAM = LAM * (Pi / 180)
    var RadPHI0 = PHI0 * (Pi / 180)
    var RadLAM0 = LAM0 * (Pi / 180)

    var af0 = a * f0
    var bf0 = b * f0
    var e2 = ((Math.pow(af0, 2)) - (Math.pow(bf0, 2))) / (Math.pow(af0, 2))
    var n = (af0 - bf0) / (af0 + bf0)
    var nu = af0 / (Math.sqrt(1 - (e2 * (Math.pow((Math.sin(RadPHI)), 2)))))
    var rho = (nu * (1 - e2)) / (1 - (e2 * (Math.pow(Math.sin(RadPHI), 2))))
    var eta2 = (nu / rho) - 1
    var p = RadLAM - RadLAM0

    var IV = nu * (Math.cos(RadPHI))
    var V = (nu / 6) * (Math.pow((Math.cos(RadPHI)), 3)) * ((nu / rho) - ((Math.pow(Math.tan(RadPHI), 2))))

    var VI = (nu / 120) * (Math.pow(Math.cos(RadPHI), 5)) * (5 - (18 * (Math.pow(Math.tan(RadPHI), 2))) + (Math.pow(Math.tan(RadPHI), 4)) + (14 * eta2) - (58 * (Math.pow(Math.tan(RadPHI), 2)) * eta2))

    var Lat_Long_to_East1 = e0 + (p * IV) + ((Math.pow(p, 3)) * V) + ((Math.pow(p, 5)) * VI)

    return Lat_Long_to_East1
}


function Lat_Long_to_North(PHI, LAM, a, b, e0, n0, f0, PHI0, LAM0) {
    //Project Latitude and longitude to Transverse Mercator northings
    //Input: - _
    // Latitude (PHI) and Longitude (LAM) in decimal degrees; _
    // ellipsoid axis dimensions (a & b) in meters; _
    // eastings (e0) and northings (n0) of false origin in meters; _
    // central meridian scale factor (f0); _
    // latitude (PHI0) and longitude (LAM0) of false origin in decimal degrees.

    //REQUIRES THE "Marc" FUNCTION

    //Convert angle measures to radians
    var Pi = 3.14159265358979
    var RadPHI = PHI * (Pi / 180)
    var RadLAM = LAM * (Pi / 180)
    var RadPHI0 = PHI0 * (Pi / 180)
    var RadLAM0 = LAM0 * (Pi / 180)

    var af0 = a * f0
    var bf0 = b * f0
    var e2 = ((Math.pow(af0, 2)) - (Math.pow(bf0, 2))) / (Math.pow(af0, 2))
    var n = (af0 - bf0) / (af0 + bf0)
    var nu = af0 / (Math.sqrt(1 - (e2 * (Math.pow(Math.sin(RadPHI), 2)))))
    var rho = (nu * (1 - e2)) / (1 - (e2 * Math.pow(Math.sin(RadPHI), 2)))
    var eta2 = (nu / rho) - 1
    var p = RadLAM - RadLAM0
    var M = Marc(bf0, n, RadPHI0, RadPHI)

    var I = M + n0
    var II = (nu / 2) * (Math.sin(RadPHI)) * (Math.cos(RadPHI))
    var III = ((nu / 24) * (Math.sin(RadPHI)) * (Math.pow(Math.cos(RadPHI), 3))) * (5 - (Math.pow(Math.tan(RadPHI), 2)) + (9 * eta2))

    var IIIA = ((nu / 720) * (Math.sin(RadPHI)) * (Math.pow(Math.cos(RadPHI), 5))) * (61 - (58 * (Math.pow(Math.tan(RadPHI), 2))) + (Math.pow(Math.tan(RadPHI), 4)))
    var Lat_Long_to_North1 = I + ((Math.pow(p, 2)) * II) + ((Math.pow(p, 4)) * III) + ((Math.pow(p, 6)) * IIIA)
    return Lat_Long_to_North1

}
function Marc(bf0, n, PHI0, PHI) {
    var Marc1 = bf0 * (((1 + n + ((5 / 4) * (Math.pow(n, 2))) + ((5 / 4) * (Math.pow(n, 3)))) * (PHI - PHI0)) - (((3 * n) + (3 * (n * n)) + ((21 / 8) * (Math.pow(n, 3)))) * (Math.sin(PHI - PHI0)) * (Math.cos(PHI + PHI0))) + ((((15 / 8) * (Math.pow(n, 2))) + ((15 / 8) * (Math.pow(n, 3)))) * (Math.sin(2 * (PHI - PHI0))) * (Math.cos(2 * (PHI + PHI0)))) - (((35 / 24) * (Math.pow(n, 3))) * (Math.sin(3 * (PHI - PHI0))) * (Math.cos(3 * (PHI + PHI0)))))
    return Marc1;
}