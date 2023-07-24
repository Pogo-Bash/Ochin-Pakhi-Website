document.addEventListener('DOMContentLoaded', function () {
    const buttons = document.querySelectorAll('.nav-button');
    
    buttons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();
        const url = this.getAttribute('href');
        window.location.href = url;
      });
    });
  });