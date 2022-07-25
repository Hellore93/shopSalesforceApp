import { LightningElement, api } from 'lwc';
import removeFromCache from '@salesforce/apex/ComunityAvenirHouseCache.removeFromCache';
const IMGURL = '/sfc/servlet.shepherd/version/download/';

export default class AvenirHouseShoppingCartSingleItem extends LightningElement {

    @api singleCacheProduct;
    price;
    quantityValue = 1;
    day = 1;
    costRent;
    startDate;
    endDate;

    connectedCallback() {
        if (this.singleCacheProduct.productDiscountPrice[0]) {
            const arrayOfPrice = []
            this.singleCacheProduct.productDiscountPrice.forEach(element => arrayOfPrice.push(element.UnitPrice));
            this.price = Math.min(...arrayOfPrice);
        } else {
            this.price = this.singleCacheProduct.productStandardPrice.UnitPrice;
        }
        this.costRent = this.price;
        this.changePriceEvent();
    }

    getStartDate(event) {
        this.startDate = new Date(event.target.value);
        this.rentCost();
    }

    getEndDate(event) {
        this.endDate = new Date(event.target.value);
        this.rentCost();
    }

    deleteFromCache(event) {
        const custEvent = new CustomEvent('callpasstoparent', {
            detail: this.singleCacheProduct.product.Id
        });
        this.dispatchEvent(custEvent);
    }

    rentCost() {
        if (this.startDate && this.endDate) {
            this.day = 1 + (this.endDate - this.startDate) / (1000 * 3600 * 24);
            this.costRent = this.day * this.price;
            this.changePriceEvent();

        }
    }

    @api
    getPrice() {
        return this.costRent;
    }

    changePriceEvent() {
        const custEvent = new CustomEvent('changeprice', {
            detail: 'changePrice'
        });
        this.dispatchEvent(custEvent);
    }

    get singleProduct() {
        if (this.singleCacheProduct) {
            const price = [this.price, this.singleCacheProduct.productStandardPrice.UnitPrice]
            this.price = Math.min(...price);
            return this.singleCacheProduct.product;
        }
        return null;
    }
}