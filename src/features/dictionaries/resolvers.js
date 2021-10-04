const dictionaryResolvers = {
  Query: {
    typeList: async (_parent, _args, { dataSources }, _info) => {
      const typeList = await dataSources.dictionaryDb.getTypeList()
      return typeList
    },
    categoryList: async (_parent, _args, { dataSources }, _info) => {
      const categoryList = await dataSources.dictionaryDb.getCategoryList()
      return categoryList
    },
    countryList: async (_parent, _args, { dataSources }, _info) => {
      const categoryList = await dataSources.dictionaryDb.getCountryList()
      return categoryList
    },
    countyList: async (_parent, _args, { dataSources }, _info) => {
      const categoryList = await dataSources.dictionaryDb.getCountyList()
      return categoryList
    },
    cityList: async (_parent, _args, { dataSources }, _info) => {
      const categoryList = await dataSources.dictionaryDb.getCityList()
      return categoryList
    }
  }
}

module.exports = dictionaryResolvers
