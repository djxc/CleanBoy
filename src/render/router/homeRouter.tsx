import { Route, Routes, useNavigate } from "react-router-dom";
import CanvasPage from "../page/canvas";
import ChartsPage from "../page/charts";
import D3dPage from "../page/d3d";
import HomePage from "../page/Home";
import MapPage from "../page/map";
import Map3DPage from "../page/map3D";
import OnlineTilePage from "../page/onlineTile";
import WebAssemblyPage from "../page/webAssembly";
import WebGLPage from "../page/webGL";

function HomeRouter() {
    const navigate = useNavigate();

    return (
        <div>
            <div>
                <button onClick={() => changeMap('/home')}>主页面</button>
            </div>
            <Routes>
                {/* exact 表示url匹配整个path而不是拦截所有以path开头的url */}
                <Route path='/' element={<HomePage />}>
                </Route>
                <Route path="/2dmap" element={<MapPage />}>
                </Route>
                <Route path="/3dmap" element={<Map3DPage />}>
                </Route>
                <Route path="/d3d" element={<D3dPage />}>
                </Route>
                <Route path="/charts" element={<ChartsPage />}>
                </Route>
                <Route path="/canvas" element={<CanvasPage />}>
                </Route>
                <Route path="/onlineTile" element={<OnlineTilePage />}>
                </Route>
                <Route path="/webGL" element={<WebGLPage />}>
                </Route>
                <Route path="/webAssembly" element={<WebAssemblyPage />}>
                </Route>
            </Routes>
            <div>
                footer
            </div>
        </div>
    )

    function changeMap(path: string) {
        navigate(path)
    }
}

export default HomeRouter