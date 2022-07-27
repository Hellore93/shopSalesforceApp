public with sharing class ComunityAvenirHouseOrder extends ProductWithPriceWrapper{
    public ComunityAvenirHouseOrder() {}

    @AuraEnabled(cacheable=true)
    public static Account searchAccount(){
        Account accountItem = [SELECT Id, Name, Type, First_Name__c, OwnerId FROM Account 
        where Name ='Community Account'];
        return accountItem;
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