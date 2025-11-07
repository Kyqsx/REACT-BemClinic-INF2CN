package com.bemclinicinf2cn.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Permite requisições para todos os endpoints da API
                .allowedOrigins("*") // Permite requisições de qualquer origem
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") // Permite os métodos HTTP necessários
                .allowedHeaders("*") // Permite todos os cabeçalhos
                .allowCredentials(false); // Defina como 'false' se não estiver lidando com cookies/autenticação via credenciais
    }
}