import { Route, Routes } from "react-router-dom"
import CanvasComponent from "../components/webglComponent/CanvasComponent"
import WebGPUComponent from "../components/webglComponent/WebGPUComponent"
import WebGLComponent from "../components/webglComponent/WebGLComponent"
import WebGLPage from "../page/webGL"


function WebcgRouter() {
    return(
        <div>
            <Routes>
                <Route path='/' element={<WebGLPage />}></Route>
                <Route path='/webGL' element={<WebGLComponent />}></Route>
                <Route path='/webGPU' element={<WebGPUComponent />}></Route>
                <Route path='/canvas' element={<CanvasComponent />}></Route>
            </Routes>
        </div>
    )
}

export default WebcgRouter