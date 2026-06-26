<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { store } from '../store';
import type { Employee } from '../types';
import { Search, Plus, Edit2, Contact, Mail, Phone, X } from 'lucide-vue-next';

const searchQuery = ref('');
const selectedRole = ref('Todos');
const isModalOpen = ref(false);
const editingEmployee = ref<Employee | null>(null);

// Form states
const formCedula = ref('');
const formFirstName = ref('');
const formLastName = ref('');
const formRole = ref('Vendedor');
const formEmail = ref('');
const formPhone = ref('');
const formSalary = ref(0);
const formIsActive = ref(true);

const roles = ['Administrador', 'Regente Farmacéutico', 'Vendedor', 'Auditor'];

onMounted(() => {
  store.fetchEmployees();
});

// Filter employees
const filteredEmployees = computed(() => {
  return store.employees.filter(emp => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      emp.cedula.includes(searchQuery.value) ||
      (emp.email || '').toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesRole = selectedRole.value === 'Todos' || emp.role === selectedRole.value;

    return matchesSearch && matchesRole;
  });
});

function handleOpenNewModal() {
  editingEmployee.value = null;
  formCedula.value = '';
  formFirstName.value = '';
  formLastName.value = '';
  formRole.value = 'Vendedor';
  formEmail.value = '';
  formPhone.value = '';
  formSalary.value = 450;
  formIsActive.value = true;
  isModalOpen.value = true;
}

function handleOpenEditModal(emp: Employee) {
  editingEmployee.value = emp;
  formCedula.value = emp.cedula;
  formFirstName.value = emp.firstName;
  formLastName.value = emp.lastName;
  formRole.value = emp.role;
  formEmail.value = emp.email || '';
  formPhone.value = emp.phone || '';
  formSalary.value = emp.salary || 0;
  formIsActive.value = emp.isActive;
  isModalOpen.value = true;
}

async function handleSaveEmployee() {
  if (!formCedula.value || !formFirstName.value || !formLastName.value || !formEmail.value) {
    alert('Por favor complete todos los campos obligatorios.');
    return;
  }

  const payload = {
    cedula: formCedula.value,
    firstName: formFirstName.value,
    lastName: formLastName.value,
    role: formRole.value,
    email: formEmail.value,
    phone: formPhone.value || null,
    salary: Number(formSalary.value),
    isActive: formIsActive.value
  };

  let success = false;
  if (editingEmployee.value) {
    success = await store.updateEmployee(editingEmployee.value.id, payload);
  } else {
    success = await store.addEmployee(payload);
  }

  if (success) {
    isModalOpen.value = false;
  } else {
    alert('Hubo un error al guardar el colaborador.');
  }
}
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-300">
    <!-- Search Actions Header -->
    <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 class="text-base font-bold text-primary flex items-center gap-2">
            <Contact :size="20" class="text-secondary" />
            Nómina de Personal y Staff Autorizado
          </h3>
          <p class="text-xs text-outline font-light mt-0.5">
            Administración de credenciales de personal, puestos de control y salarios en Oracle DB.
          </p>
        </div>

        <button
          @click="handleOpenNewModal"
          class="bg-primary hover:bg-primary-container text-white transition-all font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm self-end cursor-pointer"
        >
          <Plus :size="16" />
          Ingresar Colaborador
        </button>
      </div>

      <!-- Inputs -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 text-xs">
        <!-- Search Box -->
        <div class="relative col-span-1 sm:col-span-2">
          <input
            type="text"
            placeholder="Buscar por cédula, nombre, correo corporativo..."
            v-model="searchQuery"
            class="w-full bg-surface-container-low text-sm rounded-xl pl-10 pr-4 py-2.5 border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary"
          />
          <Search :size="18" class="absolute left-3.5 top-3 text-outline" />
        </div>

        <!-- Role Dropdown filter -->
        <select
          v-model="selectedRole"
          class="bg-surface-container-low text-sm rounded-xl px-4 py-2.5 border-none text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
        >
          <option value="Todos">Todos los Cargos</option>
          <option v-for="r in roles" :key="r" :value="r">
            {{ r }}
          </option>
        </select>
      </div>
    </div>

    <!-- Grid listing -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-if="filteredEmployees.length === 0" class="col-span-3 text-center py-12 text-outline text-sm">
        No se encontraron colaboradores coincidentes.
      </div>
      
      <div
        v-else
        v-for="emp in filteredEmployees"
        :key="emp.id"
        class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm flex flex-col justify-between hover:shadow-md transition-all relative"
      >
        <!-- Status indicators -->
        <span
          :class="[
            'absolute top-6 right-6 px-2 py-0.5 rounded font-mono font-bold text-[9px] uppercase tracking-wider',
            emp.isActive ? 'bg-secondary/15 text-secondary' : 'bg-surface-container-high text-outline'
          ]"
        >
          {{ emp.isActive ? 'Activo' : 'Inactivo' }}
        </span>

        <div class="space-y-4">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-surface-container font-extrabold text-sm">
              {{ emp.name.substring(0, 2).toUpperCase() }}
            </div>
            <div>
              <span class="text-[10px] uppercase font-mono tracking-widest text-outline">{{ emp.role }}</span>
              <h4 class="font-extrabold text-sm text-primary leading-tight">{{ emp.name }}</h4>
            </div>
          </div>

          <!-- Data parameters -->
          <div class="space-y-2 text-xs text-primary font-medium border-t border-surface-container pt-3">
            <div class="flex items-center gap-2 text-outline">
              <Mail :size="13" class="text-secondary shrink-0" />
              <span class="truncate">{{ emp.email }}</span>
            </div>
            <div class="flex items-center gap-1.5 text-outline">
              <Phone :size="13" class="text-secondary shrink-0" />
              <span>{{ emp.phone || 'Sin teléfono' }}</span>
            </div>
            <div class="text-[10px] uppercase font-mono font-bold text-outline">
              ID Cédula: {{ emp.cedula }} | Salario: ${{ emp.salary.toFixed(2) }}
            </div>
          </div>
        </div>

        <div class="mt-6 pt-4 border-t border-surface-container flex justify-end">
          <button
            @click="handleOpenEditModal(emp)"
            class="text-xs text-primary bg-surface-container hover:bg-surface-container-high font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
          >
            <Edit2 :size="12" />
            Editar Relación
          </button>
        </div>
      </div>
    </div>

    <!-- Modal dialog -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-[#001f29]/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in"
    >
      <div class="bg-white rounded-2xl border border-surface-container shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95">
        <!-- Modal Header -->
        <div class="bg-primary px-6 py-4 flex items-center justify-between text-white border-b border-primary-container">
          <h4 class="font-bold text-sm tracking-wide">
            {{ editingEmployee ? 'MODIFICAR COLABORADOR' : 'REGISTRAR COLABORADOR' }}
          </h4>
          <button
            @click="isModalOpen = false"
            class="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-all cursor-pointer"
          >
            <X :size="18" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSaveEmployee" class="p-6 space-y-4 text-xs">
          <div class="space-y-3">
            <!-- Cédula -->
            <div>
              <label class="text-[11px] font-mono font-bold text-outline block mb-1">CÉDULA DE IDENTIDAD *</label>
              <input
                type="text"
                required
                placeholder="Ej. 1712345678"
                v-model="formCedula"
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none font-mono font-bold text-primary focus:outline-none"
              />
            </div>

            <!-- First Name -->
            <div>
              <label class="text-[11px] font-mono font-bold text-outline block mb-1">NOMBRES *</label>
              <input
                type="text"
                required
                placeholder="Ej. Elena"
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
                placeholder="Ej. Martínez"
                v-model="formLastName"
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none text-primary focus:outline-none"
              />
            </div>

            <!-- Role dropdown choice -->
            <div>
              <label class="text-[11px] font-mono font-bold text-outline block mb-1">PUESTO O CARGO AUTORIZADO</label>
              <select
                v-model="formRole"
                class="w-full bg-surface-container-low text-xs font-semibold py-2.5 px-3 border-none text-primary rounded-lg focus:outline-none"
              >
                <option v-for="opt in roles" :key="opt" :value="opt">
                  {{ opt }}
                </option>
              </select>
            </div>

            <!-- Phone -->
            <div>
              <label class="text-[11px] font-mono font-bold text-outline block mb-1">TELÉFONO *</label>
              <input
                type="text"
                placeholder="Ej. +57 301 223 9910"
                v-model="formPhone"
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none text-primary focus:outline-none"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="text-[11px] font-mono font-bold text-outline block mb-1">CORREO INSTITUCIONAL *</label>
              <input
                type="email"
                required
                placeholder="e.martinez@farmasecure.com"
                v-model="formEmail"
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none text-primary focus:outline-none"
              />
            </div>

            <!-- Salary -->
            <div>
              <label class="text-[11px] font-mono font-bold text-outline block mb-1">SALARIO MENSUAL ($) *</label>
              <input
                type="number"
                required
                v-model="formSalary"
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none text-primary focus:outline-none font-mono"
              />
            </div>

            <!-- Active Status -->
            <div class="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                v-model="formIsActive"
                id="empActive"
                class="rounded border-surface-container text-primary focus:ring-0"
              />
              <label for="empActive" class="text-[11px] font-mono font-bold text-primary cursor-pointer select-none">
                ESTADO ACTIVO EN NÓMINA (PERMITIR ACCESOS)
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
              Guardar Colaborador
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
