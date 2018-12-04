var liststate = {};
let pattern01=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
// let clicked;
let currbar = 0;
let Bars = 16;
let clicked;
let polly;
let seqarr = [];
let height = -1;
let width = -1;
let synth = '';
let tempo = 120;
let globalTick = 0;
let thisNote = 1;
let userNo = 0;
let id = 0;
let checkId = false;
let arrayrecieved = false;
let clientCounter = 0;
let currMetroPos = -1;
let inputActive = false;
let rapURL;
let focusedElement;
let rapped = [];
let pollyArr = [];
let volume = 0.3;

let currfeedback = 0;

let sampleURL = [];

let currsec = 0;
let currmin = 0;
let lyricsArr = [];


let thisnotationArr = []
let soundsToPlay = 0;
let addRemove = '';



function speakThis(utterText, cell, voice,){

  // console.log("utterText", utterText);

  let params = {
    OutputFormat: "mp3",
    Text: utterText,
    TextType: "text",
    VoiceId: voice
  };

  polly.synthesizeSpeech(params, function(err, data){
    if (err){
      console.log(err);
    } else {
      let uInt8Array = new Uint8Array(data.AudioStream);
      let arrayBuffer = uInt8Array.buffer;
      let blob = new Blob([arrayBuffer]);
      let url = URL.createObjectURL(blob);

      // sampleURL[cell].push(url);
      // sampleURL[cell] = url;
      liststate[cell-1].pollyURL = url;
      // console.log(liststate[cell-1].pollyURL);

      // let audio = document.getElementsByTagName("audio")[0];
      // audio.src = url;
      // audio.play();
    }
  });

}


function rapThis(utterText, voice){


  let params = {
    OutputFormat: "mp3",
    Text: utterText,
    TextType: "text",
    VoiceId: voice
  };

  polly.synthesizeSpeech(params, function(err, data){
    if (err){
      console.log(err);
    } else {
      let uInt8Array = new Uint8Array(data.AudioStream);
      let arrayBuffer = uInt8Array.buffer;
      let blob = new Blob([arrayBuffer]);
      let url = URL.createObjectURL(blob);
      rapURL = url;
    }
  });
}


let audio = new AudioContext();


for (let i = 0; i < width*height; i++){
  //seqarraystate[i] = [];
  // let polly[i] = new AWS.Polly();

  liststate[i] = {instrument: '',
  color: 'white',
  activated: 0,
  serverUID: 0,
  pollyURL: 0
};

}

console.log("liststate initialized")

//////

function buildArrayForGridState(liststate, synth, i, bool, innerContent){

  if ( (liststate[i-1].activated!==1) && (bool)){
    liststate[i-1].activated = 1; // activate cell
    // liststate[i-1].instrument = innerContent;
    liststate[i-1].color = synth;
    liststate[i-1].text = innerContent;

  }else {
    liststate[i-1].activated = 0;
  }
  return liststate;
}



$.ajax({
  url: "/GetGridSize",
  context: document.body
}).done(function(data) {
  // width = data.width;
  // height = data.height;
  // seqarr = data.array;
  // userNo = data.userNumber;
  //
  width = Bars;
  height = 6;
  seqarr = data.array;
  userNo = 1;

  AWS.config.region = 'us-west-2';
  AWS.config.accessKeyId = data.accessKey;
  AWS.config.secretAccessKey = data.secretAccessKey;


  polly = new AWS.Polly();

  //repeated event every 8th note
  Tone.Transport.bpm.value = 90;
  Tone.Transport.swing.value = .4 ,
  Tone.Transport.start();


  init();


  function assignColor(){
    if (userNo == 0){
      synth = 'white';
      //console.log('you are ', synth);
    }

    if (userNo == 1){
      synth = 'red';
      // console.log('you are ', synth);
    }
  }

  assignColor();
  // document.body.appendChild(grid);
});



