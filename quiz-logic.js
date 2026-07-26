let answers = {
    type: '',
    location: '',
    size: '',
    desc: '',
    phone: '',
    messenger: ''
};

function next(field, value, nextStepId) {
    answers[field] = value;
    showStep(nextStepId);
}

function showStep(stepId) {
    document.querySelectorAll('.quiz-step').forEach(s => s.classList.remove('active'));
    document.getElementById(stepId).classList.add('active');
    
    if (stepId === 'step-contacts') {
        const finalBackBtn = document.getElementById('final-back-btn');
        if (finalBackBtn) {
            finalBackBtn.onclick = () => {
                showStep(answers.type === 'Другое' ? 'step-other' : 'step-size');
            };
        }
    }
}

function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
    }
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Логика мобильного меню (бургер)
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

    window.toggleOverlay = function(id) {
        const el = document.getElementById(id);
        if (el) el.style.display = (window.getComputedStyle(el).display === 'none') ? 'flex' : 'none';
    };

    const callBtn = document.getElementById('headerCallBtn');
    if (callBtn) {
        callBtn.addEventListener('click', (e) => {
            if (window.innerWidth > 768) {
                e.preventDefault();
                toggleOverlay('contactsBlock');
            }
        });
    }

    // Обработка отправки формы Квиза на почту через send.php
    const quizForm = document.getElementById('tg-quiz-form');
    if (quizForm) {
        quizForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const sizeInput = document.getElementById('quiz_size');
            const otherDescInput = document.getElementById('quiz_other_desc');
            const visualDescInput = document.getElementById('quiz_visual_desc');
            const phoneInput = document.getElementById('quiz_phone');
            const messengerSelect = document.getElementById('quiz_messenger');

            answers.size = sizeInput ? (sizeInput.value || 'Не указан') : 'Не указан';
            answers.desc = (answers.type === 'Другое') ? 
                (otherDescInput ? otherDescInput.value : '') : 
                (visualDescInput ? visualDescInput.value : '');
            answers.phone = phoneInput ? phoneInput.value : '';
            answers.messenger = messengerSelect ? messengerSelect.value : '';

            // Упаковываем данные для отправки в PHP
            let formData = new FormData();
            formData.append('type', answers.type);
            formData.append('location', answers.type !== 'Другое' ? answers.location : 'Не применимо');
            formData.append('size', answers.size);
            formData.append('desc', answers.desc || 'Нет');
            formData.append('phone', answers.phone);
            formData.append('messenger', answers.messenger);

            // Отправляем запрос на серверный скрипт
            fetch('send.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    const successModal = document.getElementById('successModal');
                    if (successModal) {
                        successModal.classList.add('active');
                    }
                } else {
                    alert('Ошибка при отправке письма. Проверьте настройки почты на хостинге.');
                }
            })
            .catch(err => {
                console.error('Ошибка отправки:', err);
                alert('Произошла сетевая ошибка при отправке заявки.');
            });
        });
    }
});