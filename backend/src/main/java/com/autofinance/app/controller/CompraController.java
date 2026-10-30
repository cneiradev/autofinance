package com.autofinance.app.controller;

import com.autofinance.app.entity.Compra;
import com.autofinance.app.service.CompraService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class CompraController {
    private final CompraService service;
    public CompraController(CompraService service) { this.service = service; }
    @GetMapping("/perfiles/{perfilId}/compras")
    public List<Compra> list(@PathVariable Long perfilId) { return service.listByPerfil(perfilId); }
    @PostMapping("/perfiles/{perfilId}/compras")
    public Compra create(@PathVariable Long perfilId, @RequestBody Compra c) { return service.create(perfilId, c); }
    @PutMapping("/compras/{id}")
    public Compra update(@PathVariable Long id, @RequestBody Compra c) { return service.update(id, c); }
    @PatchMapping("/compras/{id}/pago")
    public Compra toggle(@PathVariable Long id) { return service.togglePago(id); }
    @DeleteMapping("/compras/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}