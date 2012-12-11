import sys
from time import gmtime, strftime
import json
import datetime
import random


def editData(filenamePrefix):
  originalFn = filenamePrefix + ".json"
  cleanFilename = filenamePrefix + "_.json"
  originalJson = open(originalFn)
  jsonArr = json.load(originalJson)
  originalJson.close()
    
  flowRateDataFileSmall = "v1.1354183200000.n1440.flowrate.json" 
  flowRateDataFile = "v1.1355182293294.n1440.flowrate.json"
  flowRateFileSmall = open(flowRateDataFileSmall)
  flowRateFile = open(flowRateDataFile)
  flowRateDataSmall = json.load(flowRateFileSmall)
  flowRateData = json.load(flowRateFile)
  flowRateFileSmall.close()  
  flowRateFile.close()

  tempDataFilename = "ecovillage.1354183200000.n1440.temp.json"
  tempDataFile = open(tempDataFilename)
  tempData = json.load(tempDataFile)
  tempDataFile.close()

  start = datetime.datetime.fromtimestamp(1354723736)

  for (i, obj) in enumerate(jsonArr):

    time = start + datetime.timedelta(seconds = i * 10)
    timeStr = time.strftime("%Y-%m-%dT%H:%M:%S.000Z")
    # old = obj['time']
    obj['time'] = timeStr
    
    secsFromStart = i * 10
    
    flowObject = flowRateData[i]

    if (i < len(flowRateDataSmall)):
      flowObject = flowRateDataSmall[i]
    
    if (i < len(tempData)):
      setTemperature(obj, tempData[i])
    else:
      setTemperature(obj, obj)


#    setTemperature(obj, secsFromStart)    
    setFlowRate(obj, flowObject)
    setLightLevel(obj, secsFromStart)
    setGbLevel(obj, secsFromStart)
    setHumidity(obj, secsFromStart)
    
    setTankFull(obj, secsFromStart)
    setFishFeeder(obj, secsFromStart)
    setFishTankPump(obj, secsFromStart)
    setFlowSwitch(obj, flowObject)
    setGrowLights(obj, secsFromStart)
    setLeak(obj, secsFromStart)
    setBackupReservoir(obj, secsFromStart)
    setReservoirPump(obj, secsFromStart)
    
  
  cleanData = open(cleanFilename, 'wb')
  cleanData.write(json.dumps(jsonArr))
  cleanData.close()



# CONTINUOUS

def setTemperature(obj, objToCopy):
  prevTemp = objToCopy["report"]["temperature_sensor"]["temperature"]
  obj["report"]["temperature_sensor"]["temperature"] = max(round(prevTemp * .6, 2), 0)

def setFlowRate(obj, objToCopy):
  #TODO change
  rate = 0
  if "flow_rate_sensor" in objToCopy["report"]:
    rate = round(objToCopy["report"]["flow_rate_sensor"]["flowRate"] - 1.0, 2)
  rate = max(rate, 0)
  obj["report"]["flow_rate_sensor"]["flowRate"] = rate

def setLightLevel(obj, secsFromStart):
  oldLL = obj["report"]["photocell_sensor"]["lightLevel"]
  if secsFromStart > (60 * 40):
    oldLL = oldLL - 20
  obj["report"]["photocell_sensor"]["lightLevel"] = oldLL

def setGbLevel(obj, secsFromStart):
  oldGbLevel = obj["report"]["gb_level_sensor"]["gbLevel"]
  obj["report"]["gb_level_sensor"]["gbLevel"] = oldGbLevel - 50
  
def setHumidity(obj, secsFromStart):
  oldHumidity = obj["report"]["humidity_sensor"]["humidity"]
  #obj["report"]["humidity_sensor"]["humidity"] = oldHumidity 


#BOOLEAN

def setTankFull(obj, secsFromStart):
  val = 0
  min = secsFromStart / 60
  if (min > 10 and min < 30) or (min > 80 and min < 90):
    val = 1
  obj["report"]["tank_level_sensor"]["full"] = val

def setFishFeeder(obj, secsFromStart):
  min = secsFromStart / 60
  val = 0
  if min > 40 and min < 60:
    val = 1  
  obj["report"]["fish_feeder"]["on"] = val

def setFishTankPump(obj, secsFromStart):
  val = (secsFromStart/(60 * 10))%2 #turn pump on every 10 minutes
  obj["report"]["fish_tank_pump"]["on"] = val

def setFlowSwitch(obj, objToCopy):
  val = 0
  if "flow_switch_sensor" in objToCopy["report"]:
    val = objToCopy["report"]["flow_switch_sensor"]["flow"]  
  obj["report"]["flow_switch_sensor"]["flow"] = val

def setGrowLights(obj, secsFromStart):
  val = 1
  if secsFromStart > 60 * 50:
    val = 0
  obj["report"]["grow_lights"]["on"] = val

def setLeak(obj, secsFromStart):
  val = 0
  minute = secsFromStart / 60
  if (minute > 4 and minute < 7) or (minute > 10 and minute < 20) or (minute > 80 and minute < 86) or (minute > 160 and minute < 190):
    val = 1
  obj["report"]["leak_detector_sensor"]["leak"] = val

def setBackupReservoir(obj, secsFromStart):
  #TODO
  oldBackupReservoir = obj["report"]["reservior_level_sensor"]["full"]
#  obj["report"]["reservior_level_sensor"]["full"]

def setReservoirPump(obj, secsFromStart):
  #TODO
  oldRp = obj["report"]["reservior_pump"]["on"]
#  obj["report"]["reservior_pump"]["on"] =  

if __name__ == '__main__':
  editData(sys.argv[1])
