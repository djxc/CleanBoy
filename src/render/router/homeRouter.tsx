import { Route, Routes } from "react-router-dom";
import HeaderComponent from "../components/headerComponent/header";
import CanvasPage from "../page/canvas";
import ChartsPage from "../page/charts";
import D3dPage from "../page/d3d";
import FooterPage from "../components/footerComponent/footer";
import HomePage from "../page/Home";
import MapPage from "../page/map";
import Map3DPage from "../page/map3D";
import OnlineTilePage from "../page/onlineTile";
import ToolboxPage from "../page/toolbox/toolboxPage";
import WebAssemblyPage from "../page/webAssembly";
import WebGLPage from "../page/webGL";
import ToolboxRouter from "./ToolboxRouter";

function HomeRouter() {

    return (
        <div>
            <HeaderComponent/>
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
                <Route path="/toolbox/*" element={<ToolboxRouter/>}></Route>
            </Routes>
            <FooterPage/>
        </div>
    )
   
}

export default HomeRouter