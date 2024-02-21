
import {
    fromUrl as tiffFromUrl,
} from 'geotiff';
import GeoTIFF from 'ol/source/GeoTIFF.js';
import WebGLTileLayer from 'ol/layer/WebGLTile.js';

class COGLayer {
    tif_url: string
    noData: number
    bands_statis: any[]
    variables: {red: number, green: number, blue: number, redMax: number, greenMax: number, blueMax: number}
    constract: number
    band_number: number
    constructor(tif_url: string) {
        this.tif_url = tif_url;
        this.bands_statis = []
        this.noData = -1;
        this.variables = {
            red: 1,
            green: 2,
            blue: 3,
            redMax: 255,
            greenMax: 255,
            blueMax: 200
        }
        this.constract = 0
        this.band_number = 1
    }

    async getBandStatis() {
        let geotiff = await tiffFromUrl(this.tif_url)
        let image = await geotiff.getImage();
        const bands = [];
        // 获取波段数
        const samples = image.getSamplesPerPixel();
        for (let i = 0; i < samples; i++) {
            // 获取该波段信息
            const element = image.getGDALMetadata(i);
            bands.push(element);
        }
        this.bands_statis = bands
        this.band_number = bands.length
        // 获取nodata值
        this.noData = image.getGDALNoData()!;
    }


    /**
     * 创建cog图层
     * 1、图层波段可视化，默认123波段为RGB
     */
    createLayer() {
        const cogSource = new GeoTIFF({
            sources: [
                {
                    url: this.tif_url,
                },
            ],
        });
        const cogLayer = new WebGLTileLayer({
            source: cogSource,
            maxZoom: 22,
            style: {
                variables: this.variables,
                contrast: this.constract,  // 对比度
                brightness: 0,              // 亮度
                color: [
                    'array',
                    ['band', ['var', 'red']],
                    ['band', ['var', 'green']],
                    ['band', ['var', 'blue']],
                    1,
                ],
            },
        })

        return cogLayer
    }


}


export default COGLayer