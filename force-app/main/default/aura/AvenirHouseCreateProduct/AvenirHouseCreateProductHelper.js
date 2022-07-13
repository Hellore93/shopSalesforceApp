({
    saveProductDetails: function(cmp, evt, action) {
        action.setCallback(this, $A.getCallback(function(response) {
            var state = response.getState();
            if (state === 'SUCCESS') {
                this.showSuccessToast(cmp, 'success', 'Adding successfully');
            } else {
                this.showSuccessToast(cmp, 'error', 'Adding field');
            }
        }));
        $A.enqueueAction(action);
    },

    showSuccessToast: function(cmp, type, message) {
        var toastEvent = $A.get("e.force:showToast");
        toastEvent.setParams({
            "title": "Success!",
            "type": type,
            "message": message
        });
        toastEvent.fire();
    },

    closeModal: function(cmp, evt) {
        var closeModalAttribute = false;
        var parentCmp = cmp.get('v.parent');
        parentCmp.closeModalEvent(closeModalAttribute);
    },
})