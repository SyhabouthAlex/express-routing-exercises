const express = require('express');
const ExpressError = require("./expressError")

const app = express();

app.use(express.json());

function numsArray(nums) {
    if (nums == undefined) {
        throw new ExpressError(`nums are required`, 400)
    }

    let numsArray = [];

    for (let num of nums.split(',')) {
        if (isNaN(parseInt(num))) {
            throw new ExpressError(`${num} is not a number.`, 400)
        }
        numsArray.push(parseInt(num));
    }

    return numsArray;
}

function getMean(nums) {
    let total = nums.reduce((total, num) => {
        return total + num;
    }) / nums.length;
    return total;
}

function getMedian(nums) {
    return nums[Math.floor((nums.length - 1) / 2)]
}

function getMode(nums) {
    let numCounter = {};
    let highestCount = 0;
    let modeNums = [];

    for (let num of nums) {
        if (numCounter[num]) {
            numCounter[num] += 1;
        }
        else {
            numCounter[num] = 1;
        }
    }
    for (let num in numCounter) {
        if (numCounter[num] > highestCount) {
            highestCount = numCounter[num]
            modeNums = [];
            modeNums.push(num);
        }
        else if (numCounter[num] == highestCount) {
            modeNums.push(num);
        }
    }
    return modeNums;
}

app.get('/mean', function(req, res, next) {
    try {
        let nums = numsArray(req.query.nums);
        let mean = getMean(nums);

        return res.send({response: {
            operation: "mean",
            value: mean
        }});
    }
    catch (e) {
        return next(e);
    }
})

app.get('/median', function(req, res, next) {
    try {
        let nums = numsArray(req.query.nums);
        let median = getMedian(nums);

        return res.send({response: {
            operation: "median",
            value: median
        }});
    }
    catch (e) {
        return next(e);
    }
})

app.get('/mode', function(req, res, next) {
    try {
        let nums = numsArray(req.query.nums);
        let mode = getMode(nums).toString();

        return res.send({response: {
            operation: "mode",
            value: mode
        }});
    }
    catch (e) {
        return next(e);
    }
})

app.use(function (req, res, next) {
    const notFoundError = new ExpressError("Not Found", 404);

    return next(notFoundError)
});

app.use(function(err, req, res, next) { 
    let status = err.status || 500;
    let message = err.message;
    console.error(err.stack);
  
    return res.status(status).json({
      error: {message, status}
    });
});

app.listen(3000, function () {
    console.log('App on port 3000');
});