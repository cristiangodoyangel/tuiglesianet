package net.tuiglesia.api.controller;

import net.tuiglesia.api.model.Iglesia;
import net.tuiglesia.api.model.PeticionOracion;
import net.tuiglesia.api.repository.IglesiaRepository;
import net.tuiglesia.api.repository.PeticionOracionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

import net.tuiglesia.api.model.enums.EstadoPeticion;
import java.util.Map;

@RestController
@RequestMapping("/api/peticiones")
public class PeticionOracionController {

    @Autowired private PeticionOracionRepository peticionRepository;
    @Autowired private IglesiaRepository iglesiaRepository;

    @PostMapping
    public PeticionOracion crear(@RequestBody PeticionOracion peticion, @RequestParam Long iglesiaId) {
        Iglesia iglesia = iglesiaRepository.findById(iglesiaId).orElseThrow();
        peticion.setIglesia(iglesia);
        if (peticion.getEstado() == null) {
            peticion.setEstado(EstadoPeticion.PENDIENTE);
        }
        return peticionRepository.save(peticion);
    }

    @GetMapping
    public List<PeticionOracion> listar(@RequestParam Long iglesiaId, @RequestParam(required = false) EstadoPeticion estado) {
        if (estado != null) {
            return peticionRepository.findByIglesiaIdAndEstado(iglesiaId, estado);
        }
        return peticionRepository.findByIglesiaIdOrderByFechaDesc(iglesiaId);
    }

    @PutMapping("/{id}/responder")
    public PeticionOracion marcarRespondida(@PathVariable Long id, @RequestBody Map<String, String> body) {
        PeticionOracion peticion = peticionRepository.findById(id).orElseThrow();
        peticion.setEstado(EstadoPeticion.RESPONDIDA);
        peticion.setRespuesta(body.get("respuesta"));
        peticion.setRespondida(true); // Legacy sync
        return peticionRepository.save(peticion);
    }
}