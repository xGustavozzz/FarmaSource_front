<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { Product } from '../types';
import { store } from '../store';
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  AlertCircle,
  FileText
} from 'lucide-vue-next';

const catalogQuery = ref('');
const selectedClientId = ref<number | ''>('');
const paymentMethodId = ref<number>(1); // Defaults to first payment method
const discountGlobal = ref(0); // overall percentage discount

// Receipt modal state
const showReceipt = ref(false);
const recentGeneratedSale = ref<any>(null);

onMounted(() => {
  store.fetchProducts();
  store.fetchClients();
  store.fetchSales();
});

// Filter Catalog
const activeProducts = computed(() => {
  return store.products.filter(p => {
    return (
      p.name.toLowerCase().includes(catalogQuery.value.toLowerCase()) ||
      String(p.id).includes(catalogQuery.value) ||
      (p.laboratory || '').toLowerCase().includes(catalogQuery.value.toLowerCase())
    );
  });
});

const selectedClientObj = computed(() => {
  return store.clients.find(c => c.id === selectedClientId.value);
});

const clientName = computed(() => {
  return selectedClientObj.value ? selectedClientObj.value.name : 'Consumidor Final';
});

// Cart Math totals calculation
const subtotalCart = computed(() => {
  return store.cart.reduce((acc, curr) => acc + (curr.product.price * curr.quantity), 0);
});

const discountAmount = computed(() => {
  return subtotalCart.value * (discountGlobal.value / 100);
});

const taxableSum = computed(() => {
  return subtotalCart.value - discountAmount.value;
});

const taxAmount = computed(() => {
  return taxableSum.value * 0.12; // 12% standard VAT
});

const totalAmount = computed(() => {
  return taxableSum.value + taxAmount.value;
});

// Prescription validation (mock check based on some product category or flags)
const requiresPrescriptionWarnings = computed(() => {
  // Let's assume Antibióticos (ID/categoryName) requires prescription
  return store.cart.some(item => (item.product.categoryName || '').toLowerCase().includes('antib'));
});

function handleAddToCart(product: Product) {
  if (product.stock <= 0) {
    alert('Este medicamento no cuenta con stock disponible en percha actualmente.');
    return;
  }
  store.addToCart(product);
}

function handleUpdateQuantity(productId: number, delta: number) {
  const item = store.cart.find(i => i.product.id === productId);
  if (item) {
    store.updateCartQty(productId, item.quantity + delta);
  }
}

async function handleSavePOSSale() {
  if (store.cart.length === 0) {
    alert('La canasta del POS está vacía. Por favor, añada medicamentos para vender.');
    return;
  }

  if (!selectedClientId.value) {
    alert('Por favor, seleccione un cliente para la facturación.');
    return;
  }

  if (requiresPrescriptionWarnings.value) {
    const confirmed = window.confirm(
      'ATENCIÓN: Ciertos medicamentos en esta orden requieren PRESCRIPCIÓN MÉDICA. ¿Ha verificado y retenido la receta física correspondiente firmada por el Regente?'
    );
    if (!confirmed) return;
  }

  // Find cashier employee - Mock or use a preset employee ID from DB
  const employeeId = 1; // Default Admin/Cashier employee

  const salePayload = {
    clientId: Number(selectedClientId.value),
    employeeId: employeeId,
    paymentMethodId: Number(paymentMethodId.value),
    subtotal: subtotalCart.value,
    discount: discountAmount.value,
    tax: taxAmount.value,
    total: totalAmount.value,
    notes: 'Venta registrada desde el POS Vue',
    items: store.cart.map((item, idx) => ({
      productId: item.product.id,
      lineNumber: idx + 1,
      quantity: item.quantity,
      unitPrice: item.product.price,
      discount: (item.product.price * item.quantity) * (item.discount / 100),
      subtotal: (item.product.price * item.quantity) * (1 - item.discount / 100)
    }))
  };

  const success = await store.addSale(salePayload);

  if (success) {
    recentGeneratedSale.value = {
      clientName: clientName.value,
      invoiceNumber: `FAC-${Date.now().toString().slice(-8)}`, // Fallback visual, backend will output actual invoice
      date: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
      subtotal: subtotalCart.value,
      discount: discountAmount.value,
      tax: taxAmount.value,
      total: totalAmount.value,
      paymentMethodName: store.paymentMethods.find(m => m.id === paymentMethodId.value)?.name || 'Efectivo',
      items: [...store.cart]
    };
    discountGlobal.value = 0;
    showReceipt.value = true;
  } else {
    alert('No se pudo registrar la venta en la base de datos.');
  }
}
</script>

