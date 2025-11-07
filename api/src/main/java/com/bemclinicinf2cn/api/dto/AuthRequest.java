package com.bemclinicinf2cn.api.dto;

import lombok.Data;

@Data
public class AuthRequest {
    private String email;
    private String senha;
}