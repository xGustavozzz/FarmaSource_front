<script setup lang="ts">
import { store } from '../store';
import {
  LayoutDashboard,
  Boxes,
  Users,
  Receipt,
  ShoppingCart,
  Contact,
  ShieldAlert,
  History,
  BarChart3,
  Settings,
  HelpCircle,
  Activity
} from 'lucide-vue-next';

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'products', label: 'Productos', icon: Boxes },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'sales', label: 'Punto de Venta / Ventas', icon: Receipt },
  { id: 'purchases', label: 'Compras', icon: ShoppingCart },
  { id: 'employees', label: 'Empleados', icon: Contact },
  { id: 'roles', label: 'Usuarios / Roles', icon: ShieldAlert },
  { id: 'audit', label: 'Auditoría', icon: History },
  { id: 'reports', label: 'Reportes', icon: BarChart3 },
];
</script>

<template>
  <aside class="fixed left-0 top-0 h-full w-[260px] bg-primary flex flex-col z-50 text-white shadow-xl">
    <!-- Brand Header -->
    <div class="px-6 py-8 flex items-center gap-3 border-b border-primary-container">
      <div class="w-10 h-10 bg-on-primary-fixed-variant rounded-lg flex items-center justify-center text-primary-fixed">
        <Activity :size="24" />
      </div>
      <div>
        <h1 class="text-xl font-bold font-sans tracking-tight">FarmaSecure</h1>
        <p class="text-[10px] text-on-primary-container font-mono uppercase tracking-widest font-bold">
          Pharmacy Management
        </p>
      </div>
    </div>

    <!-- Navigation List -->
    <nav class="flex-1 overflow-y-auto py-4 px-2 space-y-1 custom-scrollbar">
      <button
        v-for="item in navigationItems"
        :key="item.id"
        @click="store.setTab(item.id)"
        :class="[
          'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-sm font-medium transition-all',
          store.activeTab === item.id
            ? 'bg-on-primary-fixed-variant text-primary-fixed font-semibold'
            : 'text-on-primary-container/85 hover:text-white hover:bg-white/10'
        ]"
      >
        <component
          :is="item.icon"
          :size="20"
          :class="store.activeTab === item.id ? 'text-primary-fixed' : 'text-on-primary-container'"
        />
        <span>{{ item.label}}</span>
      </button>
    </nav>

    <!-- Sidebar Footer -->
    <div class="p-4 border-t border-primary-container space-y-1">
      <button
        @click="store.setTab('settings')"
        :class="[
          'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-xs font-medium transition-all',
          store.activeTab === 'settings'
            ? 'bg-on-primary-fixed-variant text-primary-fixed'
            : 'text-on-primary-container/80 hover:text-white hover:bg-white/5'
        ]"
      >
        <Settings :size="16" />
        <span>Configuración</span>
      </button>
      <button
        @click="store.setTab('support')"
        :class="[
          'w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-left text-xs font-medium transition-all',
          store.activeTab === 'support'
            ? 'bg-on-primary-fixed-variant text-primary-fixed'
            : 'text-on-primary-container/80 hover:text-white hover:bg-white/5'
        ]"
      >
        <HelpCircle :size="16" />
        <span>Soporte</span>
      </button>
    </div>
  </aside>
</template>
