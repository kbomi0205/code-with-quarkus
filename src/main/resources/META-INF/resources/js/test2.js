// ================================================================
// test2.js
// Week 7 - JavaScript 배열 성능 테스트 실습 코드
// 단순 배열 vs 객체 배열의 탐색/가공 속도 비교
// F12 콘솔에서 결과 확인
// ================================================================


// ===== 테스트용 대량 데이터 생성 =====
// 100만 개의 단순 문자열 배열과 객체 배열을 각각 생성
const iteration   = 1000000;
const simpleArray = [];   // 단순 문자열 배열 ["Item_0", "Item_1", ...]
const objectArray = [];   // 객체 배열 [{ id: 0, title: "Item_0", category: "General" }, ...]

console.log("데이터 생성 중...");
for (let i = 0; i < iteration; i++) {
    simpleArray.push(`Item_${i}`);
    objectArray.push({ id: i, title: `Item_${i}`, category: 'General' });
}


// ===== 1. 탐색(Search) 성능 테스트 =====
// 마지막 요소(Item_999999)를 찾는 데 걸리는 시간 비교
console.log("\n--- 탐색 성능 테스트 (마지막 요소 찾기) ---");

// 단순 배열: indexOf()로 탐색
console.time("Simple Array Search");
const result1 = simpleArray.indexOf("Item_999999");
console.timeEnd("Simple Array Search");

// 객체 배열: find()로 탐색 (객체 속성 비교)
console.time("Object Array Search");
const result2 = objectArray.find(item => item.title === "Item_999999");
console.timeEnd("Object Array Search");


// ===== 2. 가공(Map) 성능 테스트 =====
// 전체 요소를 순회하며 새 배열로 가공하는 데 걸리는 시간 비교
console.log("\n--- 데이터 가공 성능 테스트 (전체 순회) ---");

// 단순 배열: 문자열에 "_Updated" 추가
console.time("Simple Array Map");
simpleArray.map(item => item + "_Updated");
console.timeEnd("Simple Array Map");

// 객체 배열: 스프레드 연산자로 updated 속성 추가
console.time("Object Array Map");
objectArray.map(item => ({ ...item, updated: true }));
console.timeEnd("Object Array Map");