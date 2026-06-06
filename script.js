const contactForm = document.querySelector("#contactForm");
const nomeInput = document.querySelector("#nome");
const emailInput = document.querySelector("#email");
const telefonoInput = document.querySelector("#telefono");
const messaggioInput = document.querySelector("#messaggio");
const formMessage = document.querySelector("#formMessage");

if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const telefono = telefonoInput.value.trim();
        const messaggio = messaggioInput.value.trim();

        if (nome.length < 2) {
            showMessage("Inserisci un nome valido.", "error");
            return;
        }

        if (messaggio.length < 10) {
            showMessage("Scrivi un messaggio un po' più dettagliato.", "error");
            return;
        }

        if (email === "" && telefono === "") {
            showMessage("Inserisci almeno un contatto: email o numero di telefono.", "error");
            return;
        }

        if (email !== "" && !isValidEmail(email)) {
            showMessage("Inserisci un indirizzo email valido.", "error");
            return;
        }

        if (telefono !== "" && !isValidPhone(telefono)) {
            showMessage("Inserisci un numero di telefono valido.", "error");
            return;
        }

        showMessage("Richiesta inviata correttamente! Ti ricontatterò presto.", "success");

        contactForm.reset();
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const cleanPhone = phone.replace(/[\s\-().]/g, "");
    const phoneRegex = /^\+?[0-9]{8,15}$/;
    return phoneRegex.test(cleanPhone);
}

function showMessage(text, type) {
    formMessage.textContent = text;

    formMessage.classList.remove("error", "success");
    formMessage.classList.add(type);
}