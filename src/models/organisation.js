function initializeOrganisation(client, settings) {
  var Organisation = {};

  Organisation.getAll = function(userId) {
    return client.organisations.get()({
      query: {
        user: userId
      }
    });
  };

  Organisation.get = function(orgaId) {
    return client.organisations._.get(orgaId)();
  };

  Organisation.update = function(orga) {
    return client.organisations._.put(orga.id)(JSON.stringify(orga));
  };

  Organisation.create = function(orga) {
    return client.organisations.post()(JSON.stringify(orga));
  };

  Organisation.remove = function(orgaId) {
    return client.organisations._.remove(orgaId)();
  };

  Organisation.addMember = function(member, orgaId) {
    return client.organisations._.members.post(orgaId)(JSON.stringify(member));
  };

  Organisation.confirmMembership = function(params, orgaId) {
    return client.organisations._.members.post(orgaId)({
      query: params,
    });
  };

  Organisation.removeMember = function(memberId, orgaId) {
    return client.organisations._.members._.remove(orgaId, memberId)();
  };

  return Organisation;
}
