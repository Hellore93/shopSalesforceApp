import { LightningElement } from 'lwc';

export default class AvenirHouseDetailsCommentary extends LightningElement {

    commentValue;
    starRating;

    saveComment() {
        const textarea = this.template.querySelector('lightning-textarea');
        this.commentValue = textarea.value;
        console.log(this.commentValue);
        console.log(this.starRating);
    }

    onStarRatingClick(event) {
        this.starRating = event.detail.rating;
    }

}