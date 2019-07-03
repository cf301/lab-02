'use strict';

const allCreatures = [];

const Creature = function(image_url, title, description, keyword, horns) {
  this.image_url = image_url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
  allCreatures.push(this);
};

Creature.prototype.renderWithJQuery = function() {
  const $newCreature = $('<section></section');

  const creatureTemplateHTML = $('#photo-template').html();

  $newCreature.html(creatureTemplateHTML);

  $newCreature.find('h2').text(this.title);
  $newCreature.find('img').attr('src', this.image_url);
  $newCreature.find('p').text(this.description);

  $('main').append($newCreature);
};

Creature.getCreaturesFromFile = function() {
  const filePath = 'data/page-1.json';
  const fileType = 'json';
  $.get(filePath, fileType).then( creatureJSON => {
    creatureJSON.forEach( item => {
      new Creature(item.image_url, item.title, item.description, item.keyword, item.horns);
    });
    allCreatures.forEach(item => {
      item.renderWithJQuery();
    });
  });
};

Creature.getCreaturesFromFile();
