
import { Button, message } from "antd"
import { useEffect, useState } from "react"
import "./MqttRequest.css"

function MqttRequest() {
    const [connectConfig, setConnectConfig] = useState({
        url: "",
        name: "",
        passwd: "",
    })

    const [clientList, setClientList] = useState<any[]>([])
    const [toAddTopic, setToAddTopic] = useState("");
    const window_: any = window
    useEffect(() => {
        init()
        console.log(window_);
    }, [])
    return (
        <div>
            <div className="mqtt-connect-info">
                <h1>mqtt消息测试</h1>
                <span>创建连接</span>
                <span>url: <input value={connectConfig.url} onChange={(evt) => { changeValue("url", evt.target.value) }} /></span>
                <span>用户名: <input value={connectConfig.name} onChange={(evt) => { changeValue("name", evt.target.value) }} /></span>
                <span>密码: <input value={connectConfig.passwd} onChange={(evt) => { changeValue("passwd", evt.target.value) }} /></span>
                <span onClick={connect}>连接</span>
            </div>
            <div className="mqtt-request-content">
                <div className="mqtt-connect-list">
                    <h2>连接列表</h2>
                    <ul>
                        {
                            clientList.map(client => {
                                return <li key={client.clientId}>{client.clientId} - {client.status ? "在线" : "离线"}</li>
                            })
                        }
                    </ul>
                </div>
                <div className="mqtt-subscribe-list">
                    <h2>订阅列表</h2>
                    <span>
                        <input placeholder="输入订阅topic" value={toAddTopic}
                            onChange={(evt) => { setToAddTopic(evt.target.value) }} />
                        <Button>添加订阅</Button>
                    </span>
                    <div>

                    </div>
                </div>
                <div className="mqtt-message">
                    <div className="mqtt-message-history">

                    </div>
                    <div className="mqtt-message-edit">

                    </div>
                </div>
            </div>
        </div>
    )


    function addTopic() {
        
    }

    function connect() {
        if (connectConfig.url.trim().length === 0 || connectConfig.passwd.trim().length === 0
            || connectConfig.name.trim().length === 0) {
            message.error("连接参数配置错误")
        }

        let result = window_.mqtt.connect(connectConfig)
        console.log(result);
    }

    function init() {
        // 监听连接状态
        window_.mqtt.handleConnect((event: any, connecteInfo: any) => {
            console.log(event, connecteInfo);
            let connect_list = Object.assign([], clientList)
            connect_list.push(connecteInfo)
            setClientList(connect_list)
            if (connecteInfo.status) {
                message.success("连接成功！")
            } else {
                message.error("连接失败！")
            }
            // 回应
            // event.reply('counter-value', "")

        })

        // 监听消息事件
        window_.mqtt.handleMessage((event: any, value: any) => {
            console.log(event, value);

            // 回应
            // event.reply('counter-value', "")

        })
    }

    function changeValue(name: string, value: string) {
        const newConnectConfig: any = Object.assign({}, connectConfig);
        newConnectConfig[name] = value
        setConnectConfig(newConnectConfig)
    }

}

export default MqttRequest