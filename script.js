/* Starting Scene */
const startButton = document.getElementById("start-button");
const container = document.getElementById("container");
const startScreen = document.getElementById("start-screen");

startButton.addEventListener("mouseover", () => {
  startButton.textContent = "Yes!";
});

startButton.addEventListener("mouseout", () => {
  startButton.textContent = "Ready to Order?";
});

startButton.addEventListener("click", () => {
  container.style.display = "flex";
  startScreen.style.display = "none";
});

/* Main Scene */
document.addEventListener("DOMContentLoaded", () => {
  const options = document.querySelectorAll(".option");
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabContents.forEach((tab) => tab.classList.remove("active"));
  document.getElementById("tea-options").classList.add("active");

  tabButtons[0].classList.add("active");
  tabButtons[0].style.backgroundColor = "#a37d5c";
  tabButtons[0].style.borderColor = "#5c3d2e";

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      handleTabChange(button);
    });
    button.addEventListener("touchstart", (e) => {
      e.preventDefault();
      handleTabChange(button);
    });
  });

  function handleTabChange(button) {
    const currentActiveButton = document.querySelector(".tab-button.active");
    currentActiveButton.classList.remove("active");
    currentActiveButton.style.backgroundColor = "";
    currentActiveButton.style.borderColor = "";

    document.querySelector(".tab-content.active").classList.remove("active");

    button.classList.add("active");
    button.style.backgroundColor = "#a37d5c";
    button.style.borderColor = "#5c3d2e";

    document
      .getElementById(button.getAttribute("data-tab"))
      .classList.add("active");
  }

  let selectedTea = "";
  let selectedIce = "none";
  let selectedTopping = "none";
  let orderNumber = `#B${Math.floor(1000 + Math.random() * 9000)}`;

  function updateDrinkName() {
    let drinkName = selectedTea ? formatTeaName(selectedTea) : "";
    let toppingText =
      selectedTopping !== "none"
        ? formatToppingName(selectedTopping)
        : "No Topping";
    let iceText =
      selectedIce !== "none" ? formatIceName(selectedIce) : "No Ice";

    // Base price logic
    let basePrice = selectedTea ? (selectedTea === "mango" ? 4.5 : 4.0) : 0.0;

    // Topping cost calculation
    let toppingCost = 0.0;
    if (selectedTopping !== "none") {
      if (selectedTopping === "red-bean") {
        toppingCost = 1.0; // Red-bean topping costs $1
      } else {
        toppingCost = 0.5; // Other toppings cost $0.50
      }
    }

    // Total price calculation
    let totalPrice = basePrice + toppingCost;

    // Additional logic for mango + red-bean combo
    if (selectedTea === "mango" && selectedTopping === "red-bean") {
      totalPrice = 6.0;
    }

    let formattedPrice = `$${totalPrice.toFixed(2)}`;

    let timestamp = new Date().toLocaleString();

    let receiptHTML = `
      <div class="receipt-line"></div>
      <strong>BEV'S BOBA CAFE 🍵</strong>
      <div class="receipt-line"></div>
      Order: ${orderNumber} <br>
      <strong>${drinkName}</strong>
      ${toppingText}, ${iceText} <br>
      <div class="receipt-line"></div>
      <div class="receipt-total">Total: ${formattedPrice}</div>
      <div class="receipt-line"></div>
      Thank You! Have a Sweet Day! <br>
      ${timestamp} <br>
      <div class="receipt-line"></div>
    `;

    document.getElementById("drink-name").innerHTML = receiptHTML;
  }

  function formatTeaName(tea) {
    let teaNames = {
      jasmine: "Jasmine Green Tea",
      black: "Classic Black Tea",
      mango: "Mango Green Tea",
    };
    return teaNames[tea] || "Custom Tea";
  }

  function formatToppingName(topping) {
    let toppingNames = {
      boba: "Boba Pearls",
      lychee: "Lychee Jelly",
      "red-bean": "Red Bean",
    };
    return toppingNames[topping] || "No Topping";
  }

  function formatIceName(ice) {
    let iceLevels = {
      normal: "Normal Ice",
      less: "Less Ice",
      none: "No Ice",
    };
    return iceLevels[ice] || "No Ice";
  }

  options.forEach((option) => {
    option.addEventListener("click", () => {
      handleOptionSelection(option);
      updateDrinkName();
    });
    option.addEventListener("touchstart", (e) => {
      e.preventDefault();
      handleOptionSelection(option);
      updateDrinkName();
    });
  });

  function handleOptionSelection(option) {
    const type = option.getAttribute("data-type");
    const value = option.getAttribute("data-value");

    options.forEach((opt) => {
      if (opt.getAttribute("data-type") === type) {
        opt.classList.remove("selected");
      }
    });

    if (type === "tea") {
      selectedTea = value;
      option.classList.add("selected");
      updateDrinkImage();
    } else if (type === "ice") {
      option.classList.add("selected");
      selectedIce = value;
      updateDrinkImage();
    } else if (type === "topping") {
      option.classList.add("selected");
      selectedTopping = value;
      updateToppingOverlay();
    }
  }

  function updateDrinkImage() {
    let teaFilename = selectedTea ? `${selectedTea}.png` : "";

    const teaImg = document.getElementById("tea-overlay");
    if (teaFilename) {
      teaImg.style.display = "block";
      teaImg.src = `img/no-milk/${teaFilename}`;
    } else {
      teaImg.style.display = "none";
    }

    // Update ice image if selected (display only if not 'no' ice)
    let iceFilename = selectedIce !== "none" ? `${selectedIce}.png` : "";
    const iceImg = document.getElementById("ice-overlay");
    if (iceFilename) {
      iceImg.style.display = "block";
      iceImg.src = `img/ice/${iceFilename}`;
    } else {
      iceImg.style.display = "none";
    }

    const toppingImg = document.getElementById("topping-overlay");
    if (selectedTopping !== "none") {
      toppingImg.style.display = "block";
      toppingImg.src = `img/toppings/${selectedTopping}.png`;
    } else {
      toppingImg.style.display = "none";
    }
  }

  function updateToppingOverlay() {
    const toppingImg = document.getElementById("topping-overlay");
    if (selectedTopping === "none") {
      toppingImg.style.display = "none";
      toppingImg.src = "";
    } else {
      toppingImg.style.display = "block";
      toppingImg.src = `img/toppings/${selectedTopping}.png`;
    }
  }
});

