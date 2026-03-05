const Service = require('../models/Service');

const checkServiceOwnership = async (req, res, next) => {
  
  const {id}= req.params; 

  const service = await Service.findById(id);    

    if (!service) {
        return res.status(404).json({ message: "Service not found" });
    }

    if (service.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
    }

    req.service = service; // Attach the service to the request object for downstream use
    next();
}

module.exports = checkServiceOwnership;