export class ContactAPI {
  getAllContacts() {
    return fetch('http://localhost:3000/api/contacts')
    .then(response => response.json());
  }

  getContactByID(id) {
    return fetch(`http://localhost:3000/api/contacts/${id}`)
    .then(response => response.json());
  }

  addContact(encodedFormData) {
    return fetch('http://localhost:3000/api/contacts',
      { method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: encodedFormData
      })
    .then(response => response.json());
  }

  updateContact(id, encodedFormData) {
    return fetch(`http://localhost:3000/api/contacts/${id}`,
      { method: 'PUT',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: encodedFormData
      })
    .then(response => response.json());
  }

  deleteContact(id) {
    fetch(`http://localhost:3000/api/contacts/${id}`,
      {method: 'DELETE'}
    );
  }
}
