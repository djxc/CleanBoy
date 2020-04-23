/**
 * **计算坐标与切片之间关系**
 * @param {*} val 
 */

function calcTile(val) {
    var d = val.split('/')
    var dtile = d[0] + '/'
    dtile += long2tile(d[2], d[0])
    dtile += '/'
    dtile += lat2tile(d[1], d[0])
}

function calcMap(val) {
    var d = val.split('/')
    d[2] = tile2long(d[2], d[0])
    d[1] = tile2lat(d[1], d[0])
}

/* http://wiki.openstreetmap.org/wiki/Slippy_map_tilenames */

function long2tile(lon, zoom1) {
    tt = Number(lon)
    return Math.floor(((tt + 180) / 360) * Math.pow(2, zoom1))
}

function lat2tile(lat, zoom2) {
    return Math.floor(
        ((1 -
            Math.log(
                Math.tan((lat * Math.PI) / 180) +
                1 / Math.cos((lat * Math.PI) / 180)
            ) /
            Math.PI) /
            2) *
        Math.pow(2, zoom2)
    )
}

function tile2long(x, z) {
    return (x / Math.pow(2, z)) * 360 - 180
}

function tile2lat(y, z) {
    var n = Math.PI - (2 * Math.PI * y) / Math.pow(2, z)
    return (180 / Math.PI) * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
}