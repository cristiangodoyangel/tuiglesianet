package net.tuiglesia.api.repository;

import net.tuiglesia.api.model.PeticionOracion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

import net.tuiglesia.api.model.enums.EstadoPeticion;

@Repository
public interface PeticionOracionRepository extends JpaRepository<PeticionOracion, Long> {
    List<PeticionOracion> findByIglesiaId(Long iglesiaId);
    List<PeticionOracion> findByIglesiaIdAndEstado(Long iglesiaId, EstadoPeticion estado);
    List<PeticionOracion> findByIglesiaIdOrderByFechaDesc(Long iglesiaId);
}