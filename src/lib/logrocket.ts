// you can import these packages anywhere
const LogRocket = require('logrocket')
const setupLogRocketReact = require('logrocket-react')

// only initialize when in the browser
if (typeof window !== 'undefined') {
  LogRocket.init('wwsywf/rust-drills')
  // plugins should also only be initialized when in the browser
  setupLogRocketReact(LogRocket)
}
