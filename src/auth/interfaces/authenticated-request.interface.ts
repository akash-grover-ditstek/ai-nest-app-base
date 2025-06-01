import { Request } from 'express';

/**
 * Extends Express Request to include optional user property injected by JwtStrategy.
 *
 * This interface should be used in controllers and guards where req.user is expected.
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}
