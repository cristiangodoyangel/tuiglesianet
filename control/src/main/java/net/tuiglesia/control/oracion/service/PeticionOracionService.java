package net.tuiglesia.control.oracion.service;

import lombok.RequiredArgsConstructor;
import net.tuiglesia.control.oracion.model.PeticionOracion;
import net.tuiglesia.control.oracion.repository.PeticionOracionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PeticionOracionService {

    private final PeticionOracionRepository repository;

    public List<PeticionOracion> obtenerTodas() {
        return repository.findAll();
    }

    public Optional<PeticionOracion> obtenerPorId(Long id) {
        return repository.findById(id);
    }

    public PeticionOracion guardar(PeticionOracion peticion) {
        return repository.save(peticion);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }
}
