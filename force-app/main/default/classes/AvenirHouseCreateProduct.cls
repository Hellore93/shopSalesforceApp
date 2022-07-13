public with sharing class AvenirHouseCreateProduct {
    public AvenirHouseCreateProduct() {

    }

    @AuraEnabled
    public static void saveProductPrice(String productId, Decimal productPrice){

        PricebookEntry newProductEntery = new PricebookEntry();
        newProductEntery.Product2Id = productId;
        newProductEntery.UnitPrice = (Decimal) productPrice;
        newProductEntery.Pricebook2Id = '01s7Q00000A6q1sQAB';
        newProductEntery.IsActive = true;

        insert newProductEntery;
    }

    @AuraEnabled
    public static void saveProductMainPhoto(String productId, String photoLink){

        Product2 existProduct = new Product2();
        existProduct.Id = productId;
        existProduct.DisplayUrl = photoLink;

        update existProduct;
    }
}
