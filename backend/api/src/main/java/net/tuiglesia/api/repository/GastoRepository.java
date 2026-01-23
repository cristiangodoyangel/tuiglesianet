package net.tuiglesia.api.repository;

import net.tuiglesia.api.model.Gasto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface GastoRepository extends JpaRepository<Gasto, Long> {
    List<Gasto> findByIglesiaId(Long iglesiaId);
    @Query("SELECT SUM(o.monto) FROM Ofrenda o WHERE o.iglesia.id = :iglesiaId")
    BigDecimal sumarTotalPorIglesia(Long iglesiaId);
}