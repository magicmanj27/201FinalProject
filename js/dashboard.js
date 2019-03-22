//BUDGET CONTROLLER
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  Expense.prototype.calcPercentage = function(totalIncome) {

    if(totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  Expense.prototype.getDescription = function() {
    return this.description;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };


  return {
    addItem: function(type, des, val) {
      var newItem;

      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new item based on 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(ID, des, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, des, val);
      }
      // Push it into our data structure
      data.allItems[type].push(newItem);
      // Return the new element
      return newItem;
    },

    deletItem: function(type, id) {
      var ids, index;

      ids = data.allItems[type].map(function(current) {
        return current.id;
      });

      index = ids.indexOf(id);

      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }

    },

    calculateBudget: function() {

      // Calculate total income and expenses
      calculateTotal('exp');
      calculateTotal('inc');

      // Calculate the budget: income - expenses
      data.budget = data.totals.inc - data.totals.exp;

      // Calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentages: function() {
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getDescriptions: function() {
      var expDes = data.allItems.exp.map(function(cur) {

        return cur.getDescription();
      });

      return expDes;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    getChartExp: function() {
      var chartExp = data.totals.exp;
      return chartExp;
    },

    getChatInc: function() {
      var chartInc = data.totals.inc;
      return chartInc;
    },

    getchartBudet: function() {
      var budget = data.budget;
      return budget;
    },

    testing: function() {
      console.log(data);
    }
  };
})();

//UI CONTROLLER
var UIController = (function() {
  var DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expensesLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensesPercLabel: '.item__percentage',
    dateLabel: '.budget__title--month'
  };

  var formatNumber = function(num, type) {
    var numSplit, int, dec, type;

    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split('.');

    int = numSplit[0];
    if (int.length > 3) {
      int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
    }

    dec = numSplit[1];

    return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
  };

  var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value) //covert to number
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      // Create HTML string with placeholder text
      if (type === 'inc') {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right                    clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i              class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right                    clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div                                 class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></               div></div>';
      }
      // Replace the placeholder text with some actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));
      // Insert the HTML into the DOM
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function() {
      //clears discription and values when you add
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ', ' + DOMstrings.inputValue
      );

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current, index, array) {
        current.value = '';
      });

      fieldsArr[0].focus();
    },

    displayBudget: function(obj) {

      var type;
      obj.budget > 0 ? type = 'inc' : type = 'exp';


      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
      document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage = '---';
      }
    },

    displayPercentages: function(percentages) {

      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, function(current, index) {
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
    },

    displayMonth: function() {
      var now, month, months, year;

      now = new Date();

      months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

      month = now.getMonth();

      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
    },

    changedType: function() {

      var fields = document.querySelectorAll(
        DOMstrings.inputType + ',' +
        DOMstrings.inputDescription + ',' +
        DOMstrings.inputValue);

      nodeListForEach(fields, function(cur){
        cur.classList.toggle('red-focus');
      });

      document.querySelector(DOMstrings.inputBtn).classList.toggle('red');

    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {


  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();

    document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(event) {
      //console.log(event);
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
        // console.log('ENTER was pressed.');
      }
    });

    document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

    document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);

  };

  var updateBudget = function() {
    // 1. calculate the budget
    budgetCtrl.calculateBudget();
    console.log(budgetCtrl.calculateBudget);
    // 2. Display the budget on the UI
    var budget = budgetCtrl.getBudget();

    // 3. return the budget
    UICtrl.displayBudget(budget);
  };

  var updatePercentages  = function() {
    // 1. calculate percentages
    budgetCtrl.calculatePercentages();
    // 2. Read percentages from the budget controller
    var percentages = budgetCtrl.getPercentages();
    // console.log(percentages); // Potential starting point for making charts
    // 3. Update the UI with the new percentages
    UICtrl.displayPercentages(percentages);
    return percentages;
  };

  var makeChart = function() {
    var chartPercentages, chartDescriptions, inc, exp, total;

    var shit = [];
    console.log(shit);
    var newDesc = ['Income'];
    console.log(newDesc);

    inc = budgetCtrl.getChatInc();
    exp = budgetCtrl.getChartExp();

    total = 100 - ((exp * 100) / inc);

    shit.push(total);

    chartDescriptions = budgetCtrl.getDescriptions();
    console.log(chartDescriptions);

    chartPercentages = budgetCtrl.getPercentages();
    console.log(chartPercentages);

    for(var i = 0; i < chartPercentages.length; i++) {
      shit.push(chartPercentages[i]);
    }

    for(var j = 0; j < chartDescriptions.length; j++) {
      newDesc.push(chartDescriptions[j]);
    }

    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        // startAngle: chartRange,
        labels:newDesc,
        datasets: [{
          backgroundColor: [
            '#2ecc71',
            '#3498db',
            '#95a5a6',
            '#9b59b6',
            '#f1c40f',
            '#e74c3c',
            '#34495e'
          ],
          data: shit,
        }]
      }
    });
  };

  // var x = {
  //   labe
  // }
  var ctrlAddItem = function() {
    var input, newItem, chartPercentages;
    // var chartDesNames = [];

    // chartPercentages = budgetCtrl.getPercentages();
    // console.log(chartPercentages);


    // 1. Get the field input data
    input = UICtrl.getInput();

    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // 2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      // 4. Clear fields
      UICtrl.clearFields();

      // 5. Calculate and update budget
      updateBudget();

      // 6. Calculate and update percentages
      updatePercentages();

      makeChart();
    }
  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;

    
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    
    if(itemID) {
      
      splitID = itemID.split('-');
      type = splitID[0];
      ID = parseInt(splitID[1]);
      
      // 1. delete the item from the data structure
      budgetCtrl.deletItem(type, ID);
      
      // 2. Delete the item from the UI
      UICtrl.deleteListItem(itemID);
      
      // 3. Update and show the new budget
      updateBudget();
      
      // 4. Calculate and update percentages
      updatePercentages();
      
      makeChart();
      console.log(updatePercentages);
    }
  };

  return {
    init: function() {
      console.log('Application has started.');
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();


// var ctx = document.getElementById("myChart").getContext('2d');
// var myChart = new Chart(ctx, {
//   type: 'pie',
//   data: {
//     labels: ["Green", "Blue", "Gray", "Purple", "Yellow", "Red", "Black"],
//     datasets: [{
//       backgroundColor: [
//         "#2ecc71",
//         "#3498db",
//         "#95a5a6",
//         "#9b59b6",
//         "#f1c40f",
//         "#e74c3c",
//         "#34495e"
//       ],
//       data: [12, 19, 3, 17, 28, 24, 7]
//     }]
//   }
// });

