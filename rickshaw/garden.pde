JavaScript javascript = null;
void setJavaScript(JavaScript js) { javascript = js; }

PImage img;
PImage imgLabeled;
Fish [] fishies;
MediaBed garden;
boolean overTank = false;
boolean overDetailButton = false;
boolean overLabelButton = false;
boolean showDetails = false;
boolean showLabels = false;
int dropCycle = 0;
int flowCycle = 0;
int flowAlphaVal = 0;
color noflow = color(255); // color(255,127,80);
color water = color(100,149,237);
color waterpipes = color(80,140,200); 
color lightOn = color(186,85,211);
// How set rgb as 
int width = 650;
int height = 470;
int fishTankWidth = 270;
int fishTankHeight = 115;
int fishTankStartX = 350;
int fishTankStartY = 285;
int growbedWidth = 300;
int growbedStartX = 40;
int growbedStartY = 100;
String baseImg = "kijani-grows-3.png";
String baseImgLabeled = "kijani-grows-labels-3.png";

void setup() {
  // size of screen
  size(width,height);
  // set background to white
  background(255);
  int numFish = 5;
  garden = new MediaBed(70,80,95, 0.82, numFish, true, false, true, true, true, true);
}

void draw() {
  image(img,0,0,img.width/1.5,img.height/1.5);
}

void drawButtons() {
  // Offsets allow for "popping up" animation on hover
  int detailYOffset = overDetailButton ? 10 : 0;
  int labelYOffset = overLabelButton ? 10 : 0;
  int fillDetail = showDetails ? 0 : 255;
  int fillLabel = showLabels ? 0 : 255;
  fill(fillDetail);
  rect(40, 445 - detailYOffset, 65, 90);
  fill(fillLabel);
  rect(120, 445 - labelYOffset, 60, 90);
  fill(lightOn);
  text("Details", 50, 450 - detailYOffset, 80, 50); 
  text("Labels", 130, 450 - labelYOffset, 80, 50); 
}

// DRAWS GROWBED WATER LEVEL - PARAM: PERCENTAGE FILLED (eg. 70% = 0.70)
// rect( topleft x, topleft y, width, height );
// BASE EMPTY: rect(0, 230, 350, 300);
// BASE FULL: rect(0, 100, 350, 300);
float drawGrowbedLevel(float percentFull) {
  int growbedTankFull = 100;
  int growbedTankEmpty = 230;
  float waterLevel = growbedTankEmpty - (growbedTankEmpty-growbedTankFull) * (percentFull/100.0);
  stroke(water);
  fill(water);
  rect(0, waterLevel, 350, 300); 
  return waterLevel;
}

// Draws either full or half full depending on ftFull boolean
// BASE EMPTY: rect(350, 402, 350, 300);
// BASE FULL: rect(350, 285, 350, 300);
float drawFishTankLevel(boolean ftFull) {
  int fishTankFull = 285;
  int fishTankEmpty = 402;
  float percentFill = ftFull ? 1 : 0.50;
  float waterLevel = fishTankEmpty - (fishTankEmpty-fishTankFull) * (percentFill);
  stroke(water);
  fill(water);
  rect(350, waterLevel, 350, 300); 
  return waterLevel;
}  

// Same as above, but w/o drawing rectangle itself
//float calculateFishTankAbsLevel(float percentFull) {
//  int fishTankFull = 285;
//  int fishTankEmpty = 402;
//  float waterLevel = fishTankEmpty - (fishTankEmpty-fishTankFull) * (percentFull/100.0);
//  return waterLevel;
//}

void drawGrowLight(boolean on) {
  if(on) {
    stroke(lightOn);
    fill(lightOn);
    rect(40,0,300,5);
  }
}

void drawLeakage(boolean leak) {
  if(!leak) return;
  stroke(water);
  fill(water);
  ellipse(180,400,160,20);
  ellipse(100,390,70,10);
  ellipse(145,380,40,5);
}

// DRAWS THE TUBING - PARAM: BOOLEAN, TRUE IF WATER FLOWING
// TRUE - BLUE COLOR, FALSE - ORANGE COLOR
void drawIrrigationPipe(boolean flowing) {
  if (flowing) {
    stroke(waterpipes);
    fill(waterpipes);
  } else { // not flowing
    stroke(noflow);
    fill(noflow); 
  }
  rect(580,30,15,400); 
  rect(305,30,15,80);
  rect(30,100,290,15);
  rect(305,35,300,15); 
}

void drawDrainagePipe(boolean flowing) {
  if(!flowing) return;
  stroke(waterpipes);
  fill(waterpipes);
  rect(350,150,70,50);
}

void  drawFlowRate(float rate) {
  int pipeLeft = 315;
  int pipeRight = 545;
  if (flowCycle > pipeRight-pipeLeft) {
    flowCycle = 0;
    flowAlphaVal = 0;
  }
  if (flowCycle < 50 && flowAlphaVal < 255) flowAlphaVal+=5;
  if (flowCycle > 120 && flowAlphaVal > 0) flowAlphaVal-=2;
  if (rate <= 0) flowAlphaVal = 255;
  if (rate <= 0) flowCycle = 50;
  
  String label = "";
  if (rate > 0) {
    fill(0,0,205,flowAlphaVal);
    label += rate + " gpm";
  } else {
    fill(165,42,42,flowAlphaVal);
    label += "0 gpm";
  }
  text(label, pipeRight-flowCycle, 40, 60, 20);
  flowCycle++;
}

