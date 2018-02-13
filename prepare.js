const reader = require('geojson-writer').reader
const writer = require('geojson-writer').writer
const turf = require('@turf/turf')

const inFiles = ['data/geojson/collisionsbylocation2014.geojson','data/geojson/collisionsbylocation2015.geojson','data/geojson/collisionsbylocation2016.geojson'];
const outFiles = ['data/collisionsbylocation2014.geojson','data/collisionsbylocation2015.geojson','data/collisionsbylocation2016.geojson'];

const outTotalsFile = 'data/collisionsbylocationTotals.geojson'
const totals = []

for (let i in inFiles){
  const inFile = inFiles[i]

  console.log('Processing', inFile, '...')
  let roads = reader(inFile)
  for (let road of roads.features) {
    const props = road.properties
    props.location = props.LOCATION
    props.col_total = props.TOTAL_COLLISIONS==''?0:parseFloat(props.TOTAL_COLLISIONS)
    props.col_peds = props.PEDESTRIANS_IN_TOTAL==''?0:parseFloat(props.PEDESTRIANS_IN_TOTAL)
    props.col_bikes = props.BICYLCLES_IN_TOTAL==''?0:parseFloat(props.BICYLCLES_IN_TOTAL)
    delete props.X
    delete props.Y
    delete props.LOCATION
    delete props.TOTAL_COLLISIONS
    delete props.PEDESTRIANS_IN_TOTAL
    delete props.BICYLCLES_IN_TOTAL
    delete props.YEAR

    var obj = totals.find(function (obj) { return obj.properties.location == props.location; });
    if(typeof obj == 'undefined'){
      totals.push(road)
    }
    else{
      obj.properties.col_total+=props.col_total
      obj.properties.col_peds+=props.col_peds
      obj.properties.col_bikes+=props.col_bikes
    }

  }

  writer(outFiles[i], roads)

  console.log('Done. Written', roads.features.length, 'features')

}

writer(outTotalsFile, turf.featureCollection(totals))
console.log('Total collisions:', totals.length, 'features')
