package net.tuiglesia.api.controller;

import net.tuiglesia.api.model.Actividad;
import net.tuiglesia.api.model.Iglesia;
import net.tuiglesia.api.repository.ActividadRepository;
import net.tuiglesia.api.repository.IglesiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/actividades")
public class ActividadController {

    @Autowired private ActividadRepository actividadRepository;
    @Autowired private IglesiaRepository iglesiaRepository;

    @PostMapping
    public Actividad crear(@RequestBody Actividad actividad, @RequestParam Long iglesiaId) {
        Iglesia iglesia = iglesiaRepository.findById(iglesiaId).orElseThrow();
        actividad.setIglesia(iglesia);
        return actividadRepository.save(actividad);
    }

    @GetMapping
    public List<Actividad> listar(@RequestParam Long iglesiaId) {
        return actividadRepository.findByIglesiaId(iglesiaId);
    }

    @PutMapping("/{id}")
    public Actividad actualizar(@PathVariable Long id, @RequestBody Actividad actividadDetalles) {
        Actividad actividad = actividadRepository.findById(id).orElseThrow();
        actividad.setNombre(actividadDetalles.getNombre());
        actividad.setDescripcion(actividadDetalles.getDescripcion());
        actividad.setFechaInicio(actividadDetalles.getFechaInicio());
        actividad.setFechaTermino(actividadDetalles.getFechaTermino());
        actividad.setResponsable(actividadDetalles.getResponsable());
        actividad.setEstado(actividadDetalles.getEstado());
        return actividadRepository.save(actividad);
    }
}