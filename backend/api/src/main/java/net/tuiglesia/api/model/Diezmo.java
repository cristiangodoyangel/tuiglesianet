package net.tuiglesia.api.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "diezmos")
public class Diezmo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private BigDecimal monto; // Usamos BigDecimal para dinero exacto

    @Column(nullable = false)
    private LocalDate fecha;

    private String observacion; // "Transferencia", "Efectivo", etc.

    // Relación: Un diezmo pertenece a un Miembro
    @ManyToOne
    @JoinColumn(name = "miembro_id", nullable = false)
    private Miembro miembro;

    // Relación: Y ese dinero entra a una Iglesia
    @ManyToOne
    @JoinColumn(name = "iglesia_id", nullable = false)
    private Iglesia iglesia;
}