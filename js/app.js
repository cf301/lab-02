'use strict';
//array to hold all creatures
const allCreatures = [];

//constructor
const Creature = function(image_url, title, description, keyword, horns) {
  this.image_url = image_url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
  allCreatures.push(this);
};
//added render function
Creature.prototype.renderWithJQuery = function() {
  const $newCreature = $('<section></section');

  //find our place in the DOM
  const creatureTemplateHTML = $('#photo-template').html();
  $newCreature.html(creatureTemplateHTML);
  //populate these tags
  $newCreature.find('h2').text(this.title);
  $newCreature.find('h2').attr('id', this.title);

  $newCreature.find('img').attr('src', this.image_url);
  $newCreature.find('img').attr('alt', this.keyword);
  $newCreature.find('img').attr('width', '200');
  $newCreature.find('img').attr('height', '200');

  $newCreature.find('p').text(this.description);
  $newCreature.find('p').attr('id', this.keyword);

  //append
  $('main').append($newCreature);
};

Creature.getCreaturesFromFile = function() {
  const filePath = 'data/page-1.json';
  const fileType = 'json';
  //aysnc call to instantiate new creatures
  $.get(filePath, fileType).then( creatureJSON => {
    //iterate
    creatureJSON.forEach( item => {
      new Creature(item.image_url, item.title, item.description, item.keyword, item.horns);
    });
    //populate our drop down with all creatures
    populateDropDown();
    //iterate
    allCreatures.forEach(item => {
      //render each picture
      item.renderWithJQuery();
    });
  });
};


function populateDropDown() {
  //iterate
  allCreatures.forEach( item => {
    //new option object in HTML
    var o = new Option(item.keyword, item.keyword);
    //actual html text
    $(o).html(item.keyword);
    //finding our select HTml tag, and appending our new option
    $('select').append(o);
  });
}

//event handler on click (of select dropdown)
$( 'select' ).on('change', function() {
  //hide ALL images
  $('img').hide();
  $('h2').hide();
  $('p').hide();
  //iterate
  allCreatures.forEach( item => {
    //if keyword exactly matches CURRENT keyword
    if(item.keyword === $(this).val()) {
      //show only those images, h2s, and p's.
      $(`img[alt="${item.keyword}"]`).show();
      $(`h2[id="${item.title}"]`).show();
      $(`p[id="${item.keyword}"]`).show();
    }
  });
});

$(document).ready(function () {
  //grab our creatures from file, but not until page loads
  Creature.getCreaturesFromFile();
})
