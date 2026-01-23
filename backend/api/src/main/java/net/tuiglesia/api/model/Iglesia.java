package net.tuiglesia.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data // ✨ Magia de Lombok: Crea getters, setters y toString automáticamente (adiós código repetitivo)
@Entity // 🏗️ Le dice a Spring: "Esto es una tabla en la Base de Datos"
@Table(name = "iglesias") // 🗃️ Nombre real que tendrá la tabla en PostgreSQL
public class Iglesia {

    @Id // 🔑 Es la Llave Primaria (Primary Key)
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 🔢 Es Auto-incremental (Serial en Postgres)
    private Long id;

    @Column(nullable = false, length = 100) // Campo obligatorio, max 100 caracteres
    private String nombre;

    @Column(name = "pastor_principal") // En Java usamos camelCase, en BD snake_case
    private String pastorPrincipal;

    private String direccion;

    private String telefono;

    @Column(unique = true) // No pueden haber dos iglesias con el mismo email
    private String email;

    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @PrePersist // 🕒 Antes de guardar por primera vez, asigna la fecha actual
    protected void onCreate() {
        this.fechaCreacion = LocalDateTime.now();
    }
}