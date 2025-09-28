from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.conf import settings

import stripe
stripe.api_key = settings.STRIPE_SECRET_KEY

from .models import Doctor, Paciente
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Doctor

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Doctor

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Doctor

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Doctor




def home(request):
    if request.user.is_authenticated:
        if hasattr(request.user, 'paciente'):
            return redirect('home_paciente')
        elif hasattr(request.user, 'doctor'):
            return redirect('home_doctor')  # O donde desees que inicie el doctor
    return render(request, 'helcon/welcome.html')
def home_doc(request):
    return render(request, 'helcon/home_doctor.html')



def registro(request):
    return render(request, 'helcon/seleccionar_tipo.html')


def dissplay_view(request):
    # Muestra todos los doctores
    doctores = Doctor.objects.all()
    return render(request, 'helcon/dissplay.html', {'doctores': doctores})


from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from helcon.models import Doctor, Paciente  # ajusta si tus modelos están en otro archivo

def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            if hasattr(user, 'doctor'):
                return redirect('home_doctor')
            elif hasattr(user, 'paciente'):
                return redirect('home_paciente')
            else:
                # Usuario sin perfil doctor ni paciente, lo envías a un home genérico
                return redirect('home')
        else:
            return render(request, 'helcon/registration/login.html', {'error': 'Credenciales inválidas'})
    return render(request, 'helcon/registration/login.html')


def formdoc(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        last_name = request.POST.get('last_name')
        id_number = request.POST.get('id_number')
        credential_number = request.POST.get('credential_number')
        email = request.POST.get('email')
        phone = request.POST.get('tel')
        password = request.POST.get('password')

        # Crear usuario
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name,
            last_name=last_name
        )

        # Crear doctor
        doctor = Doctor(
            user=user,
            id_number=id_number,
            credential_number=credential_number,
            phone=phone
        )
        doctor.save()
        login(request, user)

        return redirect('home')
    return render(request, 'helcon/formDoctor.html')


from django.contrib.auth.models import User
from django.contrib.auth import login
from django.shortcuts import render, redirect
from django.db import IntegrityError
from .models import Paciente

def formpac(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        birthdate = request.POST.get('birthdate')
        id_number = request.POST.get('id_number')
        genero = request.POST.get('genero')
        phone = request.POST.get('phone')
        email = request.POST.get('email')
        password = request.POST.get('password')
        alergias = request.POST.get('alergias', '')
        enfermedades = request.POST.get('enfermedades', '')
        medicamentos = request.POST.get('medicamentos', '')
        antecedentes = request.POST.get('antecedentes_quirurgicos', '')

        # Verificar si ya existe un usuario con ese correo
        if User.objects.filter(username=email).exists():
            return render(request, 'helcon/formPaciente.html', {
                'error': 'Ya existe un usuario con este correo electrónico.'
            })

        try:
            user = User.objects.create_user(
                username=email,
                email=email,
                first_name=name,
                password=password
            )

            Paciente.objects.create(
                user=user,
                birthdate=birthdate,
                id_number=id_number,
                genero=genero,
                phone=phone,
                alergias=alergias,
                enfermedades=enfermedades,
                medicamentos=medicamentos,
                antecedentes_quirurgicos=antecedentes
            )

            login(request, user)
            return redirect('home_paciente')  # Asegúrate que esta URL existe

        except IntegrityError:
            return render(request, 'helcon/formPaciente.html', {
                'error': 'Ocurrió un error al crear el usuario. Intenta con otro correo.'
            })

    return render(request, 'helcon/formPaciente.html')



def segpag(request):
    return render(request, 'helcon/segundapaginaa.html')


def tercerapag(request):
    return render(request, 'helcon/tercerapagina.html')


def cuarpag(request):
    return render(request, 'helcon/cuartapagina.html')


def blog_view(request):
    return render(request, 'helcon/cuartapagina.html')


def journal1_view(request):
    return render(request, 'helcon/journal1.html')


def journal2_view(request):
    return render(request, 'helcon/journal2.html')


def journal3_view(request):
    return render(request, 'helcon/journal3.html')


def journal4_view(request):
    return render(request, 'helcon/journal4.html')


def journal5_view(request):
    return render(request, 'helcon/journal5.html')


def journal6_view(request):
    return render(request, 'helcon/journal6.html')
def contacto_view(request):
    return render(request, 'helcon/contacto.html')



from helcon.models import Cita

from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .models import Doctor, Cita

@login_required
def perfil_doctor(request):
    doctor = Doctor.objects.get(user=request.user)

    if request.method == 'POST':
        if 'foto_perfil' in request.FILES:
            doctor.foto_perfil = request.FILES['foto_perfil']
            doctor.save()
            return redirect('perfil_doctor')

        especialidad = request.POST.get('especialidad')
        idoneidad = request.POST.get('idoneidad')
        estudios = request.POST.get('estudios')
        descripcion = request.POST.get('descripcion')
        phone = request.POST.get('phone')
        ubicacion = request.POST.get('ubicacion')
        estado_switch = request.POST.get('estado_switch')
        preciobase = request.POST.get('preciobase')

        # Guardar switch independientemente de los otros campos
        if estado_switch:
            doctor.estado_switch = estado_switch

        if especialidad:
            doctor.especialidad = especialidad
            doctor.idoneidad = idoneidad
            doctor.estudios = estudios
            doctor.descripcion = descripcion
            doctor.phone = phone
            doctor.ubicacion = ubicacion
            doctor.preciobase = preciobase

        doctor.save()
        return redirect('perfil_doctor')
    return render(request, 'helcon/perfil_doctor.html', {'doctor': doctor})

@login_required
def logout_view(request):
    logout(request)
    return redirect('home')

# views.py
from django.shortcuts import render, get_object_or_404
from django.utils.translation import gettext_lazy as _
from .models import Doctor
ESPECIALIDADES_TRADUCIDAS = {
    "Cardiología": _("Cardiology"),
    "Pediatría": _("Pediatrics"),
    "Dermatología": _("Dermatology"),
    "Alergología": _("Allergology"),
    "Anestesiología": _("Anesthesiology"),
    "Cirugía General": _("General Surgery"),
    "Endocrinología": _("Endocrinology"),
    "Gastroenterología": _("Gastroenterology"),
    "Geriatría": _("Geriatrics"),
    "Ginecología": _("Gynecology"),
    "Hematología": _("Hematology"),
    "Infectología": _("Infectious Diseases"),
    "Medicina General": _("General Medicine"),
    "Medicina Interna": _("Internal Medicine"),
    "Nefrología": _("Nephrology"),
    "Neumología": _("Pulmonology"),
    "Neurología": _("Neurology"),
    "Nutrición": _("Nutrition"),
    "Oncología": _("Oncology"),
    "Oftalmología": _("Ophthalmology"),
    "Otorrinolaringología": _("Otolaryngology"),
    "Psiquiatría": _("Psychiatry"),
    "Radiología": _("Radiology"),
    "Reumatología": _("Rheumatology"),
    "Traumatología": _("Traumatology"),
    "Urología": _("Urology"),
}

def mas_informacion(request, id):
    doctor = get_object_or_404(Doctor, id=id)
    return render(request, 'helcon/mas_informacion.html', {'doctor': doctor,})

# views.py
from django.shortcuts import render
from .models import Doctor
from django.db.models import Q

from django.db.models import Q

def home_paciente(request):
    query = request.GET.get('q')
    especialidad = request.GET.get('especialidad')

    doctores = Doctor.objects.all()

    if query:
        doctores = doctores.filter(
            Q(user__first_name__icontains=query) | 
            Q(user__last_name__icontains=query)
        )

    if especialidad:
        doctores = doctores.filter(especialidad__iexact=especialidad)

    # Ordenar por recomendación: los que tienen recomendado = 'si' van primero
    doctores = doctores.order_by('-recomendado')

    context = {
        'doctores': doctores,
        'query': query or '',
        'especialidad': especialidad or '',
    }
    return render(request, 'helcon/home_paciente.html', context)

from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from .models import Paciente

@login_required
def perfil_paciente(request):
    paciente = Paciente.objects.get(user=request.user)

    if request.method == 'POST':
        phone = request.POST.get('phone')
        alergias = request.POST.get('alergias')
        enfermedades = request.POST.get('enfermedades')
        medicamentos = request.POST.get('medicamentos')
        antecedentes_quirurgicos = request.POST.get('antecedentes_quirurgicos')

        # Actualizar los campos si se enviaron en el formulario
        if phone:
            paciente.phone = phone
        if alergias is not None:
            paciente.alergias = alergias
        if enfermedades is not None:
            paciente.enfermedades = enfermedades
        if medicamentos is not None:
            paciente.medicamentos = medicamentos
        if antecedentes_quirurgicos is not None:
            paciente.antecedentes_quirurgicos = antecedentes_quirurgicos

        paciente.save()
        return redirect('perfil_paciente')  # Asegúrate de que este nombre esté en tus URLs

    return render(request, 'helcon/perfil_paciente.html', {'paciente': paciente})


# footer
def difamation_view(request):
    return render(request, 'helcon/difamation.html')
def terms_view(request):
    return render(request, 'helcon/terms.html')
def privacy_policies(request):
    return render (request, 'helcon/privacy_policies.html')

from django.contrib.auth.decorators import login_required
from .models import Paciente

from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .models import Paciente

from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from .models import Paciente, NuevosPacientes

from .models import Paciente, Doctor, NuevosPacientes, Cita

from django.shortcuts import render, get_object_or_404, redirect
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Cita, Paciente, NuevosPacientes, Doctor

####AGENDA CON PAGOSSS

from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from .models import Cita, Paciente, Doctor, NuevosPacientes
import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY  # Asegúrate de definirlo en settings.py



from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Cita, Paciente, Doctor  # ajusta según tus modelos

from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Cita

@login_required
def api_citas(request):
    user = request.user

    if hasattr(user, 'paciente'):
        citas = Cita.objects.filter(paciente=user.paciente)
    elif hasattr(user, 'doctor'):
        citas = Cita.objects.filter(doctor=user.doctor)
    else:
        return JsonResponse([], safe=False)

    eventos = []
    for cita in citas:
        eventos.append({
            "title": f"{cita.nombre} - {cita.motivo_visita}",
            "start": f"{cita.fecha}T{cita.hora}",
            "end": f"{cita.fecha}T{cita.hora}",  # Puedes ajustar duración si quieres
            "backgroundColor": "#40559b" if hasattr(user, 'paciente') else "#28a745",
            "borderColor": "#000",
        })

    return JsonResponse(eventos, safe=False)



#VISTAS PARA REDIRIGIR DESDE LOG PACIENTE

def segpag_pac(request):
    return render(request, 'helcon/segundapaginaa_pac.html')
from .models import Doctor, Cita
from django.contrib.auth.decorators import login_required

@login_required
def home_doc(request):
    try:
        doctor = Doctor.objects.get(user=request.user)
    except Doctor.DoesNotExist:
        doctor = None

    # Filtrar solo las citas no confirmadas (corrige el texto si es necesario)
    citas = Cita.objects.filter(
        doctor=doctor,
        estado_cita='No confirmada'  # 👈 asegúrate de que este sea el valor real
    ).order_by('fecha', 'hora') if doctor else []

    context = {
        'doctor': doctor,
        'citas': citas,
    }
    return render(request, 'helcon/home_doctor.html', context)


from django.shortcuts import render, get_object_or_404
from .models import Cita

from django.core.mail import send_mail
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages
from .models import Cita

from django.shortcuts import render, get_object_or_404, redirect
from django.core.mail import send_mail
from django.contrib import messages
from .models import Cita
from django.contrib.auth.decorators import login_required

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from .models import Cita, Paciente, NuevosPacientes

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages
from django.core.mail import send_mail
from django.conf import settings
from .models import Cita, NuevosPacientes

from django.shortcuts import render, get_object_or_404, redirect
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages
from .models import Cita, NuevosPacientes

from django.shortcuts import render, get_object_or_404, redirect
from django.core.mail import send_mail
from django.conf import settings
from django.contrib import messages
from .models import Cita, NuevosPacientes, Doctor

from decimal import Decimal

def detalle_cita(request, cita_id):
    cita = get_object_or_404(Cita, id=cita_id)
    precio_con_descuento = None
    descuento = '0$'

    doctor = cita.doctor

    if doctor and doctor.preciobase is not None:
        precio_base = doctor.preciobase
        if cita.precio is not None:
            precio_con_descuento = round(precio_base - cita.precio, 2)
            descuento = f"-${cita.precio}"
        else:
            precio_con_descuento = precio_base
            descuento = '0$'
    else:
        precio_base = None

    if request.method == 'POST':
        accion = request.POST.get('accion')

        if accion == 'cancelar':
            if cita.paciente:
                correo_destino = cita.paciente.user.email
            else:
                try:
                    nuevo = NuevosPacientes.objects.get(nombre=cita.nombre, fecha_cita=cita.fecha)
                    correo_destino = nuevo.correo
                except NuevosPacientes.DoesNotExist:
                    correo_destino = None

            if correo_destino:
                send_mail(
                    subject="Cancelación de Cita Médica",
                    message=f"Hola {cita.nombre}, lamentamos informarte que tu cita con el Dr. {request.user.get_full_name()} fue cancelada. Por favor, agenda otra en un horario disponible.",
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[correo_destino],
                    fail_silently=False,
                )

            cita.delete()
            return redirect('home_doctor')

    return render(request, 'helcon/detalle_cita.html', {
        'cita': cita,
        'precio_base': precio_base,
        'precio_con_descuento': precio_con_descuento,
        'descuento': descuento,
    })




# views.py
from django.conf import settings  # <- Importa settings para las llaves Stripe
from django.shortcuts import render
from .models import Doctor       # <- Importa tu modelo Doctor
stripe.api_key = settings.STRIPE_SECRET_KEY  # clave secreta

from django.shortcuts import get_object_or_404

from decimal import Decimal, ROUND_HALF_UP
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
import stripe

from decimal import Decimal, ROUND_HALF_UP
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib import messages
from django.urls import reverse
import stripe

from decimal import Decimal, ROUND_HALF_UP, InvalidOperation
from django.contrib import messages
from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
import stripe

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.urls import reverse
from decimal import Decimal, ROUND_HALF_UP, InvalidOperation
import stripe

from .models import Doctor, Paciente
from django.conf import settings

# Configurar la clave secreta de Stripe desde settings
stripe.api_key = settings.STRIPE_SECRET_KEY




from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponseRedirect
from django.urls import reverse
from django.conf import settings
import json
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def procesar_pago(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            # Crear el intento de pago
            intent = stripe.PaymentIntent.create(
                amount=5000,  # monto en centavos
                currency='usd',
                payment_method=data['payment_method_id'],
                confirm=True,
            )

            # Si el pago fue exitoso, redirigir
            success_url = request.build_absolute_uri(reverse('home'))
            return JsonResponse({'status': 'success', 'redirect_url': success_url})

        except stripe.error.CardError as e:
            # Si el pago fue rechazado
            cancel_url = request.build_absolute_uri(reverse('pago_cancelado'))
            return JsonResponse({'status': 'failed', 'error': str(e), 'redirect_url': cancel_url}, status=400)

    return JsonResponse({'error': 'Método no permitido'}, status=405)

#PAGOSSSSS
def pagar_cita(request, cita_id):
    cita = Cita.objects.get(id=cita_id)
    
    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'unit_amount': 5000,  # en centavos: $50.00
                'product_data': {
                    'name': f'Cita médica con {cita.nombre}',
                },
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=request.build_absolute_uri('pago-exitoso/'),
        cancel_url=request.build_absolute_uri('/pago-cancelado/'),
        metadata={'cita_id': cita.id}
    )
    return redirect(session.url, code=303)
 
def pago_exitoso(request):
    return render(request, 'helcon/pago_exitoso.html')
 
def pago_cancelado(request):
    return render(request, 'helcon/pago_cancelado.html')
from decimal import Decimal, ROUND_HALF_UP
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages

from decimal import Decimal, ROUND_HALF_UP
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib import messages

from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from .models import Cita, Paciente

@login_required
def detalle_cita_paciente(request):
    try:
        paciente = Paciente.objects.get(user=request.user)
    except Paciente.DoesNotExist:
        paciente = None

    citas = Cita.objects.filter(paciente=paciente).order_by('fecha', 'hora') if paciente else []

    return render(request, 'helcon/detalle_cita_paciente.html', {
        'citas': citas,
    })

from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.colors import black, navy, lightgrey

from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib import colors


from io import BytesIO
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors

def generar_comprobante_suscripcion_pdf(doctor, fecha_inicio, precio_mensual, periodo="1 mes", metodo_pago="Tarjeta de crédito"):
    buffer = BytesIO()
    p = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4

    navy = colors.HexColor("#0B0B3B")
    lightblue = colors.HexColor("#A9D0F5")
    blue = colors.HexColor("#5DADE2")
    black = colors.black

    # Fondo decorativo con círculos
    p.setFillColor(navy)
    p.circle(-50, height + 50, 150, stroke=0, fill=1)
    p.circle(width + 50, height - 50, 150, stroke=0, fill=1)

    p.setFillColor(lightblue)
    p.circle(80, height - 100, 40, stroke=0, fill=1)
    p.circle(width - 100, height - 250, 60, stroke=0, fill=1)

    p.setFillColor(blue)
    p.circle(140, height - 130, 20, stroke=0, fill=1)
    p.circle(width - 30, height - 320, 15, stroke=0, fill=1)

    # Encabezado
    p.setFillColor(black)
    p.setFont("Helvetica-Bold", 24)
    p.drawCentredString(width / 2, height - 80, "Health")

    p.setFillColor(blue)
    p.drawString((width / 2) + 40, height - 80, "Connectors")

    p.setFillColor(black)
    p.setFont("Helvetica-Oblique", 10)
    p.drawCentredString(width / 2, height - 100, '"Connecting patients with healthcare"')

    # Título comprobante
    p.setFont("Helvetica-Bold", 14)
    p.drawCentredString(width / 2, height - 140, "COMPROBANTE DE SUSCRIPCIÓN MENSUAL")

    # Datos de la suscripción
    p.setFont("Helvetica-Bold", 12)
    inicio_y = height - 200
    espacio = 20

    nombre_doctor = f"{doctor.user.first_name} {doctor.user.last_name}"
    p.drawString(100, inicio_y, f"Doctor: {doctor.user.first_name}")
    p.drawString(100, inicio_y - espacio, f"Fecha inicio / Start Date: {fecha_inicio.strftime('%d/%m/%Y')}")
    p.drawString(100, inicio_y - 2*espacio, f"Precio mensual / Monthly Fee: ${7.99}")


    # Pie de página
    p.setFillColor(colors.HexColor("#F2F3F4"))
    p.rect(80, 80, width - 160, 40, stroke=0, fill=1)

    p.setFillColor(black)
    p.setFont("Helvetica-Bold", 10)
    p.drawCentredString(width / 2, 100, "Para más información contáctenos en nuestro correo")

    p.setFont("Helvetica", 10)
    p.drawCentredString(width / 2, 90, "armadillomedico2025@gmail.com")

    # Finalizar PDF
    p.showPage()
    p.save()
    buffer.seek(0)
    return buffer


from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseForbidden
from django.core.mail import EmailMessage
from .models import Cita, Paciente, Doctor
from datetime import date

@login_required
def enviar_comprobante_pago(request, cita_id):
    user = request.user

    # Intentar encontrar paciente y doctor relacionado con el user
    paciente = None
    doctor = None
    try:
        paciente = Paciente.objects.get(user=user)
    except Paciente.DoesNotExist:
        pass

    try:
        doctor = Doctor.objects.get(user=user)
    except Doctor.DoesNotExist:
        pass

    if paciente:
        # Enviar comprobante de cita
        try:
            cita = Cita.objects.get(id=cita_id, paciente=paciente)
        except Cita.DoesNotExist:
            return HttpResponseForbidden("No tienes permiso para esta cita.")

        pdf_buffer = generar_comprobante_pdf(cita)

        email = EmailMessage(
            subject="Comprobante de pago de su cita médica",
            body="Adjunto encontrará su comprobante de pago.",
            from_email="armadillomedico2025@gmail.com",
            to=[paciente.user.email],
        )
        email.attach(f"comprobante_cita_{cita.id}.pdf", pdf_buffer.getvalue(), 'application/pdf')
        email.send()

        # ✅ Enviar mismo comprobante al doctor
        email_doctor = EmailMessage(
            subject="Cita confirmada con un paciente",
            body=f"El paciente {paciente.user.get_full_name()} ha pagado y confirmado la cita.",
            from_email="armadillomedico2025@gmail.com",
            to=[cita.doctor.user.email],
        )
        email_doctor.attach(f"comprobante_cita_{cita.id}.pdf", pdf_buffer.getvalue(), 'application/pdf')
        email_doctor.send()


        # Opcional: eliminar cita
        cita.delete()

    elif doctor:
        # Enviar comprobante de suscripción
        # Aquí asumo que tienes los datos de la suscripción; ajusta según tu modelo y lógica
        fecha_inicio = date.today()
        precio_mensual = 50.00
        periodo = "1 mes"
        metodo_pago = "Tarjeta de crédito"

        pdf_buffer = generar_comprobante_suscripcion_pdf(doctor, fecha_inicio, precio_mensual, periodo, metodo_pago)

        email = EmailMessage(
            subject="Comprobante de pago de su suscripción mensual",
            body="Adjunto encontrará su comprobante de pago de suscripción.",
            from_email="armadillomedico2025@gmail.com",
            to=[doctor.user.email],
        )
        email.attach(f"comprobante_suscripcion_doctor_{doctor.id}.pdf", pdf_buffer.getvalue(), 'application/pdf')
        email.send()
        
        doctor.recomendado = 'si'
        doctor.save()
    else:
        return HttpResponseForbidden("Usuario no autorizado.")

    # Mostrar mensaje y redirigir
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Comprobante enviado</title>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap" rel="stylesheet">
        <style>
            :root {
                --seasalt: #FBFAF8ff;
                --ruddy-blue: #6CA5FFff;
                --denim: #245DB5ff;
                --oxford-blue: #111835ff;
                --oxford-blue-2: #051024ff;
                --texto-interno: #C9C9C9;
            }
            body {
                margin: 0;
                padding: 0;
                font-family: 'Poppins', sans-serif;
                background: var(--oxford-blue-2);
                color: var(--texto-interno);
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                flex-direction: column;
                text-align: center;
            }
            h1 {
                color: var(--ruddy-blue);
                font-size: 2rem;
                margin-bottom: 0.5rem;
            }
            p {
                font-size: 1.1rem;
                color: var(--seasalt);
            }
        </style>
        <script>
            setTimeout(function() {
                window.location.href = "http://127.0.0.1:8000/";
            }, 2000);
        </script>
    </head>
    <body>
        <h1>✅ Correo de comprobante enviado</h1>
        <p>Serás redirigido a la página principal en 2 segundos...</p>
    </body>
    </html>
    """
    return HttpResponse(html)




from django.shortcuts import render, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Doctor

@login_required
def recomendacion_doctor(request, doctor_id):
    doctor = get_object_or_404(Doctor, id=doctor_id)

    # Aquí puedes agregar lógica para obtener recomendaciones si tienes otro modelo
    # Por ahora solo mostramos el doctor

    context = {
        'doctor': doctor,
    }
    return render(request, 'helcon/recomendacion_doctor.html', context)


from django.conf import settings  # <- Importa settings para las llaves Stripe
from django.shortcuts import render
from .models import Doctor       # <- Importa tu modelo Doctor
stripe.api_key = settings.STRIPE_SECRET_KEY  # clave secreta

from django.shortcuts import get_object_or_404

from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
import stripe

stripe.api_key = settings.STRIPE_SECRET_KEY

# Vista para iniciar pago relacionado con un doctor
def pago_tarjeta_doctor(request, doctor_id):
    doctor = get_object_or_404(Doctor, id=doctor_id)
    
    # Aquí defines el monto fijo o variable, por ejemplo:
    monto_centavos = 299  # $50.00 por defecto (modifica según necesidad)

    if request.method == 'POST':
        if monto_centavos <= 0:
            return redirect('detalle_doctor')  # Ajusta según url válida
        
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': f'Pago por servicio del Dr. {doctor.user.first_name} {doctor.user.last_name}',
                    },
                    'unit_amount': monto_centavos,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=request.build_absolute_uri(reverse('enviar_comprobante_doctor', args=[doctor.id])),
            cancel_url=request.build_absolute_uri(reverse('pago_cancelado')),
        )
        return redirect(session.url, code=303)

    context = {
        'stripe_public_key': settings.STRIPE_PUBLIC_KEY,
        'doctor': doctor,
    }
    return render(request, 'helcon/pago_targeta_doctor.html', context)

# Procesar pago con PaymentIntent (opcional, si usas pago inmediato con JS)
@csrf_exempt
def procesar_pago_doctor(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        try:
            intent = stripe.PaymentIntent.create(
                amount=5000,  # monto fijo, modifica si necesitas variable
                currency='usd',
                payment_method=data['payment_method_id'],
                confirm=True,
            )
            success_url = request.build_absolute_uri(reverse('enviar_comprobante_doctor'))
            return JsonResponse({'status': 'success', 'redirect_url': success_url})
        except stripe.error.CardError as e:
            cancel_url = request.build_absolute_uri(reverse('pago_cancelado'))
            return JsonResponse({'status': 'failed', 'error': str(e), 'redirect_url': cancel_url}, status=400)

    return JsonResponse({'error': 'Método no permitido'}, status=405)

# Pago directo con checkout session para doctor
def pagar_doctor(request, doctor_id):
    doctor = get_object_or_404(Doctor, id=doctor_id)
    monto_centavos = 5000  # Por defecto, cambia si quieres que sea dinámico

    session = stripe.checkout.Session.create(
        payment_method_types=['card'],
        line_items=[{
            'price_data': {
                'currency': 'usd',
                'unit_amount': monto_centavos,
                'product_data': {
                    'name': f'Pago por servicio del Dr. {doctor.user.first_name} {doctor.user.last_name}',
                },
            },
            'quantity': 1,
        }],
        mode='payment',
        success_url=request.build_absolute_uri(reverse('pago_exitoso')),
        cancel_url=request.build_absolute_uri(reverse('pago_cancelado')),
        metadata={'doctor_id': doctor.id}
    )
    return redirect(session.url, code=303)
@login_required
def enviar_comprobante_pago_doctor(request, doctor_id):
    user = request.user

    # Intentar encontrar paciente y doctor relacionado con el user
    paciente = None
    doctor = None
    try:
        paciente = Paciente.objects.get(user=user)
    except Paciente.DoesNotExist:
        pass

    try:
        doctor = Doctor.objects.get(user=user)
    except Doctor.DoesNotExist:
        pass

    if paciente:
        # Enviar comprobante de cita
        try:
            cita = Cita.objects.get(id=cita_id, paciente=paciente)
        except Cita.DoesNotExist:
            return HttpResponseForbidden("No tienes permiso para esta cita.")

        pdf_buffer = generar_comprobante_pdf(cita)

        email = EmailMessage(
            subject="Comprobante de pago de su cita médica",
            body="Adjunto encontrará su comprobante de pago.",
            from_email="armadillomedico2025@gmail.com",
            to=[paciente.user.email],
        )
        email.attach(f"comprobante_cita_{cita.id}.pdf", pdf_buffer.getvalue(), 'application/pdf')
        email.send()


        # Opcional: eliminar cita
        cita.delete()

    elif doctor:
        # Enviar comprobante de suscripción
        # Aquí asumo que tienes los datos de la suscripción; ajusta según tu modelo y lógica
        fecha_inicio = date.today()
        precio_mensual = 50.00
        periodo = "1 mes"
        metodo_pago = "Tarjeta de crédito"

        pdf_buffer = generar_comprobante_suscripcion_pdf(doctor, fecha_inicio, precio_mensual, periodo, metodo_pago)

        email = EmailMessage(
            subject="Comprobante de pago de su suscripción mensual",
            body="Adjunto encontrará su comprobante de pago de suscripción.",
            from_email="armadillomedico2025@gmail.com",
            to=[doctor.user.email],
        )
        email.attach(f"comprobante_suscripcion_doctor_{doctor.id}.pdf", pdf_buffer.getvalue(), 'application/pdf')
        email.send()
        
        doctor.recomendado = 'si'
        doctor.save()
    else:
        return HttpResponseForbidden("Usuario no autorizado.")
    
from django.shortcuts import get_object_or_404, redirect
from django.contrib import messages
from .models import Cita, Paciente

def aplicar_cupon(request, cita_id):
    if request.method == 'POST':
        cupon_elegido = request.POST.get('cupon')
        cita = get_object_or_404(Cita, id=cita_id)
        paciente = cita.paciente

        if paciente and paciente.cupon == 'si' and cupon_elegido == '1':
            # Aplica el 15% de descuento
            precio_original = float(cita.precio)
            descuento = round(precio_original * 0.15, 2)
            cita.precio = round(precio_original - descuento, 2)
            cita.save()

            paciente.cupon = 'no'
            paciente.save()

            messages.success(request, f'✅ Cupón aplicado. Nuevo precio: ${cita.precio:.2f}')
        elif cupon_elegido == '1':
            messages.error(request, '❌ Ya usaste tu cupón.')
        else:
            messages.info(request, 'ℹ️ Ese cupón no es válido.')

    return redirect('detalle_cita_paciente')


from django.shortcuts import render, get_object_or_404
from decimal import Decimal
from .models import Cita


from django.shortcuts import render, get_object_or_404
from decimal import Decimal, ROUND_HALF_UP
from django.contrib.auth.decorators import login_required
from .models import Doctor
from .models import Cita  # Asegúrate de importar el modelo si lo usas

from django.shortcuts import render, get_object_or_404
from decimal import Decimal, ROUND_HALF_UP
from django.contrib.auth.decorators import login_required
from .models import Doctor, Cita

from django.shortcuts import render, get_object_or_404
from decimal import Decimal, ROUND_HALF_UP
from django.contrib.auth.decorators import login_required
from .models import Doctor, Paciente, Cita

from django.shortcuts import render, get_object_or_404
from decimal import Decimal, ROUND_HALF_UP
from django.contrib.auth.decorators import login_required
from .models import Doctor, Paciente, Cita

from django.shortcuts import render, get_object_or_404
from decimal import Decimal, ROUND_HALF_UP
from django.contrib.auth.decorators import login_required
from .models import Doctor, Paciente, Cita

from django.shortcuts import render, redirect, get_object_or_404
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from decimal import Decimal, ROUND_HALF_UP
from .models import Doctor, Paciente
import stripe
from django.conf import settings

stripe.api_key = settings.STRIPE_SECRET_KEY
from decimal import Decimal, ROUND_HALF_UP
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, get_object_or_404, redirect

from decimal import Decimal, ROUND_HALF_UP
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from decimal import Decimal, ROUND_HALF_UP
from .models import Doctor, Paciente


from django.shortcuts import render, redirect
from django.contrib import messages
from .models import Cita

def registrar_cita_doc(request):
    if request.method == 'POST':
        nombre = request.POST.get('nombre')
        fecha = request.POST.get('fecha')
        hora = request.POST.get('hora')

        # Suponiendo que tienes un modelo Doctor relacionado con User
        try:
            doctor = Doctor.objects.get(user=request.user)
        except Doctor.DoesNotExist:
            # Sin mensaje, solo redirige
            return redirect('registrar_cita_doc')

        if nombre and fecha and hora:
            cita = Cita.objects.create(
                doctor=doctor,
                doctor_nombre=doctor.user.first_name,  # o doctor.nombre si tienes ese campo
                nombre=nombre,
                fecha_cita=fecha,
                fecha=fecha,
                hora=hora,
            )
            return redirect('home_doctor')  # Redirige sin mensaje
        else:
            # Solo redirige sin mensaje
            return redirect('registrar_cita_doc')

    context = {
        'doctor_nombre': request.user.first_name if request.user.is_authenticated else '',
    }
    return render(request, 'helcon/registrar_cita_doc.html', context)

from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Doctor, Paciente, Cita
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
import stripe
from django.conf import settings
from django.views.decorators.http import require_POST

# --- Configura tu clave secreta de Stripe ---
stripe.api_key = settings.STRIPE_SECRET_KEY

from django.shortcuts import render, get_object_or_404, redirect
from django.urls import reverse
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import Doctor, Paciente, Cita
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
import stripe
from django.conf import settings
from django.views.decorators.http import require_POST

# --- Configura tu clave secreta de Stripe ---
stripe.api_key = settings.STRIPE_SECRET_KEY

@login_required
def agenda(request, doctor_id):
    doctor = get_object_or_404(Doctor, id=doctor_id)

    try:
        paciente = Paciente.objects.get(user=request.user)
    except Paciente.DoesNotExist:
        paciente = None

    if request.method == 'POST':
        # Obtener datos del formulario
        data = {
            'nombre': request.POST.get('nombre'),
            'fecha_nacimiento': request.POST.get('fecha_nacimiento'),
            'cedula': request.POST.get('cedula'),
            'telefono': request.POST.get('telefono'),
            'datos_consulta': request.POST.get('datos_consulta'),
            'motivo_visita': request.POST.get('motivo_visita'),
            'aseguradora': request.POST.get('aseguradora'),
            ### CORRECCIÓN 1: Usar las claves 'hora' y 'fecha' para que coincidan con el modelo Cita ###
            'hora': request.POST.get('horacita'),
            'fecha': request.POST.get('fecha_cita'),
            'doctor_id': doctor.id
        }

        # Guardar en sesión para ser usados tras el pago
        request.session['cita_data'] = data

        return redirect('vistadecita', doctor_id=doctor.id)


    return render(request, 'helcon/agenda.html', {
        'paciente': paciente,
        'doctor': doctor,
    })


@login_required
def vistadecita(request, doctor_id):
    """
    Prepara los detalles de la cita, calcula los precios y los guarda en la sesión.
    """
    doctor = get_object_or_404(Doctor, id=doctor_id)
    paciente = get_object_or_404(Paciente, user=request.user)

    ### CORRECCIÓN 2: Leer los datos de la sesión en lugar de usar datos de ejemplo ###
    cita_data = request.session.get('cita_data')
    if not cita_data:
        messages.error(request, "No se encontraron datos de la cita. Por favor, agende de nuevo.")
        return redirect('home')

    # Lógica de cálculo de precios
    preciobase = doctor.preciobase or Decimal('0.00')
    porcentaje = (preciobase * Decimal('0.02')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    if doctor.recomendado == 'si':
        porcentaje = (preciobase * Decimal('0.05')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

    descuento = Decimal('0.00')
    precio_final = porcentaje

    # Aplicar cupón si se envía el formulario
    if request.method == 'POST' and 'aplicar_cupon' in request.POST:
        if paciente.cupon == 'si' and request.POST.get('cupon') == '1':
            request.session['cupon_aplicado'] = True

    cupon_aplicado = request.session.get('cupon_aplicado', False)
    if cupon_aplicado:
        descuento = (porcentaje * Decimal('0.15')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
        precio_final = (porcentaje - descuento).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)

    ### CORRECCIÓN 3: Actualizar la sesión con los precios, sin sobrescribir los datos de la cita ###
    cita_data['precio'] = str(precio_final)
    cita_data['descuento'] = str(descuento)
    request.session['cita_data'] = cita_data # Guardar los datos actualizados
    request.session.save()

    return render(request, 'helcon/vistadecita.html', {
        'doctor': doctor,
        'paciente': paciente,
        'preciobase': preciobase,
        'porcentaje': porcentaje,
        'porcentaje2': precio_final,
        'descuento': descuento,
        'cupon_aplicado': cupon_aplicado,
        'cita': cita_data, # Pasar los datos reales de la sesión a la plantilla
    })


@login_required
@require_POST # Esta vista solo debe aceptar peticiones POST
def pago_tarjeta(request):
    """
    Crea la sesión de Stripe Checkout y redirige al usuario a la página de pago.
    """
    cita_data = request.session.get('cita_data')

    if not cita_data:
        messages.error(request, "No hay datos de cita para procesar el pago.")
        return redirect('home')

    doctor = get_object_or_404(Doctor, id=cita_data.get('doctor_id'))
    
    try:
        precio_final = Decimal(cita_data.get('precio'))
        monto_centavos = int(precio_final * 100)
    except (InvalidOperation, TypeError):
        messages.error(request, "El precio es inválido.")
        return redirect('home')

    if monto_centavos < 50: # Stripe requiere un monto mínimo (ej. 0.50 USD)
        messages.error(request, "El monto a pagar es demasiado bajo.")
        return redirect('vistadecita', doctor_id=doctor.id)

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd', # O tu moneda, ej: 'pab'
                    'product_data': {
                        'name': f'Cita médica con Dr. {doctor.user.first_name} {doctor.user.last_name}',
                        'description': f"Fecha: {cita_data['fecha']} a las {cita_data['hora']}"
                    },
                    'unit_amount': monto_centavos,
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=request.build_absolute_uri(reverse('confirmar_pago')),
            cancel_url=request.build_absolute_uri(reverse('pago_cancelado')),
        )
        return redirect(session.url, code=303)

    except stripe.error.StripeError as e:
        messages.error(request, f"Ocurrió un error con el servicio de pago: {str(e)}")
        return redirect('home')


@login_required
def confirmar_pago(request):
    """
    Esta es la 'success_url'. Se ejecuta después de un pago exitoso.
    Aquí se crea la cita en la base de datos.
    """
    cita_data = request.session.get('cita_data')

    if not cita_data:
        messages.error(request, "No se pudo confirmar la cita. Sesión expirada.")
        return redirect('home')

    doctor = get_object_or_404(Doctor, id=cita_data['doctor_id'])
    paciente = get_object_or_404(Paciente, user=request.user)

    # Evitar crear citas duplicadas si el usuario recarga la página de éxito
    if Cita.objects.filter(doctor=doctor, paciente=paciente, fecha=cita_data['fecha'], hora=cita_data['hora']).exists():
        messages.info(request, "Esta cita ya ha sido registrada.")
    else:
        # Guardar la cita en la base de datos con todos los campos requeridos
        Cita.objects.create(
            paciente=paciente,
            doctor=doctor,
            nombre=cita_data.get('nombre'),
            doctor_nombre=doctor.user.get_full_name(),
            fecha=cita_data.get('fecha'),
            hora=cita_data.get('hora'),
            motivo_visita=cita_data.get('motivo_visita'),
            datos_consulta=cita_data.get('datos_consulta', ''),
            aseguradora=cita_data.get('aseguradora', ''),
            fecha_cita=cita_data.get('fecha'),
            estado_cita='No confirmada',
            precio=Decimal(cita_data.get('precio')),
        )
        # Aquí actualizas el campo cupon del paciente para que no pueda usar otro
        paciente.cupon = 'no'
        paciente.save()

        messages.success(request, "¡Pago exitoso! Tu cita ha sido confirmada.")

    # Limpiar los datos de la sesión para que no se puedan reutilizar
    if 'cita_data' in request.session:
        del request.session['cita_data']
    if 'cupon_aplicado' in request.session:
        del request.session['cupon_aplicado']

    return render(request, 'helcon/home_paciente.html')
