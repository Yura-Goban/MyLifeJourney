document.addEventListener("DOMContentLoaded", function() {
    // Логіка для слайдера галереї (без змін)
    let currentSlide = 0;
    const slides = document.querySelectorAll(".gallery-images img");
    const totalSlides = slides.length;

    const nextButton = document.querySelector(".next");
    const prevButton = document.querySelector(".prev");

    nextButton.addEventListener("click", function() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateSlider();
    });

    prevButton.addEventListener("click", function() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateSlider();
    });

    function updateSlider() {
        const offset = -currentSlide * 100;  // Ширина зображення в процентах
        document.querySelector(".gallery-images").style.transform = `translateX(${offset}%)`;
    }

    // Логіка для капсули часу (без змін)
    const revealButton = document.getElementById("reveal-message");
    const hiddenMessage = document.getElementById("hidden-message");

    const currentDate = new Date();
    const unlockDate = new Date("2042-01-01");

    if (currentDate >= unlockDate) {
        revealButton.style.display = "block";
    }

    revealButton.addEventListener("click", function() {
        hiddenMessage.style.display = "block";
        revealButton.style.display = "none";
    });

    // Завантаження подій і листів з localStorage
    loadTimeline();
    loadLetters();
    loadAchievements();

    // Обробка форми для листів
    const letterForm = document.getElementById('letter-form');
    const lettersList = document.getElementById('letters-list');

    letterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const from = document.getElementById('letter-from').value;
        const content = document.getElementById('letter-content').value;

        const letter = { from, content };
        addLetter(letter);
        saveLetters();

        letterForm.reset();
    });

    // Обробка форми для подій
    const eventForm = document.getElementById('event-form');
    const eventsList = document.getElementById('timeline-content');

    eventForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const year = document.getElementById('event-year').value;
        const description = document.getElementById('event-description').value;

        const event = { year, description };
        addEvent(event);
        saveTimeline();

        eventForm.reset();
    });

    // Обробка форми для досягнень
    const achievementForm = document.getElementById('achievement-form');
    const achievementsList = document.getElementById('achievements-list');

    achievementForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('achievement-title').value;
        const description = document.getElementById('achievement-description').value;
        const stickerUrl = document.getElementById('achievement-sticker').value;

        const achievement = { title, description, stickerUrl };
        addAchievement(achievement);
        saveAchievements();

        achievementForm.reset();
    });

    // Функції додавання подій, листів і досягнень
    function addLetter(letter) {
        const letterDiv = document.createElement('div');
        letterDiv.classList.add('message');
        letterDiv.innerHTML = `<h3>Лист від ${letter.from}</h3><p>${letter.content}</p>`;
        lettersList.appendChild(letterDiv);
    }

    function addEvent(event) {
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('diary-entry');
        eventDiv.innerHTML = `<strong>${event.year}</strong>: ${event.description}`;
        eventsList.appendChild(eventDiv);
    }

    function addAchievement(achievement) {
        const achievementLi = document.createElement('li');
        achievementLi.classList.add('achievement');
        achievementLi.innerHTML = `
            <h3>${achievement.title}</h3>
            <p>${achievement.description}</p>
            <img src="${achievement.stickerUrl}" alt="Стікер або гіфка" style="max-width: 150px;">
        `;
        achievementsList.appendChild(achievementLi);
    }

    // Функції збереження даних у localStorage
    function saveLetters() {
        const letters = Array.from(lettersList.children).map(letterDiv => {
            return {
                from: letterDiv.querySelector('h3').textContent.replace('Лист від ', ''),
                content: letterDiv.querySelector('p').textContent
            };
        });
        localStorage.setItem('letters', JSON.stringify(letters));
    }

    function saveTimeline() {
        const events = Array.from(eventsList.children).map(eventDiv => {
            const [year, description] = eventDiv.innerHTML.split(': ');
            return { year: year.replace('<strong>', '').replace('</strong>', ''), description };
        });
        localStorage.setItem('timeline', JSON.stringify(events));
    }

    function saveAchievements() {
        const achievements = Array.from(achievementsList.children).map(achievementLi => {
            return {
                title: achievementLi.querySelector('h3').textContent,
                description: achievementLi.querySelector('p').textContent,
                stickerUrl: achievementLi.querySelector('img').src
            };
        });
        localStorage.setItem('achievements', JSON.stringify(achievements));
    }

    // Функції завантаження даних з localStorage
    function loadLetters() {
        const letters = JSON.parse(localStorage.getItem('letters')) || [];
        letters.forEach(letter => addLetter(letter));
    }

    function loadTimeline() {
        const events = JSON.parse(localStorage.getItem('timeline')) || [];
        events.forEach(event => addEvent(event));
    }

    function loadAchievements() {
        const achievements = JSON.parse(localStorage.getItem('achievements')) || [];
        achievements.forEach(achievement => addAchievement(achievement));
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const settingsIcon = document.getElementById("settings-icon");
    const settingsPanel = document.getElementById("settings-panel");
    const themeSelect = document.getElementById("theme-select");
    const backgroundImageInput = document.getElementById("background-image");
    const highlightColorInput = document.getElementById("highlight-color");

    // Відображення панелі налаштувань
    settingsIcon.addEventListener("click", function() {
        settingsPanel.style.display = settingsPanel.style.display === "none" ? "block" : "none";
    });

    // Зміна теми
    themeSelect.addEventListener("change", function() {
        if (themeSelect.value === "dark") {
            document.body.classList.add("dark-theme");
        } else {
            document.body.classList.remove("dark-theme");
        }
    });

    // Зміна фону
    backgroundImageInput.addEventListener("change", function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                document.body.style.backgroundImage = `url(${e.target.result})`;
                localStorage.setItem('backgroundImage', e.target.result);  // Зберігаємо фон у локальному сховищі
            };
            reader.readAsDataURL(file);
        }
    });

    // Зміна кольору підсвітки
    highlightColorInput.addEventListener("input", function() {
        document.documentElement.style.setProperty("--highlight-color", highlightColorInput.value);
        localStorage.setItem('highlightColor', highlightColorInput.value);  // Зберігаємо колір підсвітки
    });

    // Завантаження попередніх налаштувань
    const savedBackground = localStorage.getItem('backgroundImage');
    const savedHighlightColor = localStorage.getItem('highlightColor');

    if (savedBackground) {
        document.body.style.backgroundImage = `url(${savedBackground})`;
    }

    if (savedHighlightColor) {
        document.documentElement.style.setProperty("--highlight-color", savedHighlightColor);
        highlightColorInput.value = savedHighlightColor;  // Відображаємо поточний колір
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const users = JSON.parse(localStorage.getItem('users')) || {};
    const currentUser = localStorage.getItem('currentUser');

    const authSection = document.getElementById('auth-section');
    const siteContent = document.getElementById('site-content');
    const authForm = document.getElementById('auth-form');
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');
    const registrationSection = document.getElementById('registration-section');
    const loginSection = document.getElementById('login-section');
    const authOptions = document.getElementById('auth-options');

    // Вибір ролі
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const role = document.getElementById('role-select').value;

        if (role) {
            authOptions.style.display = 'block';
            localStorage.setItem('selectedRole', role);
        } else {
            alert('Оберіть роль для продовження.');
        }
    });

    // Показуємо реєстрацію або вхід
    registerBtn.addEventListener('click', function() {
        registrationSection.style.display = 'block';
        loginSection.style.display = 'none';
    });

    loginBtn.addEventListener('click', function() {
        loginSection.style.display = 'block';
        registrationSection.style.display = 'none';
    });

    // Реєстрація
    document.getElementById('registration-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const role = localStorage.getItem('selectedRole');

        if (!users[username]) {
            users[username] = { password, role };
            localStorage.setItem('users', JSON.stringify(users));
            alert('Реєстрація успішна!');
            showContent(username);
        } else {
            alert('Користувач із таким ім\'ям уже існує.');
        }
    });

    // Вхід
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('login-username').value;
        const password = document.getElementById('login-password').value;

        if (users[username] && users[username].password === password) {
            localStorage.setItem('currentUser', username);
            showContent(username);
        } else {
            alert('Невірне ім\'я користувача або пароль.');
        }
    });

    // Показуємо контент після входу
    function showContent(username) {
        authSection.style.display = 'none';
        siteContent.style.display = 'block';

        // Можна додати перевірку ролі користувача і показати доступний контент
    }

    if (currentUser) {
        showContent(currentUser);
    }

    // Завантаження та видалення медіафайлів (фото та відео)
    const photoGallery = document.getElementById('photo-gallery');
    const mediaGallery = document.getElementById('media-gallery');

    document.addEventListener('DOMContentLoaded', () => {

        // Завантаження фото в фотоальбом
        document.getElementById('upload-photo').addEventListener('click', () => {
            const photoUpload = document.getElementById('photo-upload').files[0];
            if (photoUpload && photoUpload.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const photoGallery = document.getElementById('photo-gallery-content');
                    const img = document.createElement('img');
                    img.src = e.target.result;
                    img.alt = 'Завантажене фото';
                    img.style.width = '200px';  // Зміна розміру фото (за бажанням)
                    img.style.margin = '10px';
                    photoGallery.appendChild(img);
                };
                reader.readAsDataURL(photoUpload);
            } else {
                alert('Будь ласка, завантажте тільки фото.');
            }
        });
    
        // Завантаження відео у відеоархів
        document.getElementById('upload-video').addEventListener('click', () => {
            const videoUpload = document.getElementById('video-upload').files[0];
            if (videoUpload && videoUpload.type.startsWith('video/')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const videoGallery = document.getElementById('video-gallery');
                    const video = document.createElement('video');
                    video.src = e.target.result;
                    video.controls = true;
                    video.style.width = '400px';  // Зміна розміру відео (за бажанням)
                    video.style.margin = '10px';
                    videoGallery.appendChild(video);
                };
                reader.readAsDataURL(videoUpload);
            } else {
                alert('Будь ласка, завантажте тільки відео.');
            }
        });
    });
    

    // Зберігання галереї у локальному сховищі
    function saveGallery(type, content) {
        localStorage.setItem(type + '-gallery', content);
    }

    // Завантаження галереї з локального сховища
    function loadGallery(type, element) {
        const savedContent = localStorage.getItem(type + '-gallery');
        if (savedContent) {
            element.innerHTML = savedContent;
            element.querySelectorAll('button').forEach(btn => {
                btn.addEventListener('click', function() {
                    btn.previousSibling.remove();
                    btn.remove();
                });
            });
        }
    }

    loadGallery('photo', photoGallery);
    loadGallery('media', mediaGallery);
});

document.querySelectorAll('.person').forEach(person => {
    person.addEventListener('click', () => {
        const childList = person.nextElementSibling;
        if (childList) {
            childList.classList.toggle('hidden');
        }
    });
});

document.getElementById('add-person-form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const birthYear = parseInt(document.getElementById('birth-year').value);
    const deathYear = document.getElementById('death-year').value ? parseInt(document.getElementById('death-year').value) : null;

    addPersonToTree(name, birthYear, deathYear);
});

const familyTree = [];

function addPersonToTree(name, birthYear, deathYear) {
    familyTree.push({ name, birthYear, deathYear });
    renderTree();
}

function renderTree() {
    const treeRoot = document.getElementById('tree-root');
    treeRoot.innerHTML = '';

    const sortedFamily = familyTree.sort((a, b) => {
        if (a.deathYear && b.deathYear) {
            return a.deathYear - b.deathYear;
        } else if (!a.deathYear && b.deathYear) {
            return -1;
        } else if (a.deathYear && !b.deathYear) {
            return 1;
        } else {
            return a.birthYear - b.birthYear;
        }
    });

    sortedFamily.forEach(person => {
        const listItem = document.createElement('li');
        const personDiv = document.createElement('div');
        personDiv.classList.add('person');

        personDiv.innerHTML = `<p>${person.name}</p><p>Народжений: ${person.birthYear}</p>${person.deathYear ? `<p>Помер: ${person.deathYear}</p>` : ''}`;
        listItem.appendChild(personDiv);
        treeRoot.appendChild(listItem);
    });
}
