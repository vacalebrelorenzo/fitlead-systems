const contactForm = document.querySelector("#contactForm");
const nomeInput = document.querySelector("#nome");
const emailInput = document.querySelector("#email");
const telefonoInput = document.querySelector("#telefono");
const messaggioInput = document.querySelector("#messaggio");
const formMessage = document.querySelector("#formMessage");

const header = document.querySelector(".site-header");
const navLinks = document.querySelectorAll(".site-header nav a[href^='#']");

const ctaHero = document.querySelector("#cta-hero");
const ctaSolution = document.querySelector("#cta-solution");
const ctaPrice = document.querySelector("#cta-price");
const contattiSection = document.querySelector("#contatti");


function trackEvent(eventName, eventData) {
    try {
        if (window.umami?.track) {
            window.umami.track(eventName, eventData);
        } else if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
            console.log("[tracking]", eventName, eventData || "");
        }
    } catch (e) {}
}

if (ctaHero) {
    ctaHero.addEventListener("click", function() {
        trackEvent("cta_hero_click");
    });
}

if (ctaSolution) {
    ctaSolution.addEventListener("click", function() {
        trackEvent("cta_solution_click");
    });
}

if (ctaPrice) {
    ctaPrice.addEventListener("click", function() {
        trackEvent("cta_price_click");
    });
}

if (contattiSection && "IntersectionObserver" in window) {
    let formViewTracked = false;

    const formViewObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !formViewTracked) {
                trackEvent("form_view");
                formViewTracked = true;
                formViewObserver.disconnect();
            }
        });
    }, { threshold: 0.3 });

    formViewObserver.observe(contattiSection);
}

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
    const sections = getMenuSections();

    if (sections.length === 0) {
        return;
    }

    const headerHeight = getHeaderHeight();
    const activationLine = headerHeight + Math.min(window.innerHeight * 0.32, 260);

    let currentSectionId = sections[0].id;
    let smallestDistance = Number.POSITIVE_INFINITY;

    sections.forEach(function(section) {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top;
        const sectionBottom = rect.bottom;

        const activationLineIsInsideSection = sectionTop <= activationLine && sectionBottom >= activationLine;

        if (activationLineIsInsideSection) {
            currentSectionId = section.id;
            smallestDistance = 0;
            return;
        }

        const distance = Math.abs(sectionTop - activationLine);

        if (distance < smallestDistance) {
            smallestDistance = distance;
            currentSectionId = section.id;
        }
    });

    updateActiveMenu(currentSectionId);
}

function getMenuSections() {
    return Array.from(navLinks)
        .map(function(link) {
            const sectionId = getSectionIdFromLink(link);
            return document.getElementById(sectionId);
        })
        .filter(function(section) {
            return section !== null;
        });
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

        trackEvent("form_submit_click");

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
            trackEvent("form_submit_error", { motivo: "validazione" });

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

            trackEvent("form_submit_success");

            showMessage("Richiesta inviata correttamente! Ti ricontatterò presto.", "success");

            contactForm.reset();

            setTimeout(function() {
                clearInputStates();
            }, 1200);

        } catch (error) {
            trackEvent("form_submit_error", { motivo: "invio" });
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

let mouseX = 50;
let mouseY = 50;
let ticking = false;

document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX / window.innerWidth) * 100;
    mouseY = (e.clientY / window.innerHeight) * 100;

    if (!ticking) {
        window.requestAnimationFrame(() => {
            document.documentElement.style.setProperty("--mx", mouseX + "%");
            document.documentElement.style.setProperty("--my", mouseY + "%");
            ticking = false;
        });

        ticking = true;
    }
});

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => revealObserver.observe(el));
} else {
    // fallback: tutto visibile
    revealElements.forEach(el => el.classList.add("visible"));
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (prefersReducedMotion.matches) {
    document.documentElement.style.setProperty("--mx", "50%");
    document.documentElement.style.setProperty("--my", "50%");
}


if (ctaHero && contattiSection) {
    ctaHero.addEventListener("click", () => {
        contattiSection.scrollIntoView({ behavior: "smooth" });

        setTimeout(() => {
            nomeInput?.focus();
        }, 700);
    });
}