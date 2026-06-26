<script setup lang="ts">
import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-vue-next';
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-300">
    <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm">
      <h3 class="text-base font-bold text-primary flex items-center gap-2">
        <BarChart3 :size="20" class="text-secondary animate-bounce-slow" />
        Reportes Financieros y de Ventas
      </h3>
      <p class="text-xs text-outline font-light mt-0.5">
        Resumen analítico e indicadores clave de rendimiento (KPIs) del negocio farmacéutico.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-outline uppercase font-mono tracking-wider">Margen de Ganancias</span>
          <TrendingUp :size="16" class="text-secondary" />
        </div>
        <div class="text-2xl font-extrabold text-primary">34.2%</div>
        <p class="text-[10px] text-outline">Promedio global sobre precio de compra de medicamentos</p>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-outline uppercase font-mono tracking-wider">Ticket Promedio Venta</span>
          <DollarSign :size="16" class="text-secondary" />
        </div>
        <div class="text-2xl font-extrabold text-primary">$18.90</div>
        <p class="text-[10px] text-outline">Gasto promedio por transacción del cliente en POS</p>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm space-y-4">
        <div class="flex items-center justify-between">
          <span class="text-xs font-semibold text-outline uppercase font-mono tracking-wider">Tasa de Conversión</span>
          <Users :size="16" class="text-secondary" />
        </div>
        <div class="text-2xl font-extrabold text-primary">94.8%</div>
        <p class="text-[10px] text-outline">Clientes registrados que concretan una compra</p>
      </div>
    </div>
  </div>
</template>
