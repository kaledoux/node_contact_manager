import {EventsHandler} from "./eventHandlers.js";
import {FormConverter} from "./formDataUtility.js";
import {TagManager} from "./tagManager.js";
import {ContactAPI} from "./contactManagerAPI.js";
import {UI} from "./userInterface.js";
import {SearchUtility} from "./searchUtility.js";

class Controller {
  constructor() {
    this.ui = new UI();
    this.api = new ContactAPI();
    this.formConverter = new FormConverter();
    this.buildTags();
    this.buildStartingUI();
  }

  bindListeners() {
    EventsHandler.bindSearchBar.call(this);
    EventsHandler.bindAppShellClicks.call(this);
    EventsHandler.bindFormSubmissions.call(this);
  }

  setUIProperties() {
    this.searchBar = document.querySelector('#search_bar');
    this.contactListUI = document.querySelector('#contact_card_holder');
    this.numberOfContacts = this.contactListUI.childElementCount;
    this.addForm = document.querySelector('#add_contact_div');
    this.updateForm = document.querySelector('#update_contact_div');
    this.noContacts = document.querySelector('#no_contacts');
  }

  async buildStartingUI() {
    await this.buildContactList();
    this.buildForm('add');
    this.buildForm('update');
    this.buildNoContacts();
    this.setUIProperties();
    this.hideStarting();
    this.bindListeners();
  }

  async buildTags() {
    await this.api.getAllContacts()
    .then(contactsArray => {
      this.tags = new TagManager(contactsArray);
    });
  }

  buildContactList() {
    return this.api.getAllContacts()
    .then(contactsArray => {
      this.ui.render('searchBar', {'tags': this.tags.allTags()});
      this.ui.render('contactList', {'contactsArray': contactsArray});
      this.contactList = contactsArray;
    });
  }

  buildForm(formType) {
    this.ui.render(`${formType}ContactForm`);
    const form = document.querySelector(`#${formType}_contact_div`);
    this.ui.populateTagInterface(this.tags.allTags(), form);
  }

  buildNoContacts() {
    this.ui.render('noContacts');
  }

  // API calls
  addNewContact(query) {
    this.api.addContact(query);
  }

  deleteContact(id) {
    const contact = document.querySelector(`div[data-contactID="${id}"]`);
    this.api.deleteContact(id);
    this.ui.remove(contact);
  }

  updateExistingContact(id, query) {
    this.api.updateContact(id, query);
  }

  // caches/controller updates
  async cacheTags() {
    await this.api.getAllContacts()
    .then(contactsArray => {
      this.tags.cacheTags(contactsArray);
    });
  }

  async updateContactList(queryString, id=null, update=false) {
    this.ui.remove(this.contactListUI);
    this.ui.remove(this.searchBar);

    if (update) {
      await this.updateExistingContact(id, queryString);
    } else {
      await this.addNewContact(queryString);
    }
    await this.cacheTags();
    await this.buildContactList();

    this.setUIProperties();
    this.hideStarting();
  }

  // Showing/Hiding:
  hideByID(idArray) {
    let toHide = [],
        toShow = [],
        contactCards = this.contactListUI.children;

    for (let i = 0; i < contactCards.length; i++) {
      let contactCard = contactCards[i];
      if (!idArray.includes(this.getContactCardID(contactCard))) {
        toHide.push(contactCard);
      } else {
        toShow.push(contactCard);
      }
    }

    this.ui.show(...toShow);
    this.ui.hide(...toHide);
  }

  hideForms() {
    this.ui.hide(this.addForm, this.updateForm);
    this.ui.show(this.searchBar, this.contactListUI);
  }

  hideStarting() {
    if (this.numberOfContacts > 1) {
      this.ui.hide(this.noContacts);
    } else {
      this.ui.hide(this.contactListUI);
    }
    this.hideForms();
  }

  refreshTagList() {
    [this.addForm, this.updateForm].forEach(form => {
      let currentTags = form.querySelector('div');
      this.ui.remove(currentTags);
      this.ui.populateTagInterface(this.tags.allTags(), form);
    });
  }

  showAddForm() {
    this.refreshTagList();
    this.ui.hide(this.searchBar, this.contactListUI);
    this.ui.show(this.addForm);
  }

  showUpdateForm(id) {
    this.refreshTagList();
    this.api.getContactByID(id)
    .then(contact => {
      this.ui.fillUpdateForm(contact);
      this.ui.hide(this.searchBar, this.contactListUI);
      this.ui.show(this.updateForm);
    });
  }

  // Utility methods
  getContactCardID(contactCard) {
    return Number(contactCard.getAttribute('data-contactID'));
  }

  searchContactsFor(term) {
    const matchingIDs = SearchUtility.searchByTerm(this.contactList, term);
    this.hideByID(matchingIDs);
  }
}

document.addEventListener('DOMContentLoaded', (event) => {
  const controller = new Controller();
});
