package net.tuiglesia.api.repository;

import net.tuiglesia.api.model.Miembro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MiembroRepository extends JpaRepository<Miembro, Long> {
    // Método mágico: Spring crea el SQL automáticamente al leer el nombre del método
    // "Búscame todos los miembros donde el ID de la iglesia sea X"
    List<Miembro> findByIglesiaId(Long iglesiaId);
}