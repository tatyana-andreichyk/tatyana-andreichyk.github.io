/* create requests */

class RequestUrlFirst{
  constructor(maxResults, question){
    this.daseUrl = 'https://www.googleapis.com/youtube/v3/';
    this.endpoint = 'search';
    this.key = 'AIzaSyD8q1D2wWD3UUwZOQid4kX7ofG3JDiFybU';
    this.type = 'video';
    this.part = 'snippet';
    this.maxResults = maxResults;
    this.question = question;
  }
  
  makeUrl(){
    return `${this.daseUrl + this.endpoint}?key=${this.key}&type=${this.type}&part=${this.part}&maxResults=${this.maxResults}&q=${this.question}`;  
  }
}

class RequestUrlSecond{
  constructor(stringOfIds){
    this.daseUrl = 'https://www.googleapis.com/youtube/v3/';
    this.endpoint = 'videos';
    this.key = 'AIzaSyD8q1D2wWD3UUwZOQid4kX7ofG3JDiFybU';
    this.stringOfIds = stringOfIds;
    this.part = 'snippet';
  } 
  
  makeUrl(){
    return `${this.daseUrl + this.endpoint}?key=${this.key}&id=${this.stringOfIds}&part=${this.part},statistics`;
  }
}


/* get response */

async function getResponse() {
  let requestUrlFirst = new RequestUrlFirst(15, searchBox.value).makeUrl();
  const responseFirst = await fetch(requestUrlFirst);
  const responseObjectFirst = await responseFirst.json();
  
  const itemsIdArray = [];
  responseObjectFirst.items.forEach(function(item) {
    let itemId = item.id.videoId;  
    itemsIdArray.push(itemId);
  });
  
  let requestUrlSecond = new RequestUrlSecond(itemsIdArray).makeUrl()
  const responseSecond = await fetch(requestUrlSecond);
  const responseObjectSecond = await responseSecond.json();
  
  const youTubeItemsArray = readResponse(responseObjectSecond);
  drawItems(youTubeItemsArray);
  drawButtons(youTubeItemsArray);
}


const searchBox = document.getElementById('search-input');

searchBox.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    getResponse();
  }
});
 
 
/* create item */ 

class YouTubeItem {
  constructor(id, title, thumbnail, description, author, date, viewRate) {
    this.id = id;
    this.title = title;
    this.thumbnail = thumbnail;
    this.description = description;
    this.author = author;
    this.date = date;
    this.viewRate = viewRate;
  }
}

function readResponse(data) {
  const itemsArray = [];
  data.items.forEach(function(item) {
    const youTubeItem = new YouTubeItem(item.id, item.snippet.title, item.snippet.thumbnails.medium.url, item.snippet.description, item.snippet.channelTitle, item.snippet.publishedAt.slice(0, 10), item.statistics.viewCount);
    itemsArray.push(youTubeItem);
  });
  return itemsArray;
}


/* draw search items */

const itemsContainer = document.querySelector('.search-items-container');

function drawItems(array) {
  if (array.length !== 0) {
    clearItemsContainer();
  } else {
    alert('Sorry, nothing has found!');
  }
  
  const fragment = document.createDocumentFragment();
  const itemTemplate = document.querySelector('#searchItemTemplate');

  array.forEach(function(item) {  
    const itemClone = itemTemplate.content.cloneNode(true);
    
    const currentItem = itemClone.querySelector('.item');
    currentItem.id = item.id;
    
    const itemThumbnail = itemClone.querySelector('.item-thumbnail');
    itemThumbnail.src = item.thumbnail;
    
    const itemTitle = itemClone.querySelector('.item-title');
    itemTitle.textContent = item.title;
    
    const itemAuthor= itemClone.querySelector('.item-author');
    itemAuthor.textContent = item.author;
    
    const itemPublicationDate = itemClone.querySelector('.item-publication-date');
    itemPublicationDate.textContent = item.date;
    
    const itemViewRate = itemClone.querySelector('.item-view-rate');
    itemViewRate.textContent = item.viewRate;
    
    const itemDescription = itemClone.querySelector('.item-description');
    itemDescription.textContent = item.description;  

    fragment.appendChild(itemClone);
  });
  itemsContainer.appendChild(fragment);
}

function clearItemsContainer() {
  while (itemsContainer.hasChildNodes()) {  
    itemsContainer.removeChild(itemsContainer.firstChild);
  }
}


/* draw buttons */

const buttonsContainer = document.querySelector('.radio-buttons-container');

function drawButtons(array) {
  clearButtonsContainer();
  const buttonsArray = countButtons(array);
  createButton(buttonsArray);
}


function countButtons(array) {
  if (innerWidth > 1361) { 
    const newArray = array.filter(function(item, index) {
      return index % 4 === 0;
    })
    return newArray;
  }  
  
  if (innerWidth < 1360 && innerWidth > 1021) { 
    const newArray = array.filter(function(item, index) {
      return index % 3 === 0;
    })
    return newArray;
  }
  
  if (innerWidth < 1020 && innerWidth > 701) { 
    const newArray = array.filter(function(item, index) {
      return index % 2 === 0;
    })
    return newArray;
  }
  
  if (innerWidth < 700 && innerWidth > 0) { 
    return array;
  }
}


function clearButtonsContainer() {
  while (buttonsContainer.hasChildNodes()) {  
    buttonsContainer.removeChild(buttonsContainer.firstChild);
  }
}

function createButton(array) {
  array.forEach(function(item, index) {
    const btn = document.createElement('a');
    btn.className = 'item-button';
    btn.href = '#' + item.id;
    btn.textContent = index + 1;
    buttonsContainer.appendChild(btn);
  });
}