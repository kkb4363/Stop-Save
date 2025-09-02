package stop.save.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable()) // CSRF 비활성화
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS 설정
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/api/users/**", "/api/savings/**", "/api/challenges/**", "/oauth2/**", "/login/oauth2/**", "/h2-console/**").permitAll()
                        .anyRequest().permitAll() // 개발 단계에서는 모든 요청 허용
                )
                .oauth2Login(oauth2 -> oauth2
                        .defaultSuccessUrl("http://localhost:5173/", true) // React 앱으로 리다이렉트
                        .failureUrl("http://localhost:5173/login?error=oauth2_error")
                        .authorizationEndpoint(authorization -> authorization
                                .baseUri("/oauth2/authorization")) // OAuth2 인증 시작점
                )
                .logout(logout -> logout
                        .logoutUrl("/api/users/logout")
                        .logoutSuccessUrl("http://localhost:5173/")
                        .invalidateHttpSession(true)
                        .deleteCookies("JSESSIONID")
                );

        // H2 콘솔을 위한 설정 - 최신 방식으로 수정
        http.headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.disable()) // 이 부분만 남기면 됩니다
                .contentTypeOptions(contentTypeOptions -> contentTypeOptions.disable())
        );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}