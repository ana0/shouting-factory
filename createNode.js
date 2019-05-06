'use strict'

const PeerInfo = require('peer-info')
const MyBundle = require("./bundle")

const createNode = (addrs) => {
  if (!Array.isArray(addrs)) {
    addrs = [addrs]
  }

  let node

  return new Promise((res) => PeerInfo.create((err, peerInfo) => res(peerInfo)))
  .then(peerInfo => {
    //console.log(peerInfo)
    addrs.forEach((addr) => peerInfo.multiaddrs.add(addr))
    node = new MyBundle({ peerInfo })
    return new Promise((res) => node.start((err) => { if (err) { throw(err) } res(node) }))
  })
}

module.exports = createNode