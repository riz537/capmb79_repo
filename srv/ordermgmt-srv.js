const cds = require('@sap/cds');
const { data } = require('@sap/cds/lib/dbs/cds-deploy');
const { SELECT, UPDATE } = require('@sap/cds/lib/ql/cds-ql');
const { results } = require('@sap/cds/lib/utils/cds-utils');
module.exports = class OrderMgmtService extends cds.ApplicationService {
    init() {

        const { Orders,OrderItems, Products } = cds.entities('OrderMgmtService');
       
        // handler to fill the store name automatically based on logged in user 
        this.before('CREATE',Orders.drafts,async req=>{
            req.data.storeName = req.user.attr.storeName[0];
        });
        
        
        this.after("PATCH",OrderItems.drafts,async(data,req)=>{
            const {ID} = data;
            const draftItem = await SELECT.one.from(OrderItems.drafts).where({ID:ID});
            
            if(draftItem){
                var totalPrice = (draftItem.quantity || 0) *  (draftItem.unitPrice||0);
                if(draftItem.discount>0){
                    totalPrice = totalPrice - (totalPrice*draftItem.discount/100);
                }
                // update the total price to the draft item back to orderitems draft table
                await UPDATE(OrderItems.drafts).set({totalPrice:totalPrice}).where({ID:ID});

                //now get all the items of this order and calculate the netprice
                const allDraftItems = await SELECT.from(OrderItems.drafts).where({order_ID:draftItem.order_ID});
                var netPrice = 0;
                for(var i=0;i<allDraftItems.length;i++){
                  netPrice = netPrice + Number(allDraftItems[i].totalPrice);                
                }
                //Update this netPrice back to ORders table

                await UPDATE(Orders.drafts).set({netPrice:netPrice}).where({ID:draftItem.order_ID});
            }

        });
        this.after("DELETE",OrderItems.drafts,async(results,req)=>{
               const order_ID = req.data.order_ID;
                const allDraftItems = await SELECT.from(OrderItems.drafts).where({order_ID:order_ID});
                var netPrice = 0;
                for(var i=0;i<allDraftItems.length;i++){
                  netPrice = netPrice + Number(allDraftItems[i].totalPrice);                
                }
                //Update this netPrice back to ORders table

                await UPDATE(Orders.drafts).set({netPrice:netPrice}).where({ID:order_ID});
        });
        this.before(["CREATE","UPDATE"],Orders, async(req)=>{
           const items = req.data.items || [];
           if(items.length === 0){
               req.error("Order can not be created without items");
           }else{
              for(const item of items){
                 // in each item take product ID , read product data from products table
                 const productID = item.product_ID;
                 const product = await SELECT.one.from(Products).where({ID:productID });
                 const currentStock = product.stock;
                 const orderQty = item.quantity;
                 if(currentStock<orderQty){
                     req.error("Insuffient Stock for the product: "+productID);
                 }else{
                    await UPDATE(Products).set({stock:currentStock - orderQty }).where({ID:productID});
                 }

              }
           }

        });

        return super.init()
    }
}