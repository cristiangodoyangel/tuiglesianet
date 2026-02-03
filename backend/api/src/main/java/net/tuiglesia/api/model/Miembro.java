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

    @ElementCollection(targetClass = EstadoSeguimiento.class, fetch = FetchType.EAGER)
    @CollectionTable(name = "miembro_estados", joinColumns = @JoinColumn(name = "miembro_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private java.util.Set<EstadoSeguimiento> estados = new java.util.HashSet<>();

    private String notasSeguimiento;

    // 🔗 LA MAGIA: Conexión con la Iglesia
    // Muchos miembros pertenecen a UNA iglesia.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "iglesia_id", nullable = false) // Crea la llave foránea en BD
    @JsonIgnore // Evita un bucle infinito al convertir a JSON
    private Iglesia iglesia;

    @OneToMany(mappedBy = "miembro", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private java.util.List<Diezmo> diezmos;
}