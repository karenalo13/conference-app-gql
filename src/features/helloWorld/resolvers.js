const helloWorldResolvers = {
  Query: {
    myFirstEndpoint: async (_parent, _arguments, _context, _info) => {
      return 'Hello World!👋 from server'
    }
  }
}

module.exports = helloWorldResolvers
