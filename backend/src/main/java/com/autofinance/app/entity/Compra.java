package com.autofinance.app.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "compras")
public class Compra {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "perfil_id", nullable = false)
    private Perfil perfil;
    @Column(nullable = false)
    private String descripcion;
    @Column(nullable = false)
    private LocalDate fechaCompra;
    @Column(nullable = false)
    private Integer cuotas;
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal montoTotal;
    @Column(precision = 12, scale = 2)
    private BigDecimal interes = BigDecimal.ZERO;
    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal montoCuota;
    @Column(nullable = false)
    private Boolean pagado = false;
    @Column
    private String casaComercial;
    public String getCasaComercial() { return casaComercial; }
    public void setCasaComercial(String casaComercial) { this.casaComercial = casaComercial; }
    @Column
    private Boolean oculto = false;
    public Boolean getOculto() { return oculto; }
    public void setOculto(Boolean oculto) { this.oculto = oculto; }
    @Column
    private Integer cuotasPagadas = 0;
    private LocalDate fechaPago;
    private String notas;
    @Column(nullable = false)
    private LocalDateTime creadoEn = LocalDateTime.now();

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    @JsonIgnore
    public Perfil getPerfil() { return perfil; }
    public void setPerfil(Perfil perfil) { this.perfil = perfil; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public LocalDate getFechaCompra() { return fechaCompra; }
    public void setFechaCompra(LocalDate fechaCompra) { this.fechaCompra = fechaCompra; }
    public Integer getCuotas() { return cuotas; }
    public void setCuotas(Integer cuotas) { this.cuotas = cuotas; }
    public BigDecimal getMontoTotal() { return montoTotal; }
    public void setMontoTotal(BigDecimal montoTotal) { this.montoTotal = montoTotal; }
    public BigDecimal getInteres() { return interes; }
    public void setInteres(BigDecimal interes) { this.interes = interes; }
    public BigDecimal getMontoCuota() { return montoCuota; }
    public void setMontoCuota(BigDecimal montoCuota) { this.montoCuota = montoCuota; }
    public Boolean getPagado() { return pagado; }
    public void setPagado(Boolean pagado) { this.pagado = pagado; }
    public Integer getCuotasPagadas() { return cuotasPagadas; }
    public void setCuotasPagadas(Integer cuotasPagadas) { this.cuotasPagadas = cuotasPagadas; }
    public LocalDate getFechaPago() { return fechaPago; }
    public void setFechaPago(LocalDate fechaPago) { this.fechaPago = fechaPago; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    public LocalDateTime getCreadoEn() { return creadoEn; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }
}