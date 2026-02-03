package net.tuiglesia.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

import net.tuiglesia.api.model.enums.EstadoPeticion;
import net.tuiglesia.api.model.enums.TipoPeticion;

@Data
@Entity
@Table(name = "peticiones_oracion")
public class PeticionOracion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    private String solicitante; // Nombre de la persona (puede no ser miembro)

    @Column(name = "oracion_por")
    private String oracionPor; // Nombre del beneficiario

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoPeticion tipo = TipoPeticion.OTRO;

    private LocalDate fecha;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoPeticion estado = EstadoPeticion.PENDIENTE;

    @Column(columnDefinition = "TEXT")
    private String respuesta; // Testimonio de cómo Dios respondió

    // Campo legacy para compatibilidad temporal, se prefiere usar el Enum
    private boolean respondida = false;

    @ManyToOne
    @JoinColumn(name = "iglesia_id", nullable = false)
    private Iglesia iglesia;

    @PrePersist
    protected void onCreate() {
        if (fecha == null) {
            fecha = LocalDate.now();
        }
    }
}