package org.acme;

// WebSocket 관련 Jakarta 라이브러리
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.websocket.OnClose;
import jakarta.websocket.OnError;
import jakarta.websocket.OnMessage;
import jakarta.websocket.OnOpen;
import jakarta.websocket.Session;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;

// ================================================================
// StartWebSocket.java
// WebSocket 서버 엔드포인트 (Quarkus 기본 예제 코드)
// 실시간 양방향 통신을 위한 WebSocket 연결 처리
// 현재 프로젝트에서는 실제로 사용하지 않음
// ================================================================

// WebSocket 연결 경로: ws://localhost:8080/start-websocket/{name}
@ServerEndpoint("/start-websocket/{name}")
@ApplicationScoped  // 애플리케이션 전체에서 하나의 인스턴스만 생성
public class StartWebSocket {

    // 클라이언트가 WebSocket에 연결될 때 실행
    @OnOpen
    public void onOpen(Session session, @PathParam("name") String name) {
        System.out.println("onOpen> " + name);
    }

    // 클라이언트가 WebSocket 연결을 종료할 때 실행
    @OnClose
    public void onClose(Session session, @PathParam("name") String name) {
        System.out.println("onClose> " + name);
    }

    // WebSocket 연결 중 에러가 발생할 때 실행
    @OnError
    public void onError(Session session, @PathParam("name") String name, Throwable throwable) {
        System.out.println("onError> " + name + ": " + throwable);
    }

    // 클라이언트로부터 메시지를 받을 때 실행
    @OnMessage
    public void onMessage(String message, @PathParam("name") String name) {
        System.out.println("onMessage> " + name + ": " + message);
    }
}