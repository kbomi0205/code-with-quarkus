// ================================================================
// toggle.js
// 다크 / 라이트 모드 전환 기능
// 전체 페이지 공통 사용 (네비바 색상 + body 클래스 동시 변경)
// ================================================================


// ===== 다크/라이트 모드 토글 함수 =====
// 네비바 DARK / LIGHT 버튼 클릭 시 실행
// - body에 'light-mode' 클래스를 추가/제거해 테마 전환
// - 네비바 색상 클래스도 함께 변경
function toggleTheme() {
    const body    = document.body;
    const btn     = document.getElementById('themeToggleBtn');
    const navbar  = document.querySelector('.navbar');

    // body에 light-mode 클래스 토글 (있으면 제거, 없으면 추가)
    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        // 라이트 모드로 전환
        btn.textContent = 'LIGHT';
        navbar.classList.remove('navbar-dark', 'bg-dark');  // 다크 클래스 제거
        navbar.classList.add('navbar-light', 'bg-light');   // 라이트 클래스 추가
    } else {
        // 다크 모드로 전환
        btn.textContent = 'DARK';
        navbar.classList.remove('navbar-light', 'bg-light'); // 라이트 클래스 제거
        navbar.classList.add('navbar-dark', 'bg-dark');      // 다크 클래스 추가
    }
}

// ===== 이벤트 리스너 방식으로 토글 버튼에 클릭 이벤트 등록 =====
// HTML의 onclick="toggleTheme()" 인라인 방식 대신
// JS에서 addEventListener로 등록 (HTML과 JS 분리)
document.addEventListener('DOMContentLoaded', function() {
    const btn = document.getElementById('themeToggleBtn');
    if (btn) {
        btn.addEventListener('click', toggleTheme);
    }
});