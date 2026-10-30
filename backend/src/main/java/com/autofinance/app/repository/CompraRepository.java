package com.autofinance.app.repository;

import com.autofinance.app.entity.Compra;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CompraRepository extends JpaRepository<Compra, Long> {
    List<Compra> findByPerfilId(Long perfilId);
}