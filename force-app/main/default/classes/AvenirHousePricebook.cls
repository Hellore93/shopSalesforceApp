public with sharing class AvenirHousePricebook {
    public AvenirHousePricebook() {

    }

    @AuraEnabled
    public static List<PricebookEntry> getProductAndPrice(){
        List<PricebookEntry> price = [SELECT Id, Name, Product2Id, UnitPrice FROM PricebookEntry WHERE IsActive = true AND Pricebook2Id = '01s7Q00000A6q1sQAB' LIMIT 200];
        return price;
    }

    @AuraEnabled
    public static List<PricebookEntry> getProductByName(String houseName) {
        String houseNameSearch = '%' + houseName + '%';
        List<PricebookEntry> productList =
        [SELECT Id, Name, Product2Id, UnitPrice FROM PricebookEntry WHERE IsActive = true AND Name LIKE :houseNameSearch LIMIT 200];
        return productList;
    }
}