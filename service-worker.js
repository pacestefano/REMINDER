// Funzione per verificare e richiedere i permessi per le notifiche
function checkNotificationPermission() {
    if (!("Notification" in window) || !('serviceWorker' in navigator) || !('PushManager' in window)) {
        alert("Il tuo browser non supporta le notifiche.");
        return;
    }

    // Richiedi il permesso di inviare notifiche
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            console.log("Permesso notifiche concesso");
        } else {
            alert("Non puoi ricevere notifiche push se non dai il permesso.");
        }
    });
}

// Funzione per registrare il Service Worker
function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
        .then(registration => {
            console.log('Service Worker registrato con successo:', registration);
        })
        .catch(error => {
            console.log('Registrazione del Service Worker fallita:', error);
        });
    }
}

// Funzione per salvare il promemoria e l'orario selezionato
function saveReminder() {
    const reminderText = document.getElementById('reminderText').value;
    const reminderTime = document.getElementById('reminderTime').value;

    if (reminderText && reminderTime) {
        const reminders = JSON.parse(localStorage.getItem('reminders')) || [];
        reminders.push({ text: reminderText, time: reminderTime });
        localStorage.setItem('reminders', JSON.stringify(reminders));

        alert("Promemoria salvato!");

        // Pianifica la notifica all'ora selezionata
        scheduleNotification(reminderText, reminderTime);
    } else {
        alert("Assicurati di inserire il testo del promemoria e selezionare un orario.");
    }
}

// Funzione per pianificare una notifica
function scheduleNotification(text, time) {
    const now = new Date();
    const [hours, minutes] = time.split(":");
    const reminderDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

    const timeUntilNotification = reminderDate.getTime() - now.getTime();

    setTimeout(() => {
        navigator.serviceWorker.ready.then(registration => {
            registration.showNotification("Promemoria", {
                body: text,
                icon: "/icons/icon-192x192.png"
            });
        });
    }, timeUntilNotification);
}

// Aggiungi l'evento click al pulsante per abilitare le notifiche
document.getElementById('enableNotificationsButton').addEventListener('click', () => {
    checkNotificationPermission();
    registerServiceWorker();
});

window.onload = () => {
    // Registrazione del Service Worker al caricamento della pagina
    registerServiceWorker();
};
