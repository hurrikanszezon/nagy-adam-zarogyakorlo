document.querySelector('.spaceship-list h1').innerHTML = 'Watto\'s Backyard Sale';
document.querySelector('#search-button').onclick = searchShip;


function makeSubtitle() {
  var newElement = document.createElement('h3');
  newElement.innerHTML = '...republic credits will do fine';
  document.querySelector('.spaceship-list').appendChild(newElement);
}


function moveIt(arr, oldIndex, newIndex) {
  if (newIndex >= arr.length) {
    var k = newIndex - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
  return arr;
}

function getInput() {
  var srcInput = document.querySelector('#search-text').value.toLowerCase();
  return srcInput;
}

function searchShip() {
  var target = document.querySelector('.infoContainer');
  var inputValue = getInput();
  var message = '';
  var found = false;
  var list = document.querySelectorAll('.shipBlock');
  for ( var k = 0; !found && k < list.length; k++) {
    if ( list[k].ship.model.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1) {
      found = true;
      message = objectToDisplay(list[k].ship);
      var newImg = makeImg(list[k].ship);
    } else {
      message = 'No sign of such vehicle, Sir!';
    }
  }
  target.innerHTML += message;
  target.appendChild(newImg);
}


function loadToSide() {
  document.querySelector('.infoContainer').innerHTML = this.innerHTML;
}


function sortAscByIntKey(array, key) {
  var b = array.length;
  while (b--) {
    for (var i = 0, j = 1; i < b; i++, j++) {
      if (array[i][key] === null) {
        moveIt(array, i, array.length - 1);
      }
      if (array[i].hasOwnProperty([key])) {
        if (parseInt(array[i][key], 10) > parseInt(array[j][key], 10)) {
          [array[i], array[j]] = [array[j], array[i]];
        }
      }
    }
  } return array;
}

function deleteByProperty(array) {
  for (var k = 0; k < array.length; k++) {
    if (array[k].consumables === null) {
      array.splice(k, 1);
      k--;
    }
  } return array;
}

function modifyToUnkown(array) {
  for (var k = 0; k < array.length; k++) {
    for (var j in array[k]) {
      if (array[k][j] === null) {
        array[k][j] = 'unknown';
      }
    }
  } return array;
}

function fillContainer(array) {
  var container = document.querySelector('.spaceship-list');
  for (var k = 0; k < array.length; k++) {
    var shipData = spaceShipBlock(array[k]);
    container.appendChild(shipData);
  }
}

function spaceShipBlock(ship) {
  var shipBlock = document.createElement('div');
  shipBlock.ship = ship;
  shipBlock.className = 'shipBlock';
  shipBlock.ondblclick = loadToSide;
  var message = `${objectToDisplay(ship)}`;
  var imgChild = makeImg(ship);
  shipBlock.innerHTML = message;
  shipBlock.appendChild(imgChild);
  return shipBlock;
}

function makeImg(ship) {
  var img = document.createElement('img');
  img.src = `/img/${ship.image}`;
  img.alt = `${ship.model}`;
  img.onerror = function (event) {
    event.target.src = '/img/buffering.gif';
  };
  return img;
}


function objectToDisplay(array) {
  var result;
  for (var k in array) {
    result += `${k}: ${array[k]} <br>`;
  } return result;
}

function countOneManShips(array, x) {
  var count = 0;
  for (var k = 0; k < array.length; k++) {
    if (parseInt(array[k].crew, 10) === x) {
      count++;
    }
  } return count;
}


function maxiestStat(array, key, keyTwo) {
  var max = array[0][key];
  var maxiest;
  for (var k = 0; k < array.length; k++) {
    if (parseInt(array[k][key], 10) > parseInt(max, 10)) {
      max = array[k][key];
      maxiest = array[k][keyTwo];
    }
  } return maxiest;
}


function sumUpPassegners(array) {
  var sum = 0;
  for (var k = 0; k < array.length; k++) {
    if (array[k].passengers !== 'unknown') {
      sum += parseInt(array[k].passengers, 10);
    }
  } return sum;
}


function showStat(array) {
  var message =
  `<h1>Stats</h1>
  One man ships: ${countOneManShips(array, 1)} <br>
  Holds the most useless stuff: ${maxiestStat(array, 'cargo_capacity', 'model')} <br>
  Sum of the folks they can carry: ${sumUpPassegners(array)} <br>
  <img src='/img/${maxiestStat(array, 'lengthiness', 'image')}'>`;
  document.querySelector('.statContainer').innerHTML = message;
}

function makeElement(element, className, destination) {
  var newElement = document.createElement(element);
  newElement.className = className;
  document.querySelector(destination).appendChild(newElement);
}


function getData(url, callbackFunc) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      callbackFunc(this);
    }
  };
  xhttp.open('GET', url, true);
  xhttp.send();
}


function successAjax(xhttp) {
  // Innen lesz elérhető a JSON file tartalma, tehát az adatok amikkel dolgoznod kell
  var userDatas = JSON.parse(xhttp.responseText);
  makeSubtitle();
  makeElement('div', 'infoContainer', '.one-spaceship');
  sortAscByIntKey(userDatas, 'cost_in_credits');
  deleteByProperty(userDatas);
  modifyToUnkown(userDatas);
  fillContainer(userDatas);
  makeElement('div', 'statContainer', '.spaceship-list');
  showStat(userDatas);
}

getData('/json/spaceships.json', successAjax);


/**
*
* @param {Array} listSource array of spaceships
*/
