document.getElementById('optionForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const options = document.getElementsByClassName('option');
    const optionsArray = [];
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const title = option.querySelector('input').value;
        const description = option.querySelector('textarea').value;
        optionsArray.push({ title, description });
    }

    //save all options to storage
    chrome.storage.sync.set({ 'options': optionsArray }, function () {
        console.log('Options saved: ' + optionsArray);
    });
});

// add delete option event listener to all existing elements
const deleteOptionButtons = document.getElementsByClassName('deleteOption');
for (let i = 0; i < deleteOptionButtons.length; i++) {
    deleteOptionButtons[i].addEventListener('click', deleteOption);
}

// delete fields
function deleteOption(event) {
    event.preventDefault();
    const option = event.target.parentElement;
    option.remove();
}

// add fields
document.getElementById('addOption').addEventListener('click', function (event) {
    event.preventDefault();
    const submitButton = document.getElementById('addOption');

    const lastNumber = document.getElementsByClassName('option').length;
    // add new elements to the page
    submitButton.parentElement.insertBefore(createNewOptionSet(lastNumber), submitButton);
});

// create new elements with a new number of id
function createNewOptionSet(lastNumber, title, description) {
    const newNumber = lastNumber + 1;
    const newDiv = document.createElement('div');
    newDiv.id = `option-${newNumber}`;
    newDiv.className = 'option';
    const newLabelTitle = document.createElement('label');
    newLabelTitle.for = `option-${newNumber}-title`;
    newLabelTitle.innerText = 'Title:';
    const newInputTitle = document.createElement('input');
    newInputTitle.type = 'text';
    newInputTitle.id = `option-${newNumber}-title`;
    if (title) newInputTitle.value = title;
    const newLabelDescription = document.createElement('label');
    newLabelDescription.for = `option-${newNumber}-description`;
    newLabelDescription.innerText = 'Description:';
    const newInputDescription = document.createElement('textarea');
    newInputDescription.id = `option-${newNumber}-description`;
    newInputDescription.rows = '5';
    newInputDescription.cols = '50';
    if (description) newInputDescription.value = description;
    const newButton = document.createElement('button');
    newButton.id = 'deleteOption';
    newButton.addEventListener('click', deleteOption);
    newButton.innerText = 'Delete option';
    const newHr = document.createElement('hr');

    newDiv.appendChild(newLabelTitle);
    newDiv.appendChild(newInputTitle);
    newDiv.appendChild(newLabelDescription);
    newDiv.appendChild(newInputDescription);
    newDiv.appendChild(newButton);
    newDiv.appendChild(newHr);

    return newDiv;
}

// create fields from options
function createOptions(options) {
    for (let i = 0; i < options.length; i++) {
        const option = options[i];
        const submitButton = document.getElementById('addOption');
        submitButton.parentElement.insertBefore(createNewOptionSet(i, option.title, option.description), submitButton);
    }
}

// set page title from manifest and load options from storage
document.addEventListener('DOMContentLoaded', function () {
    var manifestData = chrome.runtime.getManifest();

    const collection = document.getElementsByClassName("pageTitle");
    for (let i = 0; i < collection.length; i++) {
        collection[i].innerText = manifestData.name;
    }

    // load all options from storage and create fields
    chrome.storage.sync.get('options', function (data) {
        const options = data.options;

        if (options) {
            createOptions(options);
        }
    });

});
