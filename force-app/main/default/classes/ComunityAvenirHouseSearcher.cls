public with sharing class ComunityAvenirHouseSearcher {
    public ComunityAvenirHouseSearcher() {

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
    public static Map<String, PricebookEntry> getStandardPriceList(){
        List<PricebookEntry> listOfPrice = [SELECT Id, Name, Pricebook2Id, Product2Id, UnitPrice, IsActive, ProductCode, Pricebook2.IsStandard 
        FROM PricebookEntry WHERE IsActive = true AND Pricebook2.IsStandard = true];
        Map<String, PricebookEntry> mapOfStandardPrice = new  Map<String, PricebookEntry>();

        for(PricebookEntry item: listOfPrice){
            mapOfStandardPrice.put(item.Product2Id, item);
        }
        return mapOfStandardPrice;
    }

    @AuraEnabled(cacheable=true)
    public static List<PricebookEntry> getDiscountPriceList(){
        List<PricebookEntry> listOfPrice = [SELECT Id, Name, Pricebook2Id, Product2Id, UnitPrice, IsActive, ProductCode, Pricebook2.IsStandard 
        FROM PricebookEntry WHERE IsActive = true AND Pricebook2.IsStandard = false];
        return listOfPrice;
    }

    @AuraEnabled(cacheable=true)
    public static List<productWithPriceWrapper> startSearch(String houseName){
        List<Product2> allHouseList = searchHomeByName(houseName);

        Map<String, PricebookEntry> mapOfPrice = getStandardPriceList();
        List<PricebookEntry> listOfDiscount = getDiscountPriceList();        
        List<productWithPriceWrapper> listProductWithPrice = new List<productWithPriceWrapper>();

        for(Product2 item : allHouseList) {
            List<PricebookEntry> listOfDiscountPrice = new List<PricebookEntry>();
            
            for(PricebookEntry element : listOfDiscount){
                if(element.Product2Id == item.Id){
                    listOfDiscountPrice.add(element);
                }
            }
            productWithPriceWrapper productWithPrice = new productWithPriceWrapper(item, mapOfPrice.get(item.Id), listOfDiscountPrice);
            listProductWithPrice.add(productWithPrice);
        } 

        return listProductWithPrice;
    }

    public class productWithPriceWrapper{
        @AuraEnabled
        public Product2 product;
        @AuraEnabled
        public PricebookEntry productStandardPrice;
        @AuraEnabled
        public  List<PricebookEntry> productDiscountPrice;

        public productWithPriceWrapper(Product2 item, PricebookEntry standardPrice,  List<PricebookEntry> discountPrice ){
            this.product = item;
            this.productStandardPrice = standardPrice;
            this.productDiscountPrice = discountPrice;
        }

    }
}
