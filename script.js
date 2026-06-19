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
let isMenuClickScrolling = false;
let menuClickTimeout;

if (navLinks.length > 0) {
    window.addEventListener("scroll", function() {
        if (isMenuClickScrolling) {
            return;
        }

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
}

function updateActiveMenuOnScroll() {
    const headerHeight = getHeaderHeight();
    const scrollPosition = window.scrollY + headerHeight + 120;

    let currentSectionId = "";

    navLinks.forEach(function(link) {
        const sectionId = getSectionIdFromLink(link);
        const section = document.getElementById(sectionId);

        if (!section) {
            return;
        }

        if (section.offsetTop <= scrollPosition) {
            currentSectionId = sectionId;
        }
    });

    const pageBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 5;

    if (pageBottom && navLinks.length > 0) {
        const lastLink = navLinks[navLinks.length - 1];
        currentSectionId = getSectionIdFromLink(lastLink);
    }

    updateActiveMenu(currentSectionId);
}

function updateActiveMenu(sectionId) {
    if (!sectionId) {
        return;
    }

    navLinks.forEach(function(link) {
        const linkTarget = getSectionIdFromLink(link);

        if (linkTarget === sectionId) {
            link.classList.add("active");
            link.setAttribute("aria-current", "page");

            if (window.innerWidth <= 700) {
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

function getSectionIdFromLink(link) {
    return link.getAttribute("href").replace("#", "");
}

function getHeaderHeight() {
    return header ? header.offsetHeight : 0;
}


/* =========================
   CLICK MENU CON STATO ATTIVO IMMEDIATO
========================= */

navLinks.forEach(function(link) {
    link.addEventListener("click", function(event) {
        event.preventDefault();

        const sectionId = getSectionIdFromLink(link);
        const section = document.getElementById(sectionId);

        if (!section) {
            return;
        }

        const headerHeight = getHeaderHeight();
        const sectionPosition = section.getBoundingClientRect().top + window.scrollY - headerHeight + 2;

        isMenuClickScrolling = true;

        updateActiveMenu(sectionId);

        window.scrollTo({
            top: sectionPosition,
            behavior: "smooth"
        });

        clearTimeout(menuClickTimeout);

        menuClickTimeout = setTimeout(function() {
            isMenuClickScrolling = false;
            updateActiveMenuOnScroll();
        }, 850);
    });
});


/* =========================
   VALIDAZIONE + INVIO NETLIFY FORMS
========================= */

if (contactForm) {
    contactForm.setAttribute("novalidate", "true");

    contactForm.addEventListener("submit", async function(event) {
        event.preventDefault();

        const submitButton = contactForm.querySelector("button[type='submit']");
        const originalButtonText = submitButton ? submitButton.textContent : "";

        clearInputStates();
        clearMessage();

        const nome = getInputValue(nomeInput);
        const email = getInputValue(emailInput);
        const telefono = getInputValue(telefonoInput);
        const messaggio = getInputValue(messaggioInput);

        const validationError = validateForm(nome, email, telefono, messaggio);

        if (validationError) {
            showMessage(validationError.message, "error");
            setInvalid(validationError.input);

            if (validationError.secondInput) {
                setInvalid(validationError.secondInput);
            }

            validationError.input?.focus();
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

        try {
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = "Invio in corso...";
            }

            const formData = new FormData(contactForm);

            const response = await fetch("/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams(formData).toString()
            });

            if (!response.ok) {
                throw new Error("Errore durante l'invio del form.");
            }

            showMessage("Richiesta inviata correttamente! Ti ricontatterò presto.", "success");

            contactForm.reset();

            setTimeout(function() {
                clearInputStates();
            }, 1200);

        } catch (error) {
            showMessage("C'è stato un problema durante l'invio. Riprova tra poco.", "error");
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText || "Richiedi mini-analisi gratuita";
            }
        }
    });
}


/* =========================
   VALIDAZIONE LIVE INPUT
========================= */

if (nomeInput) {
    nomeInput.addEventListener("input", function() {
        const nome = nomeInput.value.trim();

        if (nome === "") {
            resetInputState(nomeInput);
            return;
        }

        if (nome.length >= 2) {
            setValid(nomeInput);
        } else {
            setInvalid(nomeInput);
        }
    });
}

if (messaggioInput) {
    messaggioInput.addEventListener("input", function() {
        const messaggio = messaggioInput.value.trim();

        if (messaggio === "") {
            resetInputState(messaggioInput);
            return;
        }

        if (messaggio.length >= 10) {
            setValid(messaggioInput);
        } else {
            setInvalid(messaggioInput);
        }
    });
}

if (emailInput) {
    emailInput.addEventListener("input", function() {
        const email = emailInput.value.trim();

        if (email === "") {
            resetInputState(emailInput);
            return;
        }

        if (isValidEmail(email)) {
            setValid(emailInput);
        } else {
            setInvalid(emailInput);
        }
    });
}

if (telefonoInput) {
    telefonoInput.addEventListener("input", function() {
        telefonoInput.value = telefonoInput.value
            .replace(/[^\d+\s().-]/g, "")
            .replace(/(?!^)\+/g, "");

        const telefono = telefonoInput.value.trim();

        if (telefono === "") {
            resetInputState(telefonoInput);
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
   FUNZIONI DI VALIDAZIONE
========================= */

function validateForm(nome, email, telefono, messaggio) {
    if (nome.length < 2) {
        return {
            input: nomeInput,
            message: "Inserisci un nome valido."
        };
    }

    if (email === "" && telefono === "") {
        return {
            input: emailInput,
            secondInput: telefonoInput,
            message: "Inserisci almeno un contatto: email o numero di telefono."
        };
    }

    if (email !== "" && !isValidEmail(email)) {
        return {
            input: emailInput,
            message: "Inserisci un indirizzo email valido."
        };
    }

    if (telefono !== "" && !isValidPhone(telefono)) {
        return {
            input: telefonoInput,
            message: "Inserisci un numero di telefono valido."
        };
    }

    if (messaggio.length < 10) {
        return {
            input: messaggioInput,
            message: "Scrivi un messaggio un po' più dettagliato."
        };
    }

    return null;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const cleanPhone = phone.replace(/[\s\-().]/g, "");

    const italianPhoneRegex = /^(?:\+39|0039)?\d{8,11}$/;

    return italianPhoneRegex.test(cleanPhone);
}


/* =========================
   FUNZIONI DI SUPPORTO
========================= */

function getInputValue(input) {
    return input ? input.value.trim() : "";
}

function showMessage(text, type) {
    if (!formMessage) {
        return;
    }

    formMessage.textContent = text;

    formMessage.classList.remove("error", "success");

    if (type) {
        formMessage.classList.add(type);
    }
}

function clearMessage() {
    if (!formMessage) {
        return;
    }

    formMessage.textContent = "";
    formMessage.classList.remove("error", "success");
}

function setValid(input) {
    if (!input) {
        return;
    }

    input.classList.remove("invalid");
    input.classList.add("valid");
}

function setInvalid(input) {
    if (!input) {
        return;
    }

    input.classList.remove("valid");
    input.classList.add("invalid");
}

function resetInputState(input) {
    if (!input) {
        return;
    }

    input.classList.remove("valid", "invalid");
}

function clearInputStates() {
    const inputs = [nomeInput, emailInput, telefonoInput, messaggioInput];

    inputs.forEach(function(input) {
        resetInputState(input);
    });
}