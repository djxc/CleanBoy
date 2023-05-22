import { useNavigate } from 'react-router-dom';
import "./Home.css"

import EarthImage from "../asset/earth.jpg";
import D3EarthImage from "../asset/3dEarth.jpg";
import ChartImage from "../asset/charts.jpg";
import CanvasImage from "../asset/canvas1.jpg";
import WebThreeImage from "../asset/webThree.jpeg";
import WebAssemblyImage from "../asset/webassembly.jpg";
import WebGLImage from "../asset/webGL.jpeg";
import OnlineTileImage from "../asset/onlineTile.png";
import OpenlayerLogo from "../asset/openlayers.png";
import ToolboxImage from "../asset/toolbox.jpg";


function HomePage() {
    const navigate = useNavigate();

    return (
        <div className="main-body-menu">
            <div className="main-body-menu1">
                <div className="main-body-menu1-item">
                    <img
                        className="main-body-d2earth-img"
                        src={EarthImage}
                        title="二维地图"
                        onClick={() => changeMap('/home/2dmap')}
                    />
                    <div className="main-body-menu-title">二维地图</div>
                </div>
                <div className="main-body-menu1-item">
                    <img
                        src={D3EarthImage}
                        title="三维地图"
                        onClick={() => changeMap('/home/3dmap')}
                    />
                    <div className="main-body-menu-title">三维地图</div>
                </div>
                <div className="main-body-menu1-item">
                    <img
                        src={ChartImage}
                        title="报表工具"
                        onClick={() => changeMap('/home/charts')}
                    />
                    <div className="main-body-menu-title">报表工具</div>
                </div>
                <div className="main-body-menu1-item">
                    <img
                        src={CanvasImage}
                        title="canvas"
                        onClick={() => changeMap('/home/canvas')}
                    />
                    <div className="main-body-menu-title">canvas</div>
                </div>
            </div>
            <div className="main-body-menu2">
                <div
                    className="main-body-menu2-item"
                    title="web三维"
                    onClick={() => changeMap('/home/d3d')}
                >
                    <img src={WebThreeImage} />
                    <div className="main-body-menu-title">web三维</div>
                </div>
                <div
                    className="main-body-menu2-item"
                    title="webassembly"
                >
                    <img src={WebAssemblyImage} />
                    <div className="main-body-menu-title">webassembly</div>
                </div>
                <div
                    className="main-body-menu2-item"
                    title="webGL/webGPU"
                    onClick={() => changeMap('/home/webCG')}
                >
                    <img src={WebGLImage} />
                    <div className="main-body-menu-title">计算机图形学</div>
                </div>
                <div
                    className="main-body-menu2-item"
                    title="onlineTile"
                    onClick={() => changeMap('/home/onlineTile')}
                >
                    <img src={OnlineTileImage} />
                    <div className="main-body-menu-title">影像切片</div>
                </div>
            </div>
            <div className="main-body-menu3">
                <div
                    className="main-body-menu3-item"
                    title="常用工具"
                    onClick={() => changeMap('/home/toolbox')}
                >
                    <img src={ToolboxImage} />
                    <div className="main-body-menu-title">常用工具</div>
                </div>
                <div
                    className="main-body-menu3-item"
                    title="webassembly"
                >
                    <img src={WebAssemblyImage} />
                    <div className="main-body-menu-title">webassembly</div>
                </div>
                <div
                    className="main-body-menu3-item"
                    title="数据结构"
                    onClick={() => changeMap('/home/datastruct')}
                >
                    <img src={WebGLImage} />
                    <div className="main-body-menu-title">数据结构</div>
                </div>
                <div
                    className="main-body-menu3-item"
                    title="onlineTile"
                    onClick={() => changeMap('/home/ol')}
                >
                    <img src={OpenlayerLogo} />
                    <div className="main-body-menu-title">openlayers</div>
                </div>
            </div>
        </div>
    )

    function changeMap(path: string) {
        navigate(path)
    }
}

export default HomePage;