import { Route, Routes } from "react-router-dom"
import DCharts from "../components/toolboxComponent/DCharts"
import DRequest from "../components/toolboxComponent/DRequest"
import MqttRequest from "../components/toolboxComponent/MqttRequest"
import ToolboxPage from "../page/toolbox/toolboxPage"


function ToolboxRouter() {
    return(
        <div>
            <Routes>
                <Route path='/' element={<ToolboxPage />}></Route>
                <Route path='/mqtt' element={<MqttRequest />}></Route>
                <Route path='/http' element={<DRequest />}></Route>
                <Route path='/dchart' element={<DCharts />}></Route>
            </Routes>
        </div>
    )
}

export default ToolboxRouter