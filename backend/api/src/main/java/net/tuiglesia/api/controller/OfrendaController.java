package net.tuiglesia.api.controller;

import net.tuiglesia.api.model.Iglesia;
import net.tuiglesia.api.model.Ofrenda;
import net.tuiglesia.api.repository.IglesiaRepository;
import net.tuiglesia.api.repository.OfrendaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ofrendas")
public class OfrendaController {

    @Autowired private OfrendaRepository ofrendaRepository;
    @Autowired private IglesiaRepository iglesiaRepository;

    @PostMapping
    public Ofrenda crear(@RequestBody Ofrenda ofrenda, @RequestParam Long iglesiaId) {
        Iglesia iglesia = iglesiaRepository.findById(iglesiaId).orElseThrow();
        ofrenda.setIglesia(iglesia);
        return ofrendaRepository.save(ofrenda);
    }

    @GetMapping
    public List<Ofrenda> listar(@RequestParam Long iglesiaId) {
        return ofrendaRepository.findByIglesiaId(iglesiaId);
    }
}