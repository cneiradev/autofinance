package com.autofinance.app.controller;

import com.autofinance.app.entity.Perfil;
import com.autofinance.app.entity.Compra;
import com.autofinance.app.repository.CompraRepository;
import com.autofinance.app.service.PerfilService;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin
public class DashboardController {
    private final PerfilService perfilService;
    private final CompraRepository compraRepo;

    public DashboardController(PerfilService perfilService, CompraRepository compraRepo) {
        this.perfilService = perfilService;
        this.compraRepo = compraRepo;
    }
    @GetMapping
    public List<Map<String,Object>> summary() {
        List<Map<String,Object>> out = new ArrayList<>();
        for (Perfil p : perfilService.list()) {
            var compras = compraRepo.findByPerfilId(p.getId());
            BigDecimal pendiente = BigDecimal.ZERO;
            BigDecimal pagado = BigDecimal.ZERO;
            for (Compra c : compras) {
                if (Boolean.TRUE.equals(c.getOculto())) continue;
                int pagadas = c.getCuotasPagadas() == null ? 0 : c.getCuotasPagadas();
                int restantes = c.getCuotas() - pagadas;
                if (restantes > 0) pendiente = pendiente.add(c.getMontoCuota().multiply(BigDecimal.valueOf(restantes)));
                if (pagadas > 0) pagado = pagado.add(c.getMontoCuota().multiply(BigDecimal.valueOf(pagadas)));
            }
            Map<String,Object> m = new LinkedHashMap<>();
            m.put("perfil", p);
            m.put("totalCompras", compras.size());
            m.put("pendiente", pendiente);
            m.put("pagado", pagado);
            out.add(m);
        }
        return out;
    }
}