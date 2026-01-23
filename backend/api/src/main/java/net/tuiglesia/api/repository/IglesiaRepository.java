package net.tuiglesia.api.repository;

import net.tuiglesia.api.model.Iglesia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IglesiaRepository extends JpaRepository<Iglesia, Long> {
    // ¡Listo! No necesitas escribir código.
    // Al extender de JpaRepository, ya tienes métodos como .save(), .findAll(), .findById() gratis.
}