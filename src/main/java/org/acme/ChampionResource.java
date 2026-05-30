package org.acme;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import java.util.List;

// ================================================================
// ChampionResource.java
// 챔피언 데이터 REST API
// GET  /champions       : 전체 챔피언 목록 조회
// POST /champions       : 새 챔피언 추가
// ================================================================

@Path("/champions")                         // /champions 경로로 들어오는 요청 처리
@Produces(MediaType.APPLICATION_JSON)       // 응답 형식: JSON
@Consumes(MediaType.APPLICATION_JSON)       // 요청 형식: JSON
public class ChampionResource {

    // GET /champions → DB에서 전체 챔피언 목록을 JSON으로 반환
    @GET
    public List<Champion> list() {
        return Champion.listAll();  // Panache의 listAll()로 전체 조회
    }

    // POST /champions → 요청 body의 챔피언 데이터를 DB에 저장
    @POST
    @Transactional  // DB 쓰기 작업이므로 트랜잭션 처리 필요
    public void add(Champion champion) {
        champion.persist();  // Panache의 persist()로 DB에 저장
    }
}