from django.db import models
from django.contrib.auth.models import AbstractUser

class Church(models.Model):
    PLAN_CHOICES = [
        ('free', 'Gratis'),
        ('premium', 'Premium'),
    ]
    
    name = models.CharField('Nombre', max_length=200)
    city = models.CharField('Ciudad', max_length=100)
    logo_url = models.URLField('Logo URL', blank=True, null=True)
    plan = models.CharField('Plan', max_length=10, choices=PLAN_CHOICES, default='free')
    created_at = models.DateTimeField('Fecha de creación', auto_now_add=True)
    
    class Meta:
        verbose_name = 'Iglesia'
        verbose_name_plural = 'Iglesias'
    
    def __str__(self):
        return self.name

class User(AbstractUser):
    ROLE_CHOICES = [
        ('owner', 'Propietario'),
        ('admin', 'Administrador'),
    ]
    
    church = models.ForeignKey(Church, on_delete=models.CASCADE, related_name='users', verbose_name='Iglesia')
    role = models.CharField('Rol', max_length=10, choices=ROLE_CHOICES, default='admin')
    full_name = models.CharField('Nombre completo', max_length=200)
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    
    def __str__(self):
        return f"{self.full_name} ({self.church.name})"

class Member(models.Model):
    church = models.ForeignKey(Church, on_delete=models.CASCADE, related_name='members')
    full_name = models.CharField('Nombre completo', max_length=200)
    age = models.IntegerField('Edad')
    phone = models.CharField('Teléfono', max_length=20)
    city_sector = models.CharField('Sector de la ciudad', max_length=100)
    department_ministry = models.CharField('Departamento/Ministerio', max_length=100)
    position = models.CharField('Cargo', max_length=100, blank=True)
    baptism_date = models.DateField('Fecha de bautismo', null=True, blank=True)
    discipleship_completed = models.BooleanField('Discipulado completado', default=False)
    created_at = models.DateTimeField('Fecha de registro', auto_now_add=True)
    
    class Meta:
        verbose_name = 'Miembro'
        verbose_name_plural = 'Miembros'
    
    def __str__(self):
        return f"{self.full_name} - {self.church.name}"

class PrayerRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('answered', 'Respondida'),
    ]
    
    church = models.ForeignKey(Church, on_delete=models.CASCADE, related_name='prayer_requests')
    requester_name = models.CharField('Solicitante', max_length=200)
    prayer_for = models.CharField('Oración para', max_length=200)
    reason = models.TextField('Motivo')
    status = models.CharField('Estado', max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField('Fecha de solicitud', auto_now_add=True)
    
    class Meta:
        verbose_name = 'Petición de oración'
        verbose_name_plural = 'Peticiones de oración'
    
    def __str__(self):
        return f"Oración por {self.prayer_for}"

class NewMemberFollowup(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pendiente'),
        ('contacted', 'Contactado'),
        ('visited', 'Visitado'),
        ('integrated', 'Integrado'),
    ]
    
    member = models.ForeignKey(Member, on_delete=models.CASCADE, related_name='followups')
    church = models.ForeignKey(Church, on_delete=models.CASCADE, related_name='followups')
    invited_by = models.CharField('Invitado por', max_length=200)
    follow_up_notes = models.TextField('Notas de seguimiento', blank=True)
    next_follow_up_date = models.DateField('Próximo seguimiento')
    status = models.CharField('Estado', max_length=15, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField('Fecha de creación', auto_now_add=True)
    
    class Meta:
        verbose_name = 'Seguimiento de nuevo miembro'
        verbose_name_plural = 'Seguimientos de nuevos miembros'
    
    def __str__(self):
        return f"Seguimiento: {self.member.full_name}"