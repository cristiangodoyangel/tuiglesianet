package net.tuiglesia.api.controller;

import net.tuiglesia.api.model.Iglesia;
import net.tuiglesia.api.model.PeticionOracion;
import net.tuiglesia.api.repository.IglesiaRepository;
import net.tuiglesia.api.repository.PeticionOracionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/peticiones")
public class PeticionOracionController {

    @Autowired private PeticionOracionRepository peticionRepository;
    @Autowired private IglesiaRepository iglesiaRepository;

    @PostMapping
    public PeticionOracion crear(@RequestBody PeticionOracion peticion, @RequestParam Long iglesiaId) {
        Iglesia iglesia = iglesiaRepository.findById(iglesiaId).orElseThrow();
        peticion.setIglesia(iglesia);
        return peticionRepository.save(peticion);
    }

    @GetMapping
    public List<PeticionOracion> listar(@RequestParam Long iglesiaId) {
        return peticionRepository.findByIglesiaId(iglesiaId);
    }

    @PutMapping("/{id}/responder")
    public PeticionOracion marcarRespondida(@PathVariable Long id) {
        PeticionOracion peticion = peticionRepository.findById(id).orElseThrow();
        peticion.setRespondida(true);
        return peticionRepository.save(peticion);
    }
}