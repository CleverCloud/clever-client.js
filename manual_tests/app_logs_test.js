import { ApplicationLogStream } from '../esm/streams/application-logs.js';
import {tokens, appId, ownerId} from '../tokens.js'

const apiHost = 'https://api.clever-cloud.com'
const logStream = new ApplicationLogStream({
    apiHost,
    tokens,
    ownerId,
    appId,
    since: new Date('2023-07-25T00:23:08.602Z'),
    retryConfiguration: {
        enabled: true,
        maxRetryCount: 2
    },
    //until: new Date(),
    //service: ['bas.service', 'bas-deploy.service'],
    //limit: 100,
    //deploymentId:
    //instanceId: ['35fc3d00-110e-4f5a-8c4d-ebf56884424f'],
    //filter:
    //field: ['date', 'service', 'message']
    //throttleElements:
    //throttlePerInMilliseconds:
})

logStream
    .on('open', (event) => console.debug('stream opened!', event))
    .on('error', (event) => console.log('RETRYABLE_ERROR', event.error))
    .onLog((log) => console.log(log.date, log.message))

logStream.start()
  .then((reason) => console.info('OK', reason)) // -> FIN
  .catch((error) => console.error('FATAL_ERROR', error)) // -> FIN alternative
  .then(() => {
    console.log("c'est fini")
  })

//setInterval(() => { console.log({test: logStream.promise}) }, 1000)

setTimeout(() => { logStream.pause(); console.log('paused') },   1000)
setTimeout(() => { logStream.resume(); console.log('resumed') }, 5000)

setTimeout(() => { logStream.close('END')},   7000)


//.pause() // abort controller -> keep start() promise
//.resume() // reset controller -> fetch() ->  keep start() promise
