# Vayo's Logger for NodeJS Apps

This is a simple logger setup using Bunyan + Sentry (optional)

<!-- TOC depthFrom:2 -->
- [Installation](#installation)
- [Configuration](#configuration)
- [Use](#use)
<!-- /TOC -->


## Installation

```bash
npm install --save @vayo/logger
```

## Configuration

createLogger accepts an option object with the following keys:

```
{
level: 'info', // minimal log level to print
useBunyanPrettyStream: true, // pretty print bunyan events
useSensitiveDataStream: true, // strip certain sensitive keys (see sensitiveDataPattern)
sensitiveDataPattern: "(secret|.*token|passw(?:or)?d",
sentryDsn: 'xxxxxx', // Sentry DSN
environment: 'production' // used by Sentry
}
```

## Use

```javascript
'use strict';

const createLogger = require('@vayo/logger');

const logger = createLogger({
level: 'warn',
sentryDsn: 'http://xxxxxx.sentry.com',
environment: 'production'
});


/* 
From here on - this is just plain Bunyan
*/

logger.fatal({ err: new Error('Something bad happened'), requestId: '1234567890' }, 'Failed to complete task');
logger.debug({ user }, 'User logged in');


```