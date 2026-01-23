package net.tuiglesia.api.controller;

import net.tuiglesia.api.model.Iglesia;
import net.tuiglesia.api.repository.IglesiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Indica que esta clase responde a peticiones HTTP (JSON)
@RequestMapping("/api/iglesias") // La URL base será http://localhost:8080/api/iglesias
public class IglesiaController {

    @Autowired // Inyección de Dependencias: Spring te trae el repositorio listo para usar
    private IglesiaRepository iglesiaRepository;

    // GET: Obtener todas las iglesias
    @GetMapping
    public List<Iglesia> listarIglesias() {
        return iglesiaRepository.findAll();
    }

    // POST: Crear una nueva iglesia
    @PostMapping
    public Iglesia crearIglesia(@RequestBody Iglesia iglesia) {
        return iglesiaRepository.save(iglesia);
    }
}