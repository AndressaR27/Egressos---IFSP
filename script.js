document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formEgresso');
  const telefoneInput = document.getElementById('telefone');

  // --- 1. MÁSCARA DINÂMICA DE TELEFONE ---
  telefoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, ''); // Remove não dígitos
    
    if (value.length > 11) {
      value = value.slice(0, 11);
    }

    if (value.length > 10) {
      // Celular: (XX) XXXXX-XXXX
      value = value.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 6) {
      // Fixo ou em digitação: (XX) XXXX-XXXX
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
    } else if (value.length > 0) {
      value = value.replace(/^(\d*)/, '($1');
    }

    e.target.value = value;
  });

  // --- 2. VALIDAÇÃO AO SUBMETER ---
  form.addEventListener('submit', (event) => {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], select[required]');

    inputs.forEach((input) => {
      const formGroup = input.closest('.form-group');
      let fieldValid = true;

      // Validação básica de campo vazio
      if (!input.value.trim()) {
        fieldValid = false;
      }

      // Validação de E-mail
      if (input.type === 'email' && input.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value)) {
          fieldValid = false;
        }
      }

      // Validação de Telefone (mínimo de 10 dígitos reais)
      if (input.id === 'telefone' && input.value) {
        const rawNumbers = input.value.replace(/\D/g, '');
        if (rawNumbers.length < 10) {
          fieldValid = false;
        }
      }

      // Exibe ou oculta erros visuais
      if (!fieldValid) {
        formGroup.classList.add('error');
        isValid = false;
      } else {
        formGroup.classList.remove('error');
      }
    });

    if (!isValid) {
      event.preventDefault(); // Impede o envio se houver erro
      
      // Rola suavemente até o primeiro campo com pendência
      const firstError = form.querySelector('.form-group.error input, .form-group.error select');
      if (firstError) {
        firstError.focus();
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });

  // Limpa a marcação de erro quando o usuário digita no campo
  form.querySelectorAll('input, select').forEach((field) => {
    field.addEventListener('input', () => {
      const formGroup = field.closest('.form-group');
      if (formGroup && formGroup.classList.contains('error')) {
        formGroup.classList.remove('error');
      }
    });
  });
});
