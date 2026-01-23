package net.tuiglesia.api.controller;

import net.tuiglesia.api.model.*;
import net.tuiglesia.api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/diezmos")
public class DiezmoController {

    @Autowired private DiezmoRepository diezmoRepository;
    @Autowired private MiembroRepository miembroRepository;
    @Autowired private IglesiaRepository iglesiaRepository;

    @PostMapping
    public Diezmo registrarDiezmo(@RequestBody Diezmo diezmo, @RequestParam Long miembroId, @RequestParam Long iglesiaId) {
        Miembro miembro = miembroRepository.findById(miembroId).orElseThrow();
        Iglesia iglesia = iglesiaRepository.findById(iglesiaId).orElseThrow();

        diezmo.setMiembro(miembro);
        diezmo.setIglesia(iglesia);

        if (diezmo.getFecha() == null) diezmo.setFecha(LocalDate.now()); // Si no manda fecha, usa hoy

        return diezmoRepository.save(diezmo);
    }

    @GetMapping("/total")
    public BigDecimal obtenerTotal(@RequestParam Long iglesiaId) {
        return diezmoRepository.sumarTotalPorIglesia(iglesiaId);
    }
}