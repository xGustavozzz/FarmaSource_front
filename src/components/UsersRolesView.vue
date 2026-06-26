<script setup lang="ts">
import { store } from '../store';
import { Shield, ShieldAlert, Key } from 'lucide-vue-next';

// In this view we show configured application users and permission levels
const roles = [
  { name: 'Administrador', desc: 'Acceso total sin restricciones a inventarios, nómina, ventas y bitácoras.', level: 'Nivel 1 (Crítico)' },
  { name: 'Regente Farmacéutico', desc: 'Validación técnica de recetas retenidas, auditoría sanitaria y control de stock.', level: 'Nivel 2 (Técnico)' },
  { name: 'Vendedor', desc: 'Venta directa en Punto de Venta, búsqueda de medicamentos y control básico de percha.', level: 'Nivel 3 (Operacional)' },
  { name: 'Cajero', desc: 'Facturación directa, arqueo de caja y recepción de cobros en POS.', level: 'Nivel 3 (Financiero)' },
  { name: 'Auditor', desc: 'Solo lectura de bitácoras inmutables y descarga de reportes fiscales.', level: 'Nivel 4 (Auditoría)' }
];
</script>

<template>
  <div class="space-y-8 animate-in fade-in duration-300">
    <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm">
      <h3 class="text-base font-bold text-primary flex items-center gap-2">
        <ShieldAlert :size="20" class="text-secondary" />
        Seguridad de Usuarios y Roles
      </h3>
      <p class="text-xs text-outline font-light mt-0.5">
        Definición de políticas de firmas digitales, niveles de acceso a percha y control de sesiones activas.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Roles List -->
      <div class="lg:col-span-7 space-y-6">
        <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm space-y-4">
          <h4 class="text-sm font-bold text-primary font-mono uppercase tracking-wider">Perfiles de Acceso (Matriz de Control)</h4>
          <div class="space-y-4">
            <div
              v-for="role in roles"
              :key="role.name"
              class="p-4 bg-surface-container-low rounded-xl border border-surface-container flex justify-between items-start gap-4 text-xs"
            >
              <div class="space-y-1">
                <div class="flex items-center gap-2">
                  <Shield :size="16" class="text-secondary" />
                  <span class="font-bold text-primary">{{ role.name }}</span>
                </div>
                <p class="text-outline font-light leading-relaxed">{{ role.desc }}</p>
              </div>
              <span class="bg-primary/5 text-primary text-[10px] font-mono font-bold px-2 py-0.5 rounded-full shrink-0">
                {{ role.level }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings & Policy -->
      <div class="lg:col-span-5 space-y-6">
        <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm space-y-4">
          <h4 class="text-sm font-bold text-primary font-mono uppercase tracking-wider">Firma Electrónica Activa</h4>
          <div class="p-4 bg-[#001f2a] rounded-xl text-white font-mono text-xs space-y-3">
            <div class="flex items-center gap-2 border-b border-primary-container pb-2">
              <Key :size="16" class="text-secondary" />
              <span class="font-bold text-[10px] text-on-primary-container">TOKEN DE ACCESO ACTIVO</span>
            </div>
            <div class="space-y-1">
              <div>USUARIO: <b class="text-white">{{ store.currentUser }}</b></div>
              <div>ROL: <b class="text-white">{{ store.currentRole }}</b></div>
              <div>FIRMA: <span class="text-secondary font-bold">SHA-256 (VALIDADO EN ORACLE)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
