// get selected checkboxes
function getSelectedChbox(frm) {
  var selchbox = [];// array that will store the value of selected checkboxes
  // gets all the input tags in frm, and their number
  var inpfields = frm.getElementsByTagName('input');
  var nr_inpfields = inpfields.length;
  // traverse the inpfields elements, and adds the value of selected (checked) checkbox in selchbox
  for(var i=0; i<nr_inpfields; i++) {
    if(inpfields[i].checked == true) selchbox.push(inpfields[i].value);
  }
  return selchbox;
}   

// set selected checkboxes
function setSelectedChbox(frm, arr) {
  console.log(arr);
  var selchbox = arr;// array that will store the value of selected checkboxes
  // gets all the input tags in frm, and their number
  var inpfields = frm.getElementsByTagName('input');
  var nr_inpfields = inpfields.length;
  // traverse the inpfields elements, and adds the value of selected (checked) checkbox in selchbox
  for(var i=0; i<nr_inpfields; i++) {
    if(inpfields[i].value == selchbox[0]){
      inpfields[i].checked = true;
      selchbox.splice(0,1);
    } 
  }
}   


// Saves options to chrome.storage.sync.
function save_options() {
  var frequency = document.getElementById('myRange').value;
  var appearance = getSelectedChbox(document.getElementById('view')) ;
  console.log(appearance);
  var content = getSelectedChbox(document.getElementById('content')) ;
  var category = getSelectedChbox(document.getElementById('category')) ;
  chrome.storage.sync.set({
    frequency: frequency,
    appearance: appearance,
    content: content,
    category: category
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value color = 'red' and likesColor = true.
  chrome.storage.sync.get({
    appearance: 'textImages',
    content: 'Informative Facts',
    category: 'Poaching',
    on: true,
    ads: 0
  }, function(items) {
    document.getElementById('myRange').value = items.frequency;
    setSelectedChbox( document.getElementById('view'),items.appearance);
    setSelectedChbox( document.getElementById('content'),items.content);
    setSelectedChbox( document.getElementById('category'),items.category);
    document.getElementById('earn').innerHTML = "You have helped donate: " +items.ads*5 + " cents!";

    if(items.on){
    document.getElementById("onoff").value = "Turn Off";
  } else {
    document.getElementById("onoff").value = "Turn On";
  }
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
    save_options);

document.getElementById('onoff').addEventListener('click',
    onOff);

var myInput = document.getElementById("myRange");
document.getElementById("freq").innerHTML = "1/week";

myInput.onchange = function(){
    console.log(this.value);
    var text = "";
    if(this.value ==0){
      text = "1/week";
    } else if (this.value == 25){
      text = "1/three days";
    }
    else if (this.value == 50){
      text = "1/day";
    }
    else if (this.value == 75){
      text = "Everytime you visit a new website";
    }
    else if (this.value == 100){
      text = "Everytime";
    }
   
    document.getElementById("freq").innerHTML = text;
}

function onOff(){
  var button = document.getElementById("onoff");
  var power;
  if(button.value == "Turn Off"){
    button.value = "Turn On";
    power = false;
  } else {
    button.value = "Turn Off";
    power = true;
  }

  chrome.storage.sync.set({
    on: power
  }, function() {
    
  });
}
//var x = document.getElementById("myRange").value;