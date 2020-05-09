/**
 * **根据url获取图片，然后将其保存**  
 * @author small dj
 * @date 2020-04-19
 */

var Jimp = require('jimp')
const request = require("request");
const fs = require("fs");
// import mergeImages from 'merge-images';
// const {Canvas, Image} = require('canvas');
import { cache_img_save_path } from '../config'


/**
 * ### 爬取天地图的切片数据
 * 1、遍历切片图片的url  
 * 2、采用request方法，获取图片，然后将图片保存在本地，这里需要设置请求的头部信息，
 * 不然服务器会认为不是浏览器，则获取不到数据。
 */
function saveIMG() {
    let cache_x = 3420;
    let cache_y = 1605;
    let cache_z = 12;
    let imgUrl_start = 'http://t4.tianditu.com/DataServer?T=vec_w&'
    let imgUrl_end = '&tk=b9d6abed32f12b4094773fc6985b9ea3'
    for (let x = 0; x < 10; x++) {
        cache_x++;
        for (let y = 0; y < 10; y++) {
            cache_y++
            request({
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) ' +
                        'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.110 Safari/537.36'
                },
                uri: imgUrl_start + 'x=' + cache_x + '&y=' + cache_y +
                    '&l=' + cache_z + imgUrl_end,
                method: "GET"
            }).pipe(fs.createWriteStream(cache_img_save_path + "/"
                + cache_x + "_" + cache_y + "_" + cache_z + ".png"))
        }
    }
    megeIMG()
}

/**
 * ### 将获取到的切片图片
 */
function megeIMG() {
    let cache_x = 3420;
    let cache_y = 1605;
    let cache_z = 12;
    let images = []
    for (let x = 0; x < 5; x++) {
        cache_x++;
        for (let y = 0; y < 5; y++) {
            cache_y++
            let imgFile = cache_img_save_path + "/"
                + cache_x + "_" + cache_y + "_" + cache_z + ".png"
            images.push(imgFile)
        }
    }
    // mergeImages(images, {
    //     Canvas: Canvas,
    //     Image: Image
    // }).then(b64=>{
    //     let fd = fs.openSync("D:\\test.png", 'w')
    //     fs.writeSync(fd, b64)
    //     fs.closeSync(fd)
    // })
}

export default saveIMG