package net.tuiglesia.api.controller;

import net.tuiglesia.api.model.Iglesia;
import net.tuiglesia.api.model.Miembro;
import net.tuiglesia.api.repository.IglesiaRepository;
import net.tuiglesia.api.repository.MiembroRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/miembros")
public class MiembroController {

    @Autowired
    private MiembroRepository miembroRepository;

    @Autowired
    private IglesiaRepository iglesiaRepository;

    @PostMapping
    public Miembro crearMiembro(@RequestBody Miembro miembro, @RequestParam Long iglesiaId) {
        Iglesia iglesia = iglesiaRepository.findById(iglesiaId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Iglesia no encontrada"));

        miembro.setIglesia(iglesia);
        return miembroRepository.save(miembro);
    }

    @GetMapping
    public List<Miembro> listarPorIglesia(@RequestParam Long iglesiaId) {
        return miembroRepository.findByIglesiaId(iglesiaId);
    }
}