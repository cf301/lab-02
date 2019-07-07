'use strict';
//array to hold all creatures
const allCreatures = [];

//constructor
const Creature = function(image_url, title, description, keyword, horns, page) {
  this.image_url = image_url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
  this.page = page;
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
  $newCreature.find('h2').attr('class', this.page);

  $newCreature.find('img').attr('src', this.image_url);
  $newCreature.find('img').attr('alt', this.keyword);
  $newCreature.find('img').attr('width', '200');
  $newCreature.find('img').attr('height', '200');
  $newCreature.find('img').attr('class', this.page);

  $newCreature.find('p').text(this.description);
  $newCreature.find('p').attr('id', this.keyword);
  $newCreature.find('p').attr('class', this.page);

  //append
  $('main').append($newCreature);
};

//this is a prototype function, are we calling it right?

Creature.prototype.renderWithHandlebars = function() {
  const source = $('#creature-template').html();
  const template = Handlebars.compile(source);

  //was this, changed to hardcode to see if anything works
  const newHTML = template(this);
  //change from #photo-template
  $('#proof').append(newHTML);
};

Creature.getCreaturesFromFile = function(filePath, page) {
  const fileType = 'json';
  //aysnc call to instantiate new creatures
  $.get(filePath, fileType).then( creatureJSON => {
    //iterate
    creatureJSON.forEach( item => {
      new Creature(item.image_url, item.title, item.description, item.keyword, item.horns, page);
    });
    //populate our drop down with all creatures
    populateDropDown();
    //iterate
    render(page);
    // allCreatures.forEach(item => {
    //   //render each picture
    //   item.renderWithJQuery();
    // });
  });
};

//only render images for that page
//TODO - still rendering page 1 + page 1 + page 2 times
function render(page){

  allCreatures.forEach(item => {
    //render each picture
    if(item.page === page){
      //render here with jquery
      //item.renderWithJQuery();
      //render here with handlebars
      item.renderWithHandlebars();
    }
  });
}

//renders all creatures for page one and page two
function renderAll(){
  allCreatures.forEach(item => {
    //render here with handlebars
    item.renderWithHandlebars();
  });
}

function populateDropDown() {
  //iterate
  allCreatures.forEach( item => {
    // if the option doesn't already exist
    if ( ! $(`select option[value= ${item.keyword}]`).length > 0 ) {
      //new option object in HTML
      var o = new Option(item.keyword, item.keyword);
      //actual html text
      $(o).html(item.keyword);
      //finding our select HTml tag, and appending our new option
      $('select').append(o);
    }
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

//show and hide by page number
$('#one').click(function() {
  $('.one').show();
  $('.two').hide();
});
$('#two').click(function() {
  $('.two').show();
  $('.one').hide();
});

//sort functions
const sortByAlpha = arr => arr.sort((a,b) => a.title.localeCompare(b.title) );

const sortByHorn = (arr) => {
  return arr.sort( (a,b) => a.horns-b.horns);
};

//sort functions on click
$('#btnSortAlpha').click(function() {
  //TODO: maybe make a second array here and save the return. If the changes don't save on all creatures, because arrays are by reference.
  //sort on array
  sortByAlpha(allCreatures);

  //clear html
  clearHTML();

  //call our render again
  renderAll();
});

$('#btnSortHornNum').click(function() {
  //sort on array
  sortByHorn(allCreatures);

  //clear html  
  clearHTML();

  //call our render again
  renderAll();
});

function clearHTML() {
  let creatureContainer = document.getElementById('proof');
  creatureContainer.innerHTML = '';
}

$(document).ready(function () {
  //default on page load to page one
  Creature.getCreaturesFromFile('data/page-1.json', 'one');
  Creature.getCreaturesFromFile('data/page-2.json', 'two');
})
