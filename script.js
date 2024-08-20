const input = document.querySelector('#new-task-input');
const addBtn = document.querySelector('#add-task-button');
const taskWrapper = document.querySelector('.task-wrapper');
const completeTaskWrapper = document.querySelector('.complete-task');

const checkInput = () => { addBtn.disabled = input.value === '' };
input.addEventListener('input', checkInput);

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        if (input.value.trim() !== '') {
            createTaskCard(input.value);
        }
    }
});

const createTaskCard = (taskText, isComplete = false) => {
    const taskCard = document.createElement('div');
    taskCard.classList.add('task-card');

    const textCard = document.createElement('p');
    textCard.classList.add('card-body');
    textCard.textContent = taskText;

    if (isComplete) {
        const addCompleteText = document.createElement('p');
        addCompleteText.style.color = "#B8E986";
        addCompleteText.style.padding = "5px";
        addCompleteText.style.textAlign = "center";
        addCompleteText.textContent = 'Complete task:';
        taskCard.appendChild(addCompleteText);
    }

    taskCard.appendChild(textCard);

    const cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer');

    const completeButton = document.createElement('button');
    completeButton.type = 'button';
    completeButton.id = 'complete-task-button';
    completeButton.textContent = 'Complete';
    const completeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    completeSvg.setAttribute('id', 'complete-svg');
    completeSvg.setAttribute('width', '24');
    completeSvg.setAttribute('height', '24');
    completeSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    completeSvg.setAttribute('viewBox', '0 0 24 24');
    completeSvg.innerHTML = '<path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24zm-4 7h-8v1h8v-1zm0 5h-8v1h8v-1zm0 5h-8v1h8v-1zm-10.516-11.304l-.71-.696-2.553 2.607-1.539-1.452-.698.71 2.25 2.135 3.25-3.304zm0 5l-.71-.696-2.552 2.607-1.539-1.452-.698.709 2.249 2.136 3.25-3.304zm0 5l-.71-.696-2.552 2.607-1.539-1.452-.698.709 2.249 2.136 3.25-3.304z"/>';
    completeButton.appendChild(completeSvg);
    cardFooter.appendChild(completeButton);

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.id = 'remove-task-button';
    removeButton.classList.add('tooltip');
    removeButton.textContent = 'Remove';
    const removeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    removeSvg.setAttribute('id', 'remove-svg');
    removeSvg.setAttribute('width', '24');
    removeSvg.setAttribute('height', '24');
    removeSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    removeSvg.setAttribute('fill-rule', 'evenodd');
    removeSvg.setAttribute('clip-rule', 'evenodd');
    removeSvg.innerHTML = '<path d="M9 3h6v-1.75c0-.066-.026-.13-.073-.177-.047-.047-.111-.073-.177-.073h-5.5c-.066 0-.13.026-.177.073-.047.047-.073.111-.073.177v1.75zm11 1h-16v18c0 .552.448 1 1 1h14c.552 0 1-.448 1-1v-18zm-10 3.5c0-.276-.224-.5-.5-.5s-.5.224-.5.5v12c0 .276.224.5.5.5s.5-.224.5-.5v-12zm5 0c0-.276-.224-.5-.5-.5s-.5.224-.5.5v12c0 .276.224.5.5.5s.5-.224.5-.5v-12zm8-4.5v1h-2v18c0 1.105-.895 2-2 2h-14c-1.105 0-2-.895-2-2v-18h-2v-1h7v-2c0-.552.448-1 1-1h6c.552 0 1 .448 1 1v2h7z"/>';
    removeButton.appendChild(removeSvg);
    cardFooter.appendChild(removeButton);

    taskCard.appendChild(cardFooter);

    if (isComplete) {
        completeTaskWrapper.appendChild(taskCard);
        completeButton.remove();
    } else {
        taskWrapper.appendChild(taskCard);
    }

    input.value = '';
    addBtn.disabled = true;

    setupRemoveButton(removeButton, taskCard);
    completeButton.addEventListener('click', () => completeTaskCard(taskCard));

    saveTasksToLocalStorage();
};

addBtn.addEventListener('click', () => createTaskCard(input.value));

const completeTaskCard = (taskCard) => {
    taskWrapper.removeChild(taskCard);
    completeTaskWrapper.appendChild(taskCard);
    taskCard.querySelector('#complete-task-button').remove();

    const textBody = taskCard.querySelector('.card-body');
    if (textBody) {
        const addCompleteText = document.createElement('p');
        addCompleteText.style.color = "#B8E986";
        addCompleteText.style.padding = "5px";
        addCompleteText.style.textAlign = "center";
        addCompleteText.textContent = 'Complete task:';
        taskCard.insertBefore(addCompleteText, textBody);
    }

    saveTasksToLocalStorage();
};

const removeTaskCard = (taskCard) => {
    if (taskWrapper.contains(taskCard)) {
        taskWrapper.removeChild(taskCard);
    } else if (completeTaskWrapper.contains(taskCard)) {
        completeTaskWrapper.removeChild(taskCard);
    }

    saveTasksToLocalStorage();
};

const setupRemoveButton = (removeButton, taskCard) => { removeButton.addEventListener('click', () => removeTaskCard(taskCard));
};

const getTasksFromWrapper = (wrapper, isComplete) => {
    return Array.from(wrapper.querySelectorAll('.task-card')).map(taskCard => ({
        text: taskCard.querySelector('.card-body').textContent,
        isComplete
    }));
};

const saveTasksToLocalStorage = () => {
    const tasks = [
        ...getTasksFromWrapper(taskWrapper, false),
        ...getTasksFromWrapper(completeTaskWrapper, true)
    ];
    localStorage.setItem('tasks', JSON.stringify(tasks));
};

const loadTasksFromLocalStorage = () => {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(({ text, isComplete }) => createTaskCard(text, isComplete));
};

document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);