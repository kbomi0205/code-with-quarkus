package org.acme.login;

import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.net.URI;
import java.io.InputStream;
import jakarta.inject.Inject;
import io.vertx.ext.web.RoutingContext;
import jakarta.transaction.Transactional;
import java.util.Map;
import java.util.UUID;
import java.nio.file.Paths;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

// ================================================================
// AuthResource.java
// 로그인 / 로그아웃 / 회원가입 / 프로필 관련 REST 엔드포인트 모음
// 세션을 활용해 로그인 상태를 유지하고 페이지 접근을 제어
// ================================================================

@Path("/")
public class AuthResource {

    @Inject
    RoutingContext context;  // 세션 접근을 위한 Vert.x 라우팅 컨텍스트 주입


    // ===== 로그인 페이지 반환 =====
    // GET /login → login.html 반환
    @GET
    @Path("/login")
    @Produces(MediaType.TEXT_HTML)
    public Response loginPage() {
        InputStream html = getClass()
            .getClassLoader()
            .getResourceAsStream("META-INF/resources/login/login.html");
        return Response.ok(html).build();
    }


    // ===== 로그인 처리 =====
    // POST /login_check → DB에서 아이디/패스워드(해시값) 비교 후 세션 저장
    @POST
    @Path("/login_check")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response loginCheck(
        @FormParam("username") String username,
        @FormParam("password") String password) {

        User user = User.findByUsername(username);

        // 아이디가 없거나 패스워드 해시값이 일치하지 않으면 로그인 실패
        if (user == null || !user.password.equals(password)) {
            return Response
                .seeOther(URI.create("/login?error=1"))
                .build();
        }

        // 로그인 성공 → 세션에 아이디 저장
        context.session().put("loginUser", username);
        return Response
            .seeOther(URI.create("/after_login"))
            .build();
    }


    // ===== 로그인 후 메인 페이지 반환 =====
    // GET /after_login → 세션 체크 후 main_after_login.html 반환
    // 세션 없으면 로그인 페이지로 강제 이동 (Forced Browsing 차단)
    @GET
    @Path("/after_login")
    @Produces(MediaType.TEXT_HTML)
    public Response afterLogin() {
        String loginUser = context.session().get("loginUser");
        System.out.println("=== 세션 ID : " + context.session().id());
        System.out.println("=== loginUser : " + loginUser);

        if (loginUser == null) {
            return Response
                .seeOther(URI.create("/login"))
                .build();
        }

        InputStream html = getClass()
            .getClassLoader()
            .getResourceAsStream("META-INF/resources/login/main_after_login.html");
        return Response.ok(html).build();
    }


    // ===== 로그아웃 처리 =====
    // GET /logout → 세션 삭제 후 next 파라미터에 따라 이동
    // ?next=login 이면 로그인 페이지로, 없으면 메인 페이지로 이동
    @GET
    @Path("/logout")
    public Response logout(@QueryParam("next") String next) {
        System.out.println("=== 로그아웃 전 세션 ID : " + context.session().id());
        System.out.println("=== 로그아웃 전 loginUser : " + context.session().get("loginUser"));

        context.session().destroy();  // 세션 전체 삭제

        System.out.println("=== 로그아웃 후 세션 ID : " + context.session().id());
        System.out.println("=== 로그아웃 후 loginUser : " + context.session().get("loginUser"));

        // next=login 이면 /login으로, 아니면 / (메인)으로 이동
        String redirect = (next != null && next.equals("login")) ? "/login" : "/";
        return Response
            .seeOther(URI.create(redirect))
            .build();
    }


    // ===== 회원가입 페이지 반환 =====
    // GET /register → register.html 반환
    @GET
    @Path("/register")
    @Produces(MediaType.TEXT_HTML)
    public Response registerPage() {
        InputStream html = getClass()
            .getClassLoader()
            .getResourceAsStream("META-INF/resources/login/register.html");
        return Response.ok(html).build();
    }


    // ===== 회원가입 처리 =====
    // POST /register_check → 중복 체크 후 DB에 사용자 정보 저장
    @POST
    @Path("/register_check")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.TEXT_HTML)
    public Response registerCheck(
        @FormParam("username") String username,
        @FormParam("password") String password,  // SHA-256 해시값으로 전달됨
        @FormParam("email")    String email,
        @FormParam("phone")    String phone) {

        // ① 아이디 중복 체크
        if (User.findByUsername(username) != null) {
            return Response
                .seeOther(URI.create("/register?error=duplicate_username"))
                .build();
        }

        // ② 이메일 중복 체크
        if (User.findByEmail(email) != null) {
            return Response
                .seeOther(URI.create("/register?error=duplicate_email"))
                .build();
        }

        // ③ DB에 새 사용자 저장 (패스워드는 SHA-256 해시값으로 저장)
        User newUser = new User();
        newUser.username = username;
        newUser.password = password;
        newUser.email    = email;
        newUser.phone    = phone;
        newUser.persist();

        // ④ 가입 완료 페이지로 이동
        return Response
            .seeOther(URI.create("/register_success"))
            .build();
    }


    // ===== 회원가입 완료 페이지 반환 =====
    // GET /register_success → register_success.html 반환
    @GET
    @Path("/register_success")
    @Produces(MediaType.TEXT_HTML)
    public Response registerSuccess() {
        InputStream html = getClass()
            .getClassLoader()
            .getResourceAsStream("META-INF/resources/login/register_success.html");
        return Response.ok(html).build();
    }


    // ===== 루트 경로 메인 페이지 분기 =====
    // GET / → 세션 유무에 따라 로그인 전/후 메인 페이지를 다르게 반환
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response mainPage() {
        String loginUser = context.session().get("loginUser");
        System.out.println("=== [GET /] 세션 ID : " + context.session().id());
        System.out.println("=== [GET /] loginUser : " + loginUser);

        // 세션 있으면 로그인 후 메인, 없으면 로그인 전 메인 반환
        String htmlPath = (loginUser != null)
            ? "META-INF/resources/login/main_after_login.html"
            : "META-INF/resources/main_index.html";

        InputStream html = getClass().getClassLoader().getResourceAsStream(htmlPath);
        return Response.ok(html).build();
    }


    // ===== 프로필 페이지 반환 =====
    // GET /profile → 세션 체크 후 사용자 정보를 세션에 저장하고 profile.html 반환
    @GET
    @Path("/profile")
    @Produces(MediaType.TEXT_HTML)
    public Response profilePage() {

        // ① 세션 체크 (로그인 안 한 사용자 차단)
        String loginUser = context.session().get("loginUser");
        if (loginUser == null) {
            return Response
                .seeOther(URI.create("/login"))
                .build();
        }

        // ② DB에서 사용자 정보 조회
        User user = User.findByUsername(loginUser);

        // ③ 세션에 사용자 정보 저장 (HTML에서 활용)
        context.session().put("userEmail", user.email);
        context.session().put("userPhone", user.phone);
        context.session().put("profileImage",
            user.profileImage != null ? user.profileImage : "default.png");

        // ④ 프로필 페이지 반환
        InputStream html = getClass()
            .getClassLoader()
            .getResourceAsStream("META-INF/resources/login/profile.html");
        return Response.ok(html).build();
    }


    // ===== 프로필 정보 JSON 반환 =====
    // GET /profile/info → 로그인한 사용자 정보를 JSON으로 반환
    // profile.js의 fetch('/profile/info')에서 호출
    @GET
    @Path("/profile/info")
    @Produces(MediaType.APPLICATION_JSON)
    public Response profileInfo() {

        // 세션 체크 (미로그인 시 401 반환)
        String loginUser = context.session().get("loginUser");
        if (loginUser == null) {
            return Response.status(401).build();
        }

        // DB에서 사용자 정보 조회
        User user = User.findByUsername(loginUser);

        // JSON 형태로 사용자 정보 반환 (null 값은 빈 문자열로 처리)
        return Response.ok(
            Map.of(
                "username",     user.username,
                "email",        user.email        != null ? user.email        : "",
                "phone",        user.phone        != null ? user.phone        : "",
                "profileImage", user.profileImage != null ? user.profileImage : ""
            )
        ).build();
    }


    // ===== 프로필 사진 업로드 처리 =====
    // POST /profile/upload → 사진 파일 검증 후 서버에 저장, DB에 파일명 업데이트
    @POST
    @Path("/profile/upload")
    @Transactional
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    public Response profileUpload(
        @RestForm("profileImage") FileUpload file) {

        // ① 세션 체크
        String loginUser = context.session().get("loginUser");
        if (loginUser == null) {
            return Response
                .seeOther(URI.create("/login"))
                .build();
        }

        try {
            // ② 확장자 검사 (jpg, jpeg, png, gif, webp만 허용)
            String original = file.fileName();
            String ext = original.substring(
                original.lastIndexOf('.') + 1).toLowerCase();
            if (!ext.matches("jpg|jpeg|png|gif|webp")) {
                return Response
                    .seeOther(URI.create("/profile?error=invalid_type"))
                    .build();
            }

            // ③ 파일 크기 검사 (5MB 초과 시 거부)
            if (file.size() > 5 * 1024 * 1024) {
                return Response
                    .seeOther(URI.create("/profile?error=too_large"))
                    .build();
            }

            // ④ UUID 기반 파일명 생성 후 서버에 저장
            // UUID 사용으로 파일명 중복 및 경로 탐색 공격 방지
            String newFileName = UUID.randomUUID() + "." + ext;
            java.nio.file.Path uploadDir = Paths.get(
                "src/main/resources/META-INF/resources/uploads/profile");
            java.nio.file.Files.createDirectories(uploadDir);  // 폴더 없으면 자동 생성
            java.nio.file.Files.copy(
                file.uploadedFile(),
                uploadDir.resolve(newFileName),
                java.nio.file.StandardCopyOption.REPLACE_EXISTING);

            // ⑤ DB의 profileImage 컬럼에 새 파일명 업데이트
            User user = User.findByUsername(loginUser);
            user.profileImage = newFileName;

            return Response
                .seeOther(URI.create("/profile"))
                .build();

        } catch (Exception e) {
            return Response
                .seeOther(URI.create("/profile?error=upload_fail"))
                .build();
        }
    }

    // ===== 회원정보 수정 처리 =====
    // POST /profile/update → 이메일 / 연락처 수정 후 프로필 페이지로 이동
    @POST
    @Path("/profile/update")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response profileUpdate(
        @FormParam("email") String email,
        @FormParam("phone") String phone) {

        // ① 세션 체크 (미로그인 시 로그인 페이지로 차단)
        String loginUser = context.session().get("loginUser");
        if (loginUser == null) {
            return Response
                .seeOther(URI.create("/login"))
                .build();
        }

        // ② 이메일 중복 체크 (본인 이메일은 제외)
        User found = User.findByEmail(email);
        if (found != null && !found.username.equals(loginUser)) {
            return Response
                .seeOther(URI.create("/profile?error=duplicate_email"))
                .build();
        }

        // ③ DB 업데이트
        User user = User.findByUsername(loginUser);
        user.email = email;
        user.phone = phone;

        return Response
            .seeOther(URI.create("/profile?success=updated"))
            .build();
    }
    // ===== 비밀번호 변경 처리 =====
    // POST /profile/password → 현재 PW 확인 후 새 PW로 DB 업데이트
    @POST
    @Path("/profile/password")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response profilePassword(
        @FormParam("currentPassword") String currentPassword,
        @FormParam("newPassword")     String newPassword) {

        // ① 세션 체크
        String loginUser = context.session().get("loginUser");
        if (loginUser == null) {
            return Response
                .seeOther(URI.create("/login"))
                .build();
        }

        // ② 현재 비밀번호 확인 (해시값 비교)
        User user = User.findByUsername(loginUser);
        if (!user.password.equals(currentPassword)) {
            return Response
                .seeOther(URI.create("/profile?error=wrong_password"))
                .build();
        }

        // ③ 새 비밀번호로 DB 업데이트
        user.password = newPassword;

        return Response
            .seeOther(URI.create("/profile?success=password_changed"))
            .build();
    }
}