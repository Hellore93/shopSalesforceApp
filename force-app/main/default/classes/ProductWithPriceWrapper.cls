
    public virtual class ProductWithPriceWrapper {
        public ProductWithPriceWrapper(){}
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

