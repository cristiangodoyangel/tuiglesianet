package net.tuiglesia.control.oracion.repository;

import net.tuiglesia.control.oracion.model.PeticionOracion;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PeticionOracionRepository extends JpaRepository<PeticionOracion, Long> {
}
