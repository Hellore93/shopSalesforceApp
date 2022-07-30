public with sharing class ComunityAvenirHouseOrder extends ProductWithPriceWrapper{
    public ComunityAvenirHouseOrder() {}

    @AuraEnabled(cacheable=true)
    public static Account searchAccount(){
        Account accountItem = [SELECT Id, Name, Type, First_Name__c, OwnerId FROM Account 
        where Name ='Community Account'];
        return accountItem;
    }

    @AuraEnabled(cacheable=true)
    public static List<OrderItem> orderItemList(String OrderId){
        List<OrderItem> itemList = [SELECT IsDeleted, UnitPrice, TotalPrice, ListPrice, 
        ServiceDate, EndDate, SystemModstamp, LastModifiedDate, CreatedDate, Id, Product2Id, 
        PricebookEntryId, OrderId, LastModifiedById, CreatedById, OrderItemNumber, Description, 
        Product2.Name, Product2.Country__c, Product2.DisplayUrl FROM OrderItem where OrderId =:OrderId];
        return itemList;
    }

    @AuraEnabled(cacheable=true)
    public static List<OrderItem> orderItemListProduct(String ProductId){
        List<OrderItem> itemList = [SELECT IsDeleted, UnitPrice, TotalPrice, ListPrice, 
        ServiceDate, EndDate, SystemModstamp, LastModifiedDate, CreatedDate, Id, Product2Id, 
        PricebookEntryId, OrderId, LastModifiedById, CreatedById, OrderItemNumber, Description, 
        Product2.Name, Product2.Country__c, Product2.DisplayUrl FROM OrderItem where Product2Id =:ProductId];
        return itemList;
    }

    @AuraEnabled
    public static String getOrder(String userId){
        List<Order> itemList = [SELECT Id, OwnerId, ContractId, AccountId, Pricebook2Id, 
        EffectiveDate, EndDate, IsReductionOrder, Status, Description,StatusCode, OrderNumber, 
        TotalAmount, CreatedDate, CreatedById, LastModifiedDate, LastModifiedById, IsDeleted,
        SystemModstamp, LastViewedDate, LastReferencedDate FROM Order where OwnerId =:userId
        ORDER BY OrderNumber ASC];
        return JSON.serialize(itemList);
    }

    @AuraEnabled
    public static Order createOrder(List<OrderWrapper> orderObject){

        Account acc = searchAccount();
        System.debug(acc);
        Order newOrder = new Order(
            AccountId = acc.Id,
            Status = 'Draft',
            EffectiveDate = orderObject[0].startDate,
            Pricebook2Id = orderObject[0].prod.productStandardPrice.Pricebook2Id
        );
        try {
             insert newOrder;
        } catch (DmlException e) {
         System.debug(e);   
        }finally {
            addOrderItem(newOrder.Id, orderObject);
        }

        return newOrder;
    }

    @AuraEnabled
    public static void addOrderItem(String orderId, List<OrderWrapper> orderObject){

        List<OrderItem> orderItems = new List<OrderItem>();

        for (OrderWrapper item: orderObject){
            OrderItem orderItem = new OrderItem();
            System.debug(item.prod.productStandardPrice.Id);
            
            orderItem.Product2Id = item.prod.product.Id;
            orderItem.OrderId = orderId;
            orderItem.Quantity = 1;
            orderItem.UnitPrice = item.cost;
            orderItem.PricebookEntryId = item.prod.productStandardPrice.Id;
            orderItem.ServiceDate = item.startDate;
            orderItem.endDate = item.endDate;

            orderItems.add(orderItem);
        }
        insert orderItems;
    }

    public class OrderWrapper{

        @AuraEnabled
        public productWithPriceWrapper prod {get; set;}
        @AuraEnabled
        public Date startDate {get; set;}
        @AuraEnabled
        public Date endDate {get; set;}
        @AuraEnabled
        public Integer cost {get; set;}
    }
}