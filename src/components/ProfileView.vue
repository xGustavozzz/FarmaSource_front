<script setup lang="ts">
import { ref } from 'vue';
import { store } from '../store';
import { User, Lock, Key, ShieldCheck, CheckCircle, AlertTriangle } from 'lucide-vue-next';

const oldPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const successMessage = ref('');
const errorMessage = ref('');
const isSubmitting = ref(false);

async function handleUpdatePassword() {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    errorMessage.value = 'Por favor complete todos los campos.';
    successMessage.value = '';
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'La nueva contraseña y su confirmación no coinciden.';
    successMessage.value = '';
    return;
  }

  if (newPassword.value.length < 6) {
    errorMessage.value = 'La nueva contraseña debe tener al menos 6 caracteres.';
    successMessage.value = '';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';
  successMessage.value = '';

  const result = await store.changePassword(oldPassword.value, newPassword.value);
  isSubmitting.value = false;

  if (result.success) {
    successMessage.value = 'Contraseña actualizada exitosamente. Su firma digital ha sido renovada en Oracle DB.';
    oldPassword.value = '';
    newPassword.value = '';
    confirmPassword.value = '';
  } else {
    errorMessage.value = result.message || 'Error al actualizar la contraseña.';
  }
}
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-300">
    <!-- Header -->
    <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm">
      <h3 class="text-base font-bold text-primary flex items-center gap-2">
        <User :size="20" class="text-secondary" />
        Mi Perfil de Usuario
      </h3>
      <p class="text-xs text-outline font-light mt-0.5">
        Consola de administración de credenciales personales y firma digital criptográfica activa.
      </p>
    </div>

    <!-- Grid Layout -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
      
      <!-- Left Card: User Details -->
      <div class="md:col-span-5 bg-white p-6 rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between">
        <div class="space-y-6">
          <h4 class="text-sm font-bold text-primary flex items-center gap-2 font-mono uppercase tracking-wider">
            <ShieldCheck :size="16" class="text-secondary" /> Credenciales Activas
          </h4>
          
          <div class="flex flex-col items-center py-4 border-b border-surface-container">
            <div class="w-20 h-20 rounded-2xl bg-primary/5 border border-surface-container flex items-center justify-center text-primary font-extrabold text-3xl mb-3 shadow-inner">
              {{ store.currentUser.substring(0, 2).toUpperCase() }}
            </div>
            <span class="bg-secondary/15 text-secondary text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              Acceso Activo
            </span>
          </div>

          <div class="space-y-3 pt-2 text-primary font-medium">
            <div class="flex justify-between border-b border-surface-container pb-2">
              <span class="text-outline">Nombre Completo:</span>
              <span class="font-bold text-right">{{ store.userProfile?.fullName || 'Colaborador FarmaSecure' }}</span>
            </div>
            <div class="flex justify-between border-b border-surface-container pb-2">
              <span class="text-outline">Usuario (Firma):</span>
              <span class="font-mono font-bold">{{ store.currentUser }}</span>
            </div>
            <div class="flex justify-between border-b border-surface-container pb-2">
              <span class="text-outline">Cargo / Rol Asignado:</span>
              <span class="font-mono text-secondary font-bold">{{ store.currentRole }}</span>
            </div>
            <div class="flex justify-between pb-2">
              <span class="text-outline">Correo de Contacto:</span>
              <span class="font-mono">{{ store.userProfile?.email || 'N/A' }}</span>
            </div>
          </div>
        </div>

        <div class="p-3 bg-[#001f2a] rounded-xl text-white font-mono text-[10px] flex items-center gap-2 mt-6">
          <Key :size="14" class="text-secondary shrink-0" />
          <span>Firma digital activa y validada criptográficamente en Oracle DB.</span>
        </div>
      </div>

      <!-- Right Card: Change Password Form -->
      <div class="md:col-span-7 bg-white p-6 rounded-2xl border border-surface-container shadow-sm space-y-4">
        <h4 class="text-sm font-bold text-primary flex items-center gap-2 font-mono uppercase tracking-wider">
          <Lock :size="16" class="text-secondary" /> Actualizar Contraseña de Seguridad
        </h4>
        
        <p class="text-outline font-light leading-relaxed">
          Si es su primer ingreso con la contraseña por defecto <code class="bg-surface-container text-primary font-mono px-1 rounded">admin123</code>, es obligatorio actualizarla por una contraseña segura y personalizada para habilitar el uso de su firma digital.
        </p>

        <!-- Message Banners -->
        <div v-if="successMessage" class="bg-secondary/10 border border-secondary/20 text-secondary p-3 rounded-lg flex items-start gap-2">
          <CheckCircle :size="16" class="shrink-0 mt-0.5" />
          <span>{{ successMessage }}</span>
        </div>

        <div v-if="errorMessage" class="bg-error-container/20 border border-error-container/30 text-on-error-container p-3 rounded-lg flex items-start gap-2">
          <AlertTriangle :size="16" class="shrink-0 mt-0.5" />
          <span>{{ errorMessage }}</span>
        </div>

        <form @submit.prevent="handleUpdatePassword" class="space-y-4 pt-2">
          <!-- Current Password -->
          <div>
            <label class="text-[10px] font-mono font-bold text-outline block mb-1">CONTRASEÑA ACTUAL *</label>
            <input
              type="password"
              required
              v-model="oldPassword"
              placeholder="Ingrese su contraseña actual (o admin123)"
              class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2.5 border-none text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <!-- New Password -->
          <div>
            <label class="text-[10px] font-mono font-bold text-outline block mb-1">NUEVA CONTRASEÑA *</label>
            <input
              type="password"
              required
              v-model="newPassword"
              placeholder="Ingrese su nueva contraseña de seguridad"
              class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2.5 border-none text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <!-- Confirm Password -->
          <div>
            <label class="text-[10px] font-mono font-bold text-outline block mb-1">CONFIRMAR NUEVA CONTRASEÑA *</label>
            <input
              type="password"
              required
              v-model="confirmPassword"
              placeholder="Confirme su nueva contraseña"
              class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2.5 border-none text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <!-- Submit Button -->
          <div class="flex justify-end pt-2">
            <button
              type="submit"
              :disabled="isSubmitting"
              class="bg-secondary hover:bg-secondary-container hover:text-on-secondary-container text-white transition-all font-semibold py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Key :size="14" />
              <span>{{ isSubmitting ? 'Actualizando...' : 'Actualizar Credencial' }}</span>
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>
