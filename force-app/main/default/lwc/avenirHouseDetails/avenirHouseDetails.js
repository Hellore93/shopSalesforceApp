import { LightningElement, wire, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getProductPhotoGallery from '@salesforce/apex/ComunityAvenirHouseSearcher.getProductPhotoGallery';
import getProductDescription from '@salesforce/apex/ComunityAvenirHouseSearcher.getProductDescription';
import addToCache from '@salesforce/apex/ComunityAvenirHouseCache.addToCache';
import pubsub from 'c/pubsub';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const IMGURL = '/sfc/servlet.shepherd/version/download/';

export default class AvenirHouseDetails extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    clickedObjectDeailsResult
    clickedObjectDeails;
    discountPrice;
    photoGallery;
    objectToSend;
    mapMarkers;
    zoomLevel = 15;

    connectedCallback() {
        let prodId = this.pageRef.attributes.recordId;
        getProductDescription({ houseId: prodId }).then(
            (result) => { this.clickedObjectDeails = result[0] }
        ).catch((error) => { console.log(error); });
        this.photoGalleryFunction();
    }

    photoGalleryFunction() {
        getProductPhotoGallery({ productId: this.pageRef.attributes.recordId }).then(
            (result) => {
                this.photoGallery = result,
                    this.objectToSend = JSON.stringify(result),
                    console.log(this.clickedObjectDeails);
                this.mapMarkers = [{
                    location: {
                        Street: this.clickedObjectDeails.product.Street__c,
                        City: this.clickedObjectDeails.product.City__c,
                        Country: this.clickedObjectDeails.product.Country__c,
                    },
                    title: '',
                    description: '',
                }, ];

            }
        ).catch((error) => { console.log(error); });
    };

    saveToCart() {
        addToCache({
            product: this.clickedObjectDeails.product,
            standardPrice: this.clickedObjectDeails.productStandardPrice,
            discountPrice: this.clickedObjectDeails.productDiscountPrice
        }).then(
            (result) => {
                pubsub.fireEvent(this.pageRef, 'cacheObject', result)
            }
        ).finally(() => {
            this.dispatchEvent(new ShowToastEvent({
                title: 'Success',
                message: 'Adding to cart success',
                variant: 'success',
                mode: 'dismissable'
            }));
        }).catch((error) => { console.log(error); });
    }

    get houseObject() {
        if (this.clickedObjectDeails) {
            if (this.clickedObjectDeails.productDiscountPrice.length != 0) {
                const arrayOfPrice = []
                this.clickedObjectDeails.productDiscountPrice.forEach(element => arrayOfPrice.push(element.UnitPrice));
                this.discountPrice = Math.min(...arrayOfPrice);
            }
            return this.clickedObjectDeails;
        }
        return null;
    };

    get imgUrl() {
        if (this.clickedObjectDeails) {
            console.log(this.clickedObjectDeails);
            const id = this.houseObject.product.DisplayUrl;
            return IMGURL + id.slice(id.length - 18);
        }
        return null;
    }
}