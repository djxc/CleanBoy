import { useNavigate } from "react-router-dom";
import DRequest from "../../components/toolboxComponent/DRequest"
import MqttRequest from "../../components/toolboxComponent/MqttRequest"
import "./toolboxPage.css"

function ToolboxPage() {
    const navigate = useNavigate();


    return (
        <div className="toolbox-page">
            <div>常用工具</div>
            <div className="request-toolbox" onClick={()=>{changePage("/home/toolbox/http")}}>
                <span>http请求测试</span>
            </div>

            <div className="request-toolbox" onClick={()=>{changePage("/home/toolbox/mqtt")}}>
                <span>mqtt请求测试</span>
            </div>

            <div className="request-toolbox" onClick={()=>{changePage("/home/toolbox/websocket")}}>
                <span>websocket请求测试</span>
            </div>

            <div className="request-toolbox" onClick={()=>{changePage("/home/toolbox/dchart")}}>
                <span>报表测试</span>
            </div>

            <div className="request-toolbox" onClick={()=>{changePage("/home/toolbox/parseVectorTile")}}>
                <span>解析pbf切片文件</span>
            </div>

            <div className="request-toolbox" onClick={()=>{changePage("/home/toolbox/socket")}}>
                <span>socket请求</span>
            </div>
        </div>
    )

    function changePage(pageUrl: string) {
        navigate(pageUrl)
    }

}

export default ToolboxPage