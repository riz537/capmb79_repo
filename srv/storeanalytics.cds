using {b79capm.db as b79db} from '../db/schema';

service MyStoreAnalyticsService {

    //Store wise sales
    entity StoreWiseSales   as
        select from b79db.Orders {
            key storeName,
                cast(
                    sum(netPrice) as Decimal(9, 2)
                ) as totalSales
        }
        group by
            storeName;

    // product wise sales
    entity ProductWiseSales as
        select from b79db.OrderItems {
            key product.ID   as productID,
                product.name as productName,
                cast(
                    sum(totalPrice) as Decimal(9, 2)
                )            as totalSales,
        }
        group by
            product.ID ,product.name;

    entity LowStockAlert    as
        select from b79db.Products {
            key ID,
                name,
                stock
        }
        where
            stock < 15;

    entity Top3Orders       as
        select from b79db.Orders {
            key ID,
                netPrice,
                customerName,
                storeName
        }
        order by
            netPrice desc
        limit 3;

}
