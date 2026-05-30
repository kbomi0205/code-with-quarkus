package org.acme.login;

import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.SessionHandler;
import io.vertx.ext.web.sstore.LocalSessionStore;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import io.vertx.core.Vertx;

// ================================================================
// SessionConfig.java
// 세션 기능 설정 클래스
// 로그인 상태 유지를 위한 서버 측 세션 저장소 설정
// ================================================================

public class SessionConfig {

    @Inject         // Quarkus 컨테이너가 자동으로 Vertx 인스턴스 주입
    Vertx vertx;    // 세션 저장소 생성에 필요한 Vertx 인스턴스

    // 서버 시작 시 라우터에 세션 핸들러 등록
    public void init(@Observes Router router) {
        router.route().handler(
            SessionHandler
                .create(LocalSessionStore.create(vertx)) // 서버 메모리에 세션 저장 (로컬 저장소)
                .setSessionTimeout(60 * 60 * 1000L)      // 세션 유지 시간: 1시간 (밀리초 단위)
                .setCookieHttpOnlyFlag(true)              // JS에서 세션 쿠키 접근 차단 (보안 강화)
        );
    }
}