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
import java.util.UUID;           // UUID.randomUUID() 사용
import java.nio.file.Paths;      // Paths.get() 사용
import org.jboss.resteasy.reactive.RestForm;     // @RestForm
import org.jboss.resteasy.reactive.multipart.FileUpload; // FileUpload

@Path("/")
public class AuthResource {

    @Inject
    RoutingContext context;

    @GET
    @Path("/login")
    @Produces(MediaType.TEXT_HTML)
    public Response loginPage() {
        InputStream html = getClass()
            .getClassLoader()
            .getResourceAsStream("META-INF/resources/login/login.html");
        return Response.ok(html).build();
    }

    @POST
    @Path("/login_check")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    public Response loginCheck(
        @FormParam("username") String username,
        @FormParam("password") String password) {

        User user = User.findByUsername(username);
        if (user == null || !user.password.equals(password)) {
            return Response
                .seeOther(URI.create("/login?error=1"))
                .build();
        }
        context.session().put("loginUser", username);
        return Response
            .seeOther(URI.create("/after_login"))
            .build();
    }

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

    @GET
    @Path("/logout")
    public Response logout() {
        System.out.println("=== 로그아웃 전 세션 ID : " + context.session().id());
        System.out.println("=== 로그아웃 전 loginUser : " + context.session().get("loginUser"));

        context.session().destroy();

        System.out.println("=== 로그아웃 후 세션 ID : " + context.session().id());
        System.out.println("=== 로그아웃 후 loginUser : " + context.session().get("loginUser"));

        return Response
            .seeOther(URI.create("/"))
            .build();
    }

    @GET
    @Path("/register")
    @Produces(MediaType.TEXT_HTML)
    public Response registerPage() {
        InputStream html = getClass()
            .getClassLoader()
            .getResourceAsStream(
        "META-INF/resources/login/register.html");
        return Response.ok(html).build();
    }

    @POST
    @Path("/register_check")
    @Transactional
    @Consumes(MediaType.APPLICATION_FORM_URLENCODED)
    @Produces(MediaType.TEXT_HTML)
    public Response registerCheck(
        @FormParam("username") String username,
        @FormParam("password") String password, // SHA-256 해시값
        @FormParam("email") String email,
        @FormParam("phone") String phone) {

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

        // ③ DB 삽입
        User newUser = new User();
        newUser.username = username;
        newUser.password = password; // 해시값 저장
        newUser.email = email;
        newUser.phone = phone;
        newUser.persist();
        
        // ④ 가입 완료 페이지로 이동
        return Response
            .seeOther(URI.create("/register_success"))
            .build();
    }
    
    @GET
    @Path("/register_success")
    @Produces(MediaType.TEXT_HTML)
    public Response registerSuccess() {
        InputStream html = getClass()
            .getClassLoader()
            .getResourceAsStream(
        "META-INF/resources/login/register_success.html");
            return Response.ok(html).build();
    }

    // GET / → 세션 유무에 따라 메인 페이지 분기
    @GET
    @Produces(MediaType.TEXT_HTML)
    public Response mainPage() {
        String loginUser = context.session().get("loginUser");
    
        System.out.println("=== [GET /] 세션 ID : " + 
    context.session().id());
        System.out.println("=== [GET /] loginUser : " + loginUser);
    
        String htmlPath = (loginUser != null)
            ? "META-INF/resources/login/main_after_login.html"
            : "META-INF/resources/main_index.html";
    
        InputStream html = 
    getClass().getClassLoader().getResourceAsStream(htmlPath);
        return Response.ok(html).build();
    }

    @GET
    @Path("/profile")
    @Produces(MediaType.TEXT_HTML)
    public Response profilePage() {
    
        // ①세션체크(로그인안한사용자차단)
        String loginUser = context.session().get("loginUser");
        if (loginUser == null) {
            return Response
                .seeOther(URI.create("/login"))
                .build();
        }
    
        // ②DB에서사용자정보조회
        User user = User.findByUsername(loginUser);
    
        // ③세션에사용자정보저장(HTML에서활용)
        context.session().put("userEmail", user.email);    
        context.session().put("userPhone", user.phone);
        context.session().put("profileImage",
            user.profileImage != null ? user.profileImage : "default.png");
    
        // ④프로필페이지반환
        InputStream html = getClass()
            .getClassLoader()
            .getResourceAsStream(
                "META-INF/resources/login/profile.html");
        return Response.ok(html).build();
    }

    @GET
    @Path("/profile/info")
    @Produces(MediaType.APPLICATION_JSON)
    public Response profileInfo() {
        
        // 세션체크
        String loginUser= context.session().get("loginUser");
        if (loginUser== null) {
            return Response.status(401).build();
        }
        
        // DB 조회
        User user= User.findByUsername(loginUser);

        // JSON 응답
            return Response.ok(
                Map.of(
                    "username",     user.username,
                    "email",        user.email != null ? user.email : "",
                    "phone",        user.phone != null ? user.phone : "",
                    "profileImage", user.profileImage!= null
                                ? user.profileImage: ""
                )
            ).build();
    }

    @POST
        @Path("/profile/upload")
        @Transactional
        @Consumes(MediaType.MULTIPART_FORM_DATA)
        public Response profileUpload(
            @RestForm("profileImage") FileUpload file) {
        
            // ①세션체크
            String loginUser= context.session().get("loginUser");
            if (loginUser== null) {
                return Response
                    .seeOther(URI.create("/login"))
                    .build();
            }
            try {
                // ②확장자검사
                String original = file.fileName();
                String ext= original.substring(
                    original.lastIndexOf('.') + 1).toLowerCase();
                    if (!ext.matches("jpg|jpeg|png|gif|webp")) {
                        return Response
                            .seeOther(URI.create("/profile?error=invalid_type"))
                            .build();
                    }
                    // ③파일크기검사(5MB)
                    if (file.size() > 5 * 1024 * 1024) {
                        return Response
                            .seeOther(URI.create("/profile?error=too_large"))
                            .build();
                    }
                    // ④UUID 파일명생성+ 저장
                    String newFileName= UUID.randomUUID() + "." + ext;
                    java.nio.file.Path uploadDir= Paths.get(
                        "src/main/resources/META-INF/resources/uploads/profile");
                    java.nio.file.Files.createDirectories(uploadDir);
                    java.nio.file.Files.copy(file.uploadedFile(),
                        uploadDir.resolve(newFileName),
                        java.nio.file.StandardCopyOption.REPLACE_EXISTING);
                    // ⑤DB 업데이트
                    User user= User.findByUsername(loginUser);
                    user.profileImage= newFileName;
                    
                    return Response
                        .seeOther(URI.create("/profile"))
                        .build();
                    
                    } catch (Exception e) {
                        return Response
                            .seeOther(URI.create("/profile?error=upload_fail"))
                            .build();
                    }
}



    
    

}