var canvas, phaseDeJeu=1, FtSizeNormal=50, language=0;
var alphabet = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

var pause = false;
var myBlue = "#003999"; // 0, 57, 153
var scoreAbs;
var songSpeed = 1;
var oldTime, nowTime;

function randRange(min, max){
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Letter(){
  this.letter;
  this.x;
  this.y;
  this.panning; //taux de gauche/droite (sonore)
  this.vitesseDeBase  = 0.0001*height;
  this.acceleration   = 0.00005*height;
  this.vitesse        = this.vitesseDeBase;
  this.rotate         =false;
  this.element        = createP('');
  this.element.addClass("lettre");
  this.roll = function(){
    this.element.style("font-size:"+FtSizeNormal+"px;");
    this.letter = alphabet[randRange(0,alphabet.length-1)];
    this.element.html(this.letter);
    // this.x = randRange(0,width-FtSizeNormal);
    var range = (this.wave) ? [2*FtSizeNormal,width-FtSizeNormal*5] : [0.5*FtSizeNormal,width-FtSizeNormal*2];
    this.x = randRange(range[0],range[1]);
    this.panning = map(this.x,range[0],range[1],-1.0,1.0);
    this.y=0;
    this.phase=randRange(-2,2);
    this.element.position(this.x,this.y);
    console.log("this.x "+this.x);
    this.orientationDeBase=randRange(0,360);
    this.coefAngle=0.01*Math.round(randRange(15,70)); //entre 0.1 et 0.8 à la précision dixième par rapport à this.y
    this.angle;
    this.amplitude = 0.01*Math.round(randRange(20,40));
  }
  this.waveSetup = function(){
    this.wave=false;
    this.newX;
    this.radius=200;
  }
  this.spinSetup = function(){
    this.spin=false;
  }
  this.grossirSetup = function(){
    this.grossir=false;
    this.coefGrossir;
  }
  this.rainbowSetup = function(){
    this.rainbow=false;
    this.coefRainbow=height/50000;
  }
  this.roll();
  this.waveSetup();
  this.spinSetup();
  this.grossirSetup();
  this.rainbowSetup();

  this.update = function(deltaT){
    this.y+=this.vitesse*deltaT;
    // if(this.rotate){
    //   translate(FtSizeNormal,FtSizeNormal);
    //   rotate(radians(this.y*5));
    // }

    if(this.wave){
      this.newX = this.x + this.amplitude*sin(this.y*0.02+this.phase)*this.radius;
      this.element.position(this.newX,this.y);
    }else{
      this.element.position(this.x,this.y);
    }
    if(this.spin){
      // this.angle = this.y%oneRotation;
      // console.log(this.orientationDeBase, this.y);
      this.angle = (this.orientationDeBase+this.y*this.coefAngle)%360;
      // console.log("this.angle "+this.angle);
      this.element.style('transform','translateX(-50%) translateY(-78%) rotate('+this.angle+'deg)');
    }
    if(this.grossir){
      this.coefGrossir = map(this.y,0,height,0,0.4);
      this.taille=FtSizeNormal+this.y*this.coefGrossir;
      this.element.style("font-size:"+this.taille+"px;");
    }
    if(this.rainbow){

      var myR = Math.round(255*Math.abs(Math.sin(this.y*this.coefRainbow+2))); //sin = [-1,1] => *255
      var myG = Math.round(255*Math.abs(Math.sin(this.y*this.coefRainbow+0)));
      var myB = Math.round(255*Math.abs(Math.sin(this.y*this.coefRainbow+4)));

      console.log("RGB ", myR, myG, myB);
      this.element.style("color:rgb("+myR+","+myG+","+myB+");");
    }
  }



  this.incSpeed = function(){
    this.vitesse += this.acceleration;
  }
}

function MyImg(strLocation, x, y){
  this.strLocation = strLocation;
  this.x = x;
  this.y = y;
  this.width;
  this.height;

  this.pimage = loadImage(strLocation);
  this.draw = function(){
    if(this.width && this.height){
    image(this.pimage, this.x, this.y, this.width, this.height);
    }
    image(this.pimage, this.x, this.y);
  }
}

function MyText(value, x, y, color){
  this.value = value;
  this.color = color;
  this.x = x;
  this.y = y;
  this.addSize;
  this.element = createP('');


  this.draw = function(){
    if(this.addSize){
      var tmpSize = FtSizeNormal+this.addSize;
      this.element.style("font-size:"+tmpSize+"px;");
    } else {
      this.element.style("font-size:"+FtSizeNormal+"px;");
    }
    this.element.style("color:"+this.color+";");
    this.element.position(this.x, this.y);
    this.update();
  }

  this.update = function(){
    if(this.value.length>1){
      this.element.html(this.value[language]);
    } else{
      this.element.html(this.value);
    }
  }

}

function preload(){
  // $("i.fa").hide();
  // $("#settings").hide();
  loadTxt();
  loadImages();
  loadSounds();
}

function loadTxt(){
  scoreTxt = new MyText(["Your score :","Votre score :"],10,10,myBlue);
  lvlTxt = new MyText(["Level :","Niveau :"],10,10,myBlue);
  playTxt = new MyText(["Press Enter to play","Appuyez sur Entrer pour jouer"],0,0,"black");
  gameOverTxt = new MyText(["Game Over","Perdu !"],0,0,"black");
  retryTxt = new MyText(["To retry, click here or press Enter","Pour reessayer, cliquez ici ou appuyez sur Entrer"],0,0,"black");

  lvl = new MyText(1,FtSizeNormal*4,10,myBlue);
      lvl.element.addClass("hud");
  score = new MyText(0,windowWidth-FtSizeNormal*1.5,10,myBlue);
    score.addSize = 15;
    score.element.addClass("hud");
    score.element.addClass("atranslater");
}

function loadImages(){
  arrow = new MyImg('media/speedup/arrow60.png',0,0);
  bg = new MyImg('media/speedup/backgroundHD.png',0,0);
  ENFlag = new MyImg('media/speedup/EN.png',0,0);
  FRFlag = new MyImg('media/speedup/FR.png',0,0);
  speedUp = new MyImg('media/speedup/speedUP60.png',0,0);
}

function loadSounds(){
  song = loadSound('media/speedup/TevoVexento.mp3');
  song.setVolume(0.3);
  bad = loadSound('media/speedup/bad2.wav');
  bad.setVolume(0.8);
  good = loadSound('media/speedup/good2.wav');
  tesMauvais = loadSound('media/speedup/mauvais.mp3');
  tesMauvais.setVolume(0.7);
}

function setup(){
  canvas = createCanvas(Math.max(windowWidth,1280), windowHeight);
  canvas.parent('p5container');
  bg.width = width;
  bg.height = height;
  // $("i.fa").show();
  // frameRate(5);
  // rectMode(CENTER);
  masterVolume(0.2);
  textSize(FtSizeNormal);
  // textFont('Georgia');
  ligneY = height*0.9;

  nouvellePartie();
}


function nouvellePartie(){
  $("#divScore").hide();
  $("p.lettre").remove();
  song.jump();
  song.rate(1);
  ilFautAfficherSpeedUp=false;
  scoreAbs=0;
  score.value=0;
  lvl.value=1
  vitesse=1;
  phase1Setup();
  phaseDeJeu=1;

}

function draw(){
  bg.draw();
  switch(phaseDeJeu){
    case 1:
      phase1();
      break;
    case 2:
      phase2();
      break;
  }
  // fill(myBlue);
}

function majScore(){
  good.pan(currentLetter.panning);
  good.play();
  scoreAbs++;
  score.value++;

  if(score.value===20 && !currentLetter.grossir){
    currentLetter.grossir=true;
    // fat/y
  }
  if(score.value===40 && !currentLetter.spin){
    currentLetter.spin=true;
    currentLetter.element.addClass("spin");
  }
  if(score.value===60 && !currentLetter.rainbow){
    currentLetter.rainbow=true;
  }
  if(score.value===75 && !currentLetter.wave){
  }
  if(score.value===90){
    currentLetter.wave=true;
    //chinois (parce qu'il y en a plein)
    //ou passage de haut=>bas à rand(gauche=>droite || bas=>haut || droite=>gauche || haut=>bas)
    //petit poucet #anti Guillaume cheat
  }

  console.log(score.value, scoreAbs);
  songSpeed = map(scoreAbs,1,120,1,2);
  song.rate(songSpeed);
  if(scoreAbs%5===0 && score.value>=0){
    lvl.value++;
    lvl.update();
    currentLetter.incSpeed();
    ilFautAfficherSpeedUp=true;
  }
}

function phase1Setup(){
  currentLetter = new Letter();
  score.draw();
  lvlTxt.draw();
  lvl.draw();
  // WaveSetup();
  stroke(0);
  ilFautAfficherSpeedUp=false;
  oldTime = +new Date; // +new Date permet d'avoir la date sous forme de nombre =/= new Date
}

function phase1(){
  nowTime = +new Date;
  var deltaT = nowTime - oldTime;
  oldTime = nowTime;
  if(!pause){
    line(0,ligneY,width,ligneY);
    currentLetter.update(deltaT);
    score.update();
    if(currentLetter.y>ligneY){
      phase2Setup();
      phaseDeJeu=2;
    }
  }
}

function keyTyped(){
  if(phaseDeJeu===1){
    if(key.toLowerCase()===currentLetter.letter.toLowerCase()){
      ilFautAfficherSpeedUp=false;
      majScore();
      currentLetter.roll();
    }else{
      var i=0;
      var jaiTrouveLaTouche = false;
      while(i!==alphabet.length && !jaiTrouveLaTouche){
        if(key.toLowerCase()===alphabet[i].toLowerCase()){
          bad.pan(currentLetter.panning);
          bad.play();
          score.value--;
          jaiTrouveLaTouche=true;
          // console.log("trouvée !");
        }
        i++;
      }
    }
  }
}


function phase2Setup(){
  if(score.value<1)tesMauvais.play();
  $("#divScore").show();
  $("#divScore>h3").html("Votre score est de : "+score.value);
  $("input[name='score']").val(score.value);

}

function phase2(){
  line(0,ligneY,width,ligneY);
}

function goFullScreen(){
  var fs = fullscreen();
  fullscreen(!fs);
	// canvas.size(window.innerWidth, window.innerHeight);
  resizeCanvas(width, height);
}
