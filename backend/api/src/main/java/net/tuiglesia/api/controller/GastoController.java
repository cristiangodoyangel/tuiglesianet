package net.tuiglesia.api.controller;

import net.tuiglesia.api.model.Gasto;
import net.tuiglesia.api.model.Iglesia;
import net.tuiglesia.api.repository.GastoRepository;
import net.tuiglesia.api.repository.IglesiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/gastos")
public class GastoController {

    @Autowired private GastoRepository gastoRepository;
    @Autowired private IglesiaRepository iglesiaRepository;

    @PostMapping
    public Gasto crear(@RequestBody Gasto gasto, @RequestParam Long iglesiaId) {
        Iglesia iglesia = iglesiaRepository.findById(iglesiaId).orElseThrow();
        gasto.setIglesia(iglesia);
        return gastoRepository.save(gasto);
    }

    @GetMapping
    public List<Gasto> listar(@RequestParam Long iglesiaId) {
        return gastoRepository.findByIglesiaId(iglesiaId);
    }
}