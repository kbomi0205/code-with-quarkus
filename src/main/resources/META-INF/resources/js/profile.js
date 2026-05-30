window.onload = function() {
    fetch('/profile/info')
        .then(res => res.json())
        .then(data => {

            const infoUsername = document.getElementById('infoUsername');
            const infoEmail = document.getElementById('infoEmail');
            const infoPhone = document.getElementById('infoPhone');
            const profileImg = document.getElementById('profileImg');

            if (infoUsername) infoUsername.textContent = data.username;
            if (infoEmail) infoEmail.textContent = data.email;
            if (infoPhone) infoPhone.textContent = data.phone;
            if (profileImg && data.profileImage) {
                profileImg.src = '/uploads/profile/' + data.profileImage;
            }

            const profileLink = document.getElementById('profileNavLink');
            if (profileLink) {
                profileLink.setAttribute('data-bs-title', '👋 ' + data.username);
                new bootstrap.Tooltip(profileLink);
            }
        });
}