from django.db import models
from django.contrib.auth.models import User

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    id_number = models.CharField(max_length=20)
    credential_number = models.CharField(max_length=50)
    phone = models.CharField(max_length=20, blank=True)
    especialidad = models.CharField(max_length=100, blank=True)
    idoneidad = models.CharField(max_length=100, blank=True)
    estudios = models.TextField(blank=True)
    descripcion = models.TextField(blank=True)
    ubicacion = models.CharField(max_length=100, blank=True)
    foto_perfil = models.ImageField(upload_to='fotos_perfil/', blank=True, null=True)
    estado_switch = models.CharField(max_length=20, default='No acepta nuevos pacientes')  # 👈 nuevo campo
    recomendado = models.CharField(max_length=20, default='no',blank=True)  # 👈 nuevo campo
    preciobase = models.DecimalField(max_digits=8, decimal_places=2, blank= True,null=True)
 

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

from django.db import models
from django.contrib.auth.models import User

class Paciente(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    birthdate = models.DateField()
    id_number = models.CharField(max_length=20, unique=True)
    genero = models.TextField(blank=True)
    phone = models.CharField(max_length=20)
    alergias = models.TextField(blank=True)
    enfermedades = models.TextField(blank=True)
    medicamentos = models.TextField(blank=True)
    antecedentes_quirurgicos = models.TextField(blank=True)
    fecha_cita = models.DateField(null=True, blank=True)  # 👈 Nueva fecha de la cita
    datos_consulta = models.TextField(blank=True)
    motivo_visita = models.TextField(blank=True)
    aseguradora = models.TextField(blank=True)
    horacita = models.TextField(blank=True)
    cupon = models.TextField(blank=True,default='si')

    def __str__(self):
        return f"{self.user.first_name} - {self.id_number}"
    
class NuevosPacientes(models.Model):
    nombre = models.CharField(max_length=100)
    fecha_nacimiento = models.DateField()
    fecha_cita = models.DateField(null=True, blank=True)  # 👈 Nueva fecha de la cita
    cedula = models.CharField(max_length=20)
    telefono = models.CharField(max_length=20)
    datos_consulta = models.TextField(blank=True)
    motivo_visita = models.TextField(blank=True)
    aseguradora = models.TextField(blank=True)
    horacita = models.TextField(blank=True)
    correo = models.EmailField(unique=True,blank=True)  

    def __str__(self):
        return f"{self.nombre} - {self.cedula}"

class Cita(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE, null=True, blank=True)
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=150)  # nombre del paciente (o persona)
    doctor_nombre = models.CharField(max_length=150)  # nombre completo del doctor
    fecha = models.DateField()
    hora = models.CharField(max_length=20)
    motivo_visita = models.TextField()
    datos_consulta = models.TextField(blank=True)
    aseguradora = models.TextField(blank=True)
    fecha_cita = models.DateField(null=True, blank=True)  # 👈 Nueva fecha de la cita
    precio = models.DecimalField(max_digits=8, decimal_places=2, blank= True,null=True)
    estado_cita = models.CharField(max_length=20, default='No confirmada')  # 👈 nuevo campo

    def __str__(self):
        return f'Cita de {self.nombre} con Dr. {self.doctor_nombre}'


