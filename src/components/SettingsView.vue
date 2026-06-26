<script setup lang="ts">
import { Settings, Database, Shield } from 'lucide-vue-next';
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-300">
    <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm">
      <h3 class="text-base font-bold text-primary flex items-center gap-2">
        <Settings :size="20" class="text-secondary" />
        Configuración Global del Sistema
      </h3>
      <p class="text-xs text-outline font-light mt-0.5">
        Gestión de parámetros de red, conexiones de base de datos Oracle y firmas criptográficas autorizadas.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
      <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm space-y-4">
        <h4 class="text-sm font-bold text-primary flex items-center gap-2 font-mono uppercase">
          <Database :size="16" class="text-secondary" /> Conexión Oracle Database
        </h4>
        <div class="space-y-3 pt-2 text-primary font-medium">
          <div class="flex justify-between border-b border-surface-container pb-2">
            <span class="text-outline">Host del Servidor:</span>
            <span class="font-mono">127.0.0.1</span>
          </div>
          <div class="flex justify-between border-b border-surface-container pb-2">
            <span class="text-outline">Puerto DB:</span>
            <span class="font-mono">1521</span>
          </div>
          <div class="flex justify-between border-b border-surface-container pb-2">
            <span class="text-outline">Service Name:</span>
            <span class="font-mono">farmaciapdb</span>
          </div>
          <div class="flex justify-between border-b border-surface-container pb-2">
            <span class="text-outline">Esquema / Usuario:</span>
            <span class="font-mono font-bold">admin_farmacia</span>
          </div>
          <div class="flex justify-between">
            <span class="text-outline">Driver Cliente:</span>
            <span class="text-secondary font-bold">Node-oracledb Thin Mode (v6.5.0)</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm space-y-4">
        <h4 class="text-sm font-bold text-primary flex items-center gap-2 font-mono uppercase">
          <Shield :size="16" class="text-secondary" /> Parámetros de Seguridad
        </h4>
        <div class="space-y-3 pt-2 text-primary font-medium">
          <div class="flex justify-between border-b border-surface-container pb-2">
            <span class="text-outline">Control de Bitácoras:</span>
            <span class="text-secondary font-bold">ACTIVO (Siempre ON)</span>
          </div>
          <div class="flex justify-between border-b border-surface-container pb-2">
            <span class="text-outline">Bloqueo de Perfil:</span>
            <span>Automático tras 15m inactividad</span>
          </div>
          <div class="flex justify-between border-b border-surface-container pb-2">
            <span class="text-outline">Encriptación SSL/TLS:</span>
            <span>AES-256 GCM (SRI Facturación habilitado)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
