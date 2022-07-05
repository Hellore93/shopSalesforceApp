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
        List<ContentVersion> productPhoto = 
        [SELECT FirstPublishLocationId, FileType, ContentBodyId, Title, 	
        ContentDocumentId FROM ContentVersion WHERE FirstPublishLocationId = :productId LIMIT 100];
        return productPhoto;
    }

    @AuraEnabled
    public static ContentDocument deletePhotoById(String photoId){
        System.debug(photoId);
        ContentDocument contentToDelete = [SELECT Id, Title FROM ContentDocument WHERE Id = :photoId];
        delete contentToDelete;
        return contentToDelete;
    }

}
