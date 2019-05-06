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
      //createNode('/ip4/127.0.0.1/tcp/20000/ws')
    ])
  .then(nodes => {
    //console.log(nodes)

    const node1 = nodes[0]
    const node2 = nodes[1]
    //const node3 = nodes[2]

    printAddrs(node1, '1')
    printAddrs(node2, '2')
    //printAddrs(node3, '3')

    node1.handle('/print', print)
    node2.handle('/print', print)
    //node3.handle('/print', print)

    // node1.dialProtocol(node2.peerInfo, '/print', (err, conn) => {
    //   if (err) { throw err }

    //   pull(pull.values(['node 1 dialed to node 2 successfully']), conn)
    // })

    // node2.dialProtocol(node1.peerInfo, '/print', (err, conn) => {
    //   if (err) { throw err }

    //   pull(pull.values(['node 2 dialed to node 1 successfully']), conn)
    // })

    node1.once('peer:connect', (peer) => {
      console.log('connected to %s', peer.id.toB58String())

      // Subscribe to the topic 'news'
      node1.pubsub.subscribe('news',
        (msg) => console.log(msg.from, msg.data.toString()),
        () => {
          setInterval(() => {
            // Publish the message on topic 'news'
            node2.pubsub.publish(
              'news',
              Buffer.from('Bird bird bird, bird is the word!'),
              () => {}
            )
          }, 1000)
        }
      )
  })
  })

  // parallel([
  //   (cb) => createNode('/ip4/0.0.0.0/tcp/0', cb),
  //   (cb) => createNode(['/ip4/0.0.0.0/tcp/0', '/ip4/127.0.0.1/tcp/10000/ws'], cb),
  //   (cb) => createNode('/ip4/127.0.0.1/tcp/20000/ws', cb)
  // ], (err, nodes) => {
  //   if (err) { throw err }

  //   const node1 = nodes[0]
  //   const node2 = nodes[1]
  //   const node3 = nodes[2]

  //   printAddrs(node1, '1')
  //   printAddrs(node2, '2')
  //   printAddrs(node3, '3')

  //   node1.handle('/print', print)
  //   node2.handle('/print', print)
  //   node3.handle('/print', print)

  //   node1.dialProtocol(node2.peerInfo, '/print', (err, conn) => {
  //     if (err) { throw err }

  //     pull(pull.values(['node 1 dialed to node 2 successfully']), conn)
  //   })

  //   node2.dialProtocol(node3.peerInfo, '/print', (err, conn) => {
  //     if (err) { throw err }

  //     pull(pull.values(['node 2 dialed to node 3 successfully']), conn)
  //   })

  //   node3.dialProtocol(node1.peerInfo, '/print', (err, conn) => {
  //     if (err) {
  //       console.log('node 3 failed to dial to node 1 with:', err.message)
  //     }
  //   })
  // })
}