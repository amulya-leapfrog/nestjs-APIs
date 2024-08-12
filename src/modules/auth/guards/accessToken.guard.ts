import { AuthGuard } from '@nestjs/passport';
import { TOKEN_STRATEGY } from 'src/constants/auth';

export class AccessTokenGuard extends AuthGuard(TOKEN_STRATEGY.ACCESS) {
  constructor() {
    super();
  }
}
