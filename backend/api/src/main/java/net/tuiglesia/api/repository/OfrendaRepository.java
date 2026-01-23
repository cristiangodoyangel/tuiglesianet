package net.tuiglesia.api.repository;

import net.tuiglesia.api.model.Ofrenda;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OfrendaRepository extends JpaRepository<Ofrenda, Long> {
    List<Ofrenda> findByIglesiaId(Long iglesiaId);
}