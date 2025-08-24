# core/models.py
# Borra todo el contenido actual y reemplázalo con esto:

import uuid
from django.db import models

class Iglesia(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=255)
    ciudad = models.CharField(max_length=100, blank=True, null=True)
    logo_url = models.TextField(blank=True, null=True)
    creada_en = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'iglesias'
        verbose_name = 'Iglesia'
        verbose_name_plural = 'Iglesias'
    
    def __str__(self):
        return self.nombre

class Usuario(models.Model):
    ROL_CHOICES = [
        ('pastor', 'Pastor'),
        ('admin', 'Administrador'),
    ]
    
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    nombre = models.CharField(max_length=255)
    email = models.CharField(max_length=255, unique=True)
    password_hash = models.CharField(max_length=255)
    rol = models.CharField(max_length=10, choices=ROL_CHOICES)
    iglesia = models.ForeignKey(Iglesia, on_delete=models.CASCADE, db_column='iglesia_id')
    creado_en = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'usuarios'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    
    def __str__(self):
        return f"{self.nombre} ({self.iglesia.nombre})"

class Miembro(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    iglesia = models.ForeignKey(Iglesia, on_delete=models.CASCADE, db_column='iglesia_id')
    nombre = models.CharField(max_length=255)
    edad = models.IntegerField(blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    sector = models.CharField(max_length=100, blank=True, null=True)
    ministerio = models.CharField(max_length=100, blank=True, null=True)
    cargo = models.CharField(max_length=100, blank=True, null=True)
    bautismo = models.BooleanField(default=False)
    discipulado = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'miembros'
        verbose_name = 'Miembro'
        verbose_name_plural = 'Miembros'
    
    def __str__(self):
        return f"{self.nombre} - {self.iglesia.nombre}"

class NuevoMiembro(models.Model):
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    iglesia = models.ForeignKey(Iglesia, on_delete=models.CASCADE, db_column='iglesia_id')
    nombre = models.CharField(max_length=255)
    edad = models.IntegerField(blank=True, null=True)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    invitado_por = models.CharField(max_length=255, blank=True, null=True)
    notas_seguimiento = models.TextField(blank=True, null=True)
    fecha_ingreso = models.DateField(auto_now_add=True)
    
    class Meta:
        db_table = 'nuevos_miembros'
        verbose_name = 'Nuevo Miembro'
        verbose_name_plural = 'Nuevos Miembros'
    
    def __str__(self):
        return f"{self.nombre} - {self.iglesia.nombre}"

class Oracion(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('respondida', 'Respondida'),
    ]
    
    id = models.CharField(max_length=36, primary_key=True, default=uuid.uuid4, editable=False)
    iglesia = models.ForeignKey(Iglesia, on_delete=models.CASCADE, db_column='iglesia_id')
    solicitante = models.CharField(max_length=255)
    para_quien = models.CharField(max_length=255, blank=True, null=True)
    motivo = models.TextField(blank=True, null=True)
    estado = models.CharField(max_length=15, choices=ESTADO_CHOICES, default='pendiente')
    fecha = models.DateField(auto_now_add=True)
    
    class Meta:
        db_table = 'oraciones'
        verbose_name = 'Oración'
        verbose_name_plural = 'Oraciones'
    
    def __str__(self):
        return f"Oración por {self.para_quien or self.solicitante} - {self.iglesia.nombre}"