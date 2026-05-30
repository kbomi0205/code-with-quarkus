// ================================================================
// login.js
// 로그인 폼 유효성 검사 + SHA-256 해시 후 폼 제출
// login.html에서 사용
// input_check.js의 showError / clearError 함수 사용
// input_sha256.js의 hashPassword 함수 사용
// ================================================================


// ① 로그인 버튼 클릭 시 실행되는 유효성 검사 함수
// - 아이디 / 패스워드 형식 검사 후 모두 통과하면 submitLogin() 호출
function validateAndLogin() {
    let valid = true;   // 전체 유효성 통과 여부 플래그

    // 입력 필드 값 가져오기
    const username = document.getElementById('usernameInput').value.trim();
    const password = document.getElementById('passwordInput').value;

    // 아이디: 4~20자 영문/숫자만 허용
    const usernameRegex = /^[a-zA-Z0-9]{4,20}$/;
    if (!usernameRegex.test(username)) {
        showError('usernameInput', '아이디는 4~20자 영문/숫자만 가능합니다.');
        valid = false;
    } else {
        clearError('usernameInput');
    }

    // 패스워드: 8자 이상, 영문+숫자+특수문자 포함
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    if (!passwordRegex.test(password)) {
        showError('passwordInput', '8자 이상, 영문+숫자+특수문자 포함 필요.');
        valid = false;
    } else {
        clearError('passwordInput');
    }

    // 아이디 / 패스워드 모두 유효성 통과 시 로그인 실행
    if (valid) submitLogin();
}


// ② 실제 로그인 처리 함수
// - 입력한 패스워드를 SHA-256 해시로 변환 후 hidden input에 저장
// - 폼을 서버로 제출 (POST /login_check)
async function submitLogin() {
    const password = document.getElementById('passwordInput').value;

    // 패스워드를 SHA-256 해시로 변환 (input_sha256.js의 hashPassword 함수 사용)
    const hashed = await hashPassword(password);

    // hidden input(id="password")에 해시값 저장
    // 실제 서버로 전송되는 값은 이 해시값 (평문 패스워드는 전송되지 않음)
    document.getElementById('password').value = hashed;

    // loginForm 제출 → POST /login_check 로 아이디 + 해시된 패스워드 전송
    document.getElementById('loginForm').submit();
}