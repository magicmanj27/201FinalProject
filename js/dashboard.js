

//BUDGET CONTROLLER
var budgetController = (function(){


    // var x = 23;
    // var add = function (a) {
    //     return x + a;
    // }

    // return {
    //     publicTest: function(b){
    //        // console.log(add(b));
    //        return add(b);
    //     }
    // }



})();


//UI CONTROLLER
var UIController = (function(){
     var DOMstrings = {
         inputType: '.add__type',
         inputDescription: '.add__description',
         inputValue: '.add__value',
         inputBtn: '.add__btn'
     };
    return{
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
             };
          
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    }; 

})();


//GLOBAL APP CONTROLLER
var controller = (function(budgetCtrl, UICtrl) {

    var DOM = UICtrl.getDOMstrings();

var ctrlAddItem = function() {
    // 1. Get the field input data
    var input = UICtrl.getInput();
    console.log(input);


    // 2. Add the item to the budget controller

    // 3. Add the item to the UI

    // 4. calculate the budget

    // 5. Display the budget on the UI 

}
    
document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

document.addEventListener('keypress', function(event) {
//console.log(event);
if (event.keyCode === 13 || event.which === 13) {
    ctrlAddItem();
    // console.log('ENTER was pressed.');
}

});

// //budgetController.publicTest()
// var z = budgetCtrl.publicTest(5);
// return {
//     anotherPublic:function(){
//         console.log(z);
//     }
// }



})(budgetController, UIController);