const navData = [
  {
    name: "Master Files",
    alias: "master-files",
    rule: "browse_ItemMaster",
    screens: [
      {
        name: "Vendors . Supplier",
        alias: "vendors",
        rule: "browse_vendors",
      },
      {
        name: "Item Management",
        alias: "item-management",
        rule: "browse_ItemMaster",
        screens: [
          {
            name: "Items and Services",
            alias: "item-services",
            rule: "browse_ItemMaster",
          },
          {
            name: "Item Master By Location",
            alias: "item-locations",
            rule: "browse_ItemMaster",
          },
        ],
      },
    ],
  },
  {
    name: "Transaction",
    alias: "transactions",
    rule: "browse_purchaseRequestMaster",
    screens: [
      {
        name: "Audit",
        alias: "audit",
        rule: "browse_audits",
      },
      {
        name: "Procurements",
        alias: "procurements",
        rule: "browse_purchaseRequestMaster",
        screens: [
          {
            name: "Purchase request",
            alias: "purchase-request",
            rule: "browse_purchaseRequestMaster",
          },
          {
            name: "Request for quotation",
            alias: "request-quotation",
            rule: "browse_purchaseRequestMaster",
          },
          {
            name: "Canvas",
            alias: "canvas",
            rule: "browse_canvasMaster",
          },
          {
            name: "Purchase order",
            alias: "purchase-order",
            rule: "browse_purchaseOrderMaster",
          },
        ],
      },
      {
        name: "Inventory Mngt",
        alias: "inventory-mngt",
        rule: "browse_RRMaster",
        screens: [
          {
            name: "Deliveries",
            alias: "deliveries",
            rule: "browse_RRMaster",
          },
          {
            name: "Stock transfers",
            alias: "stock-transfers",
            rule: "browse_purchaseRequestMaster",
          },
          {
            name: "Stock requisitions",
            alias: "stock-requisition",
            rule: "browse_purchaseRequestMaster",
          },
          {
            name: "Purchase returns",
            alias: "purchase-return",
            rule: "browse_purchaseRequestMaster",
          },
          {
            name: "Stock issuances",
            alias: "stock-issuance",
            rule: "browse_purchaseRequestMaster",
          },
        ],
      },
    ],
  },
  {
    name: "Tools",
    icon: "mdi-cog",
    alias: "tools",
    rule: "browse_purchaseRequestMaster",
    screens: [
      {
        name: "Import data",
        alias: "import-data",
        icon: "mdi-note-multiple",
        rule: "browse_purchaseRequestMaster",
        screens: [
          {
            name: "Import vendors",
            alias: "import-vendors",
            rule: "browse_purchaseRequestMaster",
          },
          {
            name: "Purchase orders",
            alias: "purchase-orders",
            rule: "browse_purchaseRequestMaster",
          },
        ],
      },
      {
        name: "Audit trails",
        alias: "audit-trails",
        rule: "browse_purchaseRequestMaster",
      },
      {
        name: "Setup options",
        alias: "setup-options",
        rule: "browse_RRMaster",
      },
    ],
  },
  {
    name: "Report",
    alias: "manage-supplier",
    rule: "browse_purchaseRequestMaster",
  },
];
