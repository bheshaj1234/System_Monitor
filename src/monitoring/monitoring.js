const Service = require('../models/Service');
const MonitorLog = require('../models/MonitorLog');
const axios = require('axios');
const { sendAlertEmail } = require('../notifications/notifier');  
const socket = require("../socket");


const monitorServices = async () => {
  const services = await Service.find({ isActive: true }).populate("user");

  for (let service of services) {
    const startTime = Date.now();

    try {
      const res = await axios.get(service.url, { timeout: 5000 });
      const responseTime = Date.now() - startTime;

      console.log(`${service.name} is UP. Status: ${res.status}`);

      await MonitorLog.create({
        service: service._id,
        status: "UP",
        responseTime
      });

      service.lastStatus = "UP";
      service.lastCheckedAt = new Date();
      await service.save();

      // Emit real-time update to clients
      socket.getIO().emit("serviceStatusUpdate", {
        serviceId: service._id,
        name: service.name,
        status: "UP",
        responseTime,
        checkedAt: service.lastCheckedAt
      });

    } catch (err) {

      console.log(`${service.name} is DOWN. Error: ${err.message}`);

      await MonitorLog.create({
        service: service._id,
        status: "DOWN",
        responseTime: null
      });

      // alert only on first failure
      if (service.lastStatus !== "DOWN") {
        await sendAlertEmail(service.user.email, service);
      }

      service.lastStatus = "DOWN";
      service.lastCheckedAt = new Date();
      await service.save();

      // Emit real-time update to clients
      socket.getIO().emit("serviceStatusUpdate", {
        serviceId: service._id,
        name: service.name,
        status: "DOWN",
        responseTime: null,
        checkedAt: service.lastCheckedAt
      });
    }
  }
};

module.exports = monitorServices;
