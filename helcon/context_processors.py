from .models import Doctor,Paciente

def doctor_context(request):
    doctor = None
    if request.user.is_authenticated:
        try:
            doctor = Doctor.objects.get(user=request.user)
        except Doctor.DoesNotExist:
            pass
    return {'doctor': doctor}

from .models import Doctor, Paciente

def navbar_context(request):
    doctor = None
    paciente = None
    if request.user.is_authenticated:
        try:
            doctor = Doctor.objects.get(user=request.user)
        except Doctor.DoesNotExist:
            pass
        try:
            paciente = Paciente.objects.get(user=request.user)
        except Paciente.DoesNotExist:
            pass
    return {
        'doctor': doctor,
        'paciente': paciente,
    }