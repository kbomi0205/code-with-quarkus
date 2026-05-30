// ================================================================
// input_sha256.js
// 브라우저 내장 Web Crypto API를 이용한 SHA-256 암호화 함수 모음
// register.html, login.html, profile.html에서 사용
// ================================================================

// ① SHA-256 해시 변환 함수
// - 입력받은 문자열(패스워드)을 SHA-256 해시값(소문자 16진수)으로 변환해 반환
// - async/await 사용 (비동기 처리)
async function hashPassword(password) {
    const encoder = new TextEncoder();                              // 문자열 → UTF-8 바이트 배열로 변환
    const data = encoder.encode(password);                         // 패스워드를 바이트 배열로 인코딩
    const hashBuffer = await crypto.subtle.digest('SHA-256', data); // Web Crypto API로 SHA-256 해시 생성
    const hashArray = Array.from(new Uint8Array(hashBuffer));      // 해시 결과를 일반 배열로 변환
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // 16진수 문자열로 변환 후 합치기
}


// ② 가입 확인 모달 표시 함수
// - 입력된 정보를 모달에 출력하고, 패스워드를 SHA-256 해시로 변환해 hidden 필드에 저장
async function showConfirmModal() {
    // 입력 필드 값 가져오기
    const username = document.getElementById('username').value.trim();
    const email    = document.getElementById('email').value.trim();
    const phone    = document.getElementById('phone').value.trim();
    const password = document.getElementById('password').value;

    // 모달 내 확인 테이블에 입력 정보 표시
    document.getElementById('confirmUsername').textContent = username;
    document.getElementById('confirmEmail').textContent    = email;
    document.getElementById('confirmPhone').textContent    = phone;

    // 패스워드를 SHA-256 해시로 변환 → hidden input(id="hashedPassword")에 저장
    // 실제 서버로 전송되는 값은 이 해시값 (평문 패스워드는 전송되지 않음)
    const hashed = await hashPassword(password);
    document.getElementById('hashedPassword').value = hashed;

    // 개발용: F12 콘솔에서 해시값 확인 가능
    console.log('해시된 패스워드 :', hashed);

    // Bootstrap 모달 객체 생성 후 표시
    const modal = new bootstrap.Modal(document.getElementById('confirmModal'));
    modal.show();
}


// ③ 가입하기 버튼 클릭 시 실행되는 함수
// - 확인 모달을 닫고 회원가입 폼을 서버로 제출
function submitRegister() {
    // 열려있는 확인 모달 닫기
    bootstrap.Modal.getInstance(document.getElementById('confirmModal')).hide();

    // registerForm 제출 → POST /register_check 로 가입 정보 전송
    // 전송 데이터: username, email, phone, hashedPassword(SHA-256 해시값)
    document.getElementById('registerForm').submit();
}