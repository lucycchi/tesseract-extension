// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

// let page = document.getElementById('buttonDiv');
// const kButtonColors = ['#3aa757', '#e8453c', '#f9bb2d', '#4688f1'];
// function constructOptions(kButtonColors) {
//   for (let item of kButtonColors) {
//     let button = document.createElement('button');
//     button.style.backgroundColor = item;
//     button.addEventListener('click', function () {
//       chrome.storage.sync.set({ color: item }, function () {
//         console.log('color is ' + item);
//       });
//     });
//     page.appendChild(button);
//   }
// }
// constructOptions(kButtonColors);

var dropbox = document.getElementById('dropbox');

dropbox.addEventListener('dragenter', noopHandler, false);
dropbox.addEventListener('dragexit', noopHandler, false);
dropbox.addEventListener('dragover', noopHandler, false);
dropbox.addEventListener('drop', drop, false);

function noopHandler(evt) {
  evt.stopPropagation();
  evt.preventDefault();
}
let exampleImage = "";
//'https://miro.medium.com/max/1848/1*iKHi4xjCBoj--cmCOdJxCw.png';

function drop(evt) {
  evt.stopPropagation();
  evt.preventDefault();
  var imageUrl = evt.dataTransfer.getData('text/html');
  //addMsg(imageUrl);
  // console.log("imageUrl", imageUrl);
  alert(imageUrl.match(/src=(.+?[\.jpg|\.gif|\.png]")/)[1])
  // console.log('imageURL-regex', imageUrl.match(/src=(.+?[\.jpg|\.gif|\.png]")/)[1])
  // exampleImage = imageUrl.match(/src=(.+?[\.jpg|\.gif|\.png]")/)[1]
  //exampleImage = new URL(exampleImage);
  //console.log("string to URL", exampleImage);
  // work();
}

//functionality for button
//create sendButton=traverse DOM and find button by ID: 'send-chat'
const sendButton = document.getElementById('send-chat')
//add event listener to sendButton, 1st arg= 'click', 2nd arg= callback: captures event and saves it as e, pass value property on e to the POST request as a string (this will be the text input from class=message-input)
sendButton.addEventListener('click', function (e) {
  //e->target->previousElementSibling->value
  console.log('input text-from button', e.target.previousElementSibling.value)
  exampleImage = e.target.previousElementSibling.value;
  work();
})

const worker = Tesseract.createWorker({
  logger: (m) => console.log(m),
});
Tesseract.setLogging(true);
//work(); //this calls the work function which calls tesseract

async function work() {
  await worker.load();
  await worker.loadLanguage('eng');
  await worker.initialize('eng');

  let result = await worker.detect(exampleImage);
  console.log('detect', result.data);

  result = await worker.recognize(exampleImage);
  console.log('recognize', result.data);
  console.log('recognize-text', result.data.text);
  addMsg(result.data.text);

  function addMsg(snippet) {
    let box = document.getElementById('box');
    let div = document.createElement('div');
    div.innerHTML = snippet;
    box.appendChild(div);
  }

  await worker.terminate();
}
