import { LightningElement, wire, api } from 'lwc';
import { CurrentPageReference } from 'lightning/navigation';
import getProductPhotoGallery from '@salesforce/apex/ComunityAvenirHouseSearcher.getProductPhotoGallery';
import getProductDescription from '@salesforce/apex/ComunityAvenirHouseSearcher.getProductDescription';

const IMGURL = '/sfc/servlet.shepherd/version/download/';

export default class AvenirHouseDetails extends LightningElement {
    @wire(CurrentPageReference) pageRef;
    clickedObjectDeailsResult
    clickedObjectDeails;
    discountPrice;
    photoGallery;
    objectToSend;
    mapMarkers;

    connectedCallback() {
        let prodId = this.pageRef.attributes.recordId;
        getProductDescription({ houseId: prodId }).then(
            (result) => { this.clickedObjectDeails = result[0] }
        ).catch((error) => { console.log(error); });
        console.log(JSON.stringify(this.clickedObjectDeails));
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
                    title: 'The Landmark Building',
                    description: 'Historic <b>11-story</b> building completed in <i>1916</i>',
                }, ];
            }
        ).catch((error) => { console.log(error); });
    };

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
            const id = this.houseObject.product.DisplayUrl;
            return IMGURL + id.slice(id.length - 18);
        }
        return null;
    }
}