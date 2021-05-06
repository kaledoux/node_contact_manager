export class UI {
  constructor() {
    this.templates = TemplateEngine.buildTemplates();
    this.appShell = document.querySelector('.app_shell');
  }

  render(template, data) {
    const html = this.templates[template](data);
    this.appShell.innerHTML += html;
  }

  remove(element) {
    element.remove();
  }

  fillUpdateForm(contactObj) {
    const updateForm = document.querySelector('#update_contact_div'),
          form = updateForm.firstElementChild,
          contactKeys = Object.keys(contactObj);

    contactKeys.forEach(key => {
      let input = updateForm.querySelector(`input[id="${key}_update"]`);
      if (input) input.value = contactObj[key];
    });

    form.setAttribute('data-contactID', contactObj.id);
  }

  populateTagInterface(tagArray, form) {
    const html = this.templates.populateTags({'tags': tagArray}),
          tagDiv = document.createElement('div'),
          confirmationButton = form.querySelector('button');

    tagDiv.innerHTML = html;
    tagDiv.classList.add('tag_selections');
    form.appendChild(tagDiv);
  }

  show(...elements) {
    elements.forEach(ele => {
      ele.classList.remove('hidden');
    });
  }

  hide(...elements) {
    elements.forEach(ele => {
      ele.classList.add('hidden');
    });
  }
}

class TemplateEngine {
  static buildTemplates() {
    let templateObj = {};
    document.querySelectorAll("script[type='text/x-handlebars-template']")
      .forEach(template => {
        templateObj[template.getAttribute('id')] = Handlebars.compile(template.innerHTML);
      });
    document.querySelectorAll("[data-type=partial]").forEach(template => {
      Handlebars.registerPartial(template.id, template.innerHTML);
    });
    return templateObj;
  }
}
