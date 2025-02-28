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
  tabButtons[0].style.backgroundColor = "#5c3d2e";
  tabButtons[0].style.borderColor = "#3a2417";

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
    button.style.backgroundColor = "#5c3d2e";
    button.style.borderColor = "#3a2417";

    document
      .getElementById(button.getAttribute("data-tab"))
      .classList.add("active");
  }

  let selectedTea = "";
  let selectedIce = "none";
  let selectedTopping = "none";
  let orderNumber = `#B${Math.floor(1000 + Math.random() * 9000)}`;

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
      if (value === "jasmine" || value === "black") {
        showConfirmationPopup(
          "Did you want milk with that?",
          () => {
            // Yes
            selectedTea = `${value}-milk`;
            updateDrinkImage();
            updateDrinkName();
          },
          () => {
            // No
            selectedTea = value;
            updateDrinkImage();
            updateDrinkName();
          }
        );
      } else {
        selectedTea = value;
        updateDrinkImage();
        updateDrinkName();
      }
      option.classList.add("selected");
      displayCheckoutButton();
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

  function updateDrinkName() {
    let drinkName = selectedTea ? formatTeaName(selectedTea) : "";
    let toppingText =
      selectedTopping !== "none"
        ? formatToppingName(selectedTopping)
        : "No Topping";
    let iceText =
      selectedIce !== "none" ? formatIceName(selectedIce) : "No Ice";

    // Base price logic
    let basePrice = 0.0;
    if (selectedTea === "mango") {
      basePrice = 5.0; // Mango Green Tea starts at $5
    } else if (selectedTea) {
      basePrice = selectedTea.includes("-milk") ? 4.5 : 4.0;
    }

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
      "jasmine-milk": "Jasmine Milk Green Tea",
      black: "Classic Black Tea",
      "black-milk": "Classic Black Milk Tea",
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

  const checkoutContainer = document.getElementById("checkout-container");
  function displayCheckoutButton() {
    checkoutContainer.style.opacity = "1";
    checkoutContainer.style.transform = "scale(1)";
  }

  function updateDrinkImage() {
    const teaImg = document.getElementById("tea-overlay");

    if (!selectedTea) {
      teaImg.style.display = "none";
    } else {
      let teaFolder = selectedTea.includes("-milk") ? "with-milk" : "no-milk";
      let teaFilename = selectedTea.includes("-milk")
        ? `${selectedTea.replace("-milk", "")}.png`
        : `${selectedTea}.png`;

      if (teaFilename) {
        teaImg.style.display = "block";
        teaImg.src = `img/${teaFolder}/${teaFilename}`;
      }
    }

    // Ice image logic (only update if ice is selected)
    let iceFilename = selectedIce !== "none" ? `${selectedIce}.png` : "";
    const iceImg = document.getElementById("ice-overlay");
    if (iceFilename) {
      iceImg.style.display = "block";
      iceImg.src = `img/ice/${iceFilename}`;
    } else {
      iceImg.style.display = "none";
    }

    // Topping image logic (only update if topping is selected)
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
const polaroidWrapper = document.getElementById("polaroid-wrapper");

checkoutButton.addEventListener("mouseover", () => {
  checkoutButton.textContent = "Yes!";
});

checkoutButton.addEventListener("mouseout", () => {
  checkoutButton.textContent = "Ready to Check Out?";
});

checkoutButton.addEventListener("click", function () {
  polaroidWrapper.classList.add("polaroid-active");

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

/* Reset Scene */
orderAnotherButton.addEventListener("click", function () {
  // Reset the drink preview (images and selected options)
  polaroidWrapper.classList.remove("polaroid-active");

  // Hide images for tea, ice, and topping
  const teaImg = document.getElementById("tea-overlay");
  const iceImg = document.getElementById("ice-overlay");
  const toppingImg = document.getElementById("topping-overlay");

  teaImg.style.display = "none";
  iceImg.style.display = "none";
  toppingImg.style.display = "none";

  // Reset image sources
  teaImg.src = "";
  iceImg.src = "";
  toppingImg.src = "";

  // Reset the selected options
  selectedTea = "";
  selectedIce = "none";
  selectedTopping = "none";

  // Reset the "selected" class on all options
  const options = document.querySelectorAll(".option");
  options.forEach((option) => {
    option.classList.remove("selected");
  });

  // Reset the receipt content
  document.getElementById(
    "drink-name"
  ).innerHTML = `<p>Select your drink to generate a receipt.</p>`; // Clear receipt content

  // Reset the active tab back to "Tea"
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  // Remove active class from the current active tab and content
  tabButtons.forEach((button) => {
    button.classList.remove("active");
    button.style.backgroundColor = ""; // Reset background color
    button.style.borderColor = ""; // Reset border color
  });
  tabContents.forEach((content) => content.classList.remove("active"));

  // Set the "Tea" tab as active
  tabButtons[0].classList.add("active");
  tabButtons[0].style.backgroundColor = "#5c3d2e"; // Set the background color for the active tab
  tabButtons[0].style.borderColor = "#3a2417"; // Set the border color for the active tab

  // Show the Tea content
  document.getElementById("tea-options").classList.add("active");

  // Show the main container and hide checkout options
  document.getElementById("container").style.display = "flex";
  document.getElementById("panel").style.display = "flex";
  checkoutButton.style.display = "inline-block";
  document.getElementById("checkout-options").style.display = "none";
});

function showConfirmationPopup(message, onYes, onNo) {
  const confirmationPopup = document.getElementById("confirmation-popup");
  const confirmationMessage = document.getElementById("confirmation-message");
  const yesButton = document.getElementById("yes-button");
  const noButton = document.getElementById("no-button");

  confirmationMessage.textContent = message;

  confirmationPopup.classList.add("show");

  // Action for Yes button
  yesButton.addEventListener("click", () => {
    confirmationPopup.classList.remove("show");
    if (onYes) onYes();
  });

  // Action for No button
  noButton.addEventListener("click", () => {
    confirmationPopup.classList.remove("show");
    if (onNo) onNo();
  });
}
