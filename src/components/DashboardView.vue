<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { store } from '../store';
import {
  Boxes,
  AlertTriangle,
  Coins,
  ShieldCheck,
  ArrowUpRight,
  TrendingUp,
  Activity,
  Eye,
  PlusCircle
} from 'lucide-vue-next';

onMounted(() => {
  store.fetchDashboardStats();
  store.fetchProducts();
});

// Calculate category distribution dynamically from products list
const categoryChartData = computed(() => {
  if (!store.products || store.products.length === 0) return [];
  const categories = Array.from(new Set(store.products.map(p => p.categoryName || 'General')));
  return categories.map(cat => {
    const list = store.products.filter(p => (p.categoryName || 'General') === cat);
    const count = list.length;
    const avgPrice = list.reduce((a, b) => a + b.price, 0) / (count || 1);
    return { name: cat, count, avgPrice };
  });
});

const maxCategoryCount = computed(() => {
  const counts = categoryChartData.value.map(c => c.count);
  return counts.length > 0 ? Math.max(...counts) : 1;
});
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-300">
    <!-- Overview Grid Card -->
    <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Card 1 -->
      <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
        <div class="space-y-2">
          <span class="text-xs font-semibold text-outline font-mono uppercase tracking-wider">Total Productos</span>
          <div class="text-3xl font-extrabold text-primary font-sans">{{ store.stats.totalProducts }}</div>
          <div class="flex items-center gap-1.5 text-xs text-secondary font-medium">
            <TrendingUp :size="14" />
            <span>Catalogados</span>
          </div>
        </div>
        <div class="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
          <Boxes :size="24" />
        </div>
      </div>

      <!-- Card 2 -->
      <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
        <div class="space-y-2">
          <span class="text-xs font-semibold text-outline font-mono uppercase tracking-wider">Alertas Críticas</span>
          <div class="text-3xl font-extrabold text-[#ba1a1a] font-sans">{{ store.stats.criticalStockAlerts }}</div>
          <div class="flex items-center gap-1.5 text-xs">
            <button
              v-if="store.stats.criticalStockAlerts > 0"
              @click="store.replenishCriticalStock()"
              class="text-xs text-primary font-semibold underline hover:text-secondary-container"
            >
              Reponer ahora
            </button>
            <span v-else class="text-secondary font-medium">Inventario balanceado</span>
          </div>
        </div>
        <div :class="[
          'w-12 h-12 rounded-xl flex items-center justify-center',
          store.stats.criticalStockAlerts > 0 ? 'bg-error/10 text-error' : 'bg-secondary/10 text-secondary'
        ]">
          <AlertTriangle :size="24" :class="{ 'animate-pulse': store.stats.criticalStockAlerts > 0 }" />
        </div>
      </div>

      <!-- Card 3 -->
      <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
        <div class="space-y-2">
          <span class="text-xs font-semibold text-outline font-mono uppercase tracking-wider">Ventas Recaudadas</span>
          <div class="text-3xl font-extrabold text-primary font-sans">
            ${{ Number(store.stats.totalSalesRevenue || 0).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
          </div>
          <div class="flex items-center gap-1.5 text-xs text-secondary font-medium">
            <ArrowUpRight :size="14" />
            <span>Sincronizando POS</span>
          </div>
        </div>
        <div class="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center text-secondary">
          <Coins :size="24" />
        </div>
      </div>

      <!-- Card 4 -->
      <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
        <div class="space-y-2">
          <span class="text-xs font-semibold text-outline font-mono uppercase tracking-wider">Clientes Activos</span>
          <div class="text-3xl font-extrabold text-primary font-sans">{{ store.stats.totalClients }}</div>
          <div class="flex items-center gap-1.5 text-xs text-outline font-medium">
            <ShieldCheck :size="14" class="text-secondary" />
            <span>Registrados en BD</span>
          </div>
        </div>
        <div class="w-12 h-12 bg-primary/5 rounded-xl flex items-center justify-center text-primary">
          <ShieldCheck :size="24" />
        </div>
      </div>
    </section>

    <!-- Main Grid: Visual Charts & Quick Access -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Graphical statistics -->
      <div class="lg:col-span-2 bg-white rounded-2xl border border-surface-container p-6 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="text-base font-bold text-primary">Distribución de Productos por Categoría</h3>
            <p class="text-xs text-outline font-light">Análisis de cantidad de SKUs y promedio de precios</p>
          </div>
          <Activity class="text-secondary" :size="20" />
        </div>

        <div class="space-y-5">
          <div v-if="categoryChartData.length === 0" class="text-center py-8 text-xs text-outline">
            No hay productos registrados en el catálogo.
          </div>
          <div v-else v-for="(cat, index) in categoryChartData" :key="cat.name" class="space-y-1.5">
            <div class="flex justify-between items-center text-xs">
              <span class="font-semibold text-primary">{{ cat.name }}</span>
              <div class="flex items-center gap-2">
                <span class="font-mono text-outline font-medium">
                  Prom: ${{ cat.avgPrice.toFixed(2) }}
                </span>
                <span class="font-sans font-bold text-primary uppercase text-[10px] bg-surface-container px-2 py-0.5 rounded-full">
                  {{ cat.count }} {{ cat.count === 1 ? 'medicamento' : 'medicamentos' }}
                </span>
              </div>
            </div>
            <!-- Custom animated bar -->
            <div class="h-3 bg-surface-container-low rounded-full overflow-hidden w-full relative">
              <div
                :class="[
                  'h-full rounded-full transition-all duration-1000',
                  index % 3 === 0 ? 'bg-primary' : index % 3 === 1 ? 'bg-secondary' : 'bg-on-primary-fixed-variant'
                ]"
                :style="{ width: `${(cat.count / maxCategoryCount) * 100}%` }"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Quick actions box -->
      <div class="bg-white rounded-2xl border border-surface-container p-6 shadow-sm flex flex-col justify-between">
        <div>
          <h3 class="text-base font-bold text-primary mb-1">Acciones Rápidas</h3>
          <p class="text-xs text-outline font-light mb-6">Accesos directos operacionales rápidos</p>
        </div>

        <div class="space-y-3 flex-1 flex flex-col justify-center">
          <button
            @click="store.setTab('sales')"
            class="w-full bg-primary hover:bg-primary-container text-white py-3 px-4 rounded-xl flex items-center justify-between font-medium text-xs transition-colors cursor-pointer"
          >
            <span class="flex items-center gap-2">
              <PlusCircle :size="16" /> Abrir Punto de Venta (POS)
            </span>
            <ArrowUpRight :size="14" />
          </button>

          <button
            @click="store.setTab('products')"
            class="w-full bg-white hover:bg-surface-container-low border border-surface-container text-primary py-3 px-4 rounded-xl flex items-center justify-between font-semibold text-xs transition-colors cursor-pointer"
          >
            <span>Registrar Medicamento / Inventario</span>
            <Boxes :size="16" class="text-outline" />
          </button>

          <button
            @click="store.setTab('audit')"
            class="w-full bg-white hover:bg-surface-container-low border border-surface-container text-primary py-3 px-4 rounded-xl flex items-center justify-between font-semibold text-xs transition-colors cursor-pointer"
          >
            <span>Ver Bitácora de Auditoría</span>
            <Eye :size="16" class="text-outline" />
          </button>
        </div>

        <div class="mt-6 pt-4 border-t border-surface-container text-center font-mono">
          <span class="text-[10px] font-semibold tracking-wider text-outline uppercase">
            ENTORNO SEGURO ONLINE
          </span>
        </div>
      </div>
    </div>

    <!-- Audit Log Overview Widget -->
    <section class="bg-white rounded-2xl border border-surface-container p-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div>
          <h3 class="text-base font-bold text-primary">Bitácora de Auditoría Reciente</h3>
          <p class="text-xs text-outline font-light">Trazabilidad inmutable de todas las acciones del sistema</p>
        </div>
        <button
          @click="store.setTab('audit')"
          class="text-xs text-secondary font-bold hover:underline cursor-pointer"
        >
          Ver Bitácora Completa
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-primary border-collapse">
          <thead>
            <tr class="border-b border-surface-container-high text-outline uppercase font-mono tracking-wider font-semibold">
              <th class="py-3 px-4">Log ID</th>
              <th class="py-3 px-4">Fecha y Hora</th>
              <th class="py-3 px-4">Usuario</th>
              <th class="py-3 px-4">Módulo</th>
              <th class="py-3 px-4">Acción</th>
              <th class="py-3 px-4">IP Origen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="store.stats.recentAudits.length === 0">
              <td colspan="6" class="text-center py-6 text-outline">No hay logs de auditoría registrados.</td>
            </tr>
            <tr
              v-else
              v-for="log in store.stats.recentAudits"
              :key="log.id"
              class="border-b border-surface-container hover:bg-surface-container-low/50 transition-colors"
            >
              <td class="py-3.5 px-4 font-mono font-bold text-outline">LOG-{{ log.id }}</td>
              <td class="py-3.5 px-4">{{ new Date(log.date).toLocaleString('es-ES') }}</td>
              <td class="py-3.5 px-4 font-semibold">{{ log.user }}</td>
              <td class="py-3.5 px-4 font-mono text-outline">{{ log.table }}</td>
              <td class="py-3.5 px-4">
                <span :class="[
                  'px-2 py-0.5 rounded-full font-bold text-[10px] uppercase font-mono',
                  log.action === 'CREACIÓN' ? 'bg-secondary/10 text-secondary' :
                  log.action === 'EDICIÓN' ? 'bg-on-primary-fixed-variant/10 text-on-primary-fixed-variant' :
                  log.action === 'ELIMINACIÓN' ? 'bg-error/10 text-error' : 'bg-surface-container text-primary'
                ]">
                  {{ log.action }}
                </span>
              </td>
              <td class="py-3.5 px-4 font-mono font-semibold text-outline">{{ log.ipAddress || '127.0.0.1' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>