<template>
  <div class="space-y-6 animate-in fade-in duration-300">
    <!-- 2 Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Catalog & Search column (7 cols) -->
      <div class="lg:col-span-7 space-y-6">
        <!-- Top Panel -->
        <section class="bg-white p-6 rounded-2xl border border-surface-container shadow-sm space-y-4">
          <div>
            <h3 class="text-base font-bold text-primary flex items-center gap-2">
              <ShoppingCart :size="20" class="text-secondary" />
              Catálogo de Venta Directa
            </h3>
            <p class="text-xs text-outline font-light mt-0.5">
              Presione sobre un fármaco para anexarlo al carrito de la orden activa.
            </p>
          </div>

          <!-- Catalog search box -->
          <div class="relative">
            <input
              type="text"
              placeholder="Buscar medicamento por nombre o código..."
              v-model="catalogQuery"
              class="w-full bg-surface-container-low text-sm rounded-xl pl-10 pr-4 py-2.5 border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-primary font-medium"
            />
            <Search :size="18" class="absolute left-3.5 top-3 text-outline" />
          </div>
        </section>

        <!-- Product Grid List -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
          <div
            v-for="prod in activeProducts"
            :key="prod.id"
            @click="handleAddToCart(prod)"
            class="bg-white p-5 rounded-2xl border border-surface-container hover:border-secondary shadow-sm hover:shadow transition-all cursor-pointer flex flex-col justify-between space-y-4 relative"
          >
            <!-- Out of stock cover -->
            <div v-if="prod.stock === 0" class="absolute inset-0 bg-white/70 backdrop-blur-[1px] flex items-center justify-center rounded-2xl z-10">
              <span class="bg-error-container text-[10px] font-bold text-[#ba1a1a] uppercase py-1 px-3 rounded-md font-mono">
                Agotado en percha
              </span>
            </div>

            <div class="space-y-1">
              <div class="flex justify-between items-start gap-1">
                <span class="text-[10px] font-mono text-outline font-bold uppercase">FS-{{ prod.id }}</span>
                <span v-if="(prod.categoryName || '').toLowerCase().includes('antib')" class="text-[9px] font-bold bg-error-container text-[#ba1a1a] px-1.5 py-0.2 rounded uppercase">
                  Receta
                </span>
              </div>
              <h4 class="font-bold text-sm text-primary tracking-tight line-clamp-1">{{ prod.name }}</h4>
              <p class="text-xs text-outline font-light">{{ prod.presentation }}</p>
            </div>

            <div class="flex items-center justify-between border-t border-surface-container-low pt-3">
              <span class="font-mono font-bold text-base text-secondary">${{ prod.price.toFixed(2) }}</span>
              <span class="text-[10px] font-mono text-outline font-bold uppercase">
                Cant: <b class="text-primary font-bold">{{ prod.stock }}</b>
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Active POS Basket math column (5 cols) -->
      <div class="lg:col-span-5 space-y-6">
        <div class="bg-white rounded-2xl border border-surface-container shadow-sm p-6 space-y-6 flex flex-col justify-between h-full min-h-[500px]">
          <!-- Header Client Selector -->
          <div class="space-y-4">
            <div>
              <h3 class="text-sm font-bold text-primary font-mono uppercase tracking-wider">Orden de Facturación</h3>
              <p class="text-xs text-outline font-light">Asignación de datos fiscales del cliente</p>
            </div>

            <!-- Dropdown client -->
            <div class="space-y-2">
              <label class="text-[10px] font-mono font-bold text-outline block">CLIENTE / PACIENTE *</label>
              <div class="flex items-center gap-2">
                <select
                  v-model="selectedClientId"
                  class="w-full bg-surface-container-low text-xs rounded-xl px-4 py-2.5 border-none text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                >
                  <option value="" disabled>Seleccione un cliente...</option>
                  <option v-for="cli in store.clients" :key="cli.id" :value="cli.id">
                    {{ cli.name }} (CI: {{ cli.cedula }})
                  </option>
                </select>
              </div>
            </div>

            <!-- Payment Method & Global Discount -->
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-[10px] font-mono font-bold text-outline block">MEDIO DE PAGO</label>
                <select
                  v-model="paymentMethodId"
                  class="w-full bg-surface-container-low text-xs rounded-xl px-4 py-2.5 border-none text-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-semibold"
                >
                  <option v-for="method in store.paymentMethods" :key="method.id" :value="method.id">
                    {{ method.name }}
                  </option>
                </select>
              </div>

              <div class="space-y-2">
                <label class="text-[10px] font-mono font-bold text-outline block">DESC. GLOBAL (%)</label>
                <input
                  type="number"
                  min="0"
                  max="99"
                  v-model="discountGlobal"
                  class="w-full bg-surface-container-low text-xs rounded-xl px-4 py-2 border-none focus:outline-none focus:ring-2 focus:ring-primary/20 font-bold text-primary font-mono"
                />
              </div>
            </div>
          </div>

          <!-- Cart Table list items -->
          <div class="flex-1 py-4 border-t border-b border-surface-container-low max-h-[300px] overflow-y-auto custom-scrollbar">
            <div v-if="store.cart.length === 0" class="flex flex-col items-center justify-center h-full py-8 text-center text-outline space-y-2">
              <ShoppingCart :size="28" class="text-outline-variant" />
              <span class="text-xs">El carrito está vacío. Agrega productos.</span>
            </div>
            
            <div v-else class="space-y-3">
              <div
                v-for="item in store.cart"
                :key="item.product.id"
                class="flex items-center justify-between gap-3 text-xs bg-surface-container-low p-3 rounded-xl border border-surface-container"
              >
                <div class="flex-1 min-w-0">
                  <div class="font-bold text-primary truncate">{{ item.product.name }}</div>
                  <div class="text-[10px] text-outline mt-0.5 font-mono">
                    ${{ item.product.price.toFixed(2) }} c/u
                  </div>
                </div>

                <!-- Qty Adjustment -->
                <div class="flex items-center gap-1">
                  <button
                    @click="handleUpdateQuantity(item.product.id, -1)"
                    class="p-1 rounded-md bg-white border border-surface-container hover:bg-surface-container-low text-primary transition-all cursor-pointer"
                  >
                    <Minus :size="12" />
                  </button>
                  <span class="w-8 text-center font-mono font-bold text-primary">{{ item.quantity }}</span>
                  <button
                    @click="handleUpdateQuantity(item.product.id, 1)"
                    class="p-1 rounded-md bg-white border border-surface-container hover:bg-surface-container-low text-primary transition-all cursor-pointer"
                  >
                    <Plus :size="12" />
                  </button>
                </div>

                <!-- Price Subtotal & delete -->
                <div class="text-right flex items-center gap-3">
                  <div class="font-mono font-bold text-primary">
                    ${{ (item.product.price * item.quantity).toFixed(2) }}
                  </div>
                  <button
                    @click="store.removeFromCart(item.product.id)"
                    class="text-outline hover:text-error transition-colors cursor-pointer"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Total checkout invoice panel -->
          <div class="space-y-4 bg-surface-container-low p-4 rounded-xl border border-surface-container">
            <div class="space-y-1.5 text-xs text-primary font-medium">
              <div class="flex justify-between">
                <span class="text-outline">Subtotal de Orden</span>
                <span class="font-mono font-semibold">${{ subtotalCart.toFixed(2) }}</span>
              </div>
              <div v-if="discountAmount > 0" class="flex justify-between text-tertiary-container font-bold">
                <span>Descuento Aplicado ({{ discountGlobal }}%)</span>
                <span class="font-mono">-${{ discountAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-outline">IVA (12%)</span>
                <span class="font-mono font-semibold">${{ taxAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between border-t border-surface-container-high pt-2.5 text-sm font-extrabold">
                <span class="text-primary">VALOR TOTAL NETO</span>
                <span class="font-mono text-secondary text-base">${{ totalAmount.toFixed(2) }}</span>
              </div>
            </div>

            <!-- Warning if prescriptions required -->
            <div v-if="requiresPrescriptionWarnings" class="bg-error-container text-on-error-container p-2.5 rounded-lg text-[10px] font-semibold flex items-center gap-2">
              <AlertCircle :size="14" class="shrink-0 animate-bounce" />
              <span>Contiene medicamentos que requieren retención de receta médica.</span>
            </div>

            <!-- Complete checkout button -->
            <button
              @click="handleSavePOSSale"
              class="w-full bg-secondary hover:bg-secondary-container hover:text-on-secondary-container text-white py-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <FileText :size="16" />
              REGISTRAR Y EMITIR FACTURA
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Receipts Bill Modal -->
    <div
      v-if="showReceipt"
      class="fixed inset-0 bg-[#001f29]/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in"
    >
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-surface-container text-primary font-sans animate-in zoom-in-95">
        <div class="text-center pb-4 border-b border-surface-container-low space-y-1">
          <div class="w-10 h-10 bg-secondary/15 rounded-full flex items-center justify-center text-secondary mx-auto">
            <CheckCircle :size="24" />
          </div>
          <h4 class="text-base font-extrabold">Transacción Exitosa</h4>
          <p class="text-[11px] text-outline">Comprobante de venta electrónica emitido</p>
        </div>

        <div class="py-4 space-y-3 text-xs font-mono">
          <div class="flex justify-between border-b border-dashed border-surface-container pb-2">
            <span>Factura Nro:</span>
            <span class="font-bold">{{ recentGeneratedSale?.invoiceNumber }}</span>
          </div>
          <div class="flex justify-between">
            <span>Cliente:</span>
            <span class="font-semibold text-right">{{ recentGeneratedSale?.clientName }}</span>
          </div>
          <div class="flex justify-between">
            <span>Medio de Pago:</span>
            <span>{{ recentGeneratedSale?.paymentMethodName }}</span>
          </div>
          <div class="flex justify-between">
            <span>Fecha/Hora:</span>
            <span>{{ recentGeneratedSale?.date }}</span>
          </div>

          <!-- Items recap -->
          <div class="border-t border-b border-surface-container py-2 space-y-1 text-[11px]">
            <div
              v-for="item in recentGeneratedSale?.items"
              :key="item.product.id"
              class="flex justify-between"
            >
              <span class="truncate max-w-[180px]">{{ item.product.name }} (x{{ item.quantity }})</span>
              <span>${{ (item.product.price * item.quantity).toFixed(2) }}</span>
            </div>
          </div>

          <!-- Totals recap -->
          <div class="space-y-1 text-right text-xs pt-1">
            <div>Subtotal: ${{ recentGeneratedSale?.subtotal.toFixed(2) }}</div>
            <div v-if="recentGeneratedSale?.discount > 0">Desc: -${{ recentGeneratedSale?.discount.toFixed(2) }}</div>
            <div>IVA: ${{ recentGeneratedSale?.tax.toFixed(2) }}</div>
            <div class="text-base font-extrabold text-secondary mt-1">
              TOTAL: ${{ recentGeneratedSale?.total.toFixed(2) }}
            </div>
          </div>
        </div>

        <div class="pt-4 border-t border-surface-container flex justify-end">
          <button
            @click="showReceipt = false"
            class="px-4 py-2 bg-primary text-white hover:bg-primary-container rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Aceptar / Nueva Venta
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
