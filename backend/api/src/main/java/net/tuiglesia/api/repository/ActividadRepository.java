package net.tuiglesia.api.repository;

import net.tuiglesia.api.model.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Long> {
    List<Actividad> findByIglesiaId(Long iglesiaId);
}