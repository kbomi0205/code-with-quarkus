// ================================================================
// test.js
// Week 6 - JavaScript 기초 실습 코드 (주석으로 보존)
// + Bootstrap Toast 알림 함수 (전체 페이지 공통 사용)
// ================================================================


// ===== Week 6 실습: var / let / const 차이 =====

// 1. 스코프 차이
// var  → 함수 스코프 (블록 밖에서도 접근 가능)
// let  → 블록 스코프 (블록 밖에서 접근 불가 → ReferenceError)
// const → 블록 스코프 (블록 밖에서 접근 불가 → ReferenceError)
// console.log("===== 1. 스코프 차이 =====");
// if (true) {
//     var a = "var 변수";
//     let b = "let 변수";
//     const c = "const 변수";
// }
// console.log("var a:", a);   // 접근 가능
// console.log("let b:", b);   // ReferenceError
// console.log("const c:", c); // ReferenceError

// 2. 재선언 & 재할당
// var   → 재선언 O / 재할당 O
// let   → 재선언 X / 재할당 O
// const → 재선언 X / 재할당 X
// console.log("===== 2. 재선언 & 재할당 =====");
// var x = 10;
// var x = 20;   // 가능
// console.log("var 재선언:", x);
// let y = 30;
// // let y = 40; // 에러 (재선언 불가)
// y = 40;        // 재할당 가능
// console.log("let 재할당:", y);
// const z = 50;
// // z = 60;     // 에러 (재할당 불가)
// console.log("const 값:", z);

// 3. 호이스팅
// var   → 선언이 최상단으로 끌어올려짐 (undefined로 초기화)
// let   → 호이스팅은 되지만 초기화 전 접근 시 ReferenceError
// const → 호이스팅은 되지만 초기화 전 접근 시 ReferenceError
// console.log("===== 3. 호이스팅 =====");
// console.log(testVar);   // undefined
// var testVar = 100;
// console.log(testLet);   // ReferenceError
// let testLet = 200;
// console.log(testConst); // ReferenceError
// const testConst = 300;


// ===== Bootstrap Toast 알림 함수 =====
// 화면 우측 하단에 알림 메시지를 3초간 표시
// type: 'success'(초록) / 'danger'(빨강) / 'warning'(노랑)
// 사용 예) showToast('로그인 성공!');
//         showToast('오류 발생!', 'danger');
function showToast(message, type = 'success') {
    const toastEl   = document.getElementById('liveToast');
    const toastBody = document.getElementById('toastBody');

    // Toast 요소가 없는 페이지에서는 실행 안 함
    if (!toastEl || !toastBody) return;

    // type에 따라 배경 색상 클래스 변경
    toastEl.className = `toast align-items-center text-white bg-${type} border-0`;

    // 메시지 텍스트 설정
    toastBody.textContent = message;

    // Bootstrap Toast 객체 생성 후 3초간 표시
    const toast = new bootstrap.Toast(toastEl, { delay: 3000 });
    toast.show();
}