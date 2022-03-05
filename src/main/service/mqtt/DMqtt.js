const mqtt = require("mqtt");

function MQClient(webContents, mqClientManage) {
    this.mqClientManage = mqClientManage
    this.webContents = webContents;
    this.topicList = []
    this.clientId = -1
}



MQClient.prototype.connect = function(url, userName, passwd) {
    console.log("测试连接", url, userName, passwd);
    let client = mqtt.connect(url, {
        username: userName,
        password: passwd
    })
    // console.log(this.client);
    client.on('connect', () => {
        console.log("lianjie");
        this.mqClientManage.push(client)
        this.clientId = this.mqClientManage.length
        this.webContents.send("handle-connect", {status: true, clientId: this.clientId})
    })
    client.on("error", (error) => {
        console.log(error.message, error.name);
        this.webContents.send("handle-connect", {status: false, clientId: this.clientId})
    })

    client.on('message', (topic, message) => {
        console.log(message.toString(), topic)
        this.webContents.send("handle-message", message)
    })
}

/**
 * 添加订阅
 */
MQClient.prototype.addTopic = function(topic) {
    this.topicList.push(topic)
}


MQClient.prototype.sendMessage = function(clientId, topic, message) {
    let client = this.clientContainer[clientId]
    if (client.connected) {
        client.publish(topic, message)
    }
}

module.exports = {
    MQClient
}