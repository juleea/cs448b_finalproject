import sys
from time import gmtime, strftime
import json
import datetime

def editData(filenamePrefix):
  originalFn = filenamePrefix + ".json"
  cleanFilename = filenamePrefix + "_.json"

  originalJson = open(originalFn)
  jsonArr = json.load(originalJson)
  originalJson.close()

  start = datetime.datetime.fromtimestamp(1354723736)

  for (i, obj) in enumerate(jsonArr):

    time = start + datetime.timedelta(seconds = i * 10)
    timeStr = time.strftime("%Y-%m-%dT%H:%M:%S.000Z")
    # old = obj['time']
    obj['time'] = timeStr
    
    secsFromStart = i * 10
    
    setTemperature(obj, secsFromStart)
    setFlowRate(obj, secsFromStart)
    
    setFishTankPump(obj, secsFromStart)
    setTankFull(obj, secsFromStart)
    setFishFeeder(obj, secsFromStart)
    setLeak(obj, secsFromStart)
    
  
  cleanData = open(cleanFilename, 'wb')
  cleanData.write(json.dumps(jsonArr))
  cleanData.close()

#   "flow_rate": ["report", "flow_rate_sensor", "flowRate"],
#    "temperature": ["report", "temperature_sensor", "temperature"],
#    "light_level": ["report", "photocell_sensor", "lightLevel"],
#    "gb_level": ["report", "gb_level_sensor", "gbLevel"],
#    "humidity": ["report", "humidity_sensor", "humidity"],
# 
#    //boolean variable measurements
#    "tank_full": ["report", "tank_level_sensor", "full"],
#    "fish_feeder": ["report", "fish_feeder", "on"],
#    "fish_tank_pump": ["report", "fish_tank_pump", "on"],
#    "flow_switch": ["report", "flow_switch_sensor", "flow"],
#    "grow_lights": ["report", "grow_lights", "on"],
#    "leak": ["report", "leak_detector_sensor", "leak"],
#    "backup_reservoir": ["report", "reservior_level_sensor", "full"],
#    "reservoir_pump": ["report", "reservior_pump", "on"],

def setFlowRate(obj, secsFromStart):
  obj["report"]["flow_rate_sensor"]["flowRate"] = 50

def setTemperature(obj, secsFromStart):
  prevTemp = obj["report"]["temperature_sensor"]["temperature"]
  obj["report"]["temperature_sensor"]["temperature"] = prevTemp * (-1) - 5



def setFishTankPump(obj, secsFromStart):
  val = (secsFromStart/(60 * 10))%2 #turn pump on every 10 minutes
  obj["report"]["fish_tank_pump"]["on"] = val
  

def setTankFull(obj, secsFromStart):
  val = 0
  min = secsFromStart / 60
  if (min > 10 and min < 20) or (min > 70 and min < 80):
    val = 1
  obj["report"]["tank_level_sensor"]["full"] = val

def setFishFeeder(obj, secsFromStart):
  min = secsFromStart / 60
  val = 0
  if min > 5 and min < 10:
    val = 1
    
  obj["report"]["fish_feeder"]["on"] = val


def setLeak(obj, secsFromStart):
  val = 0
  minute = secsFromStart / 60
  if (minute > .5 and minute < 1.5) or (minute > 4 and minute < 5) or (minute > 20 and minute < 40) or (minute > 80 and minute < 86) or (minute > 160 and minute < 190):
    val = 1
  obj["report"]["leak_detector_sensor"]["leak"] = val

if __name__ == '__main__':
  editData(sys.argv[1])
