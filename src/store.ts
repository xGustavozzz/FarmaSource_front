import { reactive } from 'vue';
import type { Product, Client, Sale, Employee, AuditLog } from './types';

const API_BASE = 'http://localhost:3001/api';

export const store = reactive({
  // Auth state
  isLoggedIn: true, // Default to true, same as React app for testing
  currentUser: 'admin.secure',
  currentRole: 'Administrador',
  userProfile: null as any,

  // UI state
  activeTab: 'dashboard',

  // Data lists
  products: [] as Product[],
  categories: [] as { id: number; name: string }[],
  providers: [] as { id: number; name: string }[],
  clients: [] as Client[],
  cities: [] as { id: number; name: string }[],
  sales: [] as Sale[],
  paymentMethods: [] as { id: number; name: string }[],
  employees: [] as Employee[],
  auditLogs: [] as AuditLog[],

  // Dashboard Stats
  stats: {
    totalProducts: 0,
    totalStock: 0,
    totalClients: 0,
    totalSalesRevenue: 0,
    criticalStockAlerts: 0,
    recentSales: [] as any[],
    recentAudits: [] as any[]
  },

  // POS State
  cart: [] as Array<{ product: Product; quantity: number; discount: number }>,

  // Methods
  setTab(tab: string) {
    this.activeTab = tab;
  },

  getHeaders() {
    return {
      'Content-Type': 'application/json',
      'x-user-username': this.currentUser
    };
  },

  async login(username: string) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username })
      });
      if (!res.ok) {
        throw new Error('Credenciales inválidas');
      }
      const data = await res.json();
      this.isLoggedIn = true;
      this.currentUser = data.currentUser;
      this.currentRole = data.currentRole;
      this.userProfile = data.user;
      this.fetchDashboardStats();
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  },

  logout() {
    this.isLoggedIn = false;
    this.currentUser = '';
    this.currentRole = '';
    this.userProfile = null;
  },

  // Fetch API helpers
  async fetchDashboardStats() {
    try {
      const res = await fetch(`${API_BASE}/dashboard`, { headers: this.getHeaders() });
      if (res.ok) {
        this.stats = await res.json();
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  },

  async fetchProducts() {
    try {
      const res = await fetch(`${API_BASE}/products`, { headers: this.getHeaders() });
      if (res.ok) {
        this.products = await res.json();
      }
      
      const catsRes = await fetch(`${API_BASE}/products/categories`, { headers: this.getHeaders() });
      if (catsRes.ok) {
        this.categories = await catsRes.json();
      }

      const provsRes = await fetch(`${API_BASE}/products/providers`, { headers: this.getHeaders() });
      if (provsRes.ok) {
        this.providers = await provsRes.json();
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  },

  async addProduct(product: Omit<Product, 'id'>) {
    try {
      const res = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(product)
      });
      if (res.ok) {
        await this.fetchProducts();
        await this.fetchDashboardStats();
        return true;
      }
    } catch (err) {
      console.error('Error creating product:', err);
    }
    return false;
  },

  async updateProduct(id: number, product: Omit<Product, 'id'>) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(product)
      });
      if (res.ok) {
        await this.fetchProducts();
        await this.fetchDashboardStats();
        return true;
      }
    } catch (err) {
      console.error('Error updating product:', err);
    }
    return false;
  },

  async deleteProduct(id: number) {
    try {
      const res = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders()
      });
      if (res.ok) {
        await this.fetchProducts();
        await this.fetchDashboardStats();
        return true;
      }
    } catch (err) {
      console.error('Error deleting product:', err);
    }
    return false;
  },

  async replenishCriticalStock() {
    try {
      const res = await fetch(`${API_BASE}/products/replenish`, {
        method: 'POST',
        headers: this.getHeaders()
      });
      if (res.ok) {
        await this.fetchProducts();
        await this.fetchDashboardStats();
        return true;
      }
    } catch (err) {
      console.error('Error replenishing products:', err);
    }
    return false;
  },

  async fetchClients() {
    try {
      const res = await fetch(`${API_BASE}/clients`, { headers: this.getHeaders() });
      if (res.ok) {
        this.clients = await res.json();
      }

      const citiesRes = await fetch(`${API_BASE}/clients/cities`, { headers: this.getHeaders() });
      if (citiesRes.ok) {
        this.cities = await citiesRes.json();
      }
    } catch (err) {
      console.error('Error fetching clients:', err);
    }
  },

  async addClient(client: Omit<Client, 'id' | 'name'>) {
    try {
      const res = await fetch(`${API_BASE}/clients`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(client)
      });
      if (res.ok) {
        await this.fetchClients();
        await this.fetchDashboardStats();
        return true;
      }
    } catch (err) {
      console.error('Error adding client:', err);
    }
    return false;
  },

  async updateClient(id: number, client: Omit<Client, 'id' | 'name'>) {
    try {
      const res = await fetch(`${API_BASE}/clients/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(client)
      });
      if (res.ok) {
        await this.fetchClients();
        return true;
      }
    } catch (err) {
      console.error('Error updating client:', err);
    }
    return false;
  },

  async fetchSales() {
    try {
      const res = await fetch(`${API_BASE}/sales`, { headers: this.getHeaders() });
      if (res.ok) {
        this.sales = await res.json();
      }

      const methodsRes = await fetch(`${API_BASE}/sales/payment-methods`, { headers: this.getHeaders() });
      if (methodsRes.ok) {
        this.paymentMethods = await methodsRes.json();
      }
    } catch (err) {
      console.error('Error fetching sales:', err);
    }
  },

  async addSale(saleData: any) {
    try {
      const res = await fetch(`${API_BASE}/sales`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(saleData)
      });
      if (res.ok) {
        await this.fetchSales();
        await this.fetchDashboardStats();
        this.clearCart();
        return true;
      }
    } catch (err) {
      console.error('Error adding sale:', err);
    }
    return false;
  },

  async fetchEmployees() {
    try {
      const res = await fetch(`${API_BASE}/employees`, { headers: this.getHeaders() });
      if (res.ok) {
        this.employees = await res.json();
      }
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  },

  async addEmployee(emp: any) {
    try {
      const res = await fetch(`${API_BASE}/employees`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(emp)
      });
      if (res.ok) {
        await this.fetchEmployees();
        return true;
      }
    } catch (err) {
      console.error('Error creating employee:', err);
    }
    return false;
  },

  async updateEmployee(id: number, emp: any) {
    try {
      const res = await fetch(`${API_BASE}/employees/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(emp)
      });
      if (res.ok) {
        await this.fetchEmployees();
        return true;
      }
    } catch (err) {
      console.error('Error updating employee:', err);
    }
    return false;
  },

  async fetchAuditLogs() {
    try {
      const res = await fetch(`${API_BASE}/audit`, { headers: this.getHeaders() });
      if (res.ok) {
        this.auditLogs = await res.json();
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    }
  },

  // Cart operations
  addToCart(product: Product) {
    const existing = this.cart.find((item) => item.product.id === product.id);
    if (existing) {
      if (existing.quantity < product.stock) {
        existing.quantity++;
      }
    } else {
      if (product.stock > 0) {
        this.cart.push({ product, quantity: 1, discount: 0 });
      }
    }
  },

  updateCartQty(productId: number, qty: number) {
    const item = this.cart.find((item) => item.product.id === productId);
    if (item) {
      if (qty <= 0) {
        this.cart = this.cart.filter((i) => i.product.id !== productId);
      } else if (qty <= item.product.stock) {
        item.quantity = qty;
      }
    }
  },

  updateCartDiscount(productId: number, discountPercent: number) {
    const item = this.cart.find((item) => item.product.id === productId);
    if (item) {
      item.discount = Math.max(0, Math.min(100, discountPercent));
    }
  },

  removeFromCart(productId: number) {
    this.cart = this.cart.filter((item) => item.product.id !== productId);
  },

  clearCart() {
    this.cart = [];
  }
});