/* End Scene */
const checkoutButton = document.getElementById("checkout-button");

checkoutButton.addEventListener("mouseover", () => {
  checkoutButton.textContent = "Yes!";
});

checkoutButton.addEventListener("mouseout", () => {
  checkoutButton.textContent = "Ready to Check Out?";
});

// Button to trigger the checkout options
checkoutButton.addEventListener("click", function () {
  document.getElementById("panel").style.display = "none";
  document.getElementById("checkout-options").style.display = "flex";
  checkoutButton.style.display = "none";
});

const orderAnotherButton = document.getElementById("order-another-button");

orderAnotherButton.addEventListener("mouseover", () => {
  orderAnotherButton.textContent = "Yes!";
});

orderAnotherButton.addEventListener("mouseout", () => {
  orderAnotherButton.textContent = "Order Another Drink?";
});

// Button to order another drink
orderAnotherButton.addEventListener("click", function () {
  // Reset the drink preview (images and selected options)
  const teaImg = document.getElementById("tea-overlay");
  const iceImg = document.getElementById("ice-overlay");
  const toppingImg = document.getElementById("topping-overlay");

  teaImg.style.display = "none";
  iceImg.style.display = "none";
  toppingImg.style.display = "none";

  // Reset the selected options
  selectedTea = "";
  selectedIce = "none";
  selectedTopping = "none";

  // Reset the receipt content
  document.getElementById(
    "drink-name"
  ).innerHTML = `<p>Select your drink to generate a receipt.<p>`;

  // Show the main container and hide checkout options
  document.getElementById("container").style.display = "flex";
  document.getElementById("panel").style.display = "flex";
  checkoutButton.style.display = "inline-block";
  document.getElementById("checkout-options").style.display = "none";
});
