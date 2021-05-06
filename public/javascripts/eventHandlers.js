// Events to be bound to Controller context
export class EventsHandler {
  static bindSearchBar() {
    document.addEventListener('input', event => {
      if (event.target.id === 'search_bar_input') {
        this.searchContactsFor(event.target.value);
      }
    });
  }

  static bindAppShellClicks() {
    document.querySelector('#app_shell').addEventListener('click', event => {
      const target = event.target,
            classes = target.classList;
      if (classes.contains('add_form_btn')) {
        this.showAddForm();
      }
      if (classes.contains('update_btn')) {
        const id = target.parentElement.getAttribute('data-contactID');
        this.showUpdateForm(id);
      }
      if (classes.contains('delete_btn')) {
        const contactID = target.parentNode.getAttribute('data-contactID');
        if (window.confirm('Do you really want to delete this contact?')) {
          this.deleteContact(contactID);
        }
      }
      if (classes.contains('cancel_btn')) {
        const form = target.parentElement;
        form.reset();
        this.hideForms();
      }
      if (classes.contains('tagFilter')) {
        const searchInput = document.querySelector('#search_bar_input');
        searchInput.value = target.innerText;
        let inputEvent = new Event('input', {bubbles: true});
        searchInput.dispatchEvent(inputEvent);
      }
      if (classes.contains('tag_buttons_form')) {
        const form = target.parentElement.previousElementSibling,
              tagInput = form.querySelector("input[name='tags']"),
              tagValue = target.innerText;
        let   inputValue = tagInput.value;

        if (classes.contains('tagged')) {
          classes.remove('tagged');
          tagInput.value = this.tags.removeTagFromList(inputValue, tagValue);
        } else {
          classes.add('tagged');
          tagInput.value = this.tags.newTagList(inputValue, tagValue);
        }
      }
      if (classes.contains('clearFilter')) {
        const searchInput = document.querySelector('#search_bar_input');
        searchInput.value = '';
        let inputEvent = new Event('input', {bubbles: true});
        searchInput.dispatchEvent(inputEvent);
      }
    });
  }

  static bindFormSubmissions() {
    document.addEventListener('submit', event => {
      event.preventDefault();
      const formID = event.target.getAttribute('id'),
            form = event.target,
            formData = new FormData(form),
            queryString = this.formConverter.convertFormDataToQueryString(formData),
            id = form.getAttribute('data-contactID');

      if (formID === 'add_contact_form') {
        this.updateContactList(queryString);
      } else if (formID === 'update_contact_form') {
        this.updateContactList(queryString, id, 'update');
      }
      form.reset();
      this.hideForms();
    });
  }
}