void drawDroplets(float flowRate) {
  int fallDistance = 60;
  int dropSize = 3;
  if (dropCycle > fallDistance) dropCycle = 0;
  if (flowRate < 0.5) return;
  stroke(waterpipes);
  fill(waterpipes);
  for (int i = growbedStartX + 10 ; i < growbedStartX + growbedWidth ; i += 25 ) {
    triangle(i + dropSize/2, growbedStartY + dropCycle, i - dropSize/2, growbedStartY + dropSize*2 + dropCycle, i + dropSize, growbedStartY + dropSize*2 + dropCycle);
    ellipse(i + dropSize/2, growbedStartY + dropSize*2 + dropCycle, dropSize, dropSize);
  }
  dropCycle++;
}


Fish [] makeFish(int numFish, float tankWaterLevel) {
  Fish [] fishies = new Fish[numFish];
  for (int i = 0; i < numFish; i++) {
    int randVelocity = int(random(1,2.5));
    int randX = int(random(fishTankStartX + 35, fishTankStartX + fishTankWidth - 30));
    int randY = int(random(tankWaterLevel + 10, fishTankStartY + 105));
    Fish f = new Fish(randX,  randY, randVelocity);
    fishies[i] = f;
  }
  return fishies;
}

void animateFish(Fish [] fishies) {
  int tankLeftBound = fishTankStartX + 35;
  int tankRightBound = fishTankStartX + fishTankWidth - 30;
  for (int i = 0; i < fishies.length; i++) {
    int maybeTurn = int(random(0,100));
    Fish currFish = fishies[i];
    if (currFish.getX() <= tankLeftBound && currFish.getVelocity() < 0 ||
        currFish.getX() >= tankRightBound && currFish.getVelocity() > 0 ) {
        currFish.turn();
    } else if (maybeTurn == 1) {
        currFish.turn();
    }
    currFish.swim();
    currFish.display();
  }
}

void mousePressed() {
  if (overTank) {
    for (int i = 0; i < fishies.length; i++) {
      int currVel = fishies[i].getVelocity(); 
      if (currVel == 0) {
        fishies[i].setVelocity(true);
      } else {
        fishies[i].setVelocity(false);
      }
    } 
  } else if (overDetailButton) {
    showDetails = !showDetails;
  } else if (overLabelButton) {
    showLabels = !showLabels;
  }
  
}

void drawDetails(float gbLevel, boolean ftFull, float lightLevel, boolean lightOn, 
		 float flowRate, boolean feederOn, boolean growbedDraining,
                 boolean pumpOn, boolean leakage) {
  fill(238,232,170);
  string ftStatus = ftFull ? "Full" : "Not Full";
  text("Growbed Water Level: "+ gbLevel +"%", 80, 180, 100, 80); 
  text("Fish Tank Level: "+ftStatus, 400, 370, 80, 30);
  text("Light Level: " + lightLevel + "%  " + composeBoolStatus("Grow Lights",lightOn), 50, 5, 120, 30);
  text("Flow Rate: " + flowRate + " gpm", 400, 20, 150, 30);
  fill(0);
  boolean irrig = flowRate >= 0.5 ?  true : false;
  text(composeBoolStatus("Fish Feeder", feederOn), 400, 290, 120, 30);
  text(composeBoolStatus("Irrigation", irrig), 80, 120, 80, 30); 
  text(composeBoolStatus("Pump",pumpOn), 540, 405, 120, 30);
  fill(238,232,170);
  text(composeBoolStatus("Growbed Draining",growbedDraining), 365, 130, 80, 30); 
  text(composeBoolStatus("Leakage",leakage), 50, 405, 80, 30);
}

string composeBoolStatus(string varType, bool on) {
  return on ? varType+": On" : varType+": Off";	
}

void drawLabels() {

}


void setWhiteTransparent(PImage img) {
  int[]  maskArray=new int[img.width*img.height];
  img.loadPixels();
  for (int i=0; i<img.width*img.height; i++) {
    if((img.pixels[i] & 0x00FFFFFF) == 0x00FFFFFF) {
      maskArray[i]=0;      
    } else {
      maskArray[i]=img.pixels[i] >>> 24;
    }
  }
  img.updatePixels();
  img.mask(maskArray);  

} 

// MEDIA BED CLASS YAY!
// Technically the global variables I have at top should we in the MediaBed class
// And technically all the draw-related methods should be private methods in the
// MediaBed class, but for now, this works ... 

class MediaBed {
  float gbLevel;
  boolean ftFull;
  float lightLevel;
  float flowRate;
  float numFish;
  boolean feederOn;
  boolean lightOn;
  boolean growbedDraining;
  boolean pumpOn;
  boolean leakage;
  boolean isFlowing;
  
