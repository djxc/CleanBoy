function DMqttManage() {
    this.clientContainer = []
}

DMqttManage.prototype.add = function(dmqtt) {
    this.clientContainer.push(dmqtt)
}

module.exports = {
    DMqttManage
}