const net = require("net");

function sendMsg(host, port, msg) {
  const client = new net.Socket();
  console.log(`connected to:${host}:${port}`);
  client.connect(port, host, () => {
    // 向服务端发送数据
    client.write(msg);
    client.end();
    //   // 收到服务端数据时
    //   client.on("data", (data) => {
    //     console.log(data.toString());
    //     client.write("客：已收到");
    //     // client.end(); // 主动关闭此次tcp长连接
    //   });
    //   // 客户端主动断连，触发自己的end事件
    //   client.on("end", () => {
    //     console.log("链接已主动断开");
    //   });
  });
}

module.exports = {
  sendMsg,
};
