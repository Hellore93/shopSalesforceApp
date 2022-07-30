public with sharing class ComunityAvenirHouseCache extends ProductWithPriceWrapper {

    @AuraEnabled(cacheable=true)
    public static List<productWithPriceWrapper> getCache(){
        List<productWithPriceWrapper> wrapperProductList = (List<productWithPriceWrapper> ) Cache.Session.get('HouseCart');
        System.debug(wrapperProductList);
        return wrapperProductList;
    }

    @AuraEnabled(cacheable=true)
    public static List<productWithPriceWrapper> addToCache(Product2 product, PricebookEntry standardPrice,  List<PricebookEntry> discountPrice){
        ProductWithPriceWrapper productToCart = new ProductWithPriceWrapper(product, standardPrice, discountPrice);

        List<productWithPriceWrapper> wrapperProductList = (List<productWithPriceWrapper> ) Cache.Session.get('HouseCart');
        if(wrapperProductList == null){
            wrapperProductList = new List<productWithPriceWrapper>();
            wrapperProductList.add(productToCart);
            Cache.Session.put('HouseCart', wrapperProductList);
        } else {
            wrapperProductList.add(productToCart);
            Cache.Session.put('HouseCart', wrapperProductList);
        }
        return wrapperProductList;
    }

    @AuraEnabled(cacheable=true)
    public static void clearShoppingCart(){
       List<productWithPriceWrapper> wrapperProductList = (List<productWithPriceWrapper> ) Cache.Session.get('HouseCart');
        wrapperProductList = new  List<productWithPriceWrapper>();
        Cache.Session.put('CacheCurrency', wrapperProductList);
    }

    @AuraEnabled
    public static List<productWithPriceWrapper> removeFromCache(String productId){
        List<productWithPriceWrapper> wrapperProductList = (List<productWithPriceWrapper> ) Cache.Session.get('HouseCart');
            for (Integer i = 0; i < wrapperProductList.size(); i++) {
                if(wrapperProductList[i].product.Id == productId){
                    wrapperProductList.remove(i); 
                }
            }
            Cache.Session.put('HouseCart', wrapperProductList);
        return wrapperProductList;
    }

}
