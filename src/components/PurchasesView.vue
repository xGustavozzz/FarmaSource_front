<script setup lang="ts">
import { ref } from 'vue';
import { ShoppingCart, Plus } from 'lucide-vue-next';

const purchases = ref([
  { id: 'PUR-8291', provider: 'Droguería Central S.A.', date: '25/06/2026', total: 1250.40, status: 'Recibida', items: 'Amoxicilina 500mg (x100), Paracetamol (x200)' },
  { id: 'PUR-8290', provider: 'Distribuidora BioHealth', date: '24/06/2026', total: 420.00, status: 'Recibida', items: 'Ibuprofeno 400mg (x50), Loratadina 10mg (x100)' },
  { id: 'PUR-8289', provider: 'Laboratorios Genfar S.A.', date: '20/06/2026', total: 850.50, status: 'Pendiente', items: 'Paracetamol Jarabe (x150)' }
]);
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-300">
    <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm flex items-center justify-between">
      <div>
        <h3 class="text-base font-bold text-primary flex items-center gap-2">
          <ShoppingCart :size="20" class="text-secondary" />
          Gestión de Compras y Reabastecimiento
        </h3>
        <p class="text-xs text-outline font-light mt-0.5">
          Registro de órdenes de compra, ingreso de lotes de medicamentos y control de cuentas por pagar a distribuidores.
        </p>
      </div>
      <button class="bg-primary hover:bg-primary-container text-white transition-all font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer">
        <Plus :size="16" />
        Nueva Orden de Compra
      </button>
    </div>

    <!-- Purchases Table -->
    <div class="bg-white rounded-2xl border border-surface-container shadow-sm overflow-hidden text-xs">
      <table class="w-full text-left text-primary border-collapse">
        <thead>
          <tr class="border-b border-surface-container-high text-outline uppercase font-mono tracking-wider font-semibold bg-surface-container-low/50">
            <th class="py-3 px-6">Orden ID</th>
            <th class="py-3 px-4">Proveedor</th>
            <th class="py-3 px-4">Fecha Emisión</th>
            <th class="py-3 px-4">Detalle de Ítems</th>
            <th class="py-3 px-4 text-right">Monto Total</th>
            <th class="py-3 px-6 text-center">Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in purchases" :key="p.id" class="border-b border-surface-container hover:bg-surface-container-low/40 transition-colors">
            <td class="py-4 px-6 font-mono font-bold text-outline">#{{ p.id }}</td>
            <td class="py-4 px-4 font-bold text-primary">{{ p.provider }}</td>
            <td class="py-4 px-4">{{ p.date }}</td>
            <td class="py-4 px-4 text-outline font-light truncate max-w-xs">{{ p.items }}</td>
            <td class="py-4 px-4 text-right font-mono font-bold">${{ p.total.toFixed(2) }}</td>
            <td class="py-4 px-6 text-center">
              <span :class="[
                'text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase font-mono',
                p.status === 'Recibida' ? 'bg-secondary/15 text-secondary' : 'bg-tertiary-fixed text-on-tertiary-fixed-variant'
              ]">
                {{ p.status }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
