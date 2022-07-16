import { LightningElement, api } from 'lwc';
const IMGURL = '/sfc/servlet.shepherd/version/download/'

export default class AvenirHouseSearcherResultsSingleObject extends LightningElement {

    @api singleHouseObject;
    discountPrice;
    priceClass = 'priceText';

    get result() {
        // console.log(this.singleHouseObject);
        if (this.singleHouseObject) {
            this.isDiscountExist();
            return this.singleHouseObject.product;
        }
        return null;
    };

    get price() {
        if (this.singleHouseObject) {
            return this.singleHouseObject;
        }
        return null;
    };

    get imgUrl() {
        if (this.result.Id) {
            const id = this.result.DisplayUrl;
            return IMGURL + id.slice(id.length - 18);
        }
    };

    isDiscountExist() {
        if (this.price.productDiscountPrice[0]) {
            this.discountPrice = this.price.productDiscountPrice[0].UnitPrice;
            this.priceClass = 'oldPrice';
        }
    }

}