const cds = require('@sap/cds');


module.exports = class OrderMgmtService extends cds.ApplicationService {
    init() {

        const { Orders,OrderItems } = cds.entities('OrderMgmtService');


        this.before("CREATE",OrderItems,async req=>{
            console.log("I am inside create handler of Order Items");
        }); 
       

        return super.init()
    }
}