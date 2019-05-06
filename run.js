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
    //const node3 = nodes[2]

    printAddrs(node1, '1')
    printAddrs(node2, '2')
    //printAddrs(node3, '3')

    node1.handle('/print', print)
    node2.handle('/print', print)

    node1.once('peer:connect', (peer) => {
      console.log('connected to %s', peer.id.toB58String())

      // Subscribe to the topic 'news'
      node1.pubsub.subscribe('news',
        (msg) => console.log(msg.from, msg.data.toString()),
        () => {
        //   setInterval(() => {
        //     // Publish the message on topic 'news'
        //     node2.pubsub.publish(
        //       'news',
        //       Buffer.from('Bird bird bird, bird is the word!'),
        //       () => {}
        //     )
        //   }, 1000)
        }
      )

    const stdin = process.openStdin();

    stdin.addListener("data", function(d) {
      // note:  d is an object, and when converted to a string it will
      // end with a linefeed.  so we (rather crudely) account for that  
      // with toString() and then trim() 
      console.log("you entered: [" + 
          d.toString().trim() + "]");

      node2.pubsub.publish(
        'news',
        Buffer.from('Bird bird bird, bird is the word!'),
        () => {}
      )
    });


    })
  })
}