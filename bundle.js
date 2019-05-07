'use strict'

const libp2p = require('libp2p')
const TCP = require('libp2p-tcp')
const SPDY = require('libp2p-spdy')
const MulticastDNS = require('libp2p-mdns')
const SECIO = require('libp2p-secio')
const defaultsDeep = require('@nodeutils/defaults-deep')

class Bundle extends libp2p {
  constructor (_options) {
    const defaults = {
      modules: {
        transport: [ TCP ],
        streamMuxer: [ SPDY ],
        connEncryption: [ SECIO ],
        peerDiscovery: [ MulticastDNS ]
      },
      config: {
        peerDiscovery: {
          mdns: {
            interval: 2000,
            enabled: true
          }
        },
        EXPERIMENTAL: {
          pubsub: true
        }
      },
    }

    super(defaultsDeep(_options, defaults))
  }
}

module.exports = Bundle