package org.acme.login;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

// ================================================================
// User.java
// 사용자 엔티티 클래스
// DB의 'users' 테이블과 매핑되며 서버 시작 시 자동으로 테이블 생성
// PanacheEntity 상속으로 기본 CRUD 메서드(persist, find 등) 자동 제공
// ================================================================

@Entity             // JPA 엔티티 선언 → DB 테이블로 자동 생성
@Table(name = "users")  // 테이블명을 'users'로 지정
public class User extends PanacheEntity {
    // PanacheEntity가 id(PK) 컬럼을 자동으로 제공

    public String username;     // 아이디
    public String password;     // 패스워드 (SHA-256 해시값으로 저장)

    @Column(unique = true)      // 이메일 중복 가입 방지
    public String email;        // 이메일

    public String phone;        // 연락처 (010-0000-0000 형식)
    public String profileImage; // 프로필 사진 파일명 (UUID 기반으로 저장)

    // 아이디로 사용자 조회
    // 로그인 / 세션 체크 / 프로필 조회 시 사용
    public static User findByUsername(String username) {
        return find("username", username).firstResult();
    }

    // 이메일로 사용자 조회
    // 회원가입 / 정보 수정 시 이메일 중복 체크에 사용
    public static User findByEmail(String email) {
        return find("email", email).firstResult();
    }
}