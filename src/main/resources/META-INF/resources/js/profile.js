// ================================================================
// profile.js
// 로그인한 사용자 정보를 서버에서 가져와 화면에 출력
// profile.html : 프로필 사진 / 아이디 / 이메일 / 연락처 표시
// main_after_login.html : 네비바 프로필 버튼에 툴팁으로 사용자명 표시
// ================================================================


// 페이지 로드 완료 시 실행
window.onload = function() {

    // GET /profile/info 요청 → 서버에서 로그인한 사용자 정보를 JSON으로 받아옴
    fetch('/profile/info')
        .then(res => res.json())    // 응답을 JSON으로 파싱
        .then(data => {
            // data = { username, email, phone, profileImage }

            // ===== profile.html 전용 =====
            // 각 요소가 없는 페이지(main_after_login.html)에서는 null 체크로 스킵

            // 아이디 출력
            const infoUsername = document.getElementById('infoUsername');
            if (infoUsername) infoUsername.textContent = data.username;

            // 이메일 출력
            const infoEmail = document.getElementById('infoEmail');
            if (infoEmail) infoEmail.textContent = data.email;

            // 연락처 출력
            const infoPhone = document.getElementById('infoPhone');
            if (infoPhone) infoPhone.textContent = data.phone;

            // 프로필 사진 출력
            // profileImage가 있을 때만 src 교체 (없으면 기본 이미지 유지)
            const profileImg = document.getElementById('profileImg');
            if (profileImg && data.profileImage) {
                profileImg.src = '/uploads/profile/' + data.profileImage;
            }

            // ===== main_after_login.html 전용 =====
            // 네비바 프로필 버튼에 마우스 오버 시 사용자명을 툴팁으로 표시
            const profileLink = document.getElementById('profileNavLink');
            if (profileLink) {
                // data-bs-title 속성에 사용자명 동적으로 설정
                profileLink.setAttribute('data-bs-title', '👋 ' + data.username);
                // fetch 이후 동적으로 title이 설정되므로 JS로 툴팁 초기화 필수
                new bootstrap.Tooltip(profileLink);
            }
        });
}