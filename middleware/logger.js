const logger = (req, res, next) => {
    
    // Log the details to the console
    // [Date & Time] Method (GET/POST) URL Path
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    
   
    next(); 
};

module.exports = logger;