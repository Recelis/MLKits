const outputs = [];
// const predictionPoint = 300;

function onScoreUpdate(dropPosition, bounciness, size, bucketLabel) {
  // Ran every time a balls drops into a bucket
  outputs.push([dropPosition, bounciness, size, bucketLabel]);
  // console.log(outputs);
}

function runAnalysis() {
  const testSetSize = 100;
  const [testSet, trainingSet] = splitDataset(outputs, testSetSize); // 2015 destructuring syntax
  _.range(1, 20).forEach(k => {
    const accuracy = _.chain(testSet)
      .filter(testPoint => knn(trainingSet, _.initial(testPoint), k) === testPoint[3]) // initial to remove label off testpoint before getting into knn
      .size() // basically length
      .divide(testSetSize)
      .value();
    console.log("For k of " + k + " Accuracy: " + accuracy);
  });
}

function knn(data, point, k) {
  return _.chain(data) // allows you to chain methods together on an array
    // .map(row => [distance(row[0], point), row[3]]) // distance from dropPosition to the testPoint. Returns [diffdistance]
     .map((row => { // each row
       return [distance(_.initial(row), point), // don't want to remove label off here on point, because it will be annoying to do this if manually input point.
        _.last(row)
      ];
     })) 
    .sortBy(row => row[0]) // sort by [diffdistance]
    .slice(0, k) // arbitrary take only top 15
    .countBy(row => row[1]) //
    .toPairs()
    .sortBy(row => row[1])
    .last()
    .first()
    .parseInt()
    .value(); // stops chain
}

function distance(pointA, pointB) {
  // assume pointA is an array and pointB is same.
  // return Math.abs(pointA - pointB);
  return _.chain(pointA)
	.zip(pointB)
	.map(([a,b]) => (a-b)**2)
	.sum()
	.value() **0.5;
}

function splitDataset(data, testCount) {
  const shuffled = _.shuffle(data);
  const testSet = _.slice(shuffled, 0, testCount);
  const trainingSet = _.slice(shuffled, testCount);

  return [testSet, trainingSet];
}
