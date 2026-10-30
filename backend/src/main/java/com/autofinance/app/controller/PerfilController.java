package com.autofinance.app.controller;

import com.autofinance.app.entity.Perfil;
import com.autofinance.app.service.PerfilService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/perfiles")
@CrossOrigin
public class PerfilController {
    private final PerfilService service;
    public PerfilController(PerfilService service) { this.service = service; }
    @GetMapping public List<Perfil> list() { return service.list(); }
    @GetMapping("/{id}") public Perfil get(@PathVariable Long id) { return service.get(id); }
    @PostMapping public Perfil create(@RequestBody Perfil p) { return service.create(p); }
    @PutMapping("/{id}") public Perfil update(@PathVariable Long id, @RequestBody Perfil p) { return service.update(id, p); }
    @DeleteMapping("/{id}") public void delete(@PathVariable Long id) { service.delete(id); }
}