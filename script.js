const contactForm = document.querySelector("#contactForm");
const nomeInput = document.querySelector("#nome");
const emailInput = document.querySelector("#email");
const telefonoInput = document.querySelector("#telefono");
const messaggioInput = document.querySelector("#messaggio");
const formMessage = document.querySelector("#formMessage");

const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".site-header nav a[href^='#']");

/* =========================
   MENU ATTIVO DURANTE LO SCROLL
========================= */

let isScrolling = false;

window.addEventListener("scroll", function() {
    if (!isScrolling) {
        window.requestAnimationFrame(function() {
            updateActiveMenuOnScroll();
            isScrolling = false;
        });

        isScrolling = true;
    }
});

window.addEventListener("load", updateActiveMenuOnScroll);
window.addEventListener("resize", updateActiveMenuOnScroll);

function updateActiveMenuOnScroll() {
    const headerHeight = header ? header.offsetHeight : 0;
    const scrollPosition = window.scrollY + headerHeight + 80;

    let currentSectionId = "";

    navLinks.forEach(function(link) {
        const sectionId = link.getAttribute("href").replace("#", "");
        const section = document.getElementById(sectionId);

        if (!section) {
            return;
        }

        if (section.offsetTop <= scrollPosition) {
            currentSectionId = sectionId;
        }
    });

    const pageBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 5;

    if (pageBottom) {
        const lastLink = navLinks[navLinks.length - 1];

        if (lastLink) {
            currentSectionId = lastLink.getAttribute("href").replace("#", "");
        }
    }

    updateActiveMenu(currentSectionId);
}

function updateActiveMenu(sectionId) {
    navLinks.forEach(function(link) {
        const linkTarget = link.getAttribute("href").replace("#", "");

        if (linkTarget === sectionId) {
            link.classList.add("active");
            link.setAttribute("aria-current", "true");

            if (window.innerWidth <= 600) {
                link.scrollIntoView({
                    behavior: "smooth",
                    inline: "center",
                    block: "nearest"
                });
            }
        } else {
            link.classList.remove("active");
            link.removeAttribute("aria-current");
        }
    });
}


/* =========================
   CLICK MENU CON STATO ATTIVO IMMEDIATO
========================= */

navLinks.forEach(function(link) {
    link.addEventListener("click", function() {
        const sectionId = link.getAttribute("href").replace("#", "");
        updateActiveMenu(sectionId);
    });
});


/* =========================
   VALIDAZIONE FORM
========================= */

if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const telefono = telefonoInput.value.trim();
        const messaggio = messaggioInput.value.trim();

        clearInputStates();

        if (nome.length < 2) {
            setInvalid(nomeInput);
            showMessage("Inserisci un nome valido.", "error");
            return;
        }

        if (messaggio.length < 10) {
            setInvalid(messaggioInput);
            showMessage("Scrivi un messaggio un po' più dettagliato.", "error");
            return;
        }

        if (email === "" && telefono === "") {
            setInvalid(emailInput);
            setInvalid(telefonoInput);
            showMessage("Inserisci almeno un contatto: email o numero di telefono.", "error");
            return;
        }

        if (email !== "" && !isValidEmail(email)) {
            setInvalid(emailInput);
            showMessage("Inserisci un indirizzo email valido.", "error");
            return;
        }

        if (telefono !== "" && !isValidPhone(telefono)) {
            setInvalid(telefonoInput);
            showMessage("Inserisci un numero di cellulare italiano valido.", "error");
            return;
        }

        setValid(nomeInput);
        setValid(messaggioInput);

        if (email !== "") {
            setValid(emailInput);
        }

        if (telefono !== "") {
            setValid(telefonoInput);
        }

        showMessage("Richiesta inviata correttamente! Ti ricontatterò presto.", "success");

        contactForm.reset();

        setTimeout(function() {
            clearInputStates();
        }, 1200);
    });
}


/* =========================
   INTERAZIONE EMAIL
========================= */

if (emailInput) {
    emailInput.addEventListener("input", function() {
        const email = emailInput.value.trim();

        if (email === "") {
            emailInput.classList.remove("valid", "invalid");
            return;
        }

        if (isValidEmail(email)) {
            setValid(emailInput);
        } else {
            setInvalid(emailInput);
        }
    });
}


/* =========================
   INTERAZIONE TELEFONO
========================= */

if (telefonoInput) {
    telefonoInput.addEventListener("input", function() {
        telefonoInput.value = telefonoInput.value
            .replace(/[^\d+\s().-]/g, "")
            .replace(/(?!^)\+/g, "");

        const telefono = telefonoInput.value.trim();

        if (telefono === "") {
            telefonoInput.classList.remove("valid", "invalid");
            return;
        }

        if (isValidPhone(telefono)) {
            setValid(telefonoInput);
        } else {
            setInvalid(telefonoInput);
        }
    });
}


/* =========================
   FUNZIONI DI SUPPORTO
========================= */

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const cleanPhone = phone.replace(/[\s\-().]/g, "");
    const italianMobileRegex = /^(?:\+39|0039)?3\d{9}$/;
    return italianMobileRegex.test(cleanPhone);
}

function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.classList.remove("error", "success");
    formMessage.classList.add(type);
}

function setValid(input) {
    input.classList.remove("invalid");
    input.classList.add("valid");
}

function setInvalid(input) {
    input.classList.remove("valid");
    input.classList.add("invalid");
}

function clearInputStates() {
    const inputs = [nomeInput, emailInput, telefonoInput, messaggioInput];

    inputs.forEach(function(input) {
        input.classList.remove("valid", "invalid");
    });
}