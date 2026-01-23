package net.tuiglesia.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

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

    private LocalDate fecha;

    @Column(nullable = false)
    private boolean respondida = false;

    @ManyToOne
    @JoinColumn(name = "iglesia_id", nullable = false)
    private Iglesia iglesia;
}