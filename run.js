'use strict'

const pull = require('pull-stream')
const createNode = require('./createNode')

function printAddrs (node, number) {
  console.log('node %s is listening on:', number)
  node.peerInfo.multiaddrs.forEach((ma) => console.log(ma.toString()))
}

function print (protocol, conn) {
  pull(
    conn,
    pull.map((v) => v.toString()),
    pull.log()
  )
}

module.exports = () => { 
  console.log('called')
  
  return Promise.all([
      createNode('/ip4/0.0.0.0/tcp/0'),
      createNode('/ip4/0.0.0.0/tcp/0'),
    ])
  .then(nodes => {

    const node1 = nodes[0]
    const node2 = nodes[1]

    printAddrs(node1, '1')
    printAddrs(node2, '2')

    node1.handle('/print', print)
    node2.handle('/print', print)

    node1.once('peer:connect', (peer) => {
      console.log('connected to %s', peer.id.toB58String())

      node1.pubsub.subscribe('yelling',
        (msg) => console.log(msg.from, msg.data.toString()),
        () => {}
      )

    const stdin = process.openStdin();

    stdin.addListener("data", function(d) {

      const input = d.toString().trim()
      console.log("you entered: [" + input + "]");

      node2.pubsub.publish(
        'yelling',
        Buffer.from(input),
        () => {}
      )
    });


    })
  })
}