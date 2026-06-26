<script setup lang="ts">
import { computed } from 'vue';
import { store } from './store';
import Sidebar from './components/Sidebar.vue';
import Topbar from './components/Topbar.vue';
import DashboardView from './components/DashboardView.vue';
import ProductsView from './components/ProductsView.vue';
import ClientsView from './components/ClientsView.vue';
import SalesPOSView from './components/SalesPOSView.vue';
import PurchasesView from './components/PurchasesView.vue';
import EmployeesView from './components/EmployeesView.vue';
import UsersRolesView from './components/UsersRolesView.vue';
import AuditView from './components/AuditView.vue';
import ReportsView from './components/ReportsView.vue';
import SettingsView from './components/SettingsView.vue';
import SupportView from './components/SupportView.vue';
import LoginView from './components/LoginView.vue';

const currentView = computed(() => {
  switch (store.activeTab) {
    case 'dashboard':
      return DashboardView;
    case 'products':
      return ProductsView;
    case 'clients':
      return ClientsView;
    case 'sales':
      return SalesPOSView;
    case 'purchases':
      return PurchasesView;
    case 'employees':
      return EmployeesView;
    case 'roles':
      return UsersRolesView;
    case 'audit':
      return AuditView;
    case 'reports':
      return ReportsView;
    case 'settings':
      return SettingsView;
    case 'support':
      return SupportView;
    default:
      return DashboardView;
  }
});
</script>

<template>
  <div v-if="!store.isLoggedIn">
    <LoginView />
  </div>
  <div v-else class="min-h-screen bg-background text-primary antialiased flex">
    <!-- Drawer navigation -->
    <Sidebar />

    <!-- Main Container screen panel -->
    <div class="flex-1 flex flex-col pl-[260px]">
      <!-- Action bar and search top -->
      <Topbar />

      <!-- Dynamic subview display area -->
      <main class="flex-1 pt-[96px] pb-12 px-8 overflow-y-auto max-w-7xl mx-auto w-full">
        <component :is="currentView" />
      </main>
    </div>
  </div>
</template>
