document.getElementById('user-info').textContent = (function () {
    const user = localStorage.getItem('user');
    console.log(user);
    return user ? user : "Guest";
})();