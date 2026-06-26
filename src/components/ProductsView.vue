<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { store } from '../store';
import type { Product } from '../types';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  Boxes,
  RefreshCw
} from 'lucide-vue-next';

const searchQuery = ref('');
const selectedCategory = ref('Todas');
const selectedStatus = ref('Todos');
const isModalOpen = ref(false);
const editingProduct = ref<Product | null>(null);

// Form Fields State
const formCatId = ref(0);
const formProvId = ref('');
const formName = ref('');
const formPresentation = ref('');
const formLaboratory = ref('');
const formPurchasePrice = ref(0);
const formPrice = ref(0);
const formStock = ref(0);

onMounted(() => {
  store.fetchProducts();
});

const categoriesList = computed(() => {
  return ['Todas', ...store.categories.map(c => c.name)];
});

// Filter products
const filteredProducts = computed(() => {
  return store.products.filter(prod => {
    const matchesSearch =
      prod.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      String(prod.id).includes(searchQuery.value) ||
      (prod.laboratory || '').toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesCategory = selectedCategory.value === 'Todas' || prod.categoryName === selectedCategory.value;
    
    const matchesStatus =
      selectedStatus.value === 'Todos' ||
      (selectedStatus.value === 'Activos' && prod.stock > 0) ||
      (selectedStatus.value === 'Inactivos' && prod.stock <= 0);

    return matchesSearch && matchesCategory && matchesStatus;
  });
});

function handleOpenNewModal() {
  editingProduct.value = null;
  formCatId.value = store.categories[0]?.id || 0;
  formProvId.value = '';
  formName.value = '';
  formPresentation.value = '';
  formLaboratory.value = '';
  formPurchasePrice.value = 0;
  formPrice.value = 0;
  formStock.value = 0;
  isModalOpen.value = true;
}

function handleOpenEditModal(prod: Product) {
  editingProduct.value = prod;
  formCatId.value = prod.catId;
  formProvId.value = prod.provId ? String(prod.provId) : '';
  formName.value = prod.name;
  formPresentation.value = prod.presentation || '';
  formLaboratory.value = prod.laboratory || '';
  formPurchasePrice.value = prod.purchasePrice || 0;
  formPrice.value = prod.price;
  formStock.value = prod.stock;
  isModalOpen.value = true;
}

async function handleDeleteProduct(id: number, name: string) {
  if (window.confirm(`¿Está seguro de que desea eliminar el producto "${name}"? Esta acción quedará registrada en la bitácora de auditoría.`)) {
    await store.deleteProduct(id);
  }
}

async function handleSaveProduct() {
  if (!formName.value || !formPresentation.value || !formLaboratory.value) {
    alert('Por favor complete todos los campos obligatorios.');
    return;
  }

  const payload = {
    catId: Number(formCatId.value),
    provId: formProvId.value ? Number(formProvId.value) : null,
    name: formName.value,
    presentation: formPresentation.value,
    laboratory: formLaboratory.value,
    purchasePrice: Number(formPurchasePrice.value),
    price: Number(formPrice.value),
    stock: Number(formStock.value),
    description: ''
  };

  let success = false;
  if (editingProduct.value) {
    success = await store.updateProduct(editingProduct.value.id, payload);
  } else {
    success = await store.addProduct(payload);
  }

  if (success) {
    isModalOpen.value = false;
  } else {
    alert('Hubo un error al guardar el producto.');
  }
}

