var fs = require('fs')
var path = require('path')
// var EXIF = require('exif-js')
var ExifImage = require('exif').ExifImage;

/**
 * 遍历文件夹下所有的照片文件，然后将其解析出经纬度，保存在文件中
 * 这里采用async语法将函数变成异步函数，可以在异步函数中使用await。
 * await后的函数是一种耗时操作的函数，通过使用await关键字等待执行完该耗时操作，然后继续执行下面的语句。
 * await需要在async方法内部
 * @param {string} photosFolder 照片文件夹路径
 * @param {string} saveFilePath GPS文件保存位置
 */
async function testGPS(photosFolder, saveFilePath, callback) {
    let files = fs.readdirSync(photosFolder);
    // 同步打开文件，防止回调陷阱
    let fd = fs.openSync(saveFilePath, 'w')
    // 遍历文件夹下所有的文件，通过fs查看文件状态，如果为文件则判断后缀名是否为照片类型：jpg
    for (let i = 0; i < files.length; i++) {
        let filePathName = path.join(photosFolder, files[i])
        let infoState = fs.statSync(filePathName)
        if (infoState.isFile) {
            // 考虑解析GPS报错情况，返回的promise中的reject包含异常信息
            try{
                let info = await getGPSFromFile(files[i], filePathName)
                fs.writeSync(fd, info)
            }catch(err) {
                console.log(err)
            }
        }
    }
    fs.fsync(fd, (err)=>{
        console.log(err)
    });
    fs.close(fd, (err)=>{
        if(err) {
            console.log(err)
        }
        callback('ok')
    })
}

/**
 * 从文件中获取gps数据, await关键字的函数需要返回Promise对象，返回数据放在resolve中
 * @param {string} filePathName 文件名
 * @param {number} fd 打开文件的标记
 */
function getGPSFromFile(file, filePathName) {
    return new Promise((resolve, reject) => {
        try {
            new ExifImage({ image: filePathName }, (error, exifData) => {
                if (error) {
                    console.log('Error_dj: ' + error.message);
                    reject(error)
                } else {
                    let gps = exifData.gps;
                    let latRef = gps.GPSLatitudeRef;
                    let lat = gps.GPSLatitude;
                    let lat_ = ConvertDMSToDD(lat[0], lat[1], lat[2], latRef)
                    let lonRef = gps.GPSLongitudeRef;
                    let lon = gps.GPSLongitude;
                    let lon_ = ConvertDMSToDD(lon[0], lon[1], lon[2], lonRef)
                    let altRef = gps.GPSAltitudeRef;
                    let alt = gps.GPSAltitude;
                    resolve(file + ' ' + lat_ + ' ' + lon_ + ' ' + alt + '\n')
                }
            });
        } catch (error) {
            reject(error)
        }
    })
}

/**
 * 将度分秒转换为度小数
 * @param {*} degrees 
 * @param {*} minutes 
 * @param {*} seconds 
 * @param {*} direction 
 */
function ConvertDMSToDD(degrees, minutes, seconds, direction) {
    var dd = degrees + (minutes / 60) + (seconds / 3600);
    if (direction == "S" || direction == "W") {
        dd = dd * -1;
    }
    return dd;
}

export default testGPS
