package net.tuiglesia.api.repository;

import net.tuiglesia.api.model.Diezmo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface DiezmoRepository extends JpaRepository<Diezmo, Long> {

    // Buscar diezmos de una iglesia específica
    List<Diezmo> findByIglesiaId(Long iglesiaId);

    // SQL Customizado: Sumar todo el dinero de una iglesia
    @Query("SELECT SUM(d.monto) FROM Diezmo d WHERE d.iglesia.id = :iglesiaId")
    BigDecimal sumarTotalPorIglesia(Long iglesiaId);
}