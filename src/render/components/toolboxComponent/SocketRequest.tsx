import { Button, message } from "antd";
import { useState } from "react";
import "./toolbox.css";

function SocketRequest() {
  const [msg, setMsg] = useState("");
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const window_: any = window;
  return (
    <div className="socket-request">
      <div>
        <span>
          服务器IP ：
          <input
            placeholder="请输入服务器IP"
            value={ip}
            onChange={(evt) => {
              changeValue(evt.target.value, "ip");
            }}
          ></input>
        </span>
      </div>
      <div>
        <span>
          服务器端口：
          <input
            placeholder="请输入服务器端口"
            value={port}
            onChange={(evt) => {
              changeValue(evt.target.value, "port");
            }}
          ></input>
        </span>
      </div>
      <div>
        <textarea
          placeholder="输入要发送的内容"
          value={msg}
          onChange={(evt) => {
            changeValue(evt.target.value, "msg");
          }}
        ></textarea>
      </div>
      <span>接收到的消息：</span>
      <div className="socket-request-receiver"></div>
      <Button onClick={socketSendMsg}>发送</Button>
    </div>
  );

  function changeValue(value: string, name: string) {
    switch (name) {
      case "msg":
        setMsg(value);
        break;
      case "ip":
        setIp(value);
        break;
      case "port":
        setPort(value);
        break;
    }
  }

  function socketSendMsg() {
    console.log("发送消息");
    // 检查ip与port以及内容是否为空
    if (ip === "" || ip.trim() === "" || port === "" || port.trim() === "" || msg === "" || msg.trim() === "" ) {
        message.error("配置信息有误，请重新配置！")
        return
    }

    window_.electron.socketConnect({ ip: ip, port: port, msg: msg });
  }
}

export default SocketRequest;
