package net.tuiglesia.control.oracion.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PeticionOracion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String solicitante;     // Quién solicita la oración
    private String titulo;          // Petición de oración
    private String afectado;        // Persona por quien se pide
    private LocalDate fecha;        // Fecha de la petición
    private String categoria;       // Categoría (salud, trabajo, etc.)
    private String estado;          // Estado (pendiente, en oración, respondida)
}
