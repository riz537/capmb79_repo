sap.ui.define([
    "sap/ui/core/mvc/Controller"
], (Controller) => {
    "use strict";

    return Controller.extend("com.demo.storeanalytics.controller.View1", {
        onInit() {
            var StorewiseSalesChart = this.byId("StorewiseSales");
            StorewiseSalesChart.setVizProperties({
                plotArea: {
                    dataLabel: {
                        visible: true,
                        type: "value"
                    }
                },
                title: {
                    visible: true,
                    text: "Store Wise Sales"
                },
            });
             var ProductwiseSalesChart = this.byId("ProductwiseSales");
            ProductwiseSalesChart.setVizProperties({
                plotArea: {
                    dataLabel: {
                        visible: true,
                        type: "value"
                    }
                },
                title: {
                    visible: true,
                    text: "Product Wise Sales"
                },
            });
             var LowStockAlert = this.byId("LowStockAlert");
            LowStockAlert.setVizProperties({
                plotArea: {
                    dataLabel: {
                        visible: true,
                        type: "value"
                    }
                },
                title: {
                    visible: true,
                    text: "Low Stock Alert"
                },
            });
              var Top3Orders = this.byId("Top3Orders");
            Top3Orders.setVizProperties({
                plotArea: {
                    dataLabel: {
                        visible: true,
                        type: "value"
                    }
                },
                title: {
                    visible: true,
                    text: "Top 3 Orders"
                },
            });
        }
    });
});