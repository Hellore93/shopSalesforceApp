({
    closeModal: function(cmp, evt, helper) {
        helper.closeModal(cmp, evt);
    },

    handleSuccess: function(cmp, event, helper) {
        cmp.set('v.recordId', event.getParam("id"));
        cmp.set('v.recordName', event.getParam('fields').Name.value);
        cmp.set('v.productDetails', false);
        cmp.set('v.productPhoto', true);
    },

    handleUploadFinished: function(cmp, evt, helper, action) {
        const uploadedFiles = evt.getParam("files");
        console.log(uploadedFiles);
        let photoLink = '';
        uploadedFiles.forEach(file =>
            photoLink = 'https://britenet93-dev-ed.my.salesforce.com/sfc/servlet.shepherd/document/download/' + file.contentVersionId
        );
        var action = cmp.get('c.saveProductMainPhoto');
        action.setParams({
            productId: cmp.get('v.recordId'),
            photoLink: photoLink
        });
        helper.saveProductDetails(cmp, evt, action);
    },

    goToPriceSection: function(cmp, event) {
        cmp.set('v.productPhoto', false);
        cmp.set('v.productPrice', true);
    },

    savePrice: function(cmp, evt, helper, action) {
        var action = cmp.get('c.saveProductPrice');
        action.setParams({
            productId: cmp.get('v.recordId'),
            productPrice: parseFloat(cmp.find('enter-product-price').get('v.value'))
        });
        helper.saveProductDetails(cmp, evt, action);
        helper.closeModal(cmp, evt);
    }
})