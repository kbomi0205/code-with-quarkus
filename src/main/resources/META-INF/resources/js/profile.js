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
        .then(res => res.json())
        .then(data => {

            // 기존 정보 테이블 표시 (유지)
            document.getElementById('infoUsername').textContent = data.username;
            document.getElementById('infoEmail').textContent    = data.email;
            document.getElementById('infoPhone').textContent    = data.phone;

            // 프로필 사진 출력 (없으면 기본 이미지 유지)
            if (data.profileImage) {
                document.getElementById('profileImg').src =
                    '/uploads/profile/' + data.profileImage;
            }

            // 수정 폼에 기존 값 자동 채우기
            document.getElementById('updateEmail').value = data.email;
            document.getElementById('updatePhone').value = data.phone;

            // 네비바 프로필 버튼 툴팁으로 사용자명 표시
            const profileLink = document.getElementById('profileNavLink');
            if (profileLink) {
                profileLink.setAttribute('data-bs-title', '👋 ' + data.username);
                new bootstrap.Tooltip(profileLink);
            }
        });

    // URL 파라미터로 수정 결과 메시지 표시
    const params  = new URLSearchParams(window.location.search);
    const error   = params.get('error');
    const success = params.get('success');
    const msgEl   = document.getElementById('updateMsg');

    // 회원정보 수정 성공
    if (success === 'updated') {
        msgEl.className   = 'alert alert-success';
        msgEl.textContent = '✅ 개인정보가 수정되었습니다.';
    // 이메일 중복 오류
    } else if (error === 'duplicate_email') {
        msgEl.className   = 'alert alert-danger';
        msgEl.textContent = '⚠️ 이미 사용 중인 이메일입니다.';
    }
    // 비밀번호 변경 성공 처리
    if (success === 'password_changed') {
        showToast('✅ 비밀번호가 변경되었습니다. 로그인 페이지로 이동합니다.', 'success');
        // 3.5초 후 로그아웃 후 로그인 페이지로 이동
        setTimeout(function() {
            window.location.href = '/logout?next=login';
        }, 3500);
    }

    if (error === 'wrong_password') {
        // ①Toast 먼저(즉각알림)
        showToast('현재비밀번호가일치하지않습니다.', 'danger');
        const pwMsgEl= document.getElementById('pwMsg');
        if (pwMsgEl) {
            pwMsgEl.className = 'alert alert-danger';
            pwMsgEl.textContent= '현재비밀번호가일치하지않습니다.';
        }
    }
    if (error) {
        const messages = {
            'invalid_type': 'jpg, png, gif, webp파일만가능합니다.',
            'too_large': '파일크기는5MB 이하여야합니다.',
            'upload_fail': '업로드실패. 다시시도해주세요.'
        };
        const msg = messages[error];
        const div = document.getElementById('uploadErrorMsg');
        if (msg && div) {
            div.textContent= msg;
            div.classList.remove('d-none');
        }
    }
}


// ===== 회원정보 수정 유효성 검사 함수 =====
function validateAndUpdate() {
    let valid = true;
    const email = document.getElementById('updateEmail').value.trim();
    const phone = document.getElementById('updatePhone').value.trim();

    // 이메일 형식 검사
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showFieldError('updateEmail', 'updateEmailMsg', '올바른 이메일 형식이 아닙니다.');
        valid = false;
    } else {
        clearFieldError('updateEmail');
    }

    // 연락처 형식 검사 (010-0000-0000)
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
        showFieldError('updatePhone', 'updatePhoneMsg', '010-0000-0000 형식으로 입력해주세요.');
        valid = false;
    } else {
        clearFieldError('updatePhone');
    }

    // 모두 통과 시 폼 제출 → POST /profile/update
    if (valid) document.getElementById('updateForm').submit();
}


// ===== profile.js 전용 유효성 표시/제거 함수 =====
function showFieldError(fieldId, msgId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('is-invalid');
    const msg = document.getElementById(msgId);
    if (msg) msg.textContent = message;
}

function clearFieldError(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.remove('is-invalid');
    field.classList.add('is-valid');
}

// ===== 비밀번호 변경 유효성 검사 + 해시 함수 =====
// 비밀번호 변경 버튼 클릭 시 실행
async function validateAndChangePassword() {
    let valid = true;
    const currentPw    = document.getElementById('currentPwInput').value;
    const newPw        = document.getElementById('newPwInput').value;
    const newPwConfirm = document.getElementById('newPwConfirm').value;

    // ① 현재 비밀번호 빈 값 체크
    if (!currentPw) {
        showFieldError('currentPwInput', 'currentPwMsg', '현재 비밀번호를 입력해주세요.');
        valid = false;
    } else {
        clearFieldError('currentPwInput');
    }

    // ② 새 비밀번호 정규식 검사 (8자 이상, 영문+숫자+특수문자)
    const pwRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!pwRegex.test(newPw)) {
        showFieldError('newPwInput', 'newPwMsg', '8자 이상, 영문+숫자+특수문자를 포함해야 합니다.');
        valid = false;
    } else {
        clearFieldError('newPwInput');
    }

    // ③ 새 비밀번호 확인 일치 여부
    if (newPw !== newPwConfirm) {
        showFieldError('newPwConfirm', 'newPwConfirmMsg', '새 비밀번호가 일치하지 않습니다.');
        valid = false;
    } else {
        clearFieldError('newPwConfirm');
    }

    if (!valid) return;

    // ④ 현재/새 비밀번호 SHA-256 해시 생성 후 hidden input에 저장
    const hashedCurrent = await hashPassword(currentPw);
    const hashedNew     = await hashPassword(newPw);
    document.getElementById('currentPassword').value = hashedCurrent;
    document.getElementById('newPassword').value     = hashedNew;

    // 개발용: F12 콘솔에서 해시값 확인
    console.log('현재 PW 해시 :', hashedCurrent);
    console.log('새 PW 해시   :', hashedNew);

    // pwForm 제출 → POST /profile/password 로 전송
    document.getElementById('pwForm').submit();
}