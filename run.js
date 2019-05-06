'use strict'

//const pull = require('pull-stream')
const createNode = require('./createNode')

function printAddrs (node, number) {
  console.log('node %s is listening on:', number)
  node.peerInfo.multiaddrs.forEach((ma) => console.log(ma.toString()))
}

// function print (protocol, conn) {
//   pull(
//     conn,
//     pull.map((v) => v.toString()),
//     pull.log()
//   )
// }

module.exports = () => { 
  console.log('called')
  
  return createNode('/ip4/0.0.0.0/tcp/0')
  .then(node => {
    printAddrs(node, '1')

    // node.handle('/print', print)

    node.once('peer:connect', (peer) => {
      console.log('connected to %s', peer.id.toB58String())

      node.pubsub.subscribe('yelling',
        (msg) => console.log(msg.from, msg.data.toString()),
        () => {}
      )

    const stdin = process.openStdin();

    stdin.addListener("data", function(i) {

      const input = i.toString().trim()
      console.log("you entered: [" + input + "]");

      node.pubsub.publish(
        'yelling',
        Buffer.from(input),
        () => {}
      )
    });


    })
  })
}