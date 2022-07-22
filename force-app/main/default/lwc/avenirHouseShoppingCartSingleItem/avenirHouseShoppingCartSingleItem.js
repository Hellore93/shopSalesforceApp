import { LightningElement, api } from 'lwc';
import removeFromCache from '@salesforce/apex/ComunityAvenirHouseCache.removeFromCache';
const IMGURL = '/sfc/servlet.shepherd/version/download/';

export default class AvenirHouseShoppingCartSingleItem extends LightningElement {

    @api singleCacheProduct;
    price;
    quantityValue = 1;
    day = 1;
    costRent;
    // listAfterDelete;

    _startDate;
    @api
    get startDate() {
        return this._startDate;
    }

    set startDate(value) {
        this._startDate = value;
        this.rentCost();
    }

    _endDate;
    @api
    get endDate() {
        return this._endDate;
    }

    set endDate(value) {
        this._endDate = value;
        this.rentCost();
    }

    connectedCallback() {
        if (this.singleCacheProduct.productDiscountPrice[0]) {
            const arrayOfPrice = []
            this.singleCacheProduct.productDiscountPrice.forEach(element => arrayOfPrice.push(element.UnitPrice));
            this.price = Math.min(...arrayOfPrice);
        } else {
            this.price = this.singleCacheProduct.productStandardPrice.UnitPrice;
        }
        this.costRent = this.price;
    }

    deleteFromCache(event) {
        const custEvent = new CustomEvent('callpasstoparent', {
            detail: this.singleCacheProduct.product.Id
        });
        this.dispatchEvent(custEvent);
    }

    rentCost() {
        if (this._startDate && this._endDate) {
            this.day = 1 + (this._endDate - this._startDate) / (1000 * 3600 * 24);
            this.costRent = this.day * this.price;
        }
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