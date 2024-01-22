const checkBoxes = document.querySelectorAll('input[type="checkbox"]');

checkBoxes.forEach((checkBox) =>
  checkBox.addEventListener("click", clickCheckBox)
);

function clickCheckBox(e) {
  const currentValue = Number(e.target.value);
  checkBoxes.forEach(
    (checkBox) => (checkBox.checked = currentValue >= Number(checkBox.value))
  );
}
