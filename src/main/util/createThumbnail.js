var fs = require('fs')
var path = require('path')
var jimp = require('jimp')
/**
 * 创建缩略图
 * 1、遍历给定的文件夹下左右的照片
 */
async function CreateThumbnail(photosFolder) {
    let files = fs.readdirSync(photosFolder)
    for (let i = 0; i < files.length; i++) {
        let filePathName = path.join(photosFolder, files[i])
        const image = await jimp.read(filePathName);
    
        // Resize the image to width 150 and auto height.
        await image.resize(150, jimp.AUTO);
        // Save and overwrite the image
        await image.writeAsync(photosFolder + 'thumbail/' + files[i]);
    }
}

export default CreateThumbnail