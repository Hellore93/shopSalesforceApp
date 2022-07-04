public with sharing class AvenirHouseSearchSection {

        @AuraEnabled
        public static List<Product2> getProducts() {
    
        List<Product2> productList =
        [SELECT Id, Name, Family, Description, Price__c, ProductCode FROM Product2 WHERE Avenir__c = TRUE LIMIT 100];
        return productList;
        }

        @AuraEnabled
    public static List<Product2> getHouseByName(String houseName) {
        String houseNameSearch = '%' + houseName + '%';
        List<Product2> productList =
        [SELECT Id, Name, Family, Description, Price__c, ProductCode FROM Product2 WHERE Name LIKE :houseNameSearch AND Avenir__c = TRUE LIMIT 100];
        return productList;
    }

    @AuraEnabled
    public static Product2 deleteHouse(Product2 house) {
        delete house;
        return house;
    }

    @AuraEnabled
    public static List<ContentVersion> getProductPhoto(String productId){
        system.debug(productId);
        List<ContentVersion> productPhoto = 
        [SELECT FirstPublishLocationId, FileType, ContentBodyId, Title FROM ContentVersion WHERE FirstPublishLocationId = :productId LIMIT 100];
        system.debug(productPhoto);
        return productPhoto;
    }

}
