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

    connectedCallback() {
        let prodId = this.pageRef.attributes.recordId;
        getProductDescription({ houseId: prodId }).then(
            (result) => { this.clickedObjectDeails = result[0] }
        ).catch((error) => { console.log(error); });
        this.photoGalleryFunction();
    }

    photoGalleryFunction() {
        getProductPhotoGallery({ productId: this.pageRef.attributes.recordId }).then(
            (result) => { this.photoGallery = result, this.objectToSend = JSON.stringify(result) }
        ).catch((error) => { console.log(error); });
    };


    test() {
        // this.objectToSend = JSON.stringify(this.photoGallery);
        console.log(this.objectToSend);
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
            const id = this.houseObject.product.DisplayUrl;
            return IMGURL + id.slice(id.length - 18);
        }
        return null;
    }
}