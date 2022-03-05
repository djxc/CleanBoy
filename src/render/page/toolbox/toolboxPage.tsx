import { useNavigate } from "react-router-dom";
import DRequest from "../../components/toolboxComponent/DRequest"
import MqttRequest from "../../components/toolboxComponent/MqttRequest"
import "./toolboxPage.css"

function ToolboxPage() {
    const navigate = useNavigate();


    return (
        <div className="toolbox-page">
            <div>常用工具</div>
            <div className="request-toolbox">
                <span onClick={()=>{changePage("/home/toolbox/http")}}>http请求测试</span>
                {/* <DRequest/> */}
            </div>

            <div className="request-toolbox">
                <span onClick={()=>{changePage("/home/toolbox/mqtt")}}>mqtt请求测试</span>
                {/* <MqttRequest/> */}
            </div>
        </div>
    )

    function changePage(pageUrl: string) {
        navigate(pageUrl)
    }

}

export default ToolboxPage