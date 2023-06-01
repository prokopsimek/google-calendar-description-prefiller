var selectBoxId = 'mySelectBox';
var descriptionFieldSelector = "#xDescIn"
var descriptionEditableAreaSelector = `${descriptionFieldSelector} > [aria-label="Description"][contenteditable="true"]`
var descriptionPlaceholder = `${descriptionFieldSelector} > div[aria-hidden="false"]:first-child`

var styles = `
#prefillDescription {
    padding: 0 0 8px 0;
    align-self: start;
}

#prefillDescription label {
    color: var(--on-surface-variant-agm);
}

#prefillDescription select {
    margin-left: 4px;
    color: var(--on-surface-variant-agm);
    padding: 4px 4px;
}
`

function descriptionFieldVisible() {
    return document.querySelector(descriptionFieldSelector) && document.querySelector(descriptionFieldSelector).offsetParent != null;
}

function descriptionEditableAreaVisible() {
    return document.querySelector(descriptionEditableAreaSelector) && document.querySelector(descriptionEditableAreaSelector).offsetParent != null;
}

function selectBoxElement() {
    return document.querySelector(`#${selectBoxId}`)
}

// This function creates the select box and adds it to the page.
function createSelectBox() {
    var styleSheet = document.createElement("style")
    styleSheet.innerText = styles

    var selectBoxWrapper = document.createElement('div');
    selectBoxWrapper.id = "prefillDescription";
    
    selectBoxWrapper.appendChild(styleSheet);

    // Create the select box label.
    var selectBoxLabel = document.createElement('label');
    selectBoxLabel.htmlFor = selectBoxId;

    // Add some text to the label.
    var labelText = document.createTextNode('Prefill description:');
    selectBoxLabel.appendChild(labelText);

    selectBoxWrapper.appendChild(selectBoxLabel);

    // Create the select box.
    var selectBox = document.createElement('select');
    selectBox.id = selectBoxId;
    selectBox.setAttribute('role', 'button');
    selectBoxWrapper.appendChild(selectBox);

    // Add some options.
    var optionDefault = document.createElement('option');
    optionDefault.text = 'Choose an option';
    optionDefault.value = '';
    selectBox.appendChild(optionDefault);

    
    // load options from storage
    chrome.storage.sync.get(['options'], function(result) {
        console.log('Options loaded: ' + result.options);
        result.options.forEach(function(option) {
            var optionElement = document.createElement('option');
            optionElement.text = option.title;
            optionElement.value = option.description;
            selectBox.appendChild(optionElement);
        });
    });

    // Add the select box to the page.

    // Find the parent element.
    var parentElement = document.querySelector(descriptionFieldSelector).parentElement.parentElement.parentElement.parentElement.parentElement;

    // Add the select box to the parent element.
    if (parentElement) {
        parentElement.prepend(selectBoxWrapper);
    }

    // Add an event listener to the select box.
    selectBox.addEventListener('change', function() {
        console.log('User selected: ' + selectBox.value);
        prefillDescription(selectBox.value);
        selectBox.value = '';
    });
}

// This function will be called when the description field becomes available.
function prefillDescription(value) {
    // Find the description field.
    var descriptionField = document.querySelector(descriptionEditableAreaSelector);
    var descriptionPlaceholderField = document.querySelector(descriptionPlaceholder);
    console.log("prefillDescription");

    // Prefill the description field.
    if (descriptionField) {
        console.log("setting description");
        if (descriptionPlaceholderField) descriptionPlaceholderField.style.visibility = "hidden";
        var prevText = descriptionField.innerHTML;
        var newText = `<div>${value}</div>`
        descriptionField.innerHTML = descriptionField.textContent != '' ? prevText + `\n` + newText : newText;

        for (const type of ['keydown', 'keypress', 'keyup'])
            descriptionField.dispatchEvent(new KeyboardEvent(type));
            // focus again to make sure the cursor is at the end
            descriptionField.focus();
            
    }
}

// Create a MutationObserver to monitor the page for changes.
var observer = new MutationObserver(function(mutations) {
    if (!selectBoxElement()) {
        mutations.forEach(function(mutation) {
            // If new nodes are added and the description field is available, prefill it.
            if (mutation.addedNodes && descriptionFieldVisible() && descriptionEditableAreaVisible() && !selectBoxElement()) {
                // Call the function to create the select box.
                createSelectBox();
            }
        });
    };
});

// Start the MutationObserver.
observer.observe(document.body, { childList: true, subtree: true });
