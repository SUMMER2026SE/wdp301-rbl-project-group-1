import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';
import {
  CreateMeetingInput,
  CreateMeetingResult,
  IMeetingProvider,
} from '../../domain/interfaces/meeting-provider.interface';

@Injectable()
export class GoogleMeetProvider implements IMeetingProvider {
  private readonly logger = new Logger(GoogleMeetProvider.name);

  constructor(private readonly configService: ConfigService) {}

  private getOAuth2Client() {
    return new google.auth.OAuth2(
      this.configService.get<string>('google.clientId'),
      this.configService.get<string>('google.clientSecret'),
      this.configService.get<string>('google.redirectUri'),
    );
  }

  async createMeeting(input: CreateMeetingInput): Promise<CreateMeetingResult> {
    const systemRefreshToken = this.configService.get<string>(
      'google.refreshToken',
    );

    if (!systemRefreshToken) {
      throw new Error('System Google Calendar is not configured.');
    }

    const oauth2Client = this.getOAuth2Client();
    oauth2Client.setCredentials({
      refresh_token: systemRefreshToken,
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    const event = {
      summary: input.title,
      start: {
        dateTime: input.startTime.toISOString(),
      },
      end: {
        dateTime: input.endTime.toISOString(),
      },
      conferenceData: {
        createRequest: {
          requestId: `edura-meet-${Date.now()}`,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    };

    try {
      const response = await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
        conferenceDataVersion: 1,
      });

      const meetingUrl = response.data.hangoutLink;
      const externalId = response.data.id;

      if (!meetingUrl || !externalId) {
        throw new Error('Failed to generate Google Meet link.');
      }

      return {
        meetingUrl,
        externalId,
      };
    } catch (error) {
      this.logger.error(
        'Error creating Google Meet',
        error instanceof Error ? error.stack : error,
      );
      throw new Error('Could not create Google Meet meeting.');
    }
  }
}
