const bunyan = require('bunyan');
const Sentry = require('@sentry/node');
const PrettyStream = require('bunyan-prettystream');

const pick = require('./pick');
const SentryStream = require('./sentry-stream');
const SensitiveDataStream = require('./sensitive-stream');

const serializeRequest = (req) => {
    return pick(req, [
        'params', 'query', 'originalUrl', 'method', 'headers'
    ]);

};

const createLogger = (options) => {
    let loggerLevel = options.level || 'info';
    const config = {
        name: options.name || 'Development logger',
        level: loggerLevel,
        streams: [],
        serializers: {
            req: serializeRequest,
            res: bunyan.stdSerializers.res,
            err: bunyan.stdSerializers.err
        }
    };

    if (options.useBunyanPrettyStream) {
        const prettyStdOut = new PrettyStream();
        prettyStdOut.pipe(process.stdout);
        config.streams.push({ type: 'raw', level: loggerLevel, stream: prettyStdOut });
    } else if (options.useSensitiveDataStream) {
            config.streams.push({
        level: loggerLevel,
        stream: new SensitiveDataStream(options.sensitiveDataPattern)
    });
    } else {
        config.streams.push({level: loggerLevel, stream: process.stdout});
    }

    if (options.sentryDsn) {
        Sentry.init({
            dsn: options.sentryDsn,
            environment: options.environment
        });
        const sentryStream = new SentryStream(Sentry);
        config.streams.push(sentryStream);
    }

    return bunyan.createLogger(config)
};

module.exports = createLogger;
module.exports.Sentry = Sentry;