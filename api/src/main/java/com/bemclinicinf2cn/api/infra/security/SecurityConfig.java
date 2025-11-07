package com.bemclinicinf2cn.api.infra.security;

import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.http.SessionCreationPolicy;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.web.cors.CorsConfiguration;
    import org.springframework.web.cors.CorsConfigurationSource;
    import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

    import java.util.Arrays;

    @Configuration
    @EnableWebSecurity
    public class SecurityConfig {

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
            http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
                    .csrf(csrf -> csrf.disable())
                    .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                    .authorizeHttpRequests(auth -> auth
                            .requestMatchers("/api/v1/auth/login").permitAll()
                            .requestMatchers("/api/v1/auth/register").permitAll()
                            .requestMatchers("/api/v1/auth/**").permitAll()
                            .requestMatchers("/api/v1/auth/**").permitAll()
                            .anyRequest().permitAll()
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

        @Bean
        public PasswordEncoder passwordEncoder() {
            return new BCryptPasswordEncoder();
        }
    }