from django.contrib import admin

# Register your models here.
# core/admin.py
# Reemplaza todo el contenido con esto:

from django.contrib import admin
from .models import Iglesia, Usuario, Miembro, NuevoMiembro, Oracion

@admin.register(Iglesia)
class IglesiaAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'ciudad', 'creada_en')
    list_filter = ('ciudad', 'creada_en')
    search_fields = ('nombre', 'ciudad')
    readonly_fields = ('id', 'creada_en')
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'ciudad')
        }),
        ('Logo', {
            'fields': ('logo_url',),
            'classes': ('collapse',)
        }),
        ('Metadatos', {
            'fields': ('id', 'creada_en'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Usuario)
class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'email', 'rol', 'iglesia', 'creado_en')
    list_filter = ('rol', 'iglesia', 'creado_en')
    search_fields = ('nombre', 'email', 'iglesia__nombre')
    readonly_fields = ('id', 'creado_en')
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('nombre', 'email')
        }),
        ('Acceso y Permisos', {
            'fields': ('rol', 'iglesia', 'password_hash')
        }),
        ('Metadatos', {
            'fields': ('id', 'creado_en'),
            'classes': ('collapse',)
        }),
    )

@admin.register(Miembro)
class MiembroAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'edad', 'sector', 'ministerio', 'bautismo', 'discipulado', 'iglesia')
    list_filter = ('bautismo', 'discipulado', 'ministerio', 'iglesia', 'creado_en')
    search_fields = ('nombre', 'telefono', 'sector', 'iglesia__nombre')
    readonly_fields = ('id', 'creado_en')
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('nombre', 'edad', 'telefono', 'sector')
        }),
        ('Información Ministerial', {
            'fields': ('iglesia', 'ministerio', 'cargo')
        }),
        ('Estado Espiritual', {
            'fields': ('bautismo', 'discipulado')
        }),
        ('Metadatos', {
            'fields': ('id', 'creado_en'),
            'classes': ('collapse',)
        }),
    )
    
    # Acciones personalizadas
    actions = ['marcar_bautizado', 'marcar_discipulado']
    
    def marcar_bautizado(self, request, queryset):
        updated = queryset.update(bautismo=True)
        self.message_user(request, f'{updated} miembros marcados como bautizados.')
    marcar_bautizado.short_description = "Marcar como bautizado"
    
    def marcar_discipulado(self, request, queryset):
        updated = queryset.update(discipulado=True)
        self.message_user(request, f'{updated} miembros marcados con discipulado completado.')
    marcar_discipulado.short_description = "Marcar discipulado completado"

@admin.register(NuevoMiembro)
class NuevoMiembroAdmin(admin.ModelAdmin):
    list_display = ('nombre', 'edad', 'invitado_por', 'fecha_ingreso', 'iglesia')
    list_filter = ('fecha_ingreso', 'iglesia', 'invitado_por')
    search_fields = ('nombre', 'telefono', 'invitado_por', 'iglesia__nombre')
    readonly_fields = ('id', 'fecha_ingreso')
    date_hierarchy = 'fecha_ingreso'
    
    fieldsets = (
        ('Información Personal', {
            'fields': ('nombre', 'edad', 'telefono')
        }),
        ('Información de Seguimiento', {
            'fields': ('iglesia', 'invitado_por', 'notas_seguimiento')
        }),
        ('Metadatos', {
            'fields': ('id', 'fecha_ingreso'),
            'classes': ('collapse',)
        }),
    )
    
    # Acciones personalizadas
    actions = ['convertir_a_miembro']
    
    def convertir_a_miembro(self, request, queryset):
        from .models import Miembro
        convertidos = 0
        for nuevo_miembro in queryset:
            # Crear miembro regular
            Miembro.objects.create(
                iglesia=nuevo_miembro.iglesia,
                nombre=nuevo_miembro.nombre,
                edad=nuevo_miembro.edad,
                telefono=nuevo_miembro.telefono,
                bautismo=False,
                discipulado=False
            )
            convertidos += 1
        
        self.message_user(request, f'{convertidos} nuevos miembros convertidos a miembros regulares.')
    convertir_a_miembro.short_description = "Convertir a miembro regular"

@admin.register(Oracion)
class OracionAdmin(admin.ModelAdmin):
    list_display = ('solicitante', 'para_quien', 'motivo_corto', 'estado', 'fecha', 'iglesia')
    list_filter = ('estado', 'fecha', 'iglesia')
    search_fields = ('solicitante', 'para_quien', 'motivo', 'iglesia__nombre')
    readonly_fields = ('id', 'fecha')
    date_hierarchy = 'fecha'
    
    fieldsets = (
        ('Información de la Petición', {
            'fields': ('solicitante', 'para_quien', 'motivo')
        }),
        ('Estado y Seguimiento', {
            'fields': ('iglesia', 'estado')
        }),
        ('Metadatos', {
            'fields': ('id', 'fecha'),
            'classes': ('collapse',)
        }),
    )
    
    # Método personalizado para mostrar motivo corto
    def motivo_corto(self, obj):
        if obj.motivo:
            return obj.motivo[:50] + "..." if len(obj.motivo) > 50 else obj.motivo
        return "Sin motivo"
    motivo_corto.short_description = "Motivo"
    
    # Acciones personalizadas
    actions = ['marcar_como_respondida', 'marcar_como_pendiente']
    
    def marcar_como_respondida(self, request, queryset):
        updated = queryset.update(estado='respondida')
        self.message_user(request, f'{updated} oraciones marcadas como respondidas.')
    marcar_como_respondida.short_description = "Marcar como respondida"
    
    def marcar_como_pendiente(self, request, queryset):
        updated = queryset.update(estado='pendiente')
        self.message_user(request, f'{updated} oraciones marcadas como pendientes.')
    marcar_como_pendiente.short_description = "Marcar como pendiente"

# Personalizar el admin site
admin.site.site_header = "TuIglesia.net - Panel de Administración"
admin.site.site_title = "TuIglesia.net Admin"
admin.site.index_title = "Bienvenido al Panel de Administración"