// Master Files
import VendorSupplier from '../navigation/MasterFiles/VendorsSupplier'
// Items Management
import ItemManagement from "../navigation/MasterFiles/ItemManagement"
import ItemsMaster from '../navigation/MasterFiles/ItemManagement/ItemsMaster'
import ItemsServices from '../navigation/MasterFiles/ItemManagement/ItemsServices'
// Tools
import AuditTrails from "../navigation/Tools/AuditTrails"
import SetupOptions from "../navigation/Tools/SetupOptions"
// Import Data
import ImportData from "../navigation/Tools/ImportData"
import ImportVendor from "../navigation/Tools/ImportData/ImportVendor"
import PurchaseOrders from "../navigation/Tools/ImportData/PurchaseOrders"
// Transactions
import Audit from "../navigation/Transaction/Audit"
// Inventory Management
import InventoryManagement from "../navigation/Transaction/InventoryMangement"
import Deliveries from "../navigation/Transaction/InventoryManagement/Deliveries"
import PurchaseReturns from "../navigation/Transaction/InventoryManagement/PurchaseReturns"
import StockIssue from "../navigation/Transaction/InventoryManagement/StockIssue"
import StockRequisitions from "../navigation/Transaction/InventoryManagement/StockRequisitions"
import StockTransfers from "../navigation/Transaction/InventoryManagement/StockTransfers"
// Procurement
import Procurement from "../navigation/Transaction/Procurements"
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
        component: VendorSupplier,
      },
      {
        name: 'Item Management',
        component: ItemManagement, // wala pa
        screens: [
          {
            name: 'Items Master',
            component: ItemsMaster,
          },
          {
            name: 'Items Services',
            component: ItemsServices,
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
      },
      {
        name: 'Setup Options',
        component: SetupOptions,
      },
      {
        name: 'Import Data',
        component: ImportData,  // wala pa
        screens: [
          {
            name: 'Import Vendor',
            component: ImportVendor,
          },
          {
            name: 'Purchase Order',
            component: PurchaseOrders,
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
      },
      {
        name: 'Inventory Management',
        component: InventoryManagement, // wala pa
        screens: [
          {
            name: 'Deliveries',
            component: Deliveries,
          },
          {
            name: 'Purchase Returns',
            component: PurchaseReturns,
          },
          {
            name: 'Stock Issue',
            component: StockIssue,
          },
          {
            name: 'Stock Requisitions',
            component: StockRequisitions,
          },
          {
            name: 'Stock Transfer',
            component: StockTransfers,
          },
        ],
      },
      {
        name: 'Procurement',
        component: Procurement, // wala pa
        screens: [
          {
            name: 'Canvas',
            component: Canvas,
          },
          {
            name: 'Purchase Order',
            component: PurchaseOrder,
          },
          {
            name: 'Purchase Request',
            component: PurchaseRequest,
          },
          {
            name: 'Request Quotation',
            component: RequestQuatation,
          },
        ],
      },
    ],
  },
];