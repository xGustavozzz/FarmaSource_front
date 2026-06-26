<script setup lang="ts">
import { ref, computed } from 'vue';
import { store } from '../store';
import { Bell, LogOut, Search, ShieldCheck, RefreshCw } from 'lucide-vue-next';

const showNotifications = ref(false);

const tabLabels: Record<string, string> = {
  dashboard: 'Panel de Control / Dashboard',
  products: 'Catálogo de Inventario',
  clients: 'Directorio de Clientes',
  sales: 'Ventas / Guardar POS',
  purchases: 'Gestión de Compras',
  employees: 'Personal y Contactos',
  roles: 'Seguridad de Usuarios y Roles',
  audit: 'Trazabilidad y Bitácoras de Auditoría',
  reports: 'Reportes y Analíticas',
  settings: 'Configuración Global',
  support: 'Centro de Soporte',
  profile: 'Mi Perfil de Usuario'
};

const tabLabel = computed(() => tabLabels[store.activeTab] || 'FarmaSecure');

// Derive low stock items from products in store
const lowStockItems = computed(() => {
  return store.products.filter(p => p.stock <= 8);
});

const isReplenishing = ref(false);

async function handleReplenish() {
  isReplenishing.value = true;
  await store.replenishCriticalStock();
  isReplenishing.value = false;
  showNotifications.value = false;
}

const userDisplayName = computed(() => {
  return store.userProfile?.fullName || store.currentUser || 'Usuario';
});

const userInitials = computed(() => {
  const name = store.userProfile?.fullName || store.currentUser || 'US';
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
});
</script>

<template>
  <header class="fixed top-0 right-0 left-[260px] h-[72px] bg-white border-b border-surface-container flex items-center justify-between px-8 z-40 shadow-sm">
    <!-- Route & Back Indicator -->
    <div class="flex items-center gap-2">
      <div class="text-xs font-semibold text-outline tracking-wider uppercase font-mono">FarmaSecure</div>
      <div class="text-surface-dim font-light">/</div>
      <div class="text-base font-semibold text-primary">{{ tabLabel }}</div>
    </div>

    <!-- Global search and action bar -->
    <div class="flex items-center gap-6">
      <!-- Search -->
      <div class="relative w-64 max-w-sm hidden md:block">
        <input
          type="text"
          placeholder="Buscar medicamento o código..."
          class="w-full bg-surface-container-low text-sm rounded-lg pl-9 pr-4 py-2 border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary"
        />
        <Search :size="16" class="absolute left-3 top-2.5 text-outline" />
      </div>

      <!-- Notifications -->
      <div class="relative">
        <button
          @click="showNotifications = !showNotifications"
          class="w-10 h-10 border border-surface-container rounded-lg flex items-center justify-center text-primary-container hover:bg-surface-container-low relative transition-all"
        >
          <Bell :size="20" />
          <span v-if="lowStockItems.length > 0" class="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full animate-ping" />
          <span v-if="lowStockItems.length > 0" class="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full" />
        </button>

        <!-- Notifications Dropdown Panel -->
        <div
          v-if="showNotifications"
          class="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-surface-container-high py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <div class="px-4 py-2 border-b border-surface-container flex items-center justify-between">
            <span class="font-semibold text-xs text-primary font-mono uppercase tracking-wider">Notificaciones</span>
            <span class="bg-error-container text-on-error-container text-[11px] font-bold px-2 py-0.5 rounded-full">
              {{ lowStockItems.length }} Alertas
            </span>
          </div>
          <div class="max-h-60 overflow-y-auto custom-scrollbar">
            <div v-if="lowStockItems.length === 0" class="px-4 py-4 text-center text-outline text-xs">
              Sin alertas críticas de stock actuales
            </div>
            <div
              v-else
              v-for="prod in lowStockItems"
              :key="prod.id"
              class="px-4 py-3 border-b border-surface-container hover:bg-surface-container-low transition-colors"
            >
              <div class="flex justify-between items-start gap-1">
                <span class="text-xs font-semibold text-primary">{{ prod.name }}</span>
                <span class="text-[10px] font-mono font-bold bg-error-container text-on-error-container px-1.5 py-0.2 rounded-md">
                  Stock: {{ prod.stock }}
                </span>
              </div>
              <p class="text-[11px] text-outline mt-0.5">{{ prod.presentation }} - {{ prod.laboratory }}</p>
            </div>
          </div>
          <div v-if="lowStockItems.length > 0" class="p-2 border-t border-surface-container">
            <button
              @click="handleReplenish"
              :disabled="isReplenishing"
              class="w-full bg-secondary hover:bg-secondary-container hover:text-on-secondary-container transition-all text-white text-xs font-semibold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw :size="14" :class="{ 'animate-spin': isReplenishing }" />
              Reabastecer Stock Crítico
            </button>
          </div>
        </div>
      </div>

      <!-- User Badge Profile -->
      <div class="flex items-center gap-3 border-l border-surface-container pl-6">
        <div class="text-right">
          <div class="text-sm font-bold text-primary flex items-center gap-1 justify-end">
            <ShieldCheck :size="14" class="text-secondary" />
            <span>{{ userDisplayName }}</span>
          </div>
          <div class="text-[11px] font-mono text-outline font-semibold tracking-wide uppercase">
            {{ store.currentRole }}
          </div>
        </div>
        <div class="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container font-extrabold text-sm border border-surface-container">
          {{ userInitials }}
        </div>
        
        <!-- Logout button -->
        <button
          @click="store.logout()"
          class="w-10 h-10 rounded-lg text-outline hover:text-error hover:bg-error-container/20 flex items-center justify-center transition-all border border-transparent"
          title="Cerrar sesión"
        >
          <LogOut :size="20" />
        </button>
      </div>
    </div>
  </header>
</template>
