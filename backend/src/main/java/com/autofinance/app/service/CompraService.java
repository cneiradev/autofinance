package com.autofinance.app.service;

import com.autofinance.app.entity.Compra;
import com.autofinance.app.entity.Perfil;
import com.autofinance.app.repository.CompraRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CompraService {
    private final CompraRepository repo;
    private final PerfilService perfilService;
    public CompraService(CompraRepository repo, PerfilService perfilService) {
        this.repo = repo; this.perfilService = perfilService;
    }
    public List<Compra> listByPerfil(Long perfilId) {
        return repo.findByPerfilId(perfilId);
    }
    public Compra get(Long id) { return repo.findById(id).orElseThrow(); }
    public Compra create(Long perfilId, Compra c) {
        Perfil p = perfilService.get(perfilId);
        c.setId(null);
        c.setPerfil(p);
        return repo.save(c);
    }
    public Compra update(Long id, Compra c) {
        Compra e = get(id);
        e.setDescripcion(c.getDescripcion());
        e.setCasaComercial(c.getCasaComercial());
        e.setFechaCompra(c.getFechaCompra());
        e.setCuotas(c.getCuotas());
        e.setMontoTotal(c.getMontoTotal());
        e.setInteres(c.getInteres());
        e.setMontoCuota(c.getMontoCuota());
        e.setCuotasPagadas(c.getCuotasPagadas());
        e.setOculto(c.getOculto());
        e.setPagado(e.getCuotasPagadas() >= e.getCuotas());
        e.setFechaPago(c.getFechaPago());
        e.setNotas(c.getNotas());
        return repo.save(e);
    }
    public Compra togglePago(Long id) {
        Compra e = get(id);
        int pagadas = e.getCuotasPagadas() == null ? 0 : e.getCuotasPagadas();
        pagadas = Math.min(pagadas + 1, e.getCuotas());
        e.setCuotasPagadas(pagadas);
        e.setPagado(pagadas >= e.getCuotas());
        e.setFechaPago(e.getPagado() ? java.time.LocalDate.now() : null);
        return repo.save(e);
    }
    public void delete(Long id) { repo.deleteById(id); }
}