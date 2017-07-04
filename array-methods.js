/*jshint esversion: 6 */
var dataset = require('./dataset.json');

function twoDecimals(number){

  return Math.round(parseFloat(number)*100)/100;
}

/*
  create an array with accounts from bankBalances that are
  greater than 100000
  assign the resulting new array to `hundredThousandairs`
*/

var hundredThousandairs = dataset.bankBalances.filter((bank) => {return bank.amount > 100000;});



/*
  DO NOT MUTATE DATA.

  create a new dataset where each bank object is a new object.
  `amount` and `state` values will be transferred to the new object.
  This new object is different, you will add one new key of `rounded`

  `rounded` value is `amount` rounded to the nearest dollar

  Example:
    {
      "amount": "134758.44",
      "state": "HI",
      "rounded": 134758
    }
  assign the resulting new array to `datasetWithRoundedDollar`

*/

var datasetWithRoundedDollar = dataset.bankBalances.map(({amount, state, rounded}) => {return {amount, state, rounded: Math.round(amount)};});


/*
  DO NOT MUTATE DATA.

  create a new dataset where each bank object is a new object.
  `amount` and `state` values will be transferred to the new object.
  This new object is different, you will add one new key of `roundedDime`

  `roundedDime` value is `amount` rounded to the nearest 10th of a cent

  Example 1
    {
      "amount": "134758.46",
      "state": "HI"
      "roundedDime": 134758.5
    }
  Example 2
    {
      "amount": "134758.44",
      "state": "HI"
      "roundedDime": 134758.4
    }
  assign the resulting new array to `roundedDime`
*/
var datasetWithRoundedDime = dataset.bankBalances.map(({amount, state, roundedDime}) => {return {amount, state, roundedDime: parseFloat(parseFloat(amount).toFixed(1))};});

// console.log(datasetWithRoundedDime);

// set sumOfBankBalances to be the sum of all value held at `amount` for each bank object
var sumOfBankBalances = dataset.bankBalances.map((bank) => { return parseFloat(bank.amount); }).reduce((prev, curnt) => {return twoDecimals(prev+curnt);});


// console.log('final balance', sumOfBankBalances);

/*
  from each of the following states:
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  take each `amount` and add 18.9% interest to it rounded to the nearest cent
  and then sum it all up into one value saved to `sumOfInterests`
 */

 // locate amounts of just the banks in those states -> filter
 // multiply the amount times 1.189 and round the result to the nearest cent (2 decimal places) -> map
 // add all the amounts up -> reduce

var sumOfInterests = dataset.bankBalances.filter((bank) => {
  return ['WI', 'IL', 'WY', 'GA', 'OH', 'DE'].indexOf(bank.state) >= 0;
})
  .map((bank) => {
    return twoDecimals(parseFloat(bank.amount) * 0.189);})
  .reduce((prev,curt) => {
    return twoDecimals(prev + curt);
  });

// console.log(sumOfInterests);


/*
  aggregate the sum of bankBalance amounts
  grouped by state
  set stateSums to be a hash table where

  the key is:
    the two letter state abbreviation
  and the value is:
    the sum of all amounts from that state
    the value must be rounded to the nearest cent

  note: During your summation (
    if at any point durig your calculation where the number looks like `2486552.9779399997`
    round this number to the nearest 10th of a cent before moving on.
  )
 */

//DEPRECATED - tried it a different way below - using reduce
// var stateSums = {};

// dataset.bankBalances.forEach((bank) => {
//   if(stateSums.hasOwnProperty(bank.state)){
//     stateSums[bank.state] += (Number(bank.amount));
//   } else {
//     stateSums[bank.state] = (Number(bank.amount));
//   }
// });



var stateSums = dataset.bankBalances.reduce((totalObj, curtBankObj) => {
  if (!totalObj.hasOwnProperty(curtBankObj.state)){
    totalObj[curtBankObj.state] = 0;
  }
  totalObj[curtBankObj.state] += parseFloat(curtBankObj.amount);
  return totalObj;
}, {});

Object.keys(stateSums).forEach((state) => {
  stateSums[state] = twoDecimals(stateSums[state]);
});

// console.log(stateSums);

/*
  from each of the following states:
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  take each `amount` and add 18.9% interest to it
  only sum values greater than 50,000 and save it to `sumOfInterests`

  note: During your summation (
    if at any point durig your calculation where the number looks like `2486552.9779399997`
    round this number to the nearest 10th of a cent before moving on.
  )
 */

var allStateSums = Object.keys(stateSums).map((state) => {
  return {state: state, amount: stateSums[state]};
});

var sumOfHighInterests = twoDecimals(allStateSums.filter((stateSum) => {
  return ['WI', 'IL', 'WY', 'GA', 'OH', 'DE'].indexOf(stateSum.state) === -1;
})
  
  .map((bank) => {return (parseFloat(bank.amount) * 0.189).toFixed(2);})

  .filter((amount) => {return parseFloat(amount) > 50000;})
  
  .reduce((p, c, i, a) => {return parseFloat(p) + parseFloat(c);}));

// console.log(sumOfHighInterests);

/*
  set `lowerSumStates` to be an array of two letter state
  abbreviations of each state where the sum of amounts
  in the state is less than 1,000,000
 */

var lowerSumStates = allStateSums.filter((state) => {return state.amount < 1000000;}).map((state) => {return state.state;});

// console.log(lowerSumStates);

/*
  aggregate the sum of each state into one hash table
  `higherStateSums` should be the sum of all states with totals greater than 1,000,000
 */

var higherStateSums = allStateSums.filter((state) => {return state.amount > 1000000;}).map((state) => {return state.amount;}).reduce((p, c, i, a) => {return p + c; });

// console.log(higherStateSums);

/*
  from each of the following states:
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware

  Check if all of these states have a sum of account values
  greater than 2,550,000

  if true set `areStatesInHigherStateSum` to `true`
  otherwise set it to `false`
 */
var areStatesInHigherStateSum = allStateSums.filter((bank) => { return ['WI', 'IL', 'WY', 'GA', 'OH', 'DE'].indexOf(bank.state) >= 0;})
  .every((state) => {return state.amount > 2550000;});

// console.log(areStatesInHigherStateSum);

/*
  Stretch Goal && Final Boss

  set `anyStatesInHigherStateSum` to be `true` if
  any of these states:
    Wisconsin
    Illinois
    Wyoming
    Ohio
    Georgia
    Delaware
  have a sum of account values greater than 2,550,000
  otherwise set it to be `false`
 */

var anyStatesInHigherStateSum = allStateSums.filter((bank) => { return ['WI', 'IL', 'WY', 'GA', 'OH', 'DE'].indexOf(bank.state) >= 0;}).some((state) => {return state.amount > 2550000;});


module.exports = {
  hundredThousandairs : hundredThousandairs,
  datasetWithRoundedDollar : datasetWithRoundedDollar,
  datasetWithRoundedDime : datasetWithRoundedDime,
  sumOfBankBalances : sumOfBankBalances,
  sumOfInterests : sumOfInterests,
  sumOfHighInterests : sumOfHighInterests,
  stateSums : stateSums,
  lowerSumStates : lowerSumStates,
  higherStateSums : higherStateSums,
  areStatesInHigherStateSum : areStatesInHigherStateSum,
  anyStatesInHigherStateSum : anyStatesInHigherStateSum
};
