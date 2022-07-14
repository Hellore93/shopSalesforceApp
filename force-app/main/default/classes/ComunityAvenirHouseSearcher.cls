public with sharing class ComunityAvenirHouseSearcher {
    public ComunityAvenirHouseSearcher() {

    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> searchHome(){
        List<Product2> listOfProduct = [SELECT Id, Name, ProductCode, Description, IsActive, Family, DisplayUrl, Avenir__c FROM Product2 
        WHERE Avenir__c = true];
        return listOfProduct;
    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> searchHomeByName(String houseName){
        String nameFromSearcher = '%' + houseName + '%';
        List<Product2> listOfProduct = [SELECT Id, Name, ProductCode, Description, IsActive, Family, DisplayUrl, Avenir__c FROM Product2 
        WHERE (Name LIKE :nameFromSearcher OR Description LIKE :nameFromSearcher OR Family LIKE :nameFromSearcher OR ProductCode LIKE :nameFromSearcher) 
        AND Avenir__c = true];
        return listOfProduct;
    }



    @AuraEnabled(cacheable=true)
    public static List<Product2> startSearch(){

        List<Product2> allHouseList = searchHome();
        return allHouseList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Product2> startSearchByName(String houseName){

        List<Product2> houseList = searchHomeByName(houseName);
        return houseList;
    }
}
