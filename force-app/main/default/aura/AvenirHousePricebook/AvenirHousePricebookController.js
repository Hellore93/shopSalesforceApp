({
    init: function(cmp, action, helper) {

        cmp.set('v.mycolumns', [
            { label: 'Name', fieldName: 'Name', type: 'text' },
            { label: 'Price', fieldName: 'UnitPrice', type: 'currency' },
            { label: 'Price with discount', fieldName: 'Description', type: 'currency' }
        ]);
        var action = cmp.get('c.getProductAndPrice');
        helper.getData(cmp, action);
    },

    startSearch: function(cmp, evt, action, helper) {
        var isEnterKey = evt.keyCode === 13;
        if (isEnterKey) {
            var houseName = cmp.find('enter-house-name').get('v.value');

            if (houseName != "") {
                var action = cmp.get('c.getProductByName');
                action.setParams({ houseName: cmp.find('enter-house-name').get('v.value') });
            } else {
                var action = cmp.get('c.getProductAndPrice');
            }

            action.setCallback(this, $A.getCallback(function(response) {
                var state = response.getState();
                if (state === "SUCCESS") {
                    cmp.set('v.mydata', response.getReturnValue());
                } else if (state === "ERROR") {
                    var errors = response.getError();
                    console.error(errors);
                }
            }));
            $A.enqueueAction(action);
        }
    },

    openNewPricebook: function(cmp, evt) {
        cmp.set('v.newPricebook', true);
    },

    openPricebookTable: function(cmp, evt) {
        cmp.set('v.showPricebook', true);
    },


    closeModal: function(cmp, evt) {
        var params = evt.getParam('arguments');
        if (params) {
            var closeModal = cmp.get('v.newPricebook');
            var closeShowModal = cmp.get('v.showPricebook');
            closeModal = params.closeModalAttribute;
            closeShowModal = params.closeModalAttribute;
            cmp.set('v.newPricebook', closeModal);
            cmp.set('v.showPricebook', closeShowModal);
        }
    },

    updateSelectedText: function(cmp, event) {
        var selectedRows = event.getParam('selectedRows');
        cmp.set('v.selectedObjectToDiscount', selectedRows);
    }

})