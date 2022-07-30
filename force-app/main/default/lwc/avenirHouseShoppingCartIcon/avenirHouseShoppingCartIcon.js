import { LightningElement } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

export default class AvenirHouseShoppingCartIcon extends NavigationMixin(LightningElement) {

    goToCart() {
        const config = {
            type: 'standard__webPage',
            attributes: {
                url: '/shopping-cart/'
            }
        };
        this[NavigationMixin.Navigate](config);
    }
}