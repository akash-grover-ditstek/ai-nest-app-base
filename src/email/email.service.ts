import { Injectable, Logger } from '@nestjs/common';
import { IEmailService } from './interfaces/email-service.interface';

/**
 * EmailService provides email sending functionality.
 * In production, integrate with a real provider (e.g., SendGrid, SES).
 *
 * @remarks
 * - Uses dependency injection for testability and flexibility.
 * - Logs all outgoing emails (do not log sensitive content).
 * - Follows interface-based abstraction for loose coupling.
 * - Use environment variables for provider configuration in production.
 */
@Injectable()
export class EmailService implements IEmailService {
  private readonly logger = new Logger(EmailService.name);

  /**
   * Sends an email to the specified recipient.
   *
   * @param to - Recipient email address
   * @param subject - Email subject
   * @param text - Email body
   * @returns Promise<void>
   */
  async sendMail(to: string, subject: string, text: string): Promise<void> {
    // TODO: Integrate with a real email provider in production
    // Use environment variables for credentials/configuration
    this.logger.log(`Sending email to ${to}: [${subject}]`); // Do not log email body (text) for security
    void text; // Prevent unused variable warning
    // Simulate async email sending
    return Promise.resolve();
  }
}
