export class TagManager {
  constructor(allContactsData) {
    this.tags = [];
    this.cacheTags(allContactsData);
  }

  splitTags(tagString) {
    return tagString.split(',');
  }

  allTags(){
    return this.tags;
  }

  forEachTag(callback) {
    this.tags.forEach(callback(tag));
  }

  cacheTags(allContactsData) {
    let newTagList = [];
    allContactsData.forEach(contact => {
      let tags = this.splitTags(contact.tags);
      tags.forEach(tag => {
        if (!newTagList.includes(tag) && tag.length > 0) {
          newTagList.push(tag);
        }
      });
    });
    this.tags = newTagList;
  }

  newTagList(base, term) {
    if (base === '') return term;

    let tagObj = {};
    base.split(',').forEach(tag => {
      tag = tag.trim().replace(/\s/g, '-');
      if (tagObj[tag] === undefined) tagObj[tag] = tag;
    });

    let newTagList = Object.keys(tagObj).join(',');
    return tagObj[term] ? newTagList : `${newTagList},${term}`;
  }

  removeTagFromList(base, term) {
    let cleanedString = '';
    base.split(',').forEach((tag, index) => {
      if (tag !== term) cleanedString += `${tag},`;
    });
    return cleanedString.slice(0, cleanedString.length - 1);
  }
}
