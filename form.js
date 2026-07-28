// ================================================
// ОТПРАВКА ФОРМЫ ЧЕРЕЗ FORMSPREE (без PHP)
// ================================================

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Бургер-меню ---
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');
    if (burgerBtn && navMenu) {
        burgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            burgerBtn.classList.toggle('active');
        });
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                burgerBtn.classList.remove('active');
            });
        });
    }

    // --- Оверлей контактов ---
    window.toggleOverlay = function(id) {
        const el = document.getElementById(id);
        if (el) el.style.display = (window.getComputedStyle(el).display === 'none') ? 'flex' : 'none';
    };

    // --- Кнопка "Позвонить" ---
    const callBtn = document.getElementById('headerCallBtn');
    if (callBtn) {
        callBtn.addEventListener('click', (e) => {
            if (window.innerWidth > 768) {
                e.preventDefault();
                toggleOverlay('contactsBlock');
            }
        });
    }

    // --- Логика квиза ---
    let answers = {
        type: '',
        location: '',
        size: '',
        desc: '',
        phone: '',
        messenger: ''
    };

    window.next = function(field, value, nextStepId) {
        answers[field] = value;
        showStep(nextStepId);
    };

    window.showStep = function(stepId) {
        document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
        document.getElementById(stepId).classList.add('active');
        
        if(stepId === 'step-contacts') {
            document.getElementById('final-back-btn').onclick = () => {
                showStep(answers.type === 'Другое' ? 'step-other' : 'step-size');
            };
        }
    };

    window.closeSuccessModal = function() {
        document.getElementById('successModal').classList.remove('active');
        window.location.href = 'index.html';
    };

    // ================================================
    // 🔥 ОТПРАВКА НА FORMSPREE
    // ================================================
    const form = document.getElementById('tg-quiz-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Собираем данные с полей
            answers.size = document.getElementById('quiz_size').value || 'Не указан';
            answers.desc = (answers.type === 'Другое') ? 
                document.getElementById('quiz_other_desc').value : 
                document.getElementById('quiz_visual_desc').value;
            answers.phone = document.getElementById('quiz_phone').value;
            answers.messenger = document.getElementById('quiz_messenger').value;

            // Формируем объект для отправки
            const formData = {
                type: answers.type,
                location: answers.type !== 'Другое' ? answers.location : 'Не применимо',
                size: answers.size,
                description: answers.desc || 'Нет',
                phone: answers.phone,
                messenger: answers.messenger
            };

            // 🚀 Отправка в Formspree
            fetch('https://formspree.io/f/mykroebj', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Сервер вернул ошибку ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                // Успех!
                document.getElementById('successModal').classList.add('active');
            })
            .catch(error => {
                console.error('Ошибка отправки:', error);
                alert('❌ Не удалось отправить заявку. Пожалуйста, позвоните нам по телефону.');
            });
        });
    }
});