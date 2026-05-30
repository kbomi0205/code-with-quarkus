// ================================================================
// search.js
// 챔피언 / 뉴스 검색 기능 및 검색 결과 화면 출력
// main_index.html, main_after_login.html에서 사용
// ================================================================


// ===== 검색 폼 제출 이벤트 =====
// 폼 기본 동작(새로고침)을 막고 검색어로 performSearch() 실행
document.getElementById('searchForm').addEventListener('submit', function(e) {
    e.preventDefault();  // 새로고침 방지
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;  // 검색어가 없으면 실행 안 함
    performSearch(query);
});


// ===== 챔피언 데이터 =====
// 검색 대상이 되는 챔피언 목록 (이름, 영문명, 역할, 라인, 이미지, 난이도)
const CHAMPIONS = [
    { name: '아트록스', engName: 'Aatrox',  role: '전사',        lane: '탑',        img: 'image/a1.jpg',     difficulty: '상', modalId: 'modalAatrox' },
    { name: '사일러스', engName: 'Sylas',   role: '마법사',      lane: '정글/미드',  img: 'image/sylas.jpg',  difficulty: '중', modalId: 'modalSylas'  },
    { name: '애니비아', engName: 'Anivia',  role: '마법사',      lane: '미드',       img: 'image/anivia.jpg', difficulty: '상', modalId: 'modalAnivia' },
    { name: '브라이어', engName: 'Briar',   role: '전사',        lane: '정글',       img: 'image/briar.jpg',  difficulty: '중', modalId: 'modalBriar'  },
    { name: '잭스',     engName: 'Jax',     role: '전사',        lane: '탑',         img: 'image/jax.jpg',    difficulty: '하', modalId: 'modalJax'    },
    { name: '징크스',   engName: 'Jinx',    role: '원거리딜러',  lane: '원딜',       img: 'image/jinx.jpg',   difficulty: '중', modalId: 'modalJinx'   },
    { name: '멜',       engName: 'Mel',     role: '마법사',      lane: '미드',       img: 'image/mel.jpg',    difficulty: '중', modalId: 'modalMel'    },
    { name: '유나라',   engName: 'Yunara',  role: '원거리 딜러', lane: '바텀',       img: 'image/yunara.jpg', difficulty: '중', modalId: 'modalYunara' },
    { name: '자헨',     engName: 'Jahen',   role: '전사',        lane: '탑',         img: 'image/jahen.jpg',  difficulty: '상', modalId: 'modalJahen'  }
];

// ===== 뉴스 데이터 =====
// 검색 대상이 되는 뉴스 목록 (제목, 설명, 카테고리)
const NEWS = [
    { title: '새로운 챔피언 출시', desc: '2026 루나 레벨 이벤트! 신규 챔피언과 함께하는 특별한 시즌.', category: '게임 업데이트' },
    { title: '패치 노트 16.4',    desc: '챔피언 밸런스 및 아이템 업데이트 내용을 확인하세요.',         category: '패치 노트' }
];


