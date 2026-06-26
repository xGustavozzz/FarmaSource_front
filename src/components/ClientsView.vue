<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { store } from '../store';
import type { Client } from '../types';
import { Search, Plus, Edit2, Mail, Phone, MapPin, X, Users } from 'lucide-vue-next';

const searchQuery = ref('');
const selectedCity = ref('Todas');
const isModalOpen = ref(false);
const editingClient = ref<Client | null>(null);

// Form fields
const formCiuId = ref(0);
const formFirstName = ref('');
const formLastName = ref('');
const formCedula = ref('');
const formPhone = ref('');
const formEmail = ref('');
const formAddress = ref('');
const formIsActive = ref(true);
const formBirthDate = ref('');

onMounted(() => {
  store.fetchClients();
});

const citiesList = computed(() => {
  return ['Todas', ...store.cities.map(c => c.name)];
});

// Filter clients
const filteredClients = computed(() => {
  return store.clients.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      c.cedula.includes(searchQuery.value) ||
      (c.email || '').toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesCity = selectedCity.value === 'Todas' || c.cityName === selectedCity.value;

    return matchesSearch && matchesCity;
  });
});

function handleOpenNewModal() {
  editingClient.value = null;
  formCiuId.value = store.cities[0]?.id || 0;
  formFirstName.value = '';
  formLastName.value = '';
  formCedula.value = '';
  formPhone.value = '';
  formEmail.value = '';
  formAddress.value = '';
  formBirthDate.value = '';
  formIsActive.value = true;
  isModalOpen.value = true;
}

function handleOpenEditModal(client: Client) {
  editingClient.value = client;
  formCiuId.value = client.ciuId || store.cities[0]?.id || 0;
  formFirstName.value = client.firstName;
  formLastName.value = client.lastName;
  formCedula.value = client.cedula;
  formPhone.value = client.phone || '';
  formEmail.value = client.email || '';
  formAddress.value = client.address || '';
  formBirthDate.value = client.birthDate ? client.birthDate.substring(0, 10) : '';
  formIsActive.value = client.isActive;
  isModalOpen.value = true;
}

async function handleSaveClient() {
  if (!formCedula.value || !formFirstName.value || !formLastName.value) {
    alert('Por favor complete todos los campos obligatorios.');
    return;
  }

  const payload = {
    ciuId: Number(formCiuId.value),
    firstName: formFirstName.value,
    lastName: formLastName.value,
    cedula: formCedula.value,
    phone: formPhone.value || null,
    email: formEmail.value || null,
    address: formAddress.value || null,
    birthDate: formBirthDate.value || null,
    isActive: formIsActive.value
  };

  let success = false;
  if (editingClient.value) {
    success = await store.updateClient(editingClient.value.id, payload);
  } else {
    success = await store.addClient(payload);
  }

  if (success) {
    isModalOpen.value = false;
  } else {
    alert('Hubo un error al guardar el cliente.');
  }
}
const canWriteClients = computed(() => {
  const role = store.currentRole;
  return role === 'Administrador' || role === 'Vendedor' || role === 'Cajero';
});
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-300">
    <!-- Search Header -->
    <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-bold text-primary flex items-center gap-2">
            <Users :size="20" class="text-secondary" />
            Directorio de Clientes / Pacientes
          </h3>
          <p class="text-xs text-outline font-light mt-0.5">
            Control de fichas fiscales, números de contacto e historiales médicos
          </p>
        </div>

        <button
          v-if="canWriteClients"
          @click="handleOpenNewModal"
          class="bg-primary hover:bg-primary-container text-white transition-all font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm self-end cursor-pointer"
        >
          <Plus :size="16" />
          Ingresar Cliente
        </button>
      </div>

      <!-- Inputs -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <!-- Search Box -->
        <div class="relative col-span-1 sm:col-span-2">
          <input
            type="text"
            placeholder="Buscar por ID/Cédula, nombre completo o correo..."
            v-model="searchQuery"
            class="w-full bg-surface-container-low text-sm rounded-xl pl-10 pr-4 py-2.5 border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary"
          />
          <Search :size="18" class="absolute left-3.5 top-3 text-outline" />
        </div>

        <!-- City Dropdown -->
        <select
          v-model="selectedCity"
          class="bg-surface-container-low text-sm rounded-xl px-4 py-2.5 border-none text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
        >
          <option v-for="city in citiesList" :key="city" :value="city">
            {{ city === 'Todas' ? 'Todas las Ciudades' : city }}
          </option>
        </select>
      </div>
    </div>

    <!-- Grid of Client Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-if="filteredClients.length === 0" class="col-span-2 text-center py-12 text-outline text-sm">
        No se encontraron clientes coincidentes.
      </div>
      
      <div
        v-else
        v-for="client in filteredClients"
        :key="client.id"
        class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative"
      >
        <!-- Status indicators -->
        <span
          :class="[
            'absolute top-6 right-6 px-2.5 py-0.5 rounded-full font-bold text-[10px] uppercase font-mono',
            client.isActive ? 'bg-secondary/10 text-secondary' : 'bg-surface-container text-outline'
          ]"
        >
          {{ client.isActive ? 'Contacto Activo' : 'Inactivo' }}
        </span>

        <div class="space-y-4">
          <!-- Header Info -->
          <div>
            <span class="text-[10px] uppercase tracking-wider font-mono font-extrabold text-outline">
              Cédula: {{ client.cedula }}
            </span>
            <h4 class="font-extrabold text-base text-primary tracking-tight mt-0.5">{{ client.name }}</h4>
          </div>

          <!-- Grid of contact details -->
          <div class="space-y-2 text-xs text-primary font-medium">
            <div class="flex items-center gap-2 text-outline">
              <Phone :size="14" class="text-secondary" />
              <span>{{ client.phone || 'Sin teléfono' }}</span>
            </div>
            <div class="flex items-center gap-2 text-outline">
              <Mail :size="14" class="text-secondary" />
              <span class="truncate">{{ client.email || 'Sin correo' }}</span>
            </div>
            <div class="flex items-center gap-2 text-outline">
              <MapPin :size="14" class="text-secondary" />
              <span>
                {{ client.cityName || 'Sin Ciudad' }}, {{ client.address || 'Sin dirección' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Edit actions -->
        <div v-if="canWriteClients" class="mt-6 pt-4 border-t border-surface-container flex justify-end">
          <button
            @click="handleOpenEditModal(client)"
            class="text-xs text-primary bg-surface-container hover:bg-surface-container-high font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Edit2 :size="12" />
            Editar Expediente
          </button>
        </div>
      </div>
    </div>

    <!-- Modal dialog -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-[#001f29]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in"
    >
      <div class="bg-white rounded-2xl border border-surface-container shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
        <!-- Modal Header -->
        <div class="bg-primary px-6 py-4 flex items-center justify-between text-white border-b border-primary-container">
          <h4 class="font-bold text-sm tracking-wide">
            {{ editingClient ? 'MODIFICAR CLIENTE EN DIRECTORIO' : 'REGISTRAR NUEVO CLIENTE' }}
          </h4>
          <button
            @click="isModalOpen = false"
            class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <X :size="18" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSaveClient" class="p-6 space-y-4 text-xs">
          <div class="space-y-3">
            <!-- ID/Cédula -->
            <div>
              <label class="text-[11px] font-mono font-bold text-outline block mb-1">CÉDULA / ID FISCAL *</label>
              <input
                type="text"
                required
                v-model="formCedula"
                placeholder="Ej. 1712345678"
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none font-mono font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            <!-- First Name -->
            <div>
              <label class="text-[11px] font-mono font-bold text-outline block mb-1">NOMBRES *</label>
              <input
                type="text"
                required
                placeholder="Ej. Carlos Alberto"
                v-model="formFirstName"
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none text-primary focus:outline-none"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label class="text-[11px] font-mono font-bold text-outline block mb-1">APELLIDOS *</label>
              <input
                type="text"
                required
                placeholder="Ej. Andrade"
                v-model="formLastName"
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none text-primary focus:outline-none"
              />
            </div>

            <!-- Birth Date -->
            <div>
              <label class="text-[11px] font-mono font-bold text-outline block mb-1">FECHA DE NACIMIENTO</label>
              <input
                type="date"
                v-model="formBirthDate"
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none text-primary focus:outline-none font-mono"
              />
            </div>

            <!-- Phone -->
            <div>
              <label class="text-[11px] font-mono font-bold text-outline block mb-1">TELÉFONO DE CONTACTO</label>
              <input
                type="text"
                placeholder="Ej. 098 765 4321"
                v-model="formPhone"
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none text-primary focus:outline-none"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="text-[11px] font-mono font-bold text-outline block mb-1">CORREO ELECTRÓNICO</label>
              <input
                type="email"
                placeholder="carlos.andrade@email.com"
                v-model="formEmail"
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none text-primary focus:outline-none"
              />
            </div>

            <!-- City -->
            <div>
              <label class="text-[11px] font-mono font-bold text-outline block mb-1">CIUDAD DE DOMICILIO</label>
              <select
                v-model="formCiuId"
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none text-primary focus:outline-none"
              >
                <option v-for="city in store.cities" :key="city.id" :value="city.id">
                  {{ city.name }}
                </option>
              </select>
            </div>

            <!-- Address -->
            <div>
              <label class="text-[11px] font-mono font-bold text-outline block mb-1">DIRECCIÓN DOMICILIARIA</label>
              <input
                type="text"
                placeholder="Av. Amazonas y Orellana"
                v-model="formAddress"
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none text-primary focus:outline-none"
              />
            </div>

            <!-- Active Status -->
            <div class="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                v-model="formIsActive"
                id="isActive"
                class="rounded border-surface-container text-primary focus:ring-0"
              />
              <label for="isActive" class="text-[11px] font-mono font-bold text-primary cursor-pointer select-none">
                ESTADO DE CONTACTO ACTIVO EN EL DIRECTORIO
              </label>
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end gap-2 pt-4 border-t border-surface-container">
            <button
              type="button"
              @click="isModalOpen = false"
              class="px-4 py-2 bg-surface-container text-primary hover:bg-surface-container-high rounded-xl font-bold transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-secondary text-white hover:bg-on-secondary-container rounded-xl font-bold transition-all cursor-pointer"
            >
              Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
