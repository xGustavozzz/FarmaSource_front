export type RoleType = 'Administrador' | 'Regente Farmacéutico' | 'Vendedor' | 'Cajero' | 'Auditor';

export interface Product {
  id: number;
  catId: number;
  provId: number | null;
  name: string;
  description: string | null;
  laboratory: string | null;
  presentation: string | null;
  purchasePrice: number;
  price: number;
  stock: number;
  categoryName?: string;
  providerName?: string;
}

export interface Client {
  id: number;
  ciuId: number | null;
  name: string; // full name
  firstName: string;
  lastName: string;
  cedula: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  birthDate: string | null;
  isActive: boolean;
  cityName?: string;
}

export interface SaleItem {
  id?: number;
  productId: number;
  productName?: string;
  presentation?: string;
  lineNumber: number;
  quantity: number;
  unitPrice: number;
  discount: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  clientId: number;
  employeeId: number;
  paymentMethodId: number;
  invoiceNumber: string;
  date: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: string;
  notes: string | null;
  clientName?: string;
  employeeName?: string;
  paymentMethodName?: string;
  items?: SaleItem[];
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  name: string;
  cedula: string;
  role: string;
  phone: string | null;
  email: string | null;
  salary: number;
  isActive: boolean;
}

export interface UserAccount {
  id: number;
  username: string;
  email: string;
  role: string;
  fullName: string;
  isActive: boolean;
}

export interface AuditLog {
  id: number;
  table: string;
  action: string;
  registerId: string;
  previousData: string | null;
  posteriorData: string | null;
  username: string;
  ipAddress: string;
  timestamp: string;
}
