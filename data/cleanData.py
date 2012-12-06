import sys
from time import gmtime, strftime
import json
import datetime

def cleanData(filenamePrefix):
  rawFilename = filenamePrefix + ".raw"
  cleanFilename = filenamePrefix + ".clean.json"

  rawJson = open(rawFilename)
  jsonArr = json.load(rawJson)
  rawJson.close()


  dataHours = 4
  start = datetime.datetime.now() - datetime.timedelta(hours = dataHours)

  for (i, obj) in enumerate(jsonArr):

    time = start + datetime.timedelta(seconds = i * 10)
    timeStr = time.strftime("%Y-%m-%dT%H:%M:%S.000Z")
    # old = obj['time']
    obj['time'] = timeStr

  
  cleanData = open(cleanFilename, 'wb')
  cleanData.write(json.dumps(jsonArr))
  cleanData.close()


if __name__ == '__main__':
  cleanData(sys.argv[1])
