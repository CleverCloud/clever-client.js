function initializeOrganisation(client, settings) {
  var Organisation = {};

  Organisation.getAll = function(userId) {
    return client.organisations.get()({
      query: {
        user: userId
      }
    }).map(JSON.parse).mapError(JSON.parse);
  };

  Organisation.get = function(orgaId) {
    return client.organisations._.get(orgaId)().map(JSON.parse).mapError(JSON.parse);
  };

  Organisation.update = function(orga) {
    return client.organisations._.put(orga.id)(JSON.stringify(orga)).mapError(function(x) {
      console.log(x);
      return x;
    }).map(JSON.parse).mapError(JSON.parse);
  };

  Organisation.create = function(orga) {
    return client.organisations.post()(JSON.stringify(orga)).map(JSON.parse).mapError(JSON.parse);
  };

  Organisation.remove = function(orgaId) {
    return client.organisations._.remove(orgaId)().map(JSON.parse).mapError(JSON.parse);
  };

  Organisation.addMember = function(member, orgaId) {
    return client.organisations._.members.post(orgaId)(JSON.stringify(member)).map(JSON.parse).mapError(JSON.parse);
  };

  Organisation.confirmMembership = function(params, orgaId) {
    return client.organisations._.members.post(orgaId)({
      query: params,
    }).map(JSON.parse).mapError(JSON.parse);
  };

  Organisation.removeMember = function(memberId, orgaId) {
    return client.organisations._.members._.remove(orgaId, memberId)().map(JSON.parse).mapError(JSON.parse);
  };

  return Organisation;
}
