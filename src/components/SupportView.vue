<script setup lang="ts">
import { HelpCircle, Mail, MessageSquare, ShieldAlert } from 'lucide-vue-next';
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-300">
    <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm">
      <h3 class="text-base font-bold text-primary flex items-center gap-2">
        <HelpCircle :size="20" class="text-secondary" />
        Soporte Técnico FarmaSecure
      </h3>
      <p class="text-xs text-outline font-light mt-0.5">
        Consola de ayuda, manuales de usuario y canales de soporte directo ante incidencias del sistema o perchas.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs leading-relaxed text-primary">
      <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm space-y-4">
        <h4 class="text-sm font-bold text-primary flex items-center gap-2 font-mono uppercase">
          <MessageSquare :size="16" class="text-secondary" /> Canales de Contacto
        </h4>
        <div class="space-y-3 pt-2 font-medium">
          <div class="flex items-center gap-2 text-outline">
            <Mail :size="14" class="text-secondary" />
            <span>soporte.sistemas@farmasecure.com</span>
          </div>
          <div class="flex items-center gap-2 text-outline">
            <MessageSquare :size="14" class="text-secondary" />
            <span>Mesa de Ayuda Interna: Ext. 4500 (24/7)</span>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm space-y-4">
        <h4 class="text-sm font-bold text-primary flex items-center gap-2 font-mono uppercase">
          <ShieldAlert :size="16" class="text-secondary" /> Plan de Contingencia
        </h4>
        <p class="text-outline font-light">
          En caso de caída de la conexión con la base de datos Oracle central (1521), el Punto de Venta se mantendrá operable temporalmente guardando transacciones de forma local y asíncrona hasta la reconexión.
        </p>
      </div>
    </div>
  </div>
</template>
