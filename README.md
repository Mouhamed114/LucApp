# Application Web de configuration du capteur d'irradiance

## Description
Les capteurs d'irradiation jouent un role crucial dans les projets d'energie solaire. Cette application permets aux utilisateurs d'entrer les spécifications du projet et du capteur et generer des requetes sous forme de fichier YAML


## Fonctionnalités principales :

1. **Génération de fichier YAML** :  
    Permet de créer un fichier YAML structuré en fonction des données saisies dans le formulaire.

2. **Téléchargement du fichier YAML** : 
     Après la soumission réussie du formulaire, l'utilisateur peut télécharger le fichier YAML généré.

3. **Validation des données** : 
    Validation des entrées du formulaire pour assurer que toutes les informations sont correctes avant la génération du fichier YAML.

## Technologies et Bibliothèques Utilisées

- **Flask**: Framework web léger en Python pour construire l'application.
- **Python 3.11+**: Langage utilisé pour développer l'application.
- **Boostrap**: Framework CSS pour le design du front-end.
- **Flask-WTF**: Extension Flask pour intégrer et valider les formulaires HTML avec WTForms.
- **WTForms**: Bibliothèque Python pour la création de formulaires web.
- **pytz**: Bibliothèque pour la gestion des fuseaux horaires.
- **PyYAML**: Utilisée pour la gestion des fichiers YAML.
- **Jinja2**: Moteur de template utilisé par Flask pour rendre les pages HTML.

## Prérequis

- Python 3.11 ou plus récent.
- Environnement virtuel recommandé pour l'installation des dépendances.

## Instructions d'Installation

1. **Cloner le dépôt du projet** :

   ```bash
   git clone git@github.com:Mouhamed114/LucApp.git
   cd TEST_LUCISUN

2. **Créer un environnement virtuel (optionnel mais recommandé)** :

    ```bash
    python3 -m venv venv
    source venv/bin/activate  # Pour Linux/MacOS
    venv\Scripts\activate     # Pour Windows

3. **Installer les dépendances du projet** :

    ```bash
    pip install -r requirements.txt


4. **Exécuter l'applicationt** :

    ```bash
    python run.py
    
L'application sera accessible sur http://127.0.0.1:5000 dans votre navigateur.

## Description de la structure du projet :

/TEST_LUCISUN/
    
    /app/
        /output/           # Dossier où les fichiers YAML générés sont stockés
        /static/           # Contient les fichiers statiques (CSS, JS, images)
        /templates/        # Contient les templates HTML de l'application 
        /utils/            # Utilitaires et fonctions spécifiques, comme la génération de YAML dans yaml_utils.py
        /__init__.py       # Fichier d'initialisation du package Flask
        /forms.py          # Contient les formulaires Flask-WTF
        /routes.py         # Définition des routes et de la logique de l'application
    /config.py             # Configuration de l'application Flask
    /README.md             # Le fichier README.md 
    /requirements.txt      # Liste des dépendances requises pour l'application
    /venv/                 # Environnement virtuel Python (si utilisé)
    /instance/             # Dossier pour les configurations spécifiques à l'instance
    /run.py                # Script pour démarrer l'application Flask


