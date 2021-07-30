// получаем инпут
let input = document.querySelector('input');

// обертка для задержки запроса на сервер
function debounce(fn, debounceTime) {
    let timeout;
    return function () {
        const wrapper = () => fn.apply(this, arguments);
        clearTimeout(timeout);
        timeout = setTimeout(wrapper, debounceTime);
    };
}

// удаляет результаты поиска
function clearSearchResults() {
    // получаем список результатов поиска
    let searchResultsList = document.querySelectorAll('.results__item');
    // то проходим по элементам списка результатов поиска 
    searchResultsList.forEach(item => {
        // и удаляем их
        item.remove();
    });
}

// Отправялет запрос и получает ответ от сервера 
let sendRquest = () => {
    // получает значение из input
    let inputValue = input.value.trim();
    // console.log(inputValue);

    // если значение не пустая строка
    if (inputValue !== '') {
        // то формируем строку запроса 
        let url = `https://api.github.com/search/repositories?q=${inputValue}`;
        // отправляем запрос на сервер
        fetch(url)
            .then(response => response.json())
            // получаем ответ (массив результатов поиска)
            .then(data => {
                // console.log(data.items);

                // удаляем результаты поиска
                clearSearchResults();

                // передаем ответ функции вывода на страницу результатов поиска
                addingNewSearchResult(data.items);
            });
    } else {
        // удаляем результаты поиска
        clearSearchResults();
    }
};

// выполняет запрос с задержкой
const sendRquestDebounce = debounce(sendRquest, 500);

// слушаем инпут и передаем ему sendRquestDebounce
input.addEventListener('input', sendRquestDebounce);

// добавление нового результата поиска 
function addingNewSearchResult(items) {
    for (let item of items) {
        // console.log(item.name);
        // получаем список результатов поиска
        let searchResultsList = document.querySelectorAll('.results__item');

        // если в списке результатов поиска менее 5ти элементов
        if (searchResultsList.length < 5) {
            // то создаем новый результат поиска
            const newSearchItem = document.createElement('li');
            newSearchItem.classList.add('results__item');
            newSearchItem.textContent = item.name;
            // добавляем в список результатов
            document.querySelector('.results').append(newSearchItem);

            // добавляем обработчик клика на новый результат поиска 
            newSearchItem.addEventListener('click', () => addSelectedList(item));
        }
    }
}

// добавляет по клику выбранный репозиторий в список
function addSelectedList(item) {
    // console.log(item);

    // ! плохое решение, но в данном случае самое короткое
    const newSelectItem = document.createElement('div');
    newSelectItem.innerHTML = `<div class="selected__item"><div class="selected__item-inner"><div class="selected__text selected__text--name">Name: <span>${item.name}</span></div><div class="selected__text selected__text--owner">Owner: <span>${item.owner.login}</span></div><div class="selected__text selected__text--stars">Stars: <span>${item.stargazers_count}</span></div></div><div class="selected__delete"><img src="img/Vector 6.svg"><img src="img/Vector 8.svg"></div></div>`;
    document.querySelector('.selected').append(newSelectItem);

    // добавляем обработчик клика по кнопке удаления репозитория из списка
    newSelectItem.addEventListener('click', deleteSelectedList);

    // очищаем поле ввода
    input.value = '';
}

// удаление элемента из списка выбранных по клику
function deleteSelectedList(e) {
    // получаем полный элемент на которм произошел клик
    const wholeElement = e.target.closest('.selected__item');

    // удаляем его
    wholeElement.style.display = 'none';
}