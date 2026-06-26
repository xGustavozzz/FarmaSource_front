<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { store } from '../store';
import type { AuditLog } from '../types';
import { History, Search, Eye, X, ShieldAlert } from 'lucide-vue-next';

const searchQuery = ref('');
const selectedTable = ref('Todos');
const selectedAction = ref('Todos');
const inspectedLog = ref<AuditLog | null>(null);

const tables = ['Todos', 'PRODUCTOS', 'VENTAS', 'CLIENTES', 'EMPLEADOS', 'USUARIOS_APP'];
const actions = ['Todos', 'CREACIÓN', 'EDICIÓN', 'ELIMINACIÓN', 'LOGIN', 'INACTIVACIÓN'];

onMounted(() => {
  store.fetchAuditLogs();
});

// Filter logs
const filteredLogs = computed(() => {
  return store.auditLogs.filter(log => {
    const matchesSearch =
      log.username.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      String(log.id).includes(searchQuery.value) ||
      (log.registerId || '').includes(searchQuery.value);

    const matchesTable = selectedTable.value === 'Todos' || log.table === selectedTable.value;
    const matchesAction = selectedAction.value === 'Todos' || log.action === selectedAction.value;

    return matchesSearch && matchesTable && matchesAction;
  });
});

const parsedPrev = computed(() => {
  if (!inspectedLog.value?.previousData) return null;
  try {
    return JSON.parse(inspectedLog.value.previousData);
  } catch {
    return inspectedLog.value.previousData;
  }
});

