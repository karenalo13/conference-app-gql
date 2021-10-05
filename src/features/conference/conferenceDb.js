const { where, update } = require('ramda')
const { SQLDataSource } = require('../../utils/sqlDataSource')

const conferenceColumns = ['Id', 'Name', 'ConferenceTypeId', 'LocationId', 'StartDate', 'EndDate', 'CategoryId']
class ConferenceDb extends SQLDataSource {
  generateWhereClause(queryBuilder, filters = {}) {
    const { startDate, endDate, organizerEmail } = filters
    if (startDate) queryBuilder.andWhere('StartDate', '>=', startDate)
    if (endDate) queryBuilder.andWhere('EndDate', '<=', endDate)
    if (organizerEmail) queryBuilder.andWhere('OrganizerEmail', organizerEmail)
  }

  async getConferenceList(pager, filters) {
    const { page, pageSize } = pager
    const values = await this.knex
      .select(...conferenceColumns)
      .from('Conference')
      .modify(this.generateWhereClause, filters)
      .orderBy('Id')
      .offset(page * pageSize)
      .limit(pageSize)

    return { values }
  }

  async getConferenceListTotalCount(filters) {
    return await this.knex('Conference').count('Id', { as: 'TotalCount' }).modify(this.generateWhereClause, filters).first()
  }

  async getConferenceById(id) {
    const result = await this.knex()
      .select(...conferenceColumns)
      .from('Conference')
      .where('id', id)
      .first()
    return result
  }

  async updateConferenceXAttendee({ attendeeEmail, conferenceId, statusId }) {
    const existing = await this.knex
      .select('Id', 'AttendeeEmail', 'ConferenceId')
      .from('ConferenceXAttendee')
      .where('AttendeeEmail', attendeeEmail)
      .andWhere('ConferenceId', conferenceId)
      .first()

    const updateAttendee = {
      AttendeeEmail: attendeeEmail,
      ConferenceId: conferenceId,
      StatusId: statusId
    }
    let result
    if (existing?.id) {
      //update
      result = await this.knex('ConferenceXAttendee').update(updateAttendee, 'StatusId').where('Id', existing?.id)
    } else {
      //insert
      result = await this.knex('ConferenceXAttendee').returning('statusId').insert(updateAttendee)
    }
    return result[0]
  }




  async updateLocation(location) {
    const content = {
      Name: location.name,
      Address: location.address,
      Latitude: location.latitude,
      Longitude: location.longitude,
      CityId: parseInt(location.cityId),
      CountyId: parseInt(location.countyId),
      CountryId: parseInt(location.countryId)
    }

    const output = ['Id', 'Name', 'Address', 'Latitude', 'Longitude', 'CityId', 'CountyId', 'CountryId']

    let result
    if (location.id) {
      result = await this.knex('Location').update(content, output).where('Id', location.id)
    } else result = await this.knex('Location').returning(output).insert(content)

    return result[0]
  }

  async updateConference({ id, name, startDate, endDate, location, category, type, organizerEmail }) {
    const content = {
      Name: name,
      OrganizerEmail: organizerEmail,
      StartDate: startDate,
      EndDate: endDate,
      LocationId: parseInt( location.id),
      CategoryId:parseInt( category.id),
      ConferenceTypeId: parseInt(type.id)
    }

    const output = ['Id', 'Name', 'OrganizerEmail', 'StartDate', 'EndDate', 'ConferenceTypeId', 'LocationId', 'CategoryId']

    let result
    if (id) {
      result = await this.knex('Conference').update(content, output).where('Id', id)
    } else {
      result = await this.knex('Conference').returning(output).insert(content)
    }
    return result[0]
  }

  async updateSpeaker(speaker) {
    const content = {
      Name: speaker.name,
      Nationality: speaker.nationality,
      Rating:  parseFloat(speaker.rating)
    }
    const output = ['Id', 'Name', 'Nationality', 'Rating']
    let result
    if (parseInt(speaker.id) > 0) {
      result = await this.knex('Speaker').update(content, output).where('Id', speaker.id)
    } else {
      result = await this.knex('Speaker').returning(output).insert(content)
    }
    return result[0]
  }

  async updateConferenceXSpeaker({speakerId, isMainSpeaker, conferenceId}) {
    const current = await this.knex()
      .select('Id')
      .from('ConferenceXSpeaker')
      .where('SpeakerId', speakerId)
      .andWhere('ConferenceId', conferenceId)

    let result
    if (current.id) {
      result = await this.knex('ConferenceXSpeaker')
        .update({ IsMainSpeaker: Boolean(isMainSpeaker) }, 'IsMainSpeaker')
        .where('Id', current.id)
    } else {
      result = await this.knex('ConferenceXSpeaker')
        .returning('IsMainSpeaker')
        .insert({ SpeakerId: parseInt(speakerId), IsMainSpeaker: Boolean(isMainSpeaker), ConferenceId:  parseInt(conferenceId) })
    }
    return result[0]
  }

  async deleteSpeakers(speakerIds){
    await this.knex('ConferenceXSpeaker').whereIn('SpeakerId',speakerIds).del()
    await this.knex('Speaker').whereIn('Id',speakerIds).del()
  }

}

module.exports = ConferenceDb
