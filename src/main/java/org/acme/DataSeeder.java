package org.acme;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.transaction.Transactional;
import org.acme.login.User;

// ================================================================
// DataSeeder.java
// 서버 시작 시 DB에 초기 데이터를 자동으로 삽입하는 클래스
// 챔피언 데이터 + guest 계정을 테이블이 비어있을 때만 삽입
// ================================================================

@ApplicationScoped  // 애플리케이션 전체에서 하나의 인스턴스만 생성
public class DataSeeder {

    // 서버 시작(StartupEvent) 시 자동으로 실행되는 메서드
    // @Transactional: DB 작업을 하나의 트랜잭션으로 처리
    @Transactional
    void onStart(@Observes StartupEvent ev) {

        // 챔피언 테이블이 비어있을 때만 초기 데이터 삽입 (중복 방지)
        if (Champion.count() == 0) {
            persist("아트록스", "전사",       "탑");
            persist("사일러스", "마법사",     "정글/미드");
            persist("애니비아", "마법사",     "미드");
            persist("브라이어", "전사",       "정글");
            persist("잭스",     "전사",       "탑");
            persist("징크스",   "원거리딜러", "원딜");
            persist("야스오",   "전사",       "미드/탑");
            persist("리신",     "전사",       "정글");
            persist("티모",     "마법사",     "탑");
            persist("케인",     "암살자",     "정글");
            persist("루시안",   "원거리딜러", "원딜/미드");
        }

        // users 테이블이 비어있을 때만 guest 계정 삽입 (중복 방지)
        // password는 SHA-256 해시값으로 저장 (평문 저장 금지)
        if (User.count() == 0) {
            User guest = new User();
            guest.username = "guest";
            guest.password = "73C97C725A23D64834A9CF6A2A153C8ABCEDFA8E4996E44D8A1C8F3361B5E1C0";
            guest.persist();
        }
    }

    // 챔피언 데이터를 DB에 저장하는 헬퍼 메서드
    private void persist(String name, String role, String line) {
        Champion c = new Champion();
        c.name = name;
        c.role = role;
        c.line = line;
        c.persist();  // Panache를 통해 DB에 저장
    }
}