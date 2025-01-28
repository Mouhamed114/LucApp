from flask import Blueprint, render_template, request, send_file, flash, redirect, url_for, session
from app.forms import SensorForm, ProjectForm, LocationForm, AnalysisForm
from app.utils.yaml_utils import write_yaml
import os
from datetime import datetime

main_bp = Blueprint('main', __name__)

@main_bp.route('/', methods=['GET', 'POST'])
def index():
    # Initialiser les formulaires
    project_form = ProjectForm()
    location_form = LocationForm()
    sensor_form = SensorForm()
    analysis_form = AnalysisForm()

    if request.method == 'POST':
        # Valider chaque formulaire séparément
        is_project_valid = project_form.validate_on_submit()
        is_location_valid = location_form.validate_on_submit()
        is_sensor_valid = sensor_form.validate_on_submit()
        is_analysis_valid = analysis_form.validate_on_submit()

        # Vérifier si tous les formulaires sont valides
        if is_sensor_valid and is_project_valid and is_location_valid and is_analysis_valid:
            # Générer le fichier YAML
            sensors = []
            for sensor in sensor_form.sensors:
                anchor_name = sensor.anchor_name.data
                sensors.append({
                    f'&{anchor_name}': {
                        'label': f"MS-{anchor_name[2:]}",
                        'plane_of_array': {
                            'tilt': sensor.plane_of_array.tilt.data,
                            'azimuth': sensor.plane_of_array.azimuth.data,
                            'tracker': sensor.plane_of_array.tracker.data,
                            'axis_tilt': sensor.plane_of_array.axis_tilt.data if sensor.plane_of_array.tracker.data else None,
                            'axis_azimuth': sensor.plane_of_array.axis_azimuth.data if sensor.plane_of_array.tracker.data else None,
                            'max_angle': sensor.plane_of_array.max_angle.data if sensor.plane_of_array.tracker.data else None,
                            'gcr': sensor.plane_of_array.gcr.data if sensor.plane_of_array.tracker.data else None,
                        },
                        'type': f"{sensor.sensor_type.data}",
                        'manufacturer': f"{sensor.manufacturer.data}",
                        'installation_date': sensor.installation_date.data.strftime('%Y-%m-%d') if sensor.installation_date.data else None,
                        'calibration_certification_details': {
                            'calibration_certification_date': sensor.calibration_certification_details.calibration_certification_date.data.strftime('%Y-%m-%d') if sensor.calibration_certification_details.calibration_certification_date.data else None,
                        }
                    }
                })

            # Construire le dictionnaire principal
            order_id = datetime.now().strftime('%Y%m%d%H%M%S')
            data = {
                'project_name': project_form.project_name.data,
                'location': {
                    'latitude': location_form.latitude.data,
                    'longitude': location_form.longitude.data,
                    'altitude': location_form.altitude.data,
                    'timezone': location_form.timezone.data,
                },
                'sensors': sensors,
                'Analysis': {
                    'order_id': order_id,
                    'label': analysis_form.label.data,
                    'start_analysis': analysis_form.start_analysis.data.strftime('%Y-%m-%d'),
                    'end_analysis': analysis_form.end_analysis.data.strftime('%Y-%m-%d'),
                    'freq_sim': analysis_form.freq_sim.data,
                    'protocol': f"*{list(sensors[0].keys())[0][1:]}",  
                }
            }

            # Écrire le fichier YAML
            output_dir = os.path.join(os.getcwd(), 'app', 'output')
            os.makedirs(output_dir, exist_ok=True)
            yaml_file = os.path.join(output_dir, f'{data["project_name"]}.yml')
            write_yaml(data, yaml_file)

            # Ajouter le chemin du fichier dans la session
            session['yaml_file'] = yaml_file

            # Flash message de succès
            flash("The YAML file has been generated successfully!", "success")

            # Rediriger pour éviter de resoumettre le formulaire en cas de rafraîchissement
            return redirect(url_for('main.index'))

        else:
            # S'il y a des erreurs, afficher un message flash
            flash("Please correct the errors in the form and try again.", "danger")

    # Toujours retourner le formulaire
    return render_template(
        'form.html',
        project_form=project_form,
        location_form=location_form,
        sensor_form=sensor_form,
        analysis_form=analysis_form
    )

@main_bp.route('/download')
def download_file():
    # Récupérer le chemin du fichier YAML de la session
    yaml_file = session.get('yaml_file')
    if yaml_file and os.path.exists(yaml_file):
        return send_file(yaml_file, as_attachment=True)
    else:
        flash("The requested file does not exist.", "danger")
        return redirect(url_for('main.index'))
