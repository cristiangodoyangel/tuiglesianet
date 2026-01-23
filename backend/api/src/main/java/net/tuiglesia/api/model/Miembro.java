package net.tuiglesia.api.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import net.tuiglesia.api.model.enums.EstadoSeguimiento;

@Data
@Entity
@Table(name = "miembros")
public class Miembro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
    private String apellidos;

    private String email;

    private String telefono;

    @Column(name = "fecha_nacimiento")
    private LocalDate fechaNacimiento;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_seguimiento")
    private EstadoSeguimiento estado = EstadoSeguimiento.VISITA_PRIMERA_VEZ;

    private String notasSeguimiento;

    // 🔗 LA MAGIA: Conexión con la Iglesia
    // Muchos miembros pertenecen a UNA iglesia.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "iglesia_id", nullable = false) // Crea la llave foránea en BD
    @JsonIgnore // Evita un bucle infinito al convertir a JSON
    private Iglesia iglesia;
}