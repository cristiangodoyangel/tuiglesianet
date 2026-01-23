package net.tuiglesia.api.controller;

import net.tuiglesia.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired private DiezmoRepository diezmoRepository;
    @Autowired private OfrendaRepository ofrendaRepository;
    @Autowired private GastoRepository gastoRepository;

    @GetMapping("/resumen-financiero")
    public Map<String, Object> obtenerResumen(@RequestParam Long iglesiaId) {
        BigDecimal totalDiezmos = diezmoRepository.sumarTotalPorIglesia(iglesiaId);
        BigDecimal totalOfrendas = ofrendaRepository.sumarTotalPorIglesia(iglesiaId);
        BigDecimal totalGastos = gastoRepository.sumarTotalPorIglesia(iglesiaId);

        // Evitar NullPointer si no hay registros aún
        if (totalDiezmos == null) totalDiezmos = BigDecimal.ZERO;
        if (totalOfrendas == null) totalOfrendas = BigDecimal.ZERO;
        if (totalGastos == null) totalGastos = BigDecimal.ZERO;

        BigDecimal totalIngresos = totalDiezmos.add(totalOfrendas);
        BigDecimal saldoActual = totalIngresos.subtract(totalGastos);

        Map<String, Object> resumen = new HashMap<>();
        resumen.put("totalDiezmos", totalDiezmos);
        resumen.put("totalOfrendas", totalOfrendas);
        resumen.put("totalIngresos", totalIngresos);
        resumen.put("totalGastos", totalGastos);
        resumen.put("saldoDisponible", saldoActual);

        return resumen;
    }
}