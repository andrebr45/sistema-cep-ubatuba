
const form = document.querySelector(".container form"),
      nextBtn = form.querySelector(".nextBtn"),
      backBtn = form.querySelector(".backBtn"),
      allInput = form.querySelectorAll("input, select");

nextBtn.addEventListener("click", () => {
    let allFieldsFilled = true;

    allInput.forEach(input => {
        if (!input.value) {
            allFieldsFilled = false;
        }
    });

    if (allFieldsFilled) {
        form.classList.add('secActive');
    } else {
        alert('Por favor, preencha todos os campos antes de prosseguir.');
    }
});

backBtn.addEventListener("click", () => form.classList.remove('secActive'));