package com.autofinance.app.service;

import com.autofinance.app.entity.Perfil;
import com.autofinance.app.repository.PerfilRepository;
import com.autofinance.app.repository.CompraRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PerfilService {
    private final PerfilRepository repo;
    private final CompraRepository compras;
    public PerfilService(PerfilRepository repo, CompraRepository compras) { this.repo = repo; this.compras = compras; }
    public List<Perfil> list() { return repo.findAll(); }
    public Perfil get(Long id) { return repo.findById(id).orElseThrow(); }
    public Perfil create(Perfil p) { p.setId(null); return repo.save(p); }
    public Perfil update(Long id, Perfil p) {
        Perfil e = get(id);
        e.setNombre(p.getNombre());
        e.setAlias(p.getAlias());
        e.setColor(p.getColor());
        return repo.save(e);
    }
    public void delete(Long id) {
        compras.deleteAll(compras.findByPerfilId(id));
        repo.deleteById(id);
    }
}
