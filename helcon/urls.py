from django.urls import path
from . import views
from django.contrib.auth import views as auth_views
from .views import enviar_comprobante_pago
from .views import enviar_comprobante_pago_doctor


urlpatterns = [
    path('', views.home, name='home'),
    path('seleccionar_tipo/', views.registro, name='registro'),
    path('login/', views.login_view, name='login'),
    path('formDoctor/', views.formdoc, name='formdoc'),
    path('formPaciente/', views.formpac, name='formpac'),
    path('segunda/', views.segpag, name='segpag'),
    path('tercera/', views.tercerapag, name='tercerapag'),
    path('cuarta/', views.cuarpag, name='cuarpag'),
    path('blog/', views.blog_view, name='blog_view'),
    path('dissplay/', views.dissplay_view, name='dissplay'),
    path('contacto/', views.contacto_view, name='contacto'),
#url para redirigir desde log paciente
    path('segunda_pac/', views.segpag_pac, name='segpag_pac'),
    path('home_doctor/', views.home_doc, name='home_doctor'),
    path('aplicar_cupon/<int:cita_id>/', views.aplicar_cupon, name='aplicar_cupon'),
    path('journal1/', views.journal1_view, name='journal1'),
    path('journal2/', views.journal2_view, name='journal2'),
    path('journal3/', views.journal3_view, name='journal3'),
    path('journal4/', views.journal4_view, name='journal4'),
    path('journal5/', views.journal5_view, name='journal5'),
    path('journal6/', views.journal6_view, name='journal6'),
    path('perfil/', views.perfil_doctor, name='perfil_doctor'),
    path('logout/', views.logout_view, name='logout'),
    # Aquí la URL con parámetro 'id'
    path('mas_informacion/<int:id>/', views.mas_informacion, name='mas_informacion'),
    path('home_paciente/', views.home_paciente, name='home_paciente'),
    path('perfilpa/', views.perfil_paciente, name='perfil_paciente'),
    # FOOTER
    path('difamation/', views.difamation_view, name='difamation'),
    path('terms/', views.terms_view, name='terms'),
    path('privacy_policies/', views.privacy_policies, name='privacy_policies'),
    path('agenda/<int:doctor_id>/',views.agenda, name='agenda'),
    path('api/citas/', views.api_citas, name='api_citas'),
    path('pago_tarjeta/', views.pago_tarjeta, name='pago_tarjeta'),

    path('procesar_pago/', views.procesar_pago, name='procesar_pago'),
    path('cita/<int:cita_id>/', views.detalle_cita, name='detalle_cita'),
    
    
    ##PAGO DE CITA
    path('pagar-cita/int:cita_id/', views.pagar_cita, name='pagar_cita'),
    path('pago-exitoso/', views.pago_exitoso, name='pago_exitoso'),
    path('pago-cancelado/', views.pago_cancelado, name='pago_cancelado'),
    path('detalle_cita_paciente/', views.detalle_cita_paciente, name='detalle_cita_paciente'),
    path('enviar-comprobante/<int:cita_id>/', enviar_comprobante_pago, name='enviar_comprobante'),
    path('recomendacion_doctor/<int:doctor_id>/', views.recomendacion_doctor, name='recomendacion_doctor'),

    ##PAGO DE SUGERIDOS
    path('pagar_doctor/<int:doctor_id>/', views.pagar_doctor, name='pagar_doctor'),
    path('procesar_pago_doctor/', views.procesar_pago_doctor, name='procesar_pago_doctor'),
    path('pago_tarjeta_doctor/<int:doctor_id>/', views.pago_tarjeta_doctor, name='pago_tarjeta_doctor'),
    path('enviar-comprobante/<int:doctor_id>/', enviar_comprobante_pago_doctor, name='enviar_comprobante_doctor'),
    path('vistadecita/<int:doctor_id>/', views.vistadecita, name='vistadecita'),
    path('confirmar_pago/', views.confirmar_pago, name='confirmar_pago'),
    path('registrar_cita_doc/', views.registrar_cita_doc, name='registrar_cita_doc'),


]
    


