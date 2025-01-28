

from flask_wtf import FlaskForm
from wtforms import StringField, FloatField, SelectField, BooleanField, SubmitField, FieldList, FormField, DateField
from wtforms.validators import DataRequired, Optional
import pytz
from wtforms.validators import DataRequired, ValidationError, NumberRange
from datetime import date
from wtforms.validators import InputRequired, Length

class ProjectForm(FlaskForm):
     project_name = StringField(
        'Project Name',
        validators=[
            InputRequired(message="Project Name is required."),
            Length(min=2, max=100, message="Project Name must be between 2 and 100 characters.")
        ]
    )
     submit = SubmitField('Generate YAML')

class LocationForm(FlaskForm):
    latitude = FloatField(
    'Latitude',
    validators=[
        DataRequired(message="Latitude is required."),
        NumberRange(min=-90, max=90, message="Latitude must be between -90 and 90.")
    ]
)
    longitude = FloatField(
    'Longitude',
    validators=[
        DataRequired(message="Longitude is required."),
        NumberRange(min=-180, max=180, message="Longitude must be between -180 and 180.")
    ]
)
    altitude = FloatField(
    'Altitude (m)',
    validators=[
        DataRequired(message="Altitude is required."),
        NumberRange(min=-500, max=5000, message="Altitude must be between -500 and 5000.")
    ]
)
    timezone = SelectField(
        'Timezone',
        choices=[('local', 'Local')] + [(tz, tz) for tz in pytz.all_timezones], 
        default='local', 
        validators=[DataRequired()]
    )
    

class PlaneOfArrayForm(FlaskForm):
    tilt = FloatField(
        'Tilt (degrees)',
        validators=[
            InputRequired(message="Tilt is required."), 
            NumberRange(min=0, max=90, message="Tilt must be between 0 and 90 degrees.")
        ]
    )
    azimuth = FloatField(
    'Azimuth (degrees)',
    validators=[
        DataRequired(message="Azimuth is required."),
        NumberRange(min=0, max=360, message="Azimuth must be between 0 and 360 degrees.")
    ]
)
    tracker = BooleanField('Tracker', default=False)
    axis_tilt = FloatField('Axis Tilt', validators=[Optional()])
    axis_azimuth = FloatField('Axis Azimuth', validators=[Optional()])
    max_angle = FloatField('Max Angle', validators=[Optional()])
    gcr = FloatField('GCR', validators=[Optional()])
    class Meta:
        csrf = False
    
# Sous-formulaire pour les détails de calibration
class CalibrationDetailsForm(FlaskForm):
    calibration_certification_date = DateField('Calibration Certification Date', default=date.today(), format='%Y-%m-%d', validators=[Optional()])
    class Meta:
        csrf = False

# Sous-formulaire pour un capteur
class SensorDetailsForm(FlaskForm):
    anchor_name = SelectField(
        'Choose sensor',
        choices=[
            ('', '---'),  
            ('MS80_1', 'MS80_1'),
            ('MS80_2', 'MS80_2'),
            ('MS80_4', 'MS80_4'),
            ('MS80_heat_treatment_3', 'MS80_heat_treatment_3'),
        ],
        validators=[
            DataRequired(message="You must select a valid sensor.") 
        ],
        render_kw={"required": True} 
    )

    def validate_anchor_name(self, field):
        if field.data == '':  
            raise ValidationError("Please select a valid sensor from the list.")
    
    plane_of_array = FormField(PlaneOfArrayForm)  # Sous-formulaire
    sensor_type = SelectField('Type', choices=[('Class_A', 'ISO 9060:2018 Class A (Secondary standard)'), ('Class_B', 'ISO 9060:2018 Class B (First Class)'), ('Class_C', 'ISO 9060:2018 Class C (Second Class)')], validators=[DataRequired()])
    manufacturer = StringField('Manufacturer', validators=[DataRequired(message="Manufacturer is required.")])

    installation_date = DateField('Installation Date', default=date.today(), format='%Y-%m-%d', validators=[Optional()])
    calibration_certification_details = FormField(CalibrationDetailsForm)  # Sous-formulaire
    class Meta:
        csrf = False

# Formulaire principal pour gérer une liste de capteurs
class SensorForm(FlaskForm):
    sensors = FieldList(FormField(SensorDetailsForm), min_entries=1, max_entries=5)
    submit = SubmitField('Generate YAML')

class AnalysisForm(FlaskForm):
    label = StringField(
        'Analysis Label',
        validators=[
            InputRequired(message="Analysis Label is required."),
            Length(min=2, max=100, message="Analysis Label must be between 2 and 100 characters.")
        ]
    )
    start_analysis = DateField('Start Date', default=date.today(), format='%Y-%m-%d', validators=[DataRequired()])
    end_analysis = DateField('End Date', default=date.today(), format='%Y-%m-%d', validators=[DataRequired()])
    freq_sim = SelectField('Frequency', choices=[('15T', '15 Minutes'), ('1H', '1 Hour')], validators=[DataRequired()])
    def validate_end_analysis(self, field):
        """
        Validation personnalisée pour vérifier que la date de fin est après la date de début.
        """
        if self.start_analysis.data and field.data:
            if field.data <= self.start_analysis.data:
                raise ValidationError("The end date must be after the start date.")
    