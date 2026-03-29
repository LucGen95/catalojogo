package com.rgv.catalojogo.user.entity;

public enum UserRole {
    USER,
    ADMIN;

    public String asAuthority() {
        return "ROLE_" + name();
    }
}