// ===== 검색 실행 함수 =====
// 검색어를 기준으로 챔피언 / 뉴스 데이터를 필터링해 결과를 화면에 출력
function performSearch(query) {
    const q = query.trim().toLowerCase();  // 앞뒤 공백 제거 + 소문자 변환 (대소문자 구분 없이 검색)
    if (!q) {
        showMainScreen();  // 검색어가 없으면 메인 화면으로 복귀
        return;
    }

    // 검색어를 화면 상단에 표시
    document.getElementById('searchKeywordDisplay').textContent = `"${query}"`;

    // 챔피언 데이터 필터링: 이름 / 영문명 / 역할 / 라인 중 하나라도 검색어 포함 시 결과에 추가
    const champResults = CHAMPIONS.filter(c =>
        c.name.includes(q) ||
        c.engName.toLowerCase().includes(q) ||
        c.role.includes(q) ||
        c.lane.includes(q)
    );

    // 뉴스 데이터 필터링: 제목 / 설명 / 카테고리 중 하나라도 검색어 포함 시 결과에 추가
    const newsResults = NEWS.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.desc.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q)
    );

    // 카테고리 사이드바에 검색 결과 개수 표시
    document.getElementById('champCount').textContent = `(${champResults.length})`;
    document.getElementById('newsCount').textContent  = `(${newsResults.length})`;

    // 챔피언 검색 결과 출력
    // 결과 없으면 안내 메시지, 있으면 카드 형태로 출력
    const champList = document.getElementById('championResultList');
    if (champResults.length === 0) {
        champList.innerHTML = `
            <div class="no-result">
                <h4>검색 결과 없음</h4>
                <p>"${query}"에 해당하는 챔피언이 없습니다.</p>
            </div>`;
    } else {
        champList.innerHTML = champResults.map(c => `
            <div class="search-result-card d-flex align-items-center p-0 overflow-hidden"
                data-bs-toggle="modal"
                data-bs-target="#${c.modalId}"
                style="cursor:pointer;">
                <img src="${c.img}" alt="${c.name}">
                <div class="p-3">
                    <div style="font-weight:700; font-size:1rem; color:#111;">
                        ${c.name} <span style="color:#888; font-size:0.85rem;">(${c.engName})</span>
                    </div>
                    <div style="color:#555; font-size:0.9rem; margin-top:4px;">
                        역할: ${c.role} &nbsp;|&nbsp; 라인: ${c.lane} &nbsp;|&nbsp; 난이도: ${c.difficulty}
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 뉴스 검색 결과 출력
    // 결과 없으면 안내 메시지, 있으면 카드 형태로 출력
    const newsList = document.getElementById('newsResultList');
    if (newsResults.length === 0) {
        newsList.innerHTML = `
            <div class="no-result">
                <h4>검색 결과 없음</h4>
                <p>"${query}"에 해당하는 뉴스가 없습니다.</p>
            </div>`;
    } else {
        newsList.innerHTML = newsResults.map(n => `
            <div class="search-result-card p-3">
                <span style="font-size:0.75rem; background:#c8253a; color:#fff; padding:2px 8px; border-radius:3px;">
                    ${n.category}
                </span>
                <div style="font-weight:700; font-size:1rem; color:#111; margin-top:8px;">${n.title}</div>
                <div style="color:#555; font-size:0.9rem; margin-top:4px;">${n.desc}</div>
            </div>
        `).join('');
    }

    // 검색 결과 표시 시 챔피언 탭을 기본으로 활성화
    switchCategory('champion', document.querySelector('.search-category-item'));

    // 히어로 섹션 및 기타 섹션 숨기고 검색 결과 섹션만 표시
    document.querySelector('.hero').classList.add('d-none');
    document.querySelectorAll('section:not(#searchResults)').forEach(s => s.classList.add('d-none'));
    document.getElementById('searchResults').classList.remove('d-none');
    document.getElementById('searchResults').style.display = 'block';
}


// ===== 메인 화면 복귀 함수 =====
// 검색 결과 섹션을 숨기고 원래 메인 화면으로 돌아옴
function showMainScreen() {
    document.getElementById('searchResults').classList.add('d-none');
    document.querySelectorAll('section:not(#searchResults)').forEach(s => s.classList.remove('d-none'));
}


// ===== 카테고리 탭 전환 함수 =====
// 챔피언 / 뉴스 탭 클릭 시 해당 결과만 표시하고 나머지는 숨김
function switchCategory(type, element) {
    // 모든 카테고리 탭에서 active 클래스 제거
    document.querySelectorAll('.search-category-item').forEach(item => {
        item.classList.remove('active');
    });

    // 클릭한 탭에 active 클래스 추가
    element.classList.add('active');

    // 선택한 탭에 해당하는 결과만 표시
    if (type === 'champion') {
        document.getElementById('resultChampion').style.display = 'block';
        document.getElementById('resultNews').style.display     = 'none';
    } else {
        document.getElementById('resultChampion').style.display = 'none';
        document.getElementById('resultNews').style.display     = 'block';
    }
}