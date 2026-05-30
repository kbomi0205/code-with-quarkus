package org.acme;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;

// ================================================================
// Champion.java
// 챔피언 엔티티 클래스
// DB의 'champion' 테이블과 매핑되며 서버 시작 시 자동으로 테이블 생성
// PanacheEntity 상속으로 기본 CRUD 메서드(persist, listAll 등) 자동 제공
// ================================================================

@Entity  // JPA 엔티티 선언 → DB 테이블로 자동 생성
public class Champion extends PanacheEntity {
    // PanacheEntity가 id(PK) 컬럼을 자동으로 제공

    public String name; // 챔피언 이름 (예: 아트록스)
    public String role; // 역할군   (예: 전사, 마법사, 원거리딜러)
    public String line; // 포지션   (예: 탑, 미드, 정글)
}