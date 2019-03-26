// HANDLES DATA MANIPULATION/CALCULATION
let budgetController = (function () {
  let Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  let Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  }

  let data = {
    allItems: {
      expense: [],
      income: [],
    },
    totals: {
      expense: 0,
      income: 0
    },
    budget: 0,
    percentage: -1
  }

  let calculateTotal = function (type) {
    let sum = 0;
    data.allItems[type].forEach(cur => sum += cur.value);
    data.totals[type] = sum;
  }

  return {
    addItem: function (type, desc, val) {
      let newItem, ID;

      // Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }
      // Create new item (object) based on 'increment' or 'expense' type
      if (type === 'expense') {
        newItem = new Expense(ID, desc, val);
      } else {
        newItem = new Income(ID, desc, val);
      }
      // Push it into our data structure
      data.allItems[type].push(newItem); // [type] is bracket notation not an array
      return newItem;
    },
    calculateBudget: function () {
      // Sums up totlals for income and expenses
      calculateTotal('income');
      calculateTotal('expense');

      // Calculates budget
      data.budget = data.totals.income - data.totals.expense;

      // calculate percentage
      if (data.budget > 0) {
        data.percentage = Math.round((data.totals.expense / data.totals.income) * 100);
      } else {
        data.percentage = -1;
      }
    },
    getBudget: function () {
      return {
        totalIncome: data.totals.income,
        totalExpenses: data.totals.expense,
        budget: data.budget,
        percentage: data.percentage
      }
    },
    logData: function () {
      console.log(data);
    }
  }
})();

// HANDLES UI ELEMENTS
let UIController = (function () {
  let DOMstrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputBtn: '.add__btn',
    incomeContainer: '.income__list',
    expensesContainer: '.expenses__list',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    budgetLabel: '.budget__value',
    percentageLabel: '.budget__expenses--percentage'
  }

  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // will be either income or expense
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: value = parseFloat(document.querySelector(DOMstrings.inputValue).value)
      }
    },
    getDOMStrings: function () {
      return DOMstrings;
    },
    addListItem: function (obj, type) {
      var html, newHTML, element;

      if (type === "income") {
        element = DOMstrings.incomeContainer;
        html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div ><div class="right clearfix"><div class="item__value">+ %value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >';
      } else if (type === "expense") {
        element = DOMstrings.expensesContainer;
        html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div ><div class="right clearfix"><div class="item__value">- %value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div >';
      }

      newHTML = html.replace('%id%', obj.id);
      newHTML = newHTML.replace('%description%', obj.description);
      newHTML = newHTML.replace('%value%', obj.value);

      document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);
    },
    clearFields: function () {
      var fields, fieldsArr;

      fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(curr => curr.value = "");
    },
    displayBudget: function (obj) {
      document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalIncome.toFixed(2);
      document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExpenses.toFixed(2);
      document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget.toFixed(2);
      document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';
    }
  }
})();

// GLOBAL APP CONTROLLER
let controller = (function (budgetCtrl, UICtrl) {
  let setupEventListeners = function () {
    let DOMStrings = UICtrl.getDOMStrings();

    document.querySelector(DOMStrings.inputBtn).addEventListener('click', ctrlAddItem);
    document.addEventListener("keypress", event => {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  }

  let ctrlAddItem = function () {
    // 1. Get the field input data
    let input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      // 2. Add item to the budget controller
      let newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // 3. Add new item to the UI
      // - Create HTML string with placeholder text
      // - Replace the placeholder text with some actual data
      // - Insert the HTML into the DOM
      UICtrl.addListItem(newItem, input.type);
      UICtrl.clearFields();

      // 4. Calculate the budget
      budgetCtrl.calculateBudget();
      let budget = budgetCtrl.getBudget();
      UICtrl.displayBudget(budget);
    }
  }
  return {
    init: function () {
      console.log("Application has started.");
      UICtrl.displayBudget({
        totalIncome: 0,
        totalExpenses: 0,
        budget: 0,
        percentage: 0
      });
      setupEventListeners();
    }
  }
})(budgetController, UIController);


controller.init();