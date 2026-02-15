const form = document.querySelector("#inventory-form");
form.addEventListener("change", function () {
  const updateBtn = document.querySelector("#save-changes-btn");
  updateBtn.removeAttribute("disabled");
});
