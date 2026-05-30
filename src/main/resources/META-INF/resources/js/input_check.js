// ================================================================
// input_check.js
// 회원가입 폼 유효성 검사 및 에러 메시지 표시/제거 함수 모음
// register.html에서 사용
// ================================================================

// ① 필드에 에러 표시 함수
// - 해당 입력 필드에 빨간 테두리(is-invalid) 표시
// - 필드 아래 에러 메시지 출력
function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    field.classList.add('is-invalid');       // Bootstrap 빨간 테두리 적용
    const msg = document.getElementById(fieldId + 'Msg');
    if (msg) msg.textContent = message;      // 에러 메시지 텍스트 출력
}


// ② 필드 에러 제거 함수
// - 빨간 테두리 제거 후 초록 테두리(is-valid)로 변경
function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.remove('is-invalid');    // 빨간 테두리 제거
    field.classList.add('is-valid');         // Bootstrap 초록 테두리 적용
}


// ③ 회원가입 버튼 클릭 시 실행되는 유효성 검사 함수
// - 모든 항목이 통과되면 가입 확인 모달창 표시
function validateAndShowModal() {
    let valid = true;   // 전체 유효성 통과 여부 플래그

    // 각 입력 필드 값 가져오기
    const username        = document.getElementById('username').value.trim();
    const password        = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;
    const email           = document.getElementById('email').value.trim();
    const phone           = document.getElementById('phone').value.trim();

    // 아이디: 4~20자 영문/숫자만 허용
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!usernameRegex.test(username)) {
        showError('username', '아이디는 4~20자 영문/숫자만 가능합니다.');
        valid = false;
    } else {
        clearError('username');
    }

    // 패스워드: 8자 이상, 영문+숫자+특수문자 포함
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
        showError('password', '8자 이상, 영문+숫자+특수문자를 포함 필요.');
        valid = false;
    } else {
        clearError('password');
    }

    // 패스워드 확인: 위에서 입력한 패스워드와 일치 여부 확인
    if (password !== passwordConfirm) {
        showError('passwordConfirm', '패스워드가 일치하지 않습니다.');
        valid = false;
    } else {
        clearError('passwordConfirm');
    }

    // 이메일: xxx@xxx.xxx 형식 확인
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('email', '올바른 이메일 형식이 아닙니다.');
        valid = false;
    } else {
        clearError('email');
    }

    // 연락처: 010-0000-0000 형식 확인
    const phoneRegex = /^010-\d{4}-\d{4}$/;
    if (!phoneRegex.test(phone)) {
        showError('phone', '010-0000-0000 형식으로 입력해주세요.');
        valid = false;
    } else {
        clearError('phone');
    }

    // 모든 유효성 검사 통과 시 가입 확인 모달창 표시
    if (valid) showConfirmModal();
}


// ④ 페이지 로드 시 실행
// - URL 파라미터에 에러 값이 있으면 해당 필드에 에러 표시
// - 서버에서 중복 체크 후 redirect할 때 ?error=값 형태로 전달됨
window.onload = function() {
    const params = new URLSearchParams(window.location.search);
    const error  = params.get('error');

    if (error === 'duplicate_username') {
        showError('username', '이미 사용 중인 아이디입니다.');
    } else if (error === 'duplicate_email') {
        showError('email', '이미 사용 중인 이메일입니다.');
    }
}