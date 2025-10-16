package com.rgv.catalojogo.platform.service;

import com.rgv.catalojogo.platform.entity.Platform;
import com.rgv.catalojogo.platform.repository.PlatformRepository;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.processing.Find;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlatformService {
    private final PlatformRepository platformRepository;

    @Autowired
    public PlatformService(PlatformRepository platformRepository) {
        this.platformRepository = platformRepository;
    }

    public List<Platform> findAll(){
        return platformRepository.findAll();
    }

    public Platform savePlatform (Platform platform){
        return platformRepository.save(platform);
    }
}
