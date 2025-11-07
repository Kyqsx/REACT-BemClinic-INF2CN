package com.bemclinicinf2cn.api.infra.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${api.security.token.secret}")
    private String secret;

    private long jwtExpiration = 86400000; // 24 horas em milissegundos

    // Gera um novo token JWT
    public String generateToken(String email, String tipo, Long id) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        Map<String, Object> claims = new HashMap<>();
        claims.put("tipo", tipo);
        claims.put("id", id);

        return JWT.create()
                .withSubject(email)
                .withIssuedAt(new Date(System.currentTimeMillis()))
                .withExpiresAt(new Date(System.currentTimeMillis() + jwtExpiration))
                .withClaim("claims", claims)
                .sign(algorithm);
    }

    // Extrai o email do token
    public String extractEmail(String token) {
        return getDecodedJWT(token).getSubject();
    }

    // Extrai a data de expiração
    public Date extractExpiration(String token) {
        return getDecodedJWT(token).getExpiresAt();
    }

    // Verifica se o token expirou
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date(System.currentTimeMillis()));
    }

    // Valida o token: checa se o email corresponde e se não expirou
    public Boolean validateToken(String token, String email) {
        final String extractedEmail = extractEmail(token);
        return (extractedEmail.equals(email) && !isTokenExpired(token));
    }

    // Método auxiliar para decodificar o token
    private DecodedJWT getDecodedJWT(String token) {
        Algorithm algorithm = Algorithm.HMAC256(secret);
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token);
    }
}
