$(document).ready(function () {
  loadItems();
});

var money = 0;

function loadItems() {
  $("#displayItems").empty();
  let itemDisplay = $("#displayItems");
  $.ajax({
    type: "GET",
    url: "http://vending.us-east-1.elasticbeanstalk.com/items",
    success: function (allItems, status) {
      $.each(allItems, function (index, item) {
        var data = $("#itemTemplate").clone();
        data.find("#item-number").text(item.id);
        data.attr("onclick", "selectItem(" + item.id + ")");
        data.find("#item-name").text(item.name);
        data.find("#item-price").text("$" + item.price.toFixed(2));
        data.find("#item-quantity").text("Quantiy: " + item.quantity);
        itemDisplay.append(data);
      });
    },
    error: function () {
      $("#errorMessages").append(
        $("<li>")
          .attr({ class: "list-group-item list-group-item-danger" })
          .text("Error calling web service. Please try again later.")
      );
    },
  });
}

function selectItem(id) {
  $("#itemChoice").text(id);
}

$("#addDollar").click(function (event) {
  $("#changeDisplay").text("");
  $("#itemChoice").text("");
  $("#displayMessage").text("");
  money += 1;
  let addValue = document.getElementById("addMoney");
  addValue.innerHTML = money.toFixed(2);
});

$("#addQuarter").click(function (event) {
  $("#changeDisplay").text("");
  $("#itemChoice").text("");
  $("#displayMessage").text("");
  money += 0.25;
  let addValue = document.getElementById("addMoney");
  addValue.innerHTML = money.toFixed(2);
});

$("#addDime").click(function (event) {
  $("#changeDisplay").text("");
  $("#itemChoice").text("");
  $("#displayMessage").text("");
  money += 0.1;
  let addValue = document.getElementById("addMoney");
  addValue.innerHTML = money.toFixed(2);
});

$("#addNickel").click(function (event) {
  $("#changeDisplay").text("");
  $("#itemChoice").text("");
  $("#displayMessage").text("");
  money += 0.05;
  let addValue = document.getElementById("addMoney");
  addValue.innerHTML = money.toFixed(2);
});

$("#purchaseButton").click(function (event) {
  let itemID = $("#itemChoice").text();
  $.ajax({
    type: "POST",
    url:
      "http://vending.us-east-1.elasticbeanstalk.com/money/" +
      money.toFixed(2) +
      "/item/" +
      itemID,
    success: function (change, status) {
      let changeArray = changeReturn(change);
      displayMessage(changeArray);
      loadItems();
    },
    error: function (result) {
      errorMessage(result.responseJSON.message);
    },
  });
});

function changeReturn(change) {
  let changeArray = [];
  changeArray.push(change.quarters);
  changeArray.push(change.dimes);
  changeArray.push(change.nickels);
  changeArray.push(change.pennies);
  return changeArray;
}

function changeDisplay(change) {
  let result = "";

  if (change[0] > 0) {
    result += change[0];
    result += change[0] > 1 ? " Quarters" : " Quarter";
    result += ", ";
  }

  if (change[1] > 0) {
    result += change[1];
    result += change[1] > 1 ? " Dimes" : " Dime";
    result += ", ";
  }

  if (change[2] > 0) {
    result += change[2];
    result += change[2] > 1 ? " Nickels" : " Nickel";
    result += ", ";
  }

  if (change[3] > 0) {
    result += change[3];
    result += change[3] > 1 ? " Pennies" : " Penny";
  }

  if (result.endsWith(", ")) {
    result = result.slice(0, result.length - 2);
  }

  $("#changeDisplay").text(result);
  money = 0;
  $("#addMoney").text("0.00");
}

function makeChange(money) {
  let quarters = Math.floor(money / 0.25);
  money = (money - 0.25 * quarters).toFixed(2);

  let dimes = Math.floor(money / 0.1);
  money = (money - 0.1 * dimes).toFixed(2);

  let nickels = Math.floor(money / 0.05);
  money = (money - 0.05 * nickels).toFixed(2);

  let pennies = money;

  changeDisplay([quarters, dimes, nickels, pennies]);

  $("#addMoney").text("0.00");
}

$("#changeButton").click(function (event) {
  $("#changeDisplay").text.value = "";
  makeChange(money);
  money = 0;
});

function displayMessage(changeArray) {
  $("#displayMessage").text("Thank you for your purchase! 🖤");
  changeDisplay(changeArray);
}

function errorMessage(string) {
  $("#displayMessage").text(string);
}