function init(){
  console.log("init");
  let grid = clickableGrid(height,width, function(element,row,col,i){
  });


}


for (i = 0 ; i < 300 ; i++){
  thisnotationArr[i] = false;
}


function rapButton() {




  rm = new RiMarkov(2);
  rm.loadText(lyrics);
  sentences = rm.generateSentence();

  rapped.push(sentences);


  let div = document.getElementById('seq');


  let currLine = rapped.length-2;
  let thispar = rapped[currLine];

  // console.log("thispar",thispar);
  if (thispar!= undefined){
    let para = document.createElement("p");
    para.className = 'para-rap';
    let node = document.createTextNode(thispar);
    para.appendChild(node);
    let element = document.getElementById("rappar");
    element.appendChild(para);
  }



  rapThis(sentences, 'Matthew');
  let thisURL = rapURL;
  let audio = document.getElementsByTagName("audio")[0];
  let snd7  = new Audio();
  snd7.volume = .5;
  let src7  = document.createElement("source");
  src7.type = "audio/mpeg";
  src7.src  = thisURL;
  snd7.appendChild(src7);
  snd7.play();




}

//state array
function clickableGrid( rows, cols, callback ){
  let i=0; // first number
  // let gridcontainer = document.getElementById(grid);

  let thisdiv = document.getElementById('seq');

  let grid = thisdiv.appendChild(document.createElement('table'));

  grid.className = 'grid';

  for (let r=0;r<rows;++r){
    //nested for loop
    let tr = grid.appendChild(document.createElement('tr'));

    for (let c=0;c<cols;++c){
      let cell = tr.appendChild(document.createElement('td'));
      // cell.innerHTML = 1+i++ ;      //add content to html cells
      i = 1+i++;
      // cell.innerHTML = 1+i++ ;      //add content to html cells
      cell.id = "cell_"+(i);    // assign an id based on i

      let input = cell.appendChild(document.createElement("input"));
      input.setAttribute('type', 'text');
      input.id = "input_"+(i);    // assign an id based on i
      input.value =  '';      //add content to html cells
      input.setAttribute("class", "input-text");


      // 'click'
      //
      // input.addEventListener('input', function (evt) {
      //   // console.log(document.getElementById("input_"+(i).value));
      // });
      //
      input.addEventListener('focus', function (evt) {
        // focusedElement = document.getElementById("input_"+(i));
        // console.log(focusedElement.value);
        // let lines = [];
        // lines = markov.generateSentences(2);
        // console.log(lines);

      });

      input.addEventListener('blur', (function(element,r,c,i){ //click listener function
        return function(){
          let innerContent = document.getElementById("input_"+(i));
          // console.log("innerContent",innerContent.value);
          if (innerContent.value.length > 0){
            inputActive = true;
            document.getElementById("cell_"+(i)).classList.add('clickedRed');
            newGridState = buildArrayForGridState(liststate, synth, i, inputActive, innerContent.value);
            let thisVoice = i-1;
            let voice;

            if (thisVoice <= width-1){
              voice = "Kimberly";
            } else if ((thisVoice >= width) && (thisVoice <= width*2-1)){
              voice = "Kendra";
            } else if ((thisVoice >= width*2) && (thisVoice <= width*3-1)){
              voice = "Joanna";
            } else if  ((thisVoice >= width*3) && (thisVoice <= width*4-1)){
              voice = "Ivy";
            } else if  ((thisVoice >= width*4) && (thisVoice <= width*5-1)){
              voice = "Matthew";
            } else if  ((thisVoice >= width*5) && (thisVoice <= width*6-1)){
              voice = "Joey";
            }



            console.log(voice);


            speakThis(liststate[i-1].text, i, voice);

          } else {

            inputActive = false;
            document.getElementById("cell_"+(i)).classList.remove('clickedRed');
            newGridState = buildArrayForGridState(liststate, synth, i, inputActive, innerContent.value);
          }

          // socket.emit('sendStep', {'theData': newGridState});

          callback(element,r,c,i);
        }

      })(cell,r,c,i),false);
    }
  }
  return grid;
}



////////////////////
///socket handlers//
////////////////////

socket.on('sendSteps', function(steps){
  seqarr = steps;
  arrayrecieved = true;
  // console.log('got_newArr', arrayrecieved, seqarr[1])
});


socket.on('resetAll', function(stepsreset){
  seqarr = stepsreset;
  for (i = 0 ; i < 300 ; i++){
    thisnotationArr[i] = false;
  }
  arrayrecieved = true;
});




if (checkId != true){
  checkId = true;
}
///////





/// on click event ///

Tone.Transport.scheduleRepeat(function(time){
  //do something with the time
  currMetroPos ++;

  if (currMetroPos >= Bars){
    currMetroPos = 0;
  }

  currbar = globalTick;
  liststate = seqarr;

  for(let i=0; i < width*height;i++){
    if (liststate[i] != null){

      if (liststate[i].activated != null){
        if ( (liststate[i].activated == 1) && (liststate[i].color == 'red') ){
          document.getElementById("cell_"+(i+1)).classList.add('clickedRed');
        }

        if ( (liststate[i].activated == 0) && (liststate[i].color == 'red') ){
          //TODO
          // document.getElementById("cell_"+(i+1)).classList.remove('clickedRed');
        }
      }
    }
  }


  globalTick = currMetroPos;


  for(let i = 0; i < (width*height) ;i++){
    // if (arrayrecieved == true){


    if ((liststate[i].activated==1) && (pattern01[i-(16*0)] == 1)){

      // console.log(i);
      let thisURL = liststate[i].pollyURL;
      let audio = document.getElementsByTagName("audio")[0];
      // audio.volume = volume;

      let snd1 = new Audio();
      snd1.volume = volume;
      console.log()
      let src1  = document.createElement("source");
      src1.type = "audio/mpeg";
      src1.src  = thisURL;
      snd1.appendChild(src1);
      snd1.play();


    }

    if ((liststate[i].activated==1) && (pattern01[i-(16*1)] == 1)){
      let thisURL = liststate[i].pollyURL;
      let audio = document.getElementsByTagName("audio")[0];


      let snd2  = new Audio();
      snd2.volume = volume;
      let src2  = document.createElement("source");
      src2.type = "audio/mpeg";
      src2.src  = thisURL;
      snd2.appendChild(src2);
      snd2.play();
    }

    if ((liststate[i].activated==1) && (pattern01[i-(16*2)] == 1)){
      let thisURL = liststate[i].pollyURL;
      let audio = document.getElementsByTagName("audio")[0];

      let snd3  = new Audio();
      snd3.volume = volume;
      let src3  = document.createElement("source");
      src3.type = "audio/mpeg";
      src3.src  = thisURL;
      snd3.appendChild(src3);
      snd3.play();
    }

    if ((liststate[i].activated==1) && (pattern01[i-(16*3)] == 1)){
      let thisURL = liststate[i].pollyURL;
      let audio = document.getElementsByTagName("audio")[0];
      audio.volume = volume;

      let snd4  = new Audio();
      snd4.volume = volume;
      let src4  = document.createElement("source");
      src4.type = "audio/mpeg";
      src4.src  = thisURL;
      snd4.appendChild(src4);
      snd4.play();
    }

    if ((liststate[i].activated==1) && (pattern01[i-(16*4)] == 1)){
      let thisURL = liststate[i].pollyURL;
      let audio = document.getElementsByTagName("audio")[0];
      audio.volume = volume;

      let snd5  = new Audio();
      snd5.volume = volume;
      let src5  = document.createElement("source");
      src5.type = "audio/mpeg";
      src5.src  = thisURL;
      snd5.appendChild(src5);
      snd5.play();
    }

    if ((liststate[i].activated==1) && (pattern01[i-(16*5)] == 1)){
      let thisURL = liststate[i].pollyURL;
      let audio = document.getElementsByTagName("audio")[0];
      audio.volume = volume;

      let snd6  = new Audio();
      snd6.volume = volume;
      let src6  = document.createElement("source");
      src6.type = "audio/mpeg";
      src6.src  = thisURL;
      snd6.appendChild(src6);
      snd6.play();
    }

    if ((liststate[i].activated==1) && (pattern01[i-(16*6)] == 1)){
      // note7_1();
      // speakThis(liststate[i].instrument,  pollyArr[i], i);
      // console.log("7th row")
    }

    if ((liststate[i].activated==1) && (pattern01[i-(16*7)] == 1)){
      // note8_1();
      // speakThis(liststate[i].instrument,  pollyArr[i], i);
      // console.log("8th row")
    }

    if ((liststate[i].activated==1) && (pattern01[i-(16*8)] == 1)){
      // note9_1();
      // speakThis(liststate[i].instrument,  pollyArr[i], i);
      // console.log("9th row")
    }

    if ((liststate[i].activated==1) && (pattern01[i-(16*9)] == 1)){
      // note10_1();
      // speakThis(liststate[i].instrument,  pollyArr[i], i);
      // console.log("10th row")
    }

    if ((liststate[i].activated==1) && (pattern01[i-(16*10)] == 1)){
      // note11_1();
      // speakThis(liststate[i].instrument,  pollyArr[i], i);
      // console.log("11th row")
    }

    if ((liststate[i].activated==1) && (pattern01[i-(16*11)] == 1)){
      // note12_1();
      // speakThis(liststate[i].instrument,  pollyArr[i], i);
      // console.log("12th row")
    }

    if ((liststate[i].activated==1) && (pattern01[i-(16*12)] == 1)){
      // note13_1();
      // speakThis(liststate[i].instrument,  pollyArr[i], i);
      // console.log("13th row")
    }
    // }
  }

  /////////////////////////////
  /////draw the cursor/////////
  /////////////////////////////

  //console.log(currbar);

  for(let i=0; i < width; i++){
    pattern01[i] = 0;
    document.getElementById("cell_"+(i+1)).classList.remove('player');
    document.getElementById("cell_"+(i+17)).classList.remove('player');
    document.getElementById("cell_"+(i+33)).classList.remove('player');
    document.getElementById("cell_"+(i+49)).classList.remove('player');
    document.getElementById("cell_"+(i+65)).classList.remove('player');
    document.getElementById("cell_"+(i+81)).classList.remove('player');

  }

  pattern01[currbar] = 1;
  document.getElementById("cell_"+(currbar+1)).classList.add('player');
  document.getElementById("cell_"+(currbar+17)).classList.add('player');
  document.getElementById("cell_"+(currbar+33)).classList.add('player');
  document.getElementById("cell_"+(currbar+49)).classList.add('player');
  document.getElementById("cell_"+(currbar+65)).classList.add('player');
  document.getElementById("cell_"+(currbar+81)).classList.add('player');




}, "16n");


////socket Handlers


socket.on('currplayer', function(incomingTick){

});


socket.on('currTime', function(clientCurrTimeSec, clientCurrTimeMin){
  currsec = clientCurrTimeSec;
  currmin = clientCurrTimeMin;
  //console.log('somesec',somsec, 'somemin', somemin);
});

////recieve Current Bar From Server//
socket.on('globalTimetype', function(incomingBar){
  clientCounter = incomingBar;
  // console.log('clientCounter', clientCounter)
});




/////////////////////////
////////////reset////////
////////////////////////

let body = document.querySelector('body');

body.onkeydown = function (e) {
  // if ( !e.metaKey ) {
  //   e.preventDefault();
  // }
  // if (event.keyCode == 48){
  //   socket.emit('ClientReset', {'resetfromclient': 1});
  //
  // }
};
