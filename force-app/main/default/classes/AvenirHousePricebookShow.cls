public with sharing class AvenirHousePricebookShow {
    public AvenirHousePricebookShow() {}

    // public class PricebookWrapper{
    //     @AuraEnabled
    //     public String pricebookId;
    //     @AuraEnabled
    //     public String pricebookName;
    //     @AuraEnabled
    //     public String pricebookDescription;
    // }

    @AuraEnabled
    public static List<Pricebook2> getAllPricebook(){
        List<Pricebook2> allPricebook = [SELECT Id, Name, Description, IsActive FROM Pricebook2 LIMIT 200];
        return allPricebook;
    }

    @AuraEnabled
    public static List<PricebookEntry> getPricebookDiscountById(String pricebookId){
        List<PricebookEntry> pricebookDiscountProductList = [SELECT Id, Name, Pricebook2Id, Product2Id, UnitPrice, IsActive FROM PricebookEntry WHERE Pricebook2Id = :pricebookId LIMIT 200];
        return pricebookDiscountProductList;
    }

    @AuraEnabled
    public static void deletePricebook(Pricebook2 pricebook){
        delete pricebook;        
    }

    @AuraEnabled
    public static void updatePricebookEntry(List<PricebookEntry> priceUpdate){
        update priceUpdate;
    }
}