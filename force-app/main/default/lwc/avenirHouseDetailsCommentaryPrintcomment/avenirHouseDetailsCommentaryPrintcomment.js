import { LightningElement, api } from 'lwc';
import { deleteRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class AvenirHouseDetailsCommentaryPrintcomment extends LightningElement {

    @api singleComment;

    deleteComment(event) {
        deleteRecord(this.singleComment.Id)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Record deleted',
                        variant: 'success'
                    })
                );
            }).finally(() => {
                const custEvent = new CustomEvent('eventafterdelete', {
                    detail: 'delete'
                });
                this.dispatchEvent(custEvent);
            }).catch(error => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Error deleting record',
                        message: error.body.message,
                        variant: 'error'
                    })
                );
            })
    }


    get itemData() {
        let dateToGet = new Date(this.singleComment.LastModifiedDate);
        return dateToGet.toLocaleTimeString() + " " + dateToGet.toLocaleDateString();
    }

}