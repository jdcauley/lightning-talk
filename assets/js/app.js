Messenger.options = {
  extraClasses: 'messenger-fixed messenger-on-top',
  theme: 'air'
}

io.socket.on("user", function(event){
  console.log(event.data);
  Messenger().post({
    message: event.data.firstname + ' ' + event.data.lastname + ' has signed up',
    type: "success"
  });

});

io.socket.get("/user", function(resData, jwres) {});

function labelMaker(){

  var target = 'input';

  function onInput() {
    var activeInput = document.activeElement;
    var theParent = activeInput.parentNode.childElementCount;
    if(activeInput && theParent < 2){
      var title = activeInput.getAttribute('placeholder');
      var inputLabel = document.createElement('label');
      inputLabel.innerHTML = title;
      activeInput.parentNode.insertBefore(inputLabel, activeInput);
    }
  }

  function isChanged() {
    this.className = this.className + " input-done";
    var theParent = this.parentNode;
    var theChildren = this.parentNode.children;
    for (var i = 0; i < theChildren.length; i++) {
      var child = theChildren[i].tagName;
      if(child === 'LABEL'){
        theParent.removeChild(theChildren[i]);
      }
    }
  }

  function hasLeft() {
    var theParent = this.parentNode;
    var theChildren = this.parentNode.children;
    for (var i = 0; i < theChildren.length; i++) {
      var child = theChildren[i].tagName;
      if(child === 'LABEL'){
        theParent.removeChild(theChildren[i]);
      }
    }
  }

  var inputs = document.getElementsByTagName(target);
  if (inputs) {
    for (var i = 0; i < inputs.length; i++){
      inputs[i].addEventListener("input", onInput, false);
      inputs[i].addEventListener("change", isChanged, false);
      inputs[i].addEventListener("focusout", hasLeft, false);
    }
  }
}

labelMaker();

function getFormParams(form){
  var params = [];
  var inputs = form.getElementsByTagName('input');
  params['action'] = form.action;
  for(var i = 0; i < inputs.length; i++){
    var name = inputs[i].getAttribute('name');
    var val = inputs[i].value;
    if(name){
      params[name] = val;
    }
  }
  return params;
}

function postUrlParams(params){
  var baseUrl = window.location.href;
  var urlParams = [];
  for (var prop in params) {
    if (params.hasOwnProperty(prop)) {
      var key = encodeURIComponent(prop),
      val = encodeURIComponent(params[prop]);
      if(key != 'action'){
        urlParams.push( key + "=" + val);
      }
    }
  }
  var postUrl = encodeURI(params.action + "?" + urlParams.join("&"));
  return postUrl;
}

function stop(event){
  event.preventDefault();
}

function formProcess(){
  console.log('click');
  var form = document.getElementById('socket-form');
  var params = getFormParams(form);

  io.socket.post('/user/create', {
    firstname: params.firstname,
    lastname: params.lastname,
    email: params.email
  }, function (data, jwres){

    Messenger().post({
      message: data.firstname + ' ' + data.lastname + ' has signed up',
      type: "success"
    });
    $(form).hide();
  });

}

function formSubmission(){

  var submit = document.getElementById('submit');

  submit.addEventListener('click', stop, false);
  submit.addEventListener('click', formProcess, false);

}
formSubmission();
