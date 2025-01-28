//////////////////////////////////////// 1. ADD SENSOR ////////////////////////////////////

let sensorIndex = 1; // Index initial pour les capteurs

// Fonction pour ajouter un capteur
function addSensor() {
    const container = document.getElementById('sensors-container');
    const firstSensor = document.querySelector('.sensor');

    if (!firstSensor) {
        console.error("Aucun capteur modèle trouvé.");
        return;
    }

    // Cloner le modèle de capteur
    const newSensor = firstSensor.cloneNode(true);

    // Mise à jour des IDs et des noms des champs
    newSensor.querySelectorAll('[name], [id]').forEach((input) => {
        const name = input.getAttribute('name');
        const id = input.getAttribute('id');

        if (name) {
            input.setAttribute('name', name.replace(/\d+/, sensorIndex));
        }
        if (id) {
            input.setAttribute('id', id.replace(/\d+/, sensorIndex));
        }

        // Réinitialiser les valeurs
        if (input.type === 'checkbox') {
            input.checked = false;
        } else {
            input.value = '';
        }
    });

    // Mettre à jour les IDs spécifiques
    newSensor.id = `sensor-${sensorIndex}`;
    newSensor.querySelector('.tracker-checkbox').id = `tracker-checkbox-${sensorIndex}`;
    newSensor.querySelector('.tracker-dependent-fields').id = `tracker-dependent-fields-${sensorIndex}`;

    // Mettre à jour le bouton Remove
    const removeButton = newSensor.querySelector('.btn-remove-sensor');
    removeButton.style.display = 'inline-block';
    removeButton.setAttribute('onclick', `removeSensor('sensor-${sensorIndex}')`);

    // Mettre à jour le titre
    const sensorTitle = newSensor.querySelector('h4');
    if (sensorTitle) {
        sensorTitle.textContent = `Sensor ${sensorIndex + 1}`;
    }

    // Ajouter le gestionnaire pour tracker
    initializeTrackerFields(newSensor);

    // Ajouter le capteur au conteneur
    container.appendChild(newSensor);

    // Incrémenter l'indice
    sensorIndex++;
}
//////////////////////////////////////// 2. END ADD SENSOR ///////////////////////////////////


//////////////////////////////////////// 3. SHOW INPUT IF TRACKER IS TRUE ////////////////////

// Fonction pour initialiser les champs tracker
function initializeTrackerFields(sensor) {
    const trackerCheckbox = sensor.querySelector('.tracker-checkbox');
    const trackerDependentFields = sensor.querySelector('.tracker-dependent-fields');

    if (trackerCheckbox && trackerDependentFields) {
        trackerCheckbox.addEventListener('change', function () {
            trackerDependentFields.style.display = this.checked ? 'block' : 'none';
        });

        trackerDependentFields.style.display = trackerCheckbox.checked ? 'block' : 'none';
    }
}

// Fonction pour supprimer un capteur
function removeSensor(sensorId) {
    const sensor = document.getElementById(sensorId);
    if (sensor) {
        sensor.remove();
    }
}

// Initialiser les champs tracker au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initializeTrackerFields(document.querySelector('.sensor'));
});
//////////////////////////////////////// 4.  END SHOW INPUT IF TRACKER IS TRUE ////////////////////



//////////////////////////////////////// 5.  SHOW FORMS BLOC ////////////////////
document.addEventListener('DOMContentLoaded', function () {
    const steps = document.querySelectorAll('.form-step');
    const progressBar = document.getElementById('progress-bar');
    let currentStep = 0;

    // Affiche uniquement la première étape
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.style.display = index === stepIndex ? 'block' : 'none';
        });

        // Met à jour la barre de progression
        updateProgressBar(stepIndex);
    }

    // Met à jour la barre de progression
    function updateProgressBar(stepIndex) {
        const totalSteps = steps.length;
        const progress = ((stepIndex + 1) / totalSteps) * 100; // Calcule le pourcentage
        progressBar.style.width = `${progress}%`; // Met à jour la largeur de la barre
    }

    // Gestion des boutons "Suivant" et "Précédent"
    document.querySelectorAll('.btn-next').forEach((btn) => {
        btn.addEventListener('click', () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                showStep(currentStep);
            }
        });
    });

    document.querySelectorAll('.btn-prev').forEach((btn) => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    // Initialisation : affiche la première étape et met à jour la barre de progression
    showStep(currentStep);
    function updateProgressBar(stepIndex) {
        const totalSteps = steps.length;
        const progress = ((stepIndex + 1) / totalSteps) * 100;
        progressBar.style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = `${Math.round(progress)}%`;
    }
});






