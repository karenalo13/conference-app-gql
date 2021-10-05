const { where, update } = require('ramda')
const { SQLDataSource } = require('../../utils/sqlDataSource')

class userDb extends SQLDataSource {

  
    async getUsers(id) {
        const data = await this.knex
          .select('AttendeeEmail')
          .from('Conference')
          .modify(this.generateWhereClause, filters)
          .orderBy('Id')
          .offset(page * pageSize)
          .limit(pageSize)
    
        return { values }
      }



    getUsers: new DataLoader(ids =>
        dbInstance
          .select('s.Id', 's.Name', 's.Nationality', 's.Rating', 'c.ConferenceId', 'c.isMainSpeaker')
          .from('ConferenceXSpeaker AS c')
          .innerJoin('Speaker AS s', 'c.SpeakerId', '=', 's.Id')
          .whereIn('c.ConferenceId', ids)
          .then(rows => ids.map(id => rows.filter(row => row.conferenceId === id)))
      )
    }

}

module.exports = userDb