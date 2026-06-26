<script setup lang="ts">
import { ref } from 'vue';
import { store } from '../store';
import { Activity, LogIn, Lock } from 'lucide-vue-next';

const usernameInput = ref('');
const password = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

async function handleSubmit() {
  if (!usernameInput.value || !password.value) {
    errorMessage.value = 'Por favor complete todos los campos.';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';
  
  const success = await store.login(usernameInput.value, password.value);
  isSubmitting.value = false;
  
  if (!success) {
    errorMessage.value = 'Usuario o contraseña incorrectos, o usuario inactivo.';
  }
}
</script>

<template>
  <div class="min-h-screen bg-[#001f29] flex items-center justify-center p-6 bg-gradient-to-br from-[#001f29] via-[#002633] to-[#002632] overflow-hidden relative font-sans text-white">
    <!-- Visual background details -->
    <div class="absolute top-10 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
    <div class="absolute -bottom-10 -left-10 w-96 h-96 bg-primary-fixed-dim/5 rounded-full blur-3xl animate-pulse" />

    <!-- Main Container -->
    <div class="w-full max-w-4xl bg-[#002130]/90 backdrop-blur border border-primary-container p-8 sm:p-12 rounded-3xl shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
      
      <!-- Left pane: Branding & Instructions -->
      <div class="space-y-8 flex flex-col justify-center">
        <div class="space-y-4">
          <div class="w-14 h-14 bg-on-primary-fixed-variant rounded-2xl flex items-center justify-center text-primary-fixed">
            <Activity :size="32" class="text-white" />
          </div>
          <div>
            <h2 class="text-3xl font-extrabold text-white tracking-tight">FarmaSecure</h2>
            <p class="text-xs font-mono font-bold text-secondary uppercase tracking-wider mt-1">
              Pharmacy Control System & Audit Ledger
            </p>
          </div>
          <p class="text-xs text-slate-300 leading-relaxed max-w-sm font-medium">
            Inicie sesión utilizando su firma o token criptográfico. Registre operaciones sensibles del inventario con bitácoras inmutables automáticas.
          </p>
        </div>

        <div class="p-4 bg-[#001f2a]/50 rounded-xl border border-primary-container text-xs space-y-2">
          <span class="font-bold text-[10px] font-mono text-secondary uppercase block">Seguridad del Sistema</span>
          <p class="text-[11px] text-slate-200 leading-relaxed font-medium">
            Las contraseñas de los nuevos colaboradores son asignadas por defecto como <code class="bg-[#002130] text-white px-1.5 py-0.5 rounded font-mono font-bold">admin123</code>. Cada colaborador deberá ingresar y actualizar su contraseña desde la sección "Mi Perfil".
          </p>
        </div>
      </div>

      <!-- Right pane: Entry credentials -->
      <div class="bg-[#001f2a] p-8 rounded-2xl border border-primary-container flex flex-col justify-center space-y-6">
        <div class="space-y-1">
          <h3 class="font-extrabold text-lg text-white">Consola de Acceso</h3>
          <p class="text-xs text-slate-300 font-medium">Ingrese sus credenciales registradas</p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <div v-if="errorMessage" class="bg-error-container text-on-error-container p-3 rounded-lg text-xs font-bold">
            <div>{{ errorMessage }}</div>
          </div>

          <!-- User field -->
          <div>
            <label class="text-[10px] font-mono font-bold text-slate-200 block mb-1">USUARIO (FIRMA DIGITAL) *</label>
            <input
              type="text"
              required
              v-model="usernameInput"
              placeholder="Ej. c.perez.4"
              class="w-full bg-[#002130] border border-primary-container text-white placeholder-slate-500 rounded-lg px-3 py-2.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="text-[10px] font-mono font-bold text-slate-200 block mb-1">CONTRASEÑA DE SEGURIDAD *</label>
            <div class="relative">
              <input
                type="password"
                required
                v-model="password"
                placeholder="Ingrese contraseña"
                class="w-full bg-[#002130] border border-primary-container text-white placeholder-slate-500 rounded-lg pl-3 pr-8 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-secondary focus:border-secondary"
              />
              <Lock :size="14" class="absolute right-3 top-3.5 text-slate-300" />
            </div>
          </div>

          <!-- Submit button -->
          <button
            type="submit"
            :disabled="isSubmitting"
            class="w-full bg-secondary hover:bg-secondary-container hover:text-on-secondary-container text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 cursor-pointer"
          >
            <LogIn :size="14" />
            <span>INGRESAR AL SISTEMA</span>
          </button>
        </form>

        <!-- Secure disclaimer -->
        <div class="pt-2 text-[9px] text-slate-300 font-mono flex items-center justify-center gap-1.5 leading-relaxed text-center font-medium">
          <Lock :size="12" class="shrink-0" />
          <span>Encriptación de canal TLS 1.3 - SRI Facturación Electrónica Habilitado</span>
        </div>
      </div>

    </div>
  </div>
</template>
