import os

class Config:
    SECRET_KEY = '7d65b5f1b0284a2b8fd72a0e8bbbd90e'
    WTF_CSRF_ENABLED = True
    DEBUG = True

    # Exemple pour SQLAlchemy (si une base de données est utilisée plus tard)
    #SQLALCHEMY_DATABASE_URI = 'sqlite:///app.db'
    #SQLALCHEMY_TRACK_MODIFICATIONS = False

# # Chemin du fichier
# file_path = 'C:\\Users\\tapha\\dev\\test_lucisun\\app\\output\\generated_data.yml'

# # Créez les dossiers si nécessaire
# os.makedirs(os.path.dirname(file_path), exist_ok=True)

# # Maintenant, vous pouvez créer ou écrire dans le fichier
# with open(file_path, 'w') as file:
#     file.write('Contenu initial')
