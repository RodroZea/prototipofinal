from django import forms
from .models import Doctor
from .models import Paciente

class DoctorProfileForm(forms.ModelForm):
    class Meta:
        model = Doctor
        fields = ['especialidad', 'idoneidad', 'estudios', 'descripcion', 'phone', 'ubicacion', 'foto_perfil', 'estado_switch']
        widgets = {
            'descripcion': forms.Textarea(attrs={'rows': 3}),
            'estudios': forms.Textarea(attrs={'rows': 2}),
        }

class PacienteProfileForm(forms.ModelForm):
    class Meta:
        model = Paciente
        fields = ['medicamentos', 'enfermedades', 'antecedentes_quirurgicos', 'alergias', 'phone', 'genero']
        widgets = {
            'alergias': forms.Textarea(attrs={'rows': 3}),
            'estudios': forms.Textarea(attrs={'rows': 2}),
            'enfermedades': forms.Textarea(attrs={'rows': 2}),
        }
