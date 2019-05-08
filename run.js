'use strict'

const createNode = require('./createNode')

function printAddrs (node, number) {
  console.log('node %s is listening on:', number)
  node.peerInfo.multiaddrs.forEach((ma) => console.log(ma.toString()))
}

module.exports = (peerId) => { 
  console.log('called')
  
  return createNode('/ip4/0.0.0.0/tcp/0')
  .then(node => {
    printAddrs(node, peerId)

    node.once('peer:connect', (peer) => {
      console.log('connected to %s', peer.id.toB58String())
      node.pubsub.subscribe('yelling',
        (msg) => { if (msg.from != node.peerInfo.id.toB58String()) {
          console.log(msg.from, msg.data.toString()) } },
        () => {}
      )
    })

    const stdin = process.openStdin();

    stdin.addListener("data", function(i) {
      const input = i.toString().trim()
      console.log("you entered: [" + input + "]");
      node.pubsub.publish(
        'yelling',
        Buffer.from(input.toUpperCase()),
        () => {}
      )
    });
  })
}



