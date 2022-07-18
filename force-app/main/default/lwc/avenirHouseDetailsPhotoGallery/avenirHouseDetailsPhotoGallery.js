import { LightningElement, api } from 'lwc';

const IMGURL = '/sfc/servlet.shepherd/version/download/';

export default class AvenirHouseDetailsPhotoGallery extends LightningElement {
    @api photoItem;
    @api photoList;
    showModal = false;

    galleryModal() {
        this.showModal = true;
    }

    test() {
        // this.photoList.forEach(element => {
        //     const obj = this.photoList.find(this.photoList => element.Id == this.photoList.Id)
        // })
        const obj = this.photoList.find(element => this.photoItem.Id == element.Id)
        console.log(obj);

    }

    get imgUrl() {
        if (this.photoItem) {
            return IMGURL + this.photoItem.Id;
        }
        return null;
    }

    get listOfPhoto() {
        if (this.photoList) {
            return this.photoList;
        }
        return [];
    }
}