const isReplenishing = ref(false);
async function triggerReplenish() {
  isReplenishing.value = true;
  await store.replenishCriticalStock();
  isReplenishing.value = false;
}
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-300">
    <!-- Search and Filters Header -->
    <div class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm space-y-4">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 class="text-base font-bold text-primary flex items-center gap-2">
          <Boxes :size="20" class="text-secondary" />
          Control de Inventario Farmacéutico
        </h3>

        <div class="flex items-center gap-2 self-end">
          <button
            @click="triggerReplenish"
            :disabled="isReplenishing"
            class="bg-secondary/10 text-secondary hover:bg-secondary/20 transition-all font-bold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <RefreshCw :size="14" :class="{ 'animate-spin': isReplenishing }" />
            Reposición Express
          </button>

          <button
            @click="handleOpenNewModal"
            class="bg-primary hover:bg-primary-container text-white transition-all font-semibold text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <Plus :size="16" />
            Agregar Medicamento
          </button>
        </div>
      </div>

      <!-- Inputs -->
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        <!-- Search Box -->
        <div class="relative col-span-1 sm:col-span-2">
          <input
            type="text"
            placeholder="Buscar por código, nombre o laboratorio..."
            v-model="searchQuery"
            class="w-full bg-surface-container-low text-sm rounded-xl pl-10 pr-4 py-2.5 border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary"
          />
          <Search :size="18" class="absolute left-3.5 top-3 text-outline" />
        </div>

        <!-- Category Dropdown -->
        <select
          v-model="selectedCategory"
          class="bg-surface-container-low text-sm rounded-xl px-4 py-2.5 border-none text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
        >
          <option v-for="cat in categoriesList" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>

        <!-- Status Dropdown -->
        <select
          v-model="selectedStatus"
          class="bg-surface-container-low text-sm rounded-xl px-4 py-2.5 border-none text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
        >
          <option value="Todos">Todos los Estados</option>
          <option value="Activos">Con Stock (>0)</option>
          <option value="Inactivos">Sin Stock (=0)</option>
        </select>
      </div>
    </div>

    <!-- Main Grid Inventory Table -->
    <div class="bg-white rounded-2xl border border-surface-container shadow-sm overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left text-xs text-primary border-collapse">
          <thead>
            <tr class="border-b border-surface-container-high text-outline uppercase font-mono tracking-wider font-semibold bg-surface-container-low/50">
              <th class="py-3 px-6">SKU / Cód.</th>
              <th class="py-3 px-4">Medicamento / Presentación</th>
              <th class="py-3 px-4">Clase / Laboratorio</th>
              <th class="py-3 px-4 text-right">P. Compra</th>
              <th class="py-3 px-4 text-right">P. Venta</th>
              <th class="py-3 px-4 text-center">Stock</th>
              <th class="py-3 px-4 text-center">Estado</th>
              <th class="py-3 px-6 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredProducts.length === 0">
              <td colSpan="8" class="py-12 text-center text-outline text-sm">
                No se encontraron productos coincidentes o bajo stock.
              </td>
            </tr>
            <tr
              v-else
              v-for="prod in filteredProducts"
              :key="prod.id"
              class="border-b border-surface-container hover:bg-surface-container-low/40 transition-colors"
            >
              <!-- SKU -->
              <td class="py-4 px-6 font-mono font-bold text-outline">FS-{{ prod.id }}</td>
              
              <!-- Medicamento -->
              <td class="py-4 px-4">
                <div class="font-bold text-primary text-sm">{{ prod.name }}</div>
                <div class="text-outline text-[11px] mt-0.5">{{ prod.presentation }}</div>
              </td>
              
              <!-- Categoría -->
              <td class="py-4 px-4">
                <div class="font-semibold text-primary-container">{{ prod.categoryName }}</div>
                <div class="text-outline font-medium text-[11px] mt-0.5">{{ prod.laboratory }}</div>
              </td>
              
              <!-- Precio Compra -->
              <td class="py-4 px-4 text-right font-mono font-semibold">${{ Number(prod.purchasePrice || 0).toFixed(2) }}</td>
              
              <!-- Precio Venta -->
              <td class="py-4 px-4 text-right font-mono font-bold text-secondary">${{ Number(prod.price || 0).toFixed(2) }}</td>
              
              <!-- Stock -->
              <td class="py-4 px-4 text-center">
                <div class="inline-flex items-center gap-1.5 justify-center">
                  <span
                    :class="[
                      'font-mono font-bold px-2 py-0.5 rounded-full text-[10px]',
                      prod.stock <= 5 ? 'bg-error-container text-on-error-container' :
                      prod.stock <= 15 ? 'bg-tertiary-fixed text-on-tertiary-fixed-variant' :
                      'bg-secondary-container text-on-secondary-container'
                    ]"
                  >
                    {{ prod.stock }} u
                  </span>
                  <AlertTriangle v-if="prod.stock <= 8" :size="14" class="text-error animate-pulse" />
                </div>
              </td>

              <!-- Estado -->
              <td class="py-4 px-4 text-center">
                <span
                  :class="[
                    'text-[10px] font-bold px-2 py-0.5 rounded-md uppercase font-mono',
                    prod.stock > 0 ? 'bg-secondary/15 text-secondary' : 'bg-outline-variant/30 text-outline'
                  ]"
                >
                  {{ prod.stock > 0 ? 'Disponible' : 'Agotado' }}
                </span>
              </td>
              
              <!-- Acciones -->
              <td class="py-4 px-6 text-center">
                <div class="flex items-center justify-center gap-2">
                  <button
                    @click="handleOpenEditModal(prod)"
                    class="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container transition-all"
                    title="Editar producto"
                  >
                    <Edit2 :size="15" />
                  </button>
                  <button
                    @click="handleDeleteProduct(prod.id, prod.name)"
                    class="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-all"
                    title="Eliminar producto"
                  >
                    <Trash2 :size="15" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Product Modal Form -->
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-[#001f29]/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
    >
      <div class="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-surface-container animate-in zoom-in-95 duration-200">
        <!-- Modal Header -->
        <div class="flex justify-between items-center pb-4 border-b border-surface-container">
          <h4 class="text-base font-extrabold text-primary flex items-center gap-2">
            <Boxes :size="18" class="text-secondary" />
            <span>{{ editingProduct ? 'Editar Medicamento' : 'Nuevo Medicamento' }}</span>
          </h4>
          <button @click="isModalOpen = false" class="text-outline hover:text-primary transition-colors">
            <X :size="20" />
          </button>
        </div>

        <!-- Modal Body Form -->
        <form @submit.prevent="handleSaveProduct" class="py-4 space-y-4 text-xs">
          <div class="grid grid-cols-2 gap-4">
            <!-- Name -->
            <div class="col-span-2">
              <label class="block font-bold text-primary mb-1">NOMBRE DEL PRODUCTO (COMERCIAL / GENÉRICO) *</label>
              <input
                type="text"
                v-model="formName"
                required
                placeholder="Amoxicilina 500mg, Paracetamol..."
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none focus:outline-none focus:ring-1 focus:ring-primary text-primary"
              />
            </div>

            <!-- Presentation -->
            <div>
              <label class="block font-bold text-primary mb-1">PRESENTACIÓN / UNIDAD *</label>
              <input
                type="text"
                v-model="formPresentation"
                required
                placeholder="Caja x 30 caps, Jarabe 100ml..."
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none focus:outline-none focus:ring-1 focus:ring-primary text-primary"
              />
            </div>

            <!-- Laboratory -->
            <div>
              <label class="block font-bold text-primary mb-1">LABORATORIO FABRICANTE *</label>
              <input
                type="text"
                v-model="formLaboratory"
                required
                placeholder="Pfizer, Genfar, BioHealth..."
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none focus:outline-none focus:ring-1 focus:ring-primary text-primary"
              />
            </div>

            <!-- Category -->
            <div>
              <label class="block font-bold text-primary mb-1">CATEGORÍA DE INVENTARIO</label>
              <select
                v-model="formCatId"
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none text-primary focus:outline-none"
              >
                <option v-for="cat in store.categories" :key="cat.id" :value="cat.id">
                  {{ cat.name }}
                </option>
              </select>
            </div>

            <!-- Provider -->
            <div>
              <label class="block font-bold text-primary mb-1">PROVEEDOR PRINCIPAL</label>
              <select
                v-model="formProvId"
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none text-primary focus:outline-none"
              >
                <option value="">Ninguno</option>
                <option v-for="prov in store.providers" :key="prov.id" :value="prov.id">
                  {{ prov.name }}
                </option>
              </select>
            </div>

            <!-- Purchase Price -->
            <div>
              <label class="block font-bold text-primary mb-1">PRECIO COMPRA ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                v-model="formPurchasePrice"
                required
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none focus:outline-none focus:ring-1 focus:ring-primary text-primary font-mono"
              />
            </div>

            <!-- Sale Price -->
            <div>
              <label class="block font-bold text-primary mb-1">PRECIO VENTA ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                v-model="formPrice"
                required
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none focus:outline-none focus:ring-1 focus:ring-primary text-primary font-mono"
              />
            </div>

            <!-- Stock -->
            <div class="col-span-2">
              <label class="block font-bold text-primary mb-1">CANTIDAD DISPONIBLE EN PERCHA (STOCK) *</label>
              <input
                type="number"
                min="0"
                v-model="formStock"
                required
                class="w-full bg-surface-container-low text-xs rounded-lg px-3 py-2 border-none focus:outline-none focus:ring-1 focus:ring-primary text-primary font-mono"
              />
            </div>
          </div>

          <!-- Buttons -->
          <div class="flex items-center justify-end gap-2 pt-4 border-t border-surface-container">
            <button
              type="button"
              @click="isModalOpen = false"
              class="px-4 py-2 bg-surface-container text-primary hover:bg-surface-container-high transition-all rounded-lg font-bold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-secondary text-white hover:bg-on-secondary-container transition-all rounded-lg font-bold"
            >
              Guardar Medicamento
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
