document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('gptForm');
    const instructionInput = document.getElementById('instructionInput');
    const questionInput = document.getElementById('questionInput');
    const answerField = document.getElementById('answerOutput');
  
    form.addEventListener('submit', async function(event) {
      event.preventDefault();
      const instruction = instructionInput.value.trim();
      const question = questionInput.value.trim();
  
      if (!instruction || !question) {
        answerField.value = 'Пожалуйста, введите инструкцию и вопрос.';
        return;
      }
  
      answerField.value = 'Обработка...';
  
      try {
        const response = await fetch('/api/gpt', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ instruction, question })
        });
  
        if (!response.ok) {
          answerField.value = `Ошибка: ${response.statusText}`;
          return;
        }
  
        const data = await response.json();
        if (data.answer) {
          answerField.value = data.answer;
        } else {
          answerField.value = 'Ответ не получен. Повторите попытку.';
        }
      } catch (error) {
        console.error('Ошибка:', error);
        answerField.value = 'Сетевая ошибка или проблема с API.';
      }
    });
  });
  