const parsedDsp = computed(() => {
  if (!inspectedLog.value?.posteriorData) return null;
  try {
    return JSON.parse(inspectedLog.value.posteriorData);
  } catch {
    return inspectedLog.value.posteriorData;
  }
});
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-300">
    <!-- Search Header panel -->
    <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm space-y-4">
      <div>
        <h3 class="text-base font-bold text-primary flex items-center gap-2">
          <History :size="20" class="text-secondary animate-spin-slow" />
          Bitácora de Auditoría de Sistemas
        </h3>
        <p class="text-xs text-outline font-light mt-0.5">
          Registro cronológico inmutable de eventos sensibles, mutaciones de inventario y accesos autorizados en Oracle DB.
        </p>
      </div>

      <!-- Inputs -->
      <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 text-xs">
        <!-- Search Box -->
        <div class="relative col-span-1 sm:col-span-2">
          <input
            type="text"
            placeholder="Buscar por Log ID, usuario o registro ID..."
            v-model="searchQuery"
            class="w-full bg-surface-container-low text-sm rounded-xl pl-10 pr-4 py-2.5 border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary"
          />
          <Search :size="18" class="absolute left-3.5 top-3 text-outline" />
        </div>

        <!-- Module Selector -->
        <select
          v-model="selectedTable"
          class="bg-surface-container-low text-xs rounded-xl px-4 py-2.5 border-none text-primary focus:outline-none font-medium"
        >
          <option v-for="t in tables" :key="t" :value="t">
            {{ t === 'Todos' ? 'Módulos: Todos' : `Módulo: ${t}` }}
          </option>
        </select>

        <!-- Action Selector -->
        <select
          v-model="selectedAction"
          class="bg-surface-container-low text-xs rounded-xl px-3 py-2.5 border-none text-primary focus:outline-none font-medium"
        >
          <option v-for="act in actions" :key="act" :value="act">
            {{ act === 'Todos' ? 'Acciones: Todas' : `Acción: ${act}` }}
          </option>
        </select>
      </div>
    </div>

    <!-- Main Grid Layout: Logs list vs Diff View Inspector -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Table of logs (7 cols or full) -->
      <section :class="[
        'bg-white rounded-2xl border border-surface-container p-6 shadow-sm overflow-hidden',
        inspectedLog ? 'lg:col-span-7' : 'lg:col-span-12'
      ]">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-primary border-collapse">
            <thead>
              <tr class="border-b border-surface-container-high text-outline uppercase font-mono tracking-wider font-semibold bg-surface-container-low/40">
                <th class="py-3 px-4">Log ID</th>
                <th class="py-3 px-4">Fecha y Hora</th>
                <th class="py-3 px-4">Usuario</th>
                <th class="py-3 px-4">Módulo</th>
                <th class="py-3 px-4">Acción</th>
                <th class="py-3 px-4">Reg. ID</th>
                <th class="py-3 px-4 text-center">Detalle</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredLogs.length === 0">
                <td colspan="7" class="text-center py-8 text-outline">No hay logs coincidentes.</td>
              </tr>
              <tr
                v-else
                v-for="log in filteredLogs"
                :key="log.id"
                :class="[
                  'border-b border-surface-container hover:bg-surface-container-low/30 scroll-py-2 transition-colors',
                  inspectedLog?.id === log.id ? 'bg-secondary/5 font-semibold' : ''
                ]"
              >
                <td class="py-3.5 px-4 font-mono font-bold text-outline">LOG-{{ log.id }}</td>
                <td class="py-3.5 px-4 font-medium text-[11px]">
                  {{ new Date(log.timestamp).toLocaleString('es-ES') }}
                </td>
                <td class="py-3.5 px-4 font-bold text-primary">@{{ log.username }}</td>
                <td class="py-3.5 px-4 font-mono text-outline">{{ log.table }}</td>
                <td class="py-3.5 px-4">
                  <span :class="[
                    'px-2 py-0.5 rounded-full font-bold text-[9px] uppercase font-mono',
                    log.action === 'CREACIÓN' ? 'bg-secondary/15 text-secondary' :
                    log.action === 'EDICIÓN' ? 'bg-primary/10 text-primary' :
                    log.action === 'ELIMINACIÓN' ? 'bg-error/15 text-error' :
                    log.action === 'LOGIN' ? 'bg-blue-100 text-blue-800' : 'bg-surface-container text-outline'
                  ]">
                    {{ log.action }}
                  </span>
                </td>
                <td class="py-3.5 px-4 font-mono text-outline font-semibold">{{ log.registerId || '-' }}</td>
                <td class="py-3.5 px-4 text-center">
                  <button
                    @click="inspectedLog = inspectedLog?.id === log.id ? null : log"
                    :class="[
                      'p-1.5 rounded-md transition-all cursor-pointer',
                      inspectedLog?.id === log.id ? 'bg-secondary text-white' : 'text-outline hover:text-primary hover:bg-surface-container'
                    ]"
                    title="Inspeccionar comparación"
                  >
                    <Eye :size="14" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- Side panel with Side-by-side comparison Diff (5 cols) -->
      <section
        v-if="inspectedLog"
        class="lg:col-span-5 bg-white rounded-2xl border-2 border-secondary p-6 shadow-xl space-y-6 flex flex-col justify-between animate-in slide-in-from-right duration-200"
      >
        <!-- Header info -->
        <div class="space-y-4">
          <div class="flex justify-between items-start border-b border-surface-container pb-3">
            <div>
              <span class="text-[10px] font-mono font-bold text-outline uppercase tracking-wider">
                Inspector de Cambios
              </span>
              <p class="font-extrabold text-sm text-primary">Detalle de LOG-{{ inspectedLog.id }}</p>
            </div>
            <button
              @click="inspectedLog = null"
              class="w-7 h-7 bg-surface-container hover:bg-surface-container-high rounded-full flex items-center justify-center text-outline transition-colors cursor-pointer"
            >
              <X :size="15" />
            </button>
          </div>

          <!-- Informative log criteria -->
          <div class="grid grid-cols-2 gap-3 text-xs font-mono font-medium text-primary">
            <div class="p-2 bg-surface-container-low rounded-lg">
              <span class="text-[9px] text-outline uppercase block mb-0.5">Autor</span>
              <span class="font-bold">@{{ inspectedLog.username }}</span>
            </div>
            <div class="p-2 bg-surface-container-low rounded-lg">
              <span class="text-[9px] text-outline uppercase block mb-0.5">IP Origen</span>
              <span>{{ inspectedLog.ipAddress }}</span>
            </div>
            <div class="p-2 bg-surface-container-low rounded-lg">
              <span class="text-[9px] text-outline uppercase block mb-0.5">Módulo</span>
              <span>{{ inspectedLog.table }}</span>
            </div>
            <div class="p-2 bg-surface-container-low rounded-lg">
              <span class="text-[9px] text-outline uppercase block mb-0.5">Acción</span>
              <span class="font-sans font-bold text-secondary uppercase text-[10px]">
                {{ inspectedLog.action }}
              </span>
            </div>
          </div>

          <!-- Diff comparison side-by-side -->
          <div v-if="parsedPrev || parsedDsp" class="space-y-4 pt-2">
            <!-- Summary banner -->
            <div class="p-3 bg-secondary-container/15 rounded-xl border border-secondary/20 flex gap-2 text-xs text-secondary font-semibold items-start leading-relaxed">
              <ShieldAlert :size="16" class="shrink-0 mt-0.5" />
              <div>
                <span>Resumen de Cambio Realizado:</span>
                <p class="text-[11px] text-primary font-normal mt-1 leading-relaxed">
                  El usuario mutó el estado en la tabla {{ inspectedLog.table }} para el registro ID {{ inspectedLog.registerId }}.
                </p>
              </div>
            </div>

            <!-- Comparison side-by-side panels -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <!-- Previous value card -->
              <div class="p-3 bg-red-50 border border-red-100 rounded-xl space-y-1 overflow-x-auto">
                <span class="text-[9px] font-bold text-red-600 uppercase block font-mono border-b border-red-100 pb-1 mb-1">
                  Valor Previo (Anterior)
                </span>
                <div v-if="parsedPrev">
                  <pre class="font-mono text-[9px] text-red-800">{{ JSON.stringify(parsedPrev, null, 2) }}</pre>
                </div>
                <div v-else class="text-outline text-[11px]">N/A (Creación o inserción inicial)</div>
              </div>

              <!-- Posterior value card -->
              <div class="p-3 bg-secondary/5 border border-secondary/10 rounded-xl space-y-1 overflow-x-auto">
                <span class="text-[9px] font-bold text-secondary uppercase block font-mono border-b border-secondary/10 pb-1 mb-1">
                  Valor Posterior (Nuevo)
                </span>
                <div v-if="parsedDsp">
                  <pre class="font-mono text-[9px] text-secondary">{{ JSON.stringify(parsedDsp, null, 2) }}</pre>
                </div>
                <div v-else class="text-outline text-[11px]">N/A (Eliminación)</div>
              </div>
            </div>
          </div>
          <div v-else class="py-8 bg-surface-container-low border border-dashed border-surface-container rounded-xl text-center text-xs text-outline font-medium px-4">
            Esta acción ({{ inspectedLog.action }}) registró un evento simple sin mutaciones detalladas de columnas en formato JSON.
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
