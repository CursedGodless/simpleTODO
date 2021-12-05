(function () {
  const allTasks = {
    '0': {
      title: 'Lorem ipsum dolor sit amet.',
      description: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda impedit
      laboriosam sit quisquam eius nobis inventore repudiandae rem nam voluptate, quam vitae magnam molestiae
      architecto minus quae itaque fugiat aspernatur!`
    },
  };



  if (!localStorage.getItem('counter')) { // Проверка наличия свойства counter
    localStorage.setItem('counter', 0);
  }

  const parent = document.querySelector('.task__wrapper'),
    form = document.querySelector('.form'),
    formTitle = form.querySelector('.form__input-title'),
    formDescription = form.querySelector('.form__input-description');

  // Фильтрация числовых ключей из localstorage
  function filterNumericKeys() {
    const localStorageKeys = Object.keys(localStorage);
    return localStorageKeys.filter(item => +item).sort((a, b) => a - b);
  }

  function checkTasks() {
    const div = document.createElement('div');
    div.textContent = 'Задачи отсутствуют';
    div.classList.add('no_tasks');
    div.style.cssText = `
    margin: 0 auto;
    `;
    if (filterNumericKeys().length === 1 && parent.querySelector('.no_tasks')) {
      parent.querySelector('.no_tasks').remove();
    }
    if (filterNumericKeys().length < 1) {
      parent.append(div);
    }
  }

  checkTasks();

  // Загрузка задач из LocalStorage после перезагрузки

  function loadTasksFromLocalStorage() {
    const sortedKeys = filterNumericKeys();

    for (let key of sortedKeys) {
      let keyParse = JSON.parse(localStorage.getItem(key));
      generateTask({
        title,
        description,
        completed
      } = keyParse, key);
    }
  }

  loadTasksFromLocalStorage();

  // Создание задачи

  function generateTask({
    title,
    description,
    completed
  } = {}, num) {

    const getGeneratedTasks = [...parent.querySelectorAll('.task__item')],
      numericArrayOfExistingTasks = getGeneratedTasks.map(task => task.getAttribute('data-task-number'));

    if (numericArrayOfExistingTasks.includes(num)) { // Проверка на существующий элемент
      return;
    }

    const newTask = document.createElement('div');

    newTask.classList.add('task__item');
    newTask.setAttribute('data-task-number', num);
    if (completed) {
      newTask.classList.add('completed');
    }
    newTask.innerHTML = `
      <div class="task__title">${title}</div>
      <div class="task__description">${description}</div>
      <div class="task__btns">
      <button class="task__btn task_complete">Завершить</button>
        <button class="task__btn task_delete">Удалить</button>
      </div>
      `;

    parent.insertAdjacentElement('afterbegin', newTask);
    checkTasks();
  }

  // Обработчик добавления новых задач

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = formTitle.value,
      description = formDescription.value;

    const formObj = {
      title,
      description,
      completed: false
    };

    if (formTitle.value === '' || formDescription.value === '') return;
    localStorage.setItem('counter', +localStorage.getItem('counter') + 1);
    localStorage.setItem(`${localStorage.getItem('counter')}`, JSON.stringify(formObj));
    generateTask(formObj, localStorage.getItem('counter'));

    form.reset();
    checkTasks();
  });

  // Кнопки управления задачей

  parent.addEventListener('click', (e) => { // Удаление задачи
    const target = e.target;
    if (target.classList.contains('task_delete')) {
      const closestParent = target.closest('.task__item');

      if (confirm('Удалить задачу?')) {
        closestParent.remove();
        localStorage.removeItem(closestParent.getAttribute('data-task-number'));
      } else {
        return;
      }
      checkTasks();
    }
  });

  parent.addEventListener('click', (e) => { // Завершение задачи
    const target = e.target;

    if (target.classList.contains('task_complete')) {
      const closestParent = target.closest('.task__item');

      if (confirm('Завершить задачу?')) {
        closestParent.classList.add('completed');
        const parseLocalTask = JSON.parse(localStorage.getItem(closestParent.getAttribute('data-task-number')));
        parseLocalTask.completed = true;
        localStorage.setItem(closestParent.getAttribute('data-task-number'), JSON.stringify(parseLocalTask));
      } else {
        return;
      }
    }
  });
  

  // Фильтрация задач

  const filterUncompletedBtn = document.querySelector('.filter_uncompleted'),
    filterAllTasks = document.querySelector('.filter_all');

  filterUncompletedBtn.addEventListener('click', () => {
    parent.innerHTML = ``;
    let uncompletedArray = [];

    for (let key of filterNumericKeys()) {
      uncompletedArray.push([key, JSON.parse(localStorage.getItem(key))]);
    }
    let a = uncompletedArray.filter(key => !key[1]['completed'] || key[1]['completed'] === false); // Сортировка задач у которых complted === false или отсутствует
    a.forEach(task => generateTask({
      title: task[1]['title'],
      description: task[1]['description']
    }, task[0])); // Генерация незавершенных задач
    checkTasks();
  });

  filterAllTasks.addEventListener('click', loadTasksFromLocalStorage);

  // Модуль времени
  const timerDiv = document.querySelector('.timer'),
    timerMonth = document.querySelector('.timer__month'),
    timerDay= document.querySelector('.timer__day'),
    timerHours = document.querySelector('.timer__hour'),
    timerMinutes = document.querySelector('.timer__minute'),
    monthName = {
      0: 'январь',
      1: 'февраль',
      2: 'март',
      3: 'апрель',
      4: 'май',
      5: 'июнь',
      6: 'июль',
      7: 'август',
      8: 'сентябрь',
      9: 'октябрь',
      10: 'ноябрь',
      11: 'декабрь'
    };

  function updateClock() {
    const currentTime = new Date();
    
    timerMonth.textContent = monthName[currentTime.getMonth()];
    timerDay.textContent = currentTime.getDate();
    timerHours.textContent = currentTime.getHours();
    timerMinutes.textContent = currentTime.getMinutes();
  }

  setInterval(() => {
    updateClock();
  }, 1000);

})();