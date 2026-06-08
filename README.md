# FitLead Systems

Landing page realizzata per presentare **FitLead Systems**, un servizio pensato per aiutare palestre, personal trainer e piccole attività fitness a ricevere più richieste online tramite una pagina semplice, chiara e professionale.

## Obiettivo del progetto

L’obiettivo della landing page è mostrare in modo immediato:

- il problema delle attività fitness che vengono viste online ma ricevono poche richieste;
- la soluzione proposta da FitLead Systems;
- a chi è pensato il servizio;
- cosa include il pacchetto base;
- il prezzo di lancio;
- un form di contatto realmente funzionante.

Il progetto è stato costruito per comunicare il risultato in modo semplice, evitando testi troppo tecnici e rendendo la pagina comprensibile anche a persone che non conoscono il mondo dello sviluppo web.

## Link sito online

https://fitlead-systems.netlify.app/

## Tecnologie utilizzate

- HTML5
- CSS3
- JavaScript
- Git
- GitHub
- Netlify
- Netlify Forms

## File principali

- `index.html`: struttura della pagina e contenuti principali
- `style.css`: stile grafico, colori, responsive, layout, sezioni e interazioni visive
- `script.js`: validazione del form, messaggi di errore/conferma, menu attivo durante lo scroll e invio reale dei dati
- `images/`: immagini e mockup utilizzati nella landing page

## Funzionalità attuali

- Hero section professionale
- Sezione Problema
- Sezione Soluzione
- Sezione "Perché ti serve"
- Sezione "Per chi è pensato"
- Sezione "Cosa include il pacchetto"
- Sezione Prezzo lancio con offerta da 399 €
- Sezione Servizi
- Sezione Contatti
- Form contatto con nome, email, telefono e messaggio
- Regola del form: email o telefono obbligatorio, ma non entrambi
- Controllo email valido
- Controllo numero di cellulare italiano
- Messaggi di errore e conferma
- Invio reale delle richieste tramite Netlify Forms
- Campo anti-spam honeypot
- Menu che evidenzia automaticamente la sezione attiva durante lo scroll
- Fix del menu attivo quando si clicca una voce della navbar
- Menu mobile orizzontale e scorrevole
- Design responsive per desktop, tablet e smartphone
- Deploy automatico tramite GitHub e Netlify

## Form contatto

Il form è collegato a **Netlify Forms** e permette di ricevere realmente le richieste inviate dalla landing page.

Prima dell’invio, JavaScript controlla:

- che il nome sia valido;
- che il messaggio sia abbastanza dettagliato;
- che sia presente almeno un contatto tra email e telefono;
- che l’email sia scritta correttamente;
- che il numero di telefono sia un cellulare italiano valido.

Il controllo del telefono accetta numeri di cellulare italiani con o senza prefisso internazionale, ad esempio nel formato nazionale o con prefisso `+39` / `0039`.

Se i dati sono corretti, la richiesta viene inviata a Netlify Forms e viene mostrato un messaggio di conferma.

## Responsive e interazione

La landing page è ottimizzata per:

- desktop;
- tablet;
- smartphone.

Su mobile il menu resta utilizzabile tramite scorrimento orizzontale. Il link attivo viene evidenziato in base alla sezione visualizzata.

È stato migliorato anche il comportamento del menu quando si clicca direttamente una voce della navbar: la sezione corretta viene raggiunta e il focus del menu si aggiorna subito, senza dover cliccare due volte.

## Stato del progetto

Il progetto è online, funzionante e collegato a Netlify Forms.

Attualmente FitLead Systems può essere usato come progetto dimostrativo per presentare un servizio di landing page rivolto a palestre, personal trainer e piccole attività fitness.

## Possibili miglioramenti futuri

- collegamento a un dominio personalizzato;
- aggiunta di statistiche e tracking;
- integrazione con Google Analytics o strumenti simili;
- automazioni email dopo l’invio del form;
- aggiunta di casi studio o esempi reali;
- miglioramento SEO locale;
- aggiunta di testimonianze;
- creazione di pacchetti servizio più completi;
- ottimizzazione ulteriore delle performance;
- miglioramento accessibilità.

## Autore

Progetto realizzato da **Lorenzo Vacalebre**.