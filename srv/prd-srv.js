const cds = require('@sap/cds');
const { INSERT, UPDATE } = require('@sap/cds/lib/ql/cds-ql');

module.exports = class ProductMgmtService extends cds.ApplicationService {
    init() {

        const { Products } = cds.entities('ProductMgmtService');

        this.on("ApplyDiscount", async req => {
            const prdId = req.params[0].ID;
            const discount = req.data.discount;
            await UPDATE(Products)
                .set({ discount: discount})
                .where({ ID: prdId });

            req.info("Discount " + discount + "% applied Successfuly");
        });

        this.on("AddStock", async req => {
            const prdId = req.params[0].ID;
            const newStock = req.data.stock;
            await UPDATE(Products)
                .set({ stock: { '+=': newStock } })
                .where({ ID: prdId });
            req.info("Stock " + newStock + " added Successfuly");
        });

        //I want to override generic handler with my custom handler 
        this.before('CREATE', Products, async req => {
            console.log("Before handler");
            console.log(req.data.discount);
            if (req.data.discount === null) {
                req.data.discount = 0;
            }
        });


        return super.init()
    }
}