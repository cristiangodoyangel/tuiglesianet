package net.tuiglesia.api.model;

import jakarta.persistence.*;
import lombok.Data;
import net.tuiglesia.api.model.enums.EstadoActividad;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "actividades")
public class Actividad {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    private String descripcion;

    @Column(nullable = false)
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaTermino;

    private String responsable;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoActividad estado;

    @ManyToOne
    @JoinColumn(name = "iglesia_id", nullable = false)
    private Iglesia iglesia;
}