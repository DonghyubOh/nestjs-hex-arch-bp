// ./src/apis/user/application/service/user.application.service.ts
// This file is generated by a shell script.
import { Injectable } from '@nestjs/common';
import { iUserUseCase } from '../port/in/user.usecase';
import { iUserRepositoryPort } from '../port/out/user.repository.port';
import { UserDomainService } from '../../domain/service/user.domain.service';

@Injectable()
export class UserApplicationService implements iUserUseCase {
    constructor(
        private readonly userRepository: iUserRepositoryPort,
        private readonly userDomainService: UserDomainService,
    ) {}
}
