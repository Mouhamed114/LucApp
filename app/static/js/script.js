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

    // Affichage de l'étape en cours
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.style.display = index === stepIndex ? 'block' : 'none';
        });
        updateProgressBar(stepIndex);
    }

    // Vérification du dernier bloc avant soumission
    document.getElementById('submit-btn').addEventListener('click', function (event) {
        const lastStepIndex = steps.length - 1;  // Dernière étape
        if (!validateStep(lastStepIndex)) {  
            event.preventDefault();  // Empêcher la soumission si des erreurs sont présentes
            alert("Le dernier bloc contient des erreurs. Veuillez les corriger avant de soumettre.");
        }
    });


    // Mise à jour de la barre de progression
    function updateProgressBar(stepIndex) {
        const totalSteps = steps.length;
        const progress = ((stepIndex + 1) / totalSteps) * 100;
        progressBar.style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = `${Math.round(progress)}%`;
    }

    // Fonction de validation pour chaque étape
    function validateStep(stepIndex) {
        let isValid = true;
        const inputs = steps[stepIndex].querySelectorAll('input, select');

        inputs.forEach(input => {
            let errorContainer = input.closest('.form-group').querySelector('.text-danger');

            // Créer un conteneur d'erreur si non existant
            if (!errorContainer) {
                errorContainer = document.createElement('ul');
                errorContainer.classList.add('text-danger');
                input.closest('.form-group').appendChild(errorContainer);
            }

            errorContainer.innerHTML = ""; // Réinitialiser les erreurs

            // Vérification des champs requis
            if (input.hasAttribute('required') && !input.value.trim()) {
                isValid = false;
                errorContainer.innerHTML = "<li>Ce champ est requis.</li>";
                input.classList.add('input-error');
            } else {
                input.classList.remove('input-error');
            }

            // Validation de la longueur pour "Project Name"
            if (input.name === 'project_name') {
                const projectName = input.value.trim();
                const minLength = 2;
                const maxLength = 100;

                if (projectName.length < minLength || projectName.length > maxLength) {
                    isValid = false;
                    errorContainer.innerHTML = `<li>Le nom du projet doit être entre ${minLength} et ${maxLength} caractères.</li>`;
                    input.classList.add('input-error');
                }
            }

            // Vérification des valeurs numériques (min/max)
            if (input.type === 'number' && input.hasAttribute('min') && input.hasAttribute('max')) {
                const value = parseFloat(input.value);
                const min = parseFloat(input.getAttribute('min'));
                const max = parseFloat(input.getAttribute('max'));

                if (isNaN(value) || value < min || value > max) {
                    isValid = false;
                    errorContainer.innerHTML = `<li>La valeur doit être entre ${min} et ${max}.</li>`;
                    input.classList.add('input-error');
                }
            }

            // Validation personnalisée pour les champs "Latitude" et "Longitude" (valeurs numériques avec limites spécifiques)
            if (input.name === 'latitude') {
                const latitude = parseFloat(input.value);
                if (isNaN(latitude) || latitude < -90 || latitude > 90) {
                    isValid = false;
                    errorContainer.innerHTML = "<li>La latitude doit être entre -90 et 90.</li>";
                    input.classList.add('input-error');
                }
            }

            if (input.name === 'longitude') {
                const longitude = parseFloat(input.value);
                if (isNaN(longitude) || longitude < -180 || longitude > 180) {
                    isValid = false;
                    errorContainer.innerHTML = "<li>La longitude doit être entre -180 et 180.</li>";
                    input.classList.add('input-error');
                }
            }

            if (input.name === 'altitude') {
                const altitude = parseFloat(input.value);
                if (isNaN(altitude) || altitude < -500 || altitude > 5000) {
                    isValid = false;
                    errorContainer.innerHTML = "<li>L'altitude doit être entre -500 et 5000 mètres.</li>";
                    input.classList.add('input-error');
                }
            }

            // Validation pour les autres champs numériques spécifiques, comme "Tilt" et "Azimuth"
            if (input.name.includes('tilt') && !input.name.includes('axis')) { // On vérifie que le champs egal à tilt
                const tilt = parseFloat(input.value);
                if (input.value.trim() === '') {  // Si le champ est vide
                    isValid = false;
                    errorContainer.innerHTML = "<li>Le tilt est requis.</li>";
                    input.classList.add('input-error');
                } else if (isNaN(tilt) || tilt < 0 || tilt > 90) { // Vérification des bornes
                    isValid = false;
                    errorContainer.innerHTML = "<li>Le tilt doit être entre 0 et 90 degrés.</li>";
                    input.classList.add('input-error');
                }
            }

             // Validation pour "axis_tilt" (Champ optionnel, entre 0 et 90 si rempli)
             if (input.name === 'Axis_Tilt (degrees)') {
                const axisTilt = parseFloat(input.value);
                if (input.value.trim() !== '' && (isNaN(axisTilt) || axisTilt < 0 || axisTilt > 90)) { // Vérification des bornes si non vide
                    isValid = false;
                    errorContainer.innerHTML = "<li>L'axis tilt doit être entre 0 et 90 degrés.</li>";
                    input.classList.add('input-error');
                }
            }

             // Validation pour "azimuth" (Champ obligatoire, entre 0 et 360)
             if (input.name.includes('azimuth') && !input.name.includes('axis')) {
                const azimuth = parseFloat(input.value);
                if (input.value.trim() === '') {  // Si le champ est vide
                    isValid = false;
                    errorContainer.innerHTML = "<li>L'azimuth est requis.</li>";
                    input.classList.add('input-error');
                } else if (isNaN(azimuth) || azimuth < 0 || azimuth > 360) { // Vérification des bornes
                    isValid = false;
                    errorContainer.innerHTML = "<li>L'azimuth doit être entre 0 et 360 degrés.</li>";
                    input.classList.add('input-error');
                }
            }

            // Validation pour "axis_azimuth" (optionnel, entre 0 et 360)
            if (input.name.includes('axis_azimuth')) {
                const axisAzimuth = parseFloat(input.value);
                if (input.value.trim() !== '') {  // Vérifier la plage uniquement si une valeur est entrée
                    if (isNaN(axisAzimuth) || axisAzimuth < 0 || axisAzimuth > 360) {
                        isValid = false;
                        errorContainer.innerHTML = "<li>L'azimuth de l'axe doit être entre 0 et 360 degrés.</li>";
                        input.classList.add('input-error');
                    }
                }
            }
            

            // Validation des dates (start_analysis et end_analysis)
            if (input.name === 'start_analysis' || input.name === 'end_analysis') {
                const startDateInput = document.querySelector('[name="start_analysis"]');
                const endDateInput = document.querySelector('[name="end_analysis"]');

                if (startDateInput && endDateInput) {
                    const startDate = new Date(startDateInput.value);
                    const endDate = new Date(endDateInput.value);

                    // Vérification que la date de fin est après la date de début
                    if (endDate <= startDate) {
                        isValid = false;
                        errorContainer.innerHTML = "<li>La date de fin doit être après la date de début.</li>";
                        input.classList.add('input-error');
                    }
                }
            }

        });

        return isValid;
    }

    // Passer à l'étape suivante
    document.querySelectorAll('.btn-next').forEach((btn) => {
        btn.addEventListener('click', () => {
            if (validateStep(currentStep)) {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep(currentStep);
                }
            } else {
                alert("Veuillez corriger les erreurs avant de continuer.");
            }
        });
    });

    // Revenir à l'étape précédente
    document.querySelectorAll('.btn-prev').forEach((btn) => {
        btn.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                showStep(currentStep);
            }
        });
    });

    // Affichage de l'étape initiale
    showStep(currentStep);
});







