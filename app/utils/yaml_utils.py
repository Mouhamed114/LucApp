import yaml

def write_yaml(data, file_path):
    """Écrit les données dans un fichier YAML."""
    with open(file_path, 'w') as file:
        yaml.dump(data, file, default_flow_style=False, sort_keys=False)

def read_yaml(file_path):
    """Lit les données d'un fichier YAML."""
    with open(file_path, 'r') as file:
        return yaml.safe_load(file)
