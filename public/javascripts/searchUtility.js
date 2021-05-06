export class SearchUtility {
  static searchByTerm(collection, term) {
    const matchingIDs = [];

    collection.forEach(contact => {
      if (SearchUtility.matchInContact(contact, term)) {
        matchingIDs.push(contact.id);
      }
    });

    return matchingIDs;
  }

  static matchInContact(contactObj, term) {
    let match = false;

    Object.keys(contactObj).forEach(key => {
      if (String(contactObj[key]).includes(term)) match = true;
    });

    return match;
  }
}
