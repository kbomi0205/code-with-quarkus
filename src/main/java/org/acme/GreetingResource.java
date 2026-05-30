package org.acme;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

// ================================================================
// GreetingResource.java
// Quarkus 프로젝트 생성 시 자동으로 만들어지는 기본 예제 코드
// GET /hello 요청 시 "Hello from Quarkus REST" 텍스트 반환
// 현재 프로젝트에서는 실제로 사용하지 않음
// ================================================================

@Path("/hello")  // /hello 경로로 들어오는 요청 처리
public class GreetingResource {

    // GET /hello 요청 시 plain text로 응답
    @GET
    @Produces(MediaType.TEXT_PLAIN)
    public String hello() {
        return "Hello from Quarkus REST";
    }
}