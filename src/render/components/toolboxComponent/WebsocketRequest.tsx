import { useState } from "react";
import { Button, Input, message } from "antd";

import "./toolbox.css";

function WebsocketRequest() {
  const [wsUrl, setWsUrl] = useState("");
  const [ws, setWs] = useState<any>();
  const [toSendMsg, setToSendMsg] = useState("");
  return (
    <div className="websocket-container">
      <span>连接websocket： </span>
      <Input
        className="websocket-url-input"
        value={wsUrl}
        onChange={(evt) => changeValue(evt.target.value, "url")}
      />
      <Button onClick={connectWs}>连接</Button>
      <Button onClick={disconnectWs}>断开连接</Button>
      <div className="websocket-receiver-message"></div>

      <div className="websocket-tosend-message">
        <input
          onChange={(evt) => changeValue(evt.target.value, "toSend")}
        ></input>
      </div>
      <Button onClick={sendMessage}>发送</Button>
    </div>
  );

  function sendMessage() {
    if (ws) {
      ws.send(toSendMsg);
    }
  }

  function disconnectWs() {
    if (ws) {
      ws.close();
    }
  }

  function connectWs() {
    if (wsUrl.length === 0) {
      message.info("请输入websocket地址");
      return;
    }
    if (ws) {
      console.log(ws);

      message.info("websocket已连接");
      return;
    }

    let ws_ = new WebSocket(wsUrl);
    // 建立 web socket 连接成功触发事件
    ws_.onopen = function () {
      // 使用 send() 方法发送数据
      message.success("websocket连接成功");
      setWs(ws_);
    };

    // 接收服务端数据时触发事件
    ws_.onmessage = function (evt) {
      var received_msg = evt.data;
      console.log(received_msg);
    };

    // 断开 web socket 连接成功触发事件
    ws_.onclose = function () {
      message.info("websocket 已断开");
      setWs(null);
    };
  }

  function sendMsg(msg: string) {
    ws.send(msg);
  }

  function changeValue(value: string, type: string) {
    switch (type) {
      case "toSend":
        setToSendMsg(value);
        break;
      case "url":
        setWsUrl(value);
        break;
    }
  }
}

export default WebsocketRequest;
