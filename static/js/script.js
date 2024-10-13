const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
    const li = item.parentElement;

    item.addEventListener('click', function () {
        allSideMenu.forEach(i=> {
            i.parentElement.classList.remove('active');

        })
        li.classList.add('active');
    

    });
});

// TOGGLE SIDEBAR


const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

// Verifica se há um estado de menu armazenado no localStorage
const menuState = localStorage.getItem('menuState');
if (menuState === 'collapsed') {
    sidebar.classList.add('hide');
}

menuBar.addEventListener('click', function (e) {
    // Verifica se o clique ocorreu no ícone do menu
    if (e.target.classList.contains('bx-menu') || e.target.parentElement.classList.contains('bx-menu')) {
        sidebar.classList.toggle('hide');

        // Salva o estado do menu no localStorage
        if (sidebar.classList.contains('hide')) {
            localStorage.setItem('menuState', 'collapsed');
        } else {
            localStorage.setItem('menuState', 'expanded');
        }
    }
});



const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
    if(window.innerWidth < 576 ) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
        }else{
            searchButtonIcon.classList.replace('bx-x', 'bx-search');

        }

    }
})

//aviso alert aqui 
if(window.innerWidth < 768) {
    sidebar.classList.add('hide');

}else if (window.innerWidth > 576){
    searchButtonIcon.classList.replace('bx-x', 'bx-search');
    searchForm.classList.remove('show');

}

window.addEventListener('resize', function() {
    if (this.innerWidth > 576){
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
})

const menuIcon = document.querySelector('.bx.bxs-user-circle'); // Seleciona o ícone do menu
const dropdownMenu = document.querySelector('#dropdown-menu'); // Seleciona o menu suspenso

menuIcon.addEventListener('click', function (e) {
    // Verifica se o clique ocorreu no ícone do menu
    dropdownMenu.style.display = dropdownMenu.style.display === 'block' ? 'none' : 'block';
    // Adiciona ou remove a classe 'active' no ícone do menu
    menuIcon.classList.toggle('active');
});

// Adiciona um evento de clique no documento inteiro
document.addEventListener('click', function (e) {
    // Verifica se o clique ocorreu fora do menu
    if (!dropdownMenu.contains(e.target) && e.target !== menuIcon) {
        dropdownMenu.style.display = 'none';
        // Remove a classe 'active' do ícone do menu quando o menu é fechado
        menuIcon.classList.remove('active');
    }
});