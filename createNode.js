'use strict'

const PeerInfo = require('peer-info')
const Bundle = require("./bundle")

const createNode = (addr) => {
  let node

  return new Promise((res) => PeerInfo.create((err, peerInfo) => res(peerInfo)))
  .then(peerInfo => {
    peerInfo.multiaddrs.add(addr)
    node = new Bundle({ peerInfo })
    return new Promise((res) => node.start((err) => { if (err) { throw(err) } res(node) }))
  })
}

module.exports = createNode