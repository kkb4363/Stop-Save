package stop.save.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Value("${OAUTH_URL_BUILD}")
    private String oauthUrlBuild;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable()) // CSRF 비활성화
            .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정
            .authorizeHttpRequests(authz -> authz // 요청 권한 설정
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll() // preflight 허용
            .requestMatchers(
                    "/api/users/**",
                    "/api/savings/**",
                    "/api/challenges/**",
                    "/oauth2/**",
                    "/login/oauth2/**",
                    "/h2-console/**"
            ).permitAll().anyRequest().permitAll())
            // OAuth2 로그인 설정
            .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl(oauthUrlBuild, true)
                        .failureUrl(oauthUrlBuild + "login?error=oauth2_error")
                        .authorizationEndpoint(auth -> auth.baseUri("/oauth2/authorization")))
            // 로그아웃 설정
            .logout(logout -> logout
                        .logoutUrl("/api/users/logout")
                        .logoutSuccessUrl(oauthUrlBuild)
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
            );

        return http.build();
    }

    // CORS 설정
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList("https://stop-save.vercel.app"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
