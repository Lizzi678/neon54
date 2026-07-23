document.addEventListener('DOMContentLoaded', () => {
    console.log("Скрипт загружен успешно");

    // Функция переключения шагов
    window.nextQuizStep = function(currentStepId, nextStepId) {
        document.getElementById(currentStepId).classList.remove('active');
        document.getElementById(nextStepId).classList.add('active');
    };

    // Отправка в Telegram
    const form = document.getElementById('tg-quiz-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            alert("Заявка отправлена!"); 
            // Здесь будет твой код fetch для отправки
        });
    }
});