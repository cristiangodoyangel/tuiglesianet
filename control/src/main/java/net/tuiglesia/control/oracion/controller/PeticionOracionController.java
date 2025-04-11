package net.tuiglesia.control.oracion.controller;

import lombok.RequiredArgsConstructor;
import net.tuiglesia.control.oracion.model.PeticionOracion;
import net.tuiglesia.control.oracion.service.PeticionOracionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/oracion")
@RequiredArgsConstructor
public class PeticionOracionController {

    private final PeticionOracionService service;

    @GetMapping
    public ResponseEntity<List<PeticionOracion>> listar() {
        return ResponseEntity.ok(service.obtenerTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PeticionOracion> obtener(@PathVariable Long id) {
        return service.obtenerPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<PeticionOracion> crear(@RequestBody PeticionOracion peticion) {
        PeticionOracion nueva = service.guardar(peticion);
        return ResponseEntity.created(URI.create("/api/oracion/" + nueva.getId())).body(nueva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PeticionOracion> actualizar(@PathVariable Long id, @RequestBody PeticionOracion peticion) {
        return service.obtenerPorId(id)
                .map(p -> {
                    peticion.setId(id);
                    return ResponseEntity.ok(service.guardar(peticion));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        if (service.obtenerPorId(id).isPresent()) {
            service.eliminar(id);
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
}
