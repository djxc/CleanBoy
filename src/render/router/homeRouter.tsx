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
import WebAssemblyPage from "../page/webAssembly";
import WebcgRouter from "./WebcgRouter";
import ToolboxRouter from "./ToolboxRouter";
import OLMap from "../page/openlayers/olMap";
import DataStruct from "../page/dataStruct";

function HomeRouter() {
  return (
    <div>
      <HeaderComponent />
      <Routes>
        {/* exact 表示url匹配整个path而不是拦截所有以path开头的url */}
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/2dmap" element={<MapPage />}></Route>
        <Route path="/3dmap" element={<Map3DPage />}></Route>
        <Route path="/d3d" element={<D3dPage />}></Route>
        <Route path="/charts" element={<ChartsPage />}></Route>
        <Route path="/canvas" element={<CanvasPage />}></Route>
        <Route path="/onlineTile" element={<OnlineTilePage />}></Route>
        <Route path="/webCG/*" element={<WebcgRouter />}></Route>
        <Route path="/webAssembly" element={<WebAssemblyPage />}></Route>
        <Route path="/ol" element={<OLMap />}></Route>
        <Route path="/toolbox/*" element={<ToolboxRouter />}></Route>
        <Route path="/datastruct" element={<DataStruct />}></Route>
      </Routes>
      <FooterPage />
    </div>
  );
}

export default HomeRouter;