  MediaBed() { }
  MediaBed(float gbLevel, boolean ftFull, float lightLevel, float flowRate, int numFish,
           boolean feederOn, boolean lightOn, boolean growbedDraining, boolean pumpOn, 
           boolean leakage, boolean isFlowing) {
    this.gbLevel = gbLevel;
    this.ftFull = ftFull;
    this.lightLevel = lightLevel;
    this.flowRate = flowRate;
    this.numFish = numFish;
    this.feederOn = feederOn;
    this.lightOn = lightOn;
    this.growbedDraining = growbedDraining;
    this.pumpOn = pumpOn;
    this.leakage = leakage;
    this.isFlowing = isFlowing;
    img = loadImage(baseImg);
    imgLabeled = loadImage(baseImgLabeled);
    setWhiteTransparent(img);
    setWhiteTransparent(imgLabeled);
    float absoluteFTLevel = ftFull ? 285 : 344; // don't hardcode later
    fishies = makeFish(numFish, absoluteFTLevel);
  }
  
   // just a repeat of MediaBed constructor. Should really unify code later
   void updateMediaBed(float gbLevel, boolean ftFull, float lightLevel, float flowRate, int numFish,
           boolean feederOn, boolean lightOn, boolean growbedDraining, boolean pumpOn, 
           boolean leakage, boolean isFlowing) {
    this.gbLevel = gbLevel;
    this.ftFull = ftFull;
    this.lightLevel = lightLevel;
    this.flowRate = flowRate;
    this.numFish = numFish;
    this.feederOn = feederOn;
    this.lightOn = lightOn;
    this.growbedDraining = growbedDraining;
    this.pumpOn = pumpOn;
    this.leakage = leakage;
    this.isFlowing = isFlowing;
    img = loadImage(baseImg);
    imgLabeled = loadImage(baseImgLabeled);
    setWhiteTransparent(img);
    setWhiteTransparent(imgLabeled);
    float absoluteFTLevel = ftFull ? 285 : 344; // don't hardcode later
    fishies = makeFish(numFish, absoluteFTLevel);
  }

  void animateMediaBed() {
    console.log('animating media bed!');
    
    if (showLabels) { // done separately to reduce flash/lag of masking image
      image(imgLabeled,0,0,imgLabeled.width/1.5,imgLabeled.height/1.5);
      setWhiteTransparent(imgLabeled);
    } else {
      image(imgLabeled,0,0,img.width/1.5,img.height/1.5);
      setWhiteTransparent(img);
    }
    background(255);
    float absoluteFTLevel = drawFishTankLevel(ftFull);
    drawIrrigationPipe(isFlowing);
    float absoluteGBLevel = drawGrowbedLevel(gbLevel);
    drawDrainagePipe(growbedDraining);
   //tint(0, 153, 204);
    if (showLabels) {
      image(imgLabeled,0,0,imgLabeled.width/1.5,imgLabeled.height/1.5);
    } else {
      image(img,0,0,img.width/1.5,img.height/1.5);
    }
  //noTint();
    drawButtons();
    drawGrowLight(lightOn);
    drawLeakage(leakage);
    drawFlowRate(flowRate);
    drawDroplets(flowRate); 
    animateFish(fishies);
  
    if ( showDetails ) drawDetails(gbLevel,ftFull,lightLevel, lightOn,flowRate,feederOn, growbedDraining, pumpOn, leakage);
    if ( showLabels ) drawLabels();
  
    overTank = (mouseX > fishTankWidth && mouseY > fishTankStartY) ? true : false;
    overDetailButton = (mouseX > 40 && mouseX < 105 && mouseY > 440) ? true : false;
    overLabelButton = (mouseX > 120 && mouseX < 180 && mouseY > 440) ? true : false;
  }
  
}


// FISH CLASS YAY!
class Fish {
   color fishColor = color(255,127,80);
   int xpos;
   int ypos;
   int velocity;
   
   Fish(int initXpos, int initYpos, int initVel) {
     xpos = initXpos;
     ypos = initYpos;
     velocity = initVel;
   }
   
   int getX() {
     return xpos; 
   }
   
   int getVelocity() {
     return velocity;  
   }
   
   // set velocity to either true ( moving @ random velocity between 1-2) 
   // or false (velocity of 0, fish frozen)
   void setVelocity(boolean moving) {
     velocity = moving ? int(random(1,2.5)) : 0;
   }
   
   void display() {
     stroke(fishColor);
     fill(fishColor);
     if (velocity >= 0) {
       // Display Right Facing Fish  
       triangle(2 + xpos, 0 + ypos, 2 + xpos, 10 + ypos, 10 + xpos, 5 + ypos);
       ellipse(20 + xpos, 5 + ypos, 22, 10);
     } else { // velocity < 0
       // Display Left Facing Fish 
       triangle(22 + xpos, 5 + ypos, 30 + xpos, 0 + ypos, 30 + xpos, 10 + ypos);
       ellipse(12 + xpos,5 + ypos, 22, 10);
     }
   }

   void swim() {
     xpos = xpos + velocity;  
   }
   
   void turn() {
     velocity *= -1;
   }  
}
