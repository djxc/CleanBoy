const VectorTile = require("@mapbox/vector-tile").VectorTile;
const Protobuf = require("pbf");
const zlib = require("zlib");
const { service } = require("../../util/service");
const fs = require("fs")

function parseVT() {
    const data = fs.readFileSync(__dirname + "/multipolygon.pbf");

//   service
//     .get(
//       "http://localhost/pbf/zero-line.pbf"
//     )
//     .then((data) => {
//         console.log(data);
//         let tile = new VectorTile(new Protobuf(data));
//         console.log(tile.layers);
//     //   zlib.gunzip(data, function (err, buffer) {
//     //   });
//     })
//     .catch((error) => {
//       console.log(error);
//     });
// java.lang.reflect.InvocationTargetException
// 	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
// 	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
// 	at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
// 	at java.base/java.lang.reflect.Method.invoke(Method.java:566)
// 	at com.geesatcom.smmp.quartz.util.JobInvokeUtil.invokeMethod(JobInvokeUtil.java:53)
// 	at com.geesatcom.smmp.quartz.util.JobInvokeUtil.invokeMethod(JobInvokeUtil.java:31)
// 	at com.geesatcom.smmp.quartz.util.QuartzDisallowConcurrentExecution.doExecute(QuartzDisallowConcurrentExecution.java:16)
// 	at com.geesatcom.smmp.quartz.util.AbstractQuartzJob.execute(AbstractQuartzJob.java:40)
// 	at org.quartz.core.JobRunShell.run(JobRunShell.java:202)
// 	at org.quartz.simpl.SimpleThreadPool$WorkerThread.run(SimpleThreadPool.java:573)
// Caused by: java.lang.NullPointerException
// 	at com.geesatcom.smmp.service.impl.basic.ShipInfoFacadeImpl.getPortNameByShipInfo(ShipInfoFacadeImpl.java:139)
// 	at com.geesatcom.smmp.service.impl.basic.ShipInfoFacadeImpl.queryById(ShipInfoFacadeImpl.java:128)
// 	at com.geesatcom.smmp.service.impl.basic.ShipInfoFacadeImpl$$FastClassBySpringCGLIB$$c48db921.invoke(<generated>)
// 	at org.springframework.cglib.proxy.MethodProxy.invoke(MethodProxy.java:218)
// 	at org.springframework.aop.framework.CglibAopProxy$DynamicAdvisedInterceptor.intercept(CglibAopProxy.java:688)
// 	at com.geesatcom.smmp.service.impl.basic.ShipInfoFacadeImpl$$EnhancerBySpringCGLIB$$7d73f62b.queryById(<generated>)
// 	at com.geesatcom.smmp.schedule.ShipOnlineSchedule.sendWs(ShipOnlineSchedule.java:126)
// 	at com.geesatcom.smmp.schedule.ShipOnlineSchedule.go(ShipOnlineSchedule.java:113)
// 	... 10 more
// java.lang.reflect.InvocationTargetException
// 	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
// 	at java.base/jdk.internal.reflect.NativeMethodAccessorImpl.invoke(NativeMethodAccessorImpl.java:62)
// 	at java.base/jdk.internal.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
// 	at java.base/java.lang.reflect.Method.invoke(Method.java:566)
// 	at com.geesatcom.smmp.quartz.util.JobInvokeUtil.invokeMethod(JobInvokeUtil.java:53)
// 	at com.geesatcom.smmp.quartz.util.JobInvokeUtil.invokeMethod(JobInvokeUtil.java:31)
// 	at com.geesatcom.smmp.quartz.util.QuartzDisallowConcurrentExecution.doExecute(QuartzDisallowConcurrentExecution.java:16)
// 	at com.geesatcom.smmp.quartz.util.AbstractQuartzJob.execute(AbstractQuartzJob.java:40)
// 	at org.quartz.core.JobRunShell.run(JobRunShell.java:202)
// 	at org.quartz.simpl.SimpleThreadPool$WorkerThread.run(SimpleThreadPool.java:573)
// Caused by: org.influxdb.InfluxDBException$DatabaseNotFoundException: database not found: "ocean"
// 	at org.influxdb.InfluxDBException.buildExceptionFromErrorMessage(InfluxDBException.java:138)
// 	at org.influxdb.InfluxDBException.buildExceptionForErrorState(InfluxDBException.java:173)
// 	at org.influxdb.impl.InfluxDBImpl.execute(InfluxDBImpl.java:837)
// 	at org.influxdb.impl.InfluxDBImpl.write$original$LazFhKDv(InfluxDBImpl.java:470)
// 	at org.influxdb.impl.InfluxDBImpl.write$original$LazFhKDv$accessor$1yM5jV4X(InfluxDBImpl.java)
// 	at org.influxdb.impl.InfluxDBImpl$auxiliary$b472mnV2.call(Unknown Source)
// 	at org.apache.skywalking.apm.agent.core.plugin.interceptor.enhance.InstMethodsInter.intercept(InstMethodsInter.java:86)
// 	at org.influxdb.impl.InfluxDBImpl.write(InfluxDBImpl.java)
// 	at com.geesatcom.smmp.dao.InfluxDao.writeBatch(InfluxDao.java:60)
// 	at com.geesatcom.smmp.service.shipreport.ShipStatusForInfluxServiceImpl.statisticsShipVoyage(ShipStatusForInfluxServiceImpl.java:228)
// 	at com.geesatcom.smmp.schedule.ShipVoyageSumSchedule.go(ShipVoyageSumSchedule.java:30)
// 	... 10 



}

module.exports = {
  parseVT,
};
