package net.tuiglesia.api.controller;

import net.tuiglesia.api.service.IAService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/asistente")
public class IAController {

    @Autowired
    private IAService iaService;

    @PostMapping("/consejo")
    public Map<String, String> obtenerConsejo(@RequestBody Map<String, String> request) {
        String peticion = request.get("peticion");
        String respuesta = iaService.generarConsejo(peticion);
        return Map.of("respuesta", respuesta);
    }

    @PostMapping("/imagen-prompt")
    public Map<String, String> obtenerPromptImagen(@RequestBody Map<String, String> request) {
        String escena = request.get("escena");
        String promptGenerado = iaService.generarPromptImagen(escena);
        return Map.of("prompt", promptGenerado);
    }
}