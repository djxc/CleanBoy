const VectorTile = require("@mapbox/vector-tile").VectorTile;
const Protobuf = require("pbf");
const zlib = require("zlib");
const { service } = require("../../util/service");
const fs = require("fs");

function parseVT() {
  const data = fs.readFileSync(__dirname + "/404.cvt");
  var tile = new VectorTile(new Protobuf(data));
  let layer = tile.layers.geojson;
  console.log(tile.layers);
  console.log(layer, layer._features);
  let featureSize = layer.length;
  for (let i = 0; i < featureSize; i++) {
    let feature = layer.feature(i);
    console.log(feature, feature.loadGeometry());
  }
}

module.exports = {
  parseVT,
};
