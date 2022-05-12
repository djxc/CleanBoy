import { Route, Routes } from "react-router-dom"
import DCharts from "../components/toolboxComponent/DCharts"
import DRequest from "../components/toolboxComponent/DRequest"
import MqttRequest from "../components/toolboxComponent/MqttRequest"
import ParseVectorTile from "../components/toolboxComponent/parseVectorTile"
import SocketRequest from "../components/toolboxComponent/SocketRequest"
import WebsocketRequest from "../components/toolboxComponent/WebsocketRequest"
import ToolboxPage from "../page/toolbox/toolboxPage"


function ToolboxRouter() {
    return(
        <div>
            <Routes>
                <Route path='/' element={<ToolboxPage />}></Route>
                <Route path='/mqtt' element={<MqttRequest />}></Route>
                <Route path='/http' element={<DRequest />}></Route>
                <Route path='/dchart' element={<DCharts />}></Route>
                <Route path='/websocket' element={<WebsocketRequest/>}></Route>
                <Route path='/parseVectorTile' element={<ParseVectorTile />}></Route>
                <Route path='/socket' element={<SocketRequest />}></Route>
            </Routes>
        </div>
    )
}

export default ToolboxRouter