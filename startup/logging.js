const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function() {
    // Handle uncaught exceptions
    winston.exceptions.handle(
        new winston.transports.Console({ colorize: true, prettyPrint: true }),
        new winston.transports.File({ filename: 'logs/uncaughtExceptions.log' })
    );

    // Log unhandled promise rejections
    process.on('unhandledRejection', (ex) => {
        throw ex; // Let winston handle it
    });

    // Add file transport for general logs
    winston.add(new winston.transports.File({ filename: 'logs/logfile.log' }));

    // Add MongoDB transport for info level logs
    winston.add(
        new winston.transports.MongoDB({
            db: process.env.MONGO_URI || 'mongodb://localhost/vidly',
            options: { useUnifiedTopology: true },
            level: 'info'
        })
    );
};
