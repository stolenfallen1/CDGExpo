// Master Files
import VendorsSupplier from '../navigation/MasterFiles/VendorsSupplier';
// Items Management
import ItemsMaster from '../navigation/MasterFiles/ItemManagement/ItemsMaster'
import ItemsServices from '../navigation/MasterFiles/ItemManagement/ItemsServices'
// Tools
import AuditTrails from "../navigation/Tools/AuditTrails"
import SetupOptions from "../navigation/Tools/SetupOptions"
// Import Data
import ImportVendor from "../navigation/Tools/ImportData/ImportVendor"
import PurchaseOrders from "../navigation/Tools/ImportData/PurchaseOrders"
// Transactions
import Audit from "../navigation/Transaction/Audit"
// Inventory Management
import Deliveries from "../navigation/Transaction/InventoryManagement/Deliveries"
import PurchaseReturns from "../navigation/Transaction/InventoryManagement/PurchaseReturns"
import StockIssue from "../navigation/Transaction/InventoryManagement/StockIssue"
import StockRequisitions from "../navigation/Transaction/InventoryManagement/StockRequisitions"
import StockTransfers from "../navigation/Transaction/InventoryManagement/StockTransfers"
// Procurement
import Canvas from "../navigation/Transaction/Procurements/Canvas"
import PurchaseOrder from "../navigation/Transaction/Procurements/PurchaseOrder"
import PurchaseRequest from "../navigation/Transaction/Procurements/PurchaseRequest"
import RequestQuatation from "../navigation/Transaction/Procurements/RequestQuatation"


export const routes = [
  {
    name: 'Master Files',
    screens: [
      {
        name: 'Vendor/Supplier',
        component: VendorsSupplier,
        iconName: 'person',
        iconColor: '#2596be',
      },
      {
        name: 'Item Management',
        screens: [
          {
            name: 'Items Master',
            component: ItemsMaster,
            iconName: 'cube',
            iconColor: '#2596be',
          },
          {
            name: 'Items Services',
            component: ItemsServices,
            iconName: 'settings-outline', 
            iconColor: '#2596be',
          },
        ],
      },
    ],
  },
  {
    name: 'Tools',
    screens: [
      {
        name: 'Audit Trails',
        component: AuditTrails,
        iconName: 'document-text',
        iconColor: '#2596be',
      },
      {
        name: 'Setup Options',
        component: SetupOptions,
        iconName: 'options',
        iconColor: '#2596be',
      },
      {
        name: 'Import Data',
        screens: [
          {
            name: 'Import Vendor',
            component: ImportVendor,
            iconName: 'person-add',
            iconColor: '#2596be',
          },
          {
            name: 'Purchase Order',
            component: PurchaseOrders,
            iconName: 'cart',
            iconColor: '#2596be',
          },
        ],
      },
    ],
  },
  {
    name: 'Transaction',
    screens: [
      {
        name: 'Audit',
        component: Audit,
        iconName: 'document-text',
        iconColor: '#2596be',
      },
      {
        name: 'Inventory Management',
        screens: [
          {
            name: 'Deliveries',
            component: Deliveries,
            iconName: 'md-car', 
            iconColor: '#2596be',
          },
          {
            name: 'Purchase Returns',
            component: PurchaseReturns,
            iconName: 'arrow-undo',
            iconColor: '#2596be',
          },
          {
            name: 'Stock Issue',
            component: StockIssue,
            iconName: 'cube-outline',
            iconColor: '#2596be',
          },
          {
            name: 'Stock Requisitions',
            component: StockRequisitions,
            iconName: 'clipboard',
            iconColor: '#2596be',
          },
          {
            name: 'Stock Transfer',
            component: StockTransfers,
            iconName: 'swap-horizontal',
            iconColor: '#2596be',
          },
        ],
      },
      {
        name: 'Procurement',
        screens: [
          {
            name: 'Canvas',
            component: Canvas,
            iconName: 'documents',
            iconColor: '#2596be',
          },
          {
            name: 'Purchase Order',
            component: PurchaseOrder,
            iconName: 'cart',
            iconColor: '#2596be',
          },
          {
            name: 'Purchase Request',
            component: PurchaseRequest,
            iconName: 'clipboard-outline', 
            iconColor: '#2596be',
          },
          {
            name: 'Request Quotation',
            component: RequestQuatation,
            iconName: 'document-attach',
            iconColor: '#2596be',
          },
        ],
      },
    ],
  },
];