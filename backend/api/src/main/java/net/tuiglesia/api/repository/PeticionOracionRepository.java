package net.tuiglesia.api.repository;

import net.tuiglesia.api.model.PeticionOracion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PeticionOracionRepository extends JpaRepository<PeticionOracion, Long> {
    List<PeticionOracion> findByIglesiaId(Long iglesiaId);